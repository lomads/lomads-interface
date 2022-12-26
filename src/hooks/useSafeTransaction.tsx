import { useCallback, useState } from "react";
import { SafeTransactionDataPartial, MetaTransactionData } from "@gnosis.pm/safe-core-sdk-types";
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import useSafeTokens from "./useSafeTokens";
import { get as _get, find as _find } from 'lodash';
import { tokenCallSafe } from "connection/DaoTokenCall";
import { ImportSafe, safeService } from "connection/SafeCall";
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import axiosHttp from 'api'
const { toChecksumAddress } = require('ethereum-checksum-address')


const useSafeTransaction = (safeAddress: string) => {

    const { provider, chainId, account } = useWeb3React();
    const { safeTokens, tokenBalance } = useSafeTokens(safeAddress)
    //const currentNonce = useAppSelector((state) => state.flow.currentNonce);
    const [createSafeTxnLoading, setCreateSafeTxnLoading] = useState(false);

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

    const createSafeTransaction = async ({ tokenAddress, send, confirm = true, createLabel = true }: any) => {
        if (!safeAddress) return null;
        let signature = null;
        try {
            const safeToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === tokenAddress)
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
                                payload.push({ safeAddress, safeTxHash, recipient: r.recipient, label: _get(r, 'reason', null) })
                            })
                            await axiosHttp.post(`transaction/label`, payload)
                        }
                    })
            } else {
                if (createLabel) {
                    let payload: any[] = [];
                    send.map((r: any) => {
                        payload.push({ safeAddress, safeTxHash, recipient: r.recipient, label: _get(r, 'reason', null) })
                    })
                    await axiosHttp.post(`transaction/label`, payload)
                }
            }
            setCreateSafeTxnLoading(false)
            return { safeTxHash, currentNonce, signature };
        }
        catch (e) {
            setCreateSafeTxnLoading(false)
            console.log(e)
            return null
        }
    }

    return { createSafeTransaction, createSafeTxnLoading }

};

export default useSafeTransaction;