import { useCallback, useState } from "react";
import { SafeTransactionDataPartial, MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import {useSafeTokens} from "hooks/useSafeTokens";
import { get as _get, find as _find } from 'lodash';
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import axiosHttp from 'api'
import { AddOwnerTxParams } from "@gnosis.pm/safe-core-sdk";
import { SupportedChainId } from "constants/chains";
import { beautifyHexToken } from "utils";
const { toChecksumAddress } = require('ethereum-checksum-address')


const useSafeTransaction = (safeAddress: string) => {

    const { provider, chainId, account } = useWeb3React();
    const { safeTokens, tokenBalance } = useSafeTokens()
    console.log("safeTokens", safeTokens)
    //const currentNonce = useAppSelector((state) => state.flow.currentNonce);
    const [createSafeTxnLoading, setCreateSafeTxnLoading] = useState(false);
    const [updateOwnerLoading, setUpdateOwnerLoading] = useState(false);

    const { safeThreshold } = useAppSelector(store => store.flow)

    const createNativeSingleTxn = async (send: any, token: any) => {
        const safeTransactionData: SafeTransactionDataPartial[] = [{
            to: toChecksumAddress(_get(send, '[0].recipient')),
            data: "0x",
            value: `${BigInt(parseFloat(_get(send, '[0].amount')) * 10 ** _get(token, 'token.decimals', 18))}`,
        }]
        return safeTransactionData;
    }

    const createNativeMultiTxn = async (send: any, token: any) => {
        const safeTransactionData: SafeTransactionDataPartial[] =
            send.map((result: any, index: number) => {
                return {
                    to: toChecksumAddress(result.recipient),
                    data: "0x",
                    value: `${BigInt(parseFloat(result.amount) * 10 ** _get(token, 'token.decimals', 18))}`
                };
            }
            )
        return safeTransactionData;
    }

    const createMultiTxn = async (send: any, safeToken: any) => {
        const token = await tokenCallSafe(safeToken.tokenAddress);
        const safeTransactionData: SafeTransactionDataPartial[] = await Promise.all(
            send.map(
                async (result: any, index: number) => {
                    const unsignedTransaction = await token.populateTransaction.transfer(
                        toChecksumAddress(result.recipient),
                        BigInt(parseFloat(result.amount) * 10 ** _get(safeToken, 'token.decimals', 18))
                    );
                    console.log("unsignedTransaction", unsignedTransaction)
                    const transactionData = {
                        to: safeToken.tokenAddress,
                        data: unsignedTransaction.data as string,
                        value: "0",
                    };
                    return transactionData;
                }
            )
        );
        return safeTransactionData;
    }

    const createSafeTransaction = async ({ tokenAddress, send,tag, confirm = true, createLabel = true }: any) => {
        if (!safeAddress) return null;
        let signature = null;
        try {
            const safeToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === tokenAddress)
            console.log("safeToken", safeToken)
            let total = send.reduce((pv: any, cv: any) => pv + (+cv.amount), 0);
            if (total == 0) throw 'Cannot send 0'
            console.log(tokenBalance(tokenAddress), total)
            if (tokenBalance(tokenAddress) < total)
                throw 'Low token balance'
            setCreateSafeTxnLoading(true);
            let safeTransactionData = null;
            const safeSDK = await ImportSafe(provider, safeAddress);
            if (tokenAddress === process.env.REACT_APP_MATIC_TOKEN_ADDRESS || tokenAddress === process.env.REACT_APP_GOERLI_TOKEN_ADDRESS) {
                if (send.length == 1)
                    safeTransactionData = await createNativeSingleTxn(send, safeToken)
                else
                    safeTransactionData = await createNativeMultiTxn(send, safeToken)
            } else {
                safeTransactionData = await createMultiTxn(send, safeToken)
            }

            const currentNonce = await (await safeService(provider, `${chainId}`)).getNextNonce(safeAddress);
            console.log("currentNonce", currentNonce)
            const options: SafeTransactionOptionalProps = { nonce: currentNonce };
            const safeTransaction = await safeSDK.createTransaction({
                safeTransactionData,
                options,
            });

            const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
            signature = await safeSDK.signTransactionHash(safeTxHash);
            const senderAddress = account as string;
            await (await safeService(provider, `${chainId}`))
                .proposeTransaction({ safeAddress, safeTransactionData: safeTransaction.data, safeTxHash, senderAddress, senderSignature: signature.data })
            console.log("transaction has been proposed");
            if (confirm) {
                await (await safeService(provider, `${chainId}`))
                    .confirmTransaction(safeTxHash, signature.data)
                    .then(async () => {
                        if (createLabel) {
                            let payload: any[] = [];
                            send.map((r: any) => {
                                payload.push({ safeAddress, safeTxHash, recipient: r.recipient, label: _get(r, 'reason', null),tag })
                            })
                            await axiosHttp.post(`transaction/label`, payload)
                        }
                        await axiosHttp.post(`utility/create-notification`, {
                            event: 'transaction:confirmed',
                            safeAddress,
                            account
                        })
                    })
            } else {
                if (createLabel) {
                    let payload: any[] = [];
                    send.map((r: any) => {
                        payload.push({ safeAddress, safeTxHash, recipient: r.recipient, label: _get(r, 'reason', null),tag })
                    })
                    await axiosHttp.post(`transaction/label`, payload)
                }
            }
            await axiosHttp.post(`utility/create-notification`, {
                event: safeThreshold > 1 ? 'transaction:execution.required' : 'transaction:confirmation.required',
                safeAddress,
                safeTxHash,
                account
            })
            setCreateSafeTxnLoading(false)
            return { safeTxHash, currentNonce, signature };
        }
        catch (e) {
            setCreateSafeTxnLoading(false)
            console.log(e)
            if(typeof e === 'string')
                throw e
            else
                throw _get(e, 'message', 'Something went wrong')
        }
    }


    const updateOwnersWithThreshold = async ({ newOwners = [], removeOwners = [], threshold, thresholdChanged = false, ownerCount = 0 }: any) => {
        if (!safeAddress || !account || !chainId) return;
        try {
            setUpdateOwnerLoading(true)
            const safeSDK = await ImportSafe(provider, safeAddress);
            const isOwner = await safeSDK.isOwner(account as string);
            if (!isOwner) {
                setUpdateOwnerLoading(false)
                throw 'Not allowed operation. Only safe owner can perform setAllowance operation'
            }

            const currentNonce = await (await safeService(provider, `${chainId}`)).getNextNonce(safeAddress);

            const options: SafeTransactionOptionalProps = { nonce: currentNonce };

            const newOwnerTxnData: SafeTransactionDataPartial[] = await Promise.all(
                newOwners.map(async (owner: string) => {
                    const params: AddOwnerTxParams = {
                        ownerAddress: owner,
                        threshold
                    }
                    const ownerTxn = await safeSDK.createAddOwnerTx(params)
                    const transactionData = {
                        to: ownerTxn.data.to,
                        data: ownerTxn.data.data,
                        value: "0",
                    };
                    return transactionData;
                })
            )

            const removeOwnerTxnData: SafeTransactionDataPartial[] = await Promise.all(
                removeOwners.map(async (owner: string) => {
                    const params: AddOwnerTxParams = {
                        ownerAddress: owner,
                        threshold
                    }
                    const ownerTxn = await safeSDK.createRemoveOwnerTx(params)
                    const transactionData = {
                        to: ownerTxn.data.to,
                        data: ownerTxn.data.data,
                        value: "0",
                    };
                    return transactionData;
                })
            )

            let txnPayload: any = [...removeOwnerTxnData, ...newOwnerTxnData]
            if (txnPayload.length === 0) {
                const thresholdTxn = await safeSDK.createChangeThresholdTx(threshold, options)
                txnPayload = thresholdTxn.data
            }

            const safeTransaction = await safeSDK.createTransaction({ safeTransactionData: txnPayload, options })
            console.log(safeTransaction)
            const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
            const signature = await safeSDK.signTransactionHash(safeTxHash);
            await (await safeService(provider, `${chainId}`))
                .proposeTransaction({ safeAddress, safeTransactionData: safeTransaction.data, safeTxHash, senderAddress: account, senderSignature: signature.data })
            await (await safeService(provider, `${chainId}`)).confirmTransaction(safeTxHash, signature.data)

            let payload: any[] = [];
            newOwners.map((r: any) => {
                payload.push({ safeAddress, safeTxHash, recipient: r, label: thresholdChanged ? `Add Owner: ${beautifyHexToken(r)} | Change Threshold ${threshold}/${ownerCount}` : `Add Owner: ${beautifyHexToken(r)}` })
            })
            removeOwners.map((r: any) => {
                payload.push({ safeAddress, safeTxHash, recipient: r, label: `Remove Owner: ${beautifyHexToken(r)} | Change Threshold ${threshold}/${ownerCount}` })
            })
            if (newOwners.length === 0 && removeOwners.length === 0)
                payload.push({ safeAddress, safeTxHash, recipient: beautifyHexToken(safeAddress), label: `Change Threshold ${threshold}/${ownerCount}` })
            await axiosHttp.post(`transaction/label`, payload)
            setUpdateOwnerLoading(false)
            return safeTxHash
        } catch (e) {
            console.log(e)
            setUpdateOwnerLoading(false)
            throw 'Something went wrong. Please try again.'
        }
    }

    return { createSafeTransaction, createSafeTxnLoading, updateOwnersWithThreshold, updateOwnerLoading }

};

export default useSafeTransaction;