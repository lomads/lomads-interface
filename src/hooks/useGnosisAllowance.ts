import { useCallback, useState } from 'react'
import { get as _get, find as _find } from 'lodash';
import { MetaTransactionData, SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { useWeb3React } from "@web3-react/core"
import axiosHttp from 'api'
import useSafeTokens from "./useSafeTokens";
import { ImportSafe, safeService } from "connection/SafeCall";
import { GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT, SupportedChainId } from 'constants/chains';
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import { useAllowanceContract } from "hooks/useContract";
import { Contract, utils } from "ethers"
const { toChecksumAddress } = require('ethereum-checksum-address')


const useGnosisAllowance = (safeAddress: string | null) => {
    const { provider, chainId, account } = useWeb3React();
    const [gnosisAllowanceLoading, setGnosisAllowanceLoading] = useState(false);
    const [createSafeTxnLoading, setCreateSafeTxnLoading] = useState(false);
	const allowanceContract = useAllowanceContract(GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`])
    const { safeTokens, tokenBalance } = useSafeTokens(safeAddress)

    const checkModuleEnabled = async () => {
        if(!safeAddress) return;
        const moduleAddress = GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`]
        const safeSDK = await ImportSafe(provider, safeAddress);
        const response = await safeSDK.isModuleEnabled(moduleAddress)
        return response
    }

    const getSpendingAllowance = async ({ delegate, token } : { delegate: string, token: string }) => {
        if(!safeAddress) return;
        const allowance = await allowanceContract?.getTokenAllowance(safeAddress, delegate, token)
        const data = { 
            amount: parseFloat(utils.formatEther(allowance[0])), 
            spent: parseFloat(utils.formatEther(allowance[1])),
            resetTimeMin: allowance[2].toNumber(),
            lastResetMin: allowance[3].toNumber(),
            nonce: allowance[4].toNumber(),
        }
        return data
    }

    const setAllowance = async ({ delegate, token, amount, resetMins, resetBaseMins, label = 'Allowance' } : { delegate: string, token: string, amount: string, resetMins: string, resetBaseMins: string, label?: string }) => {
        console.log(delegate, token, amount, resetMins, resetBaseMins, label)
        if(!safeAddress || !account || !chainId) return;
        setGnosisAllowanceLoading(true)
        try {  
            const addDelegateData = allowanceContract?.interface.encodeFunctionData('addDelegate', [delegate])
            const allowanceData = allowanceContract?.interface.encodeFunctionData('setAllowance', [delegate, token, amount, resetMins, resetBaseMins ])
            const safeSDK = await ImportSafe(provider, safeAddress);
            const currentNonce = await (await safeService(provider, `${chainId}`)).getNextNonce(safeAddress);
            const options: SafeTransactionOptionalProps = { nonce: currentNonce };
            const moduleAddress = GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`]
            let moduleTransactionData = undefined;
            const moduleEnabled = await checkModuleEnabled();
            if(!moduleEnabled)
                moduleTransactionData = await safeSDK.createEnableModuleTx(moduleAddress)
            const safeTransactionData: SafeTransactionDataPartial[]  = [
                ...( !moduleEnabled ? [{   
                    to: safeAddress,
                    data: moduleTransactionData?.data?.data as string,
                    value: '0'
                }] : []),
                {   
                    to: GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`],
                    data: addDelegateData as string,
                    value: '0'
                },
                {   
                    to: GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`],
                    data: allowanceData as string,
                    value: '0'
                }
            ]
            const safeTransaction = await safeSDK.createTransaction({ safeTransactionData, options })
            const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
            const signature = await safeSDK.signTransactionHash(safeTxHash);
            await (await safeService(provider, `${chainId}`))
            .proposeTransaction({ safeAddress, safeTransactionData: safeTransaction.data, safeTxHash, senderAddress: account, senderSignature: signature.data })
            await (await safeService(provider, `${chainId}`)).confirmTransaction(safeTxHash, signature.data)
            const payload = [{ safeAddress, safeTxHash, recipient: delegate, label }]
            await axiosHttp.post(`transaction/label`, payload)
            setGnosisAllowanceLoading(false)
            return { safeTxHash, currentNonce, signature };
        } catch (e) {
            console.log(_get(e, 'message', ''))
            setGnosisAllowanceLoading(false)
            throw _get(e, 'message', 'Something went wrong')
        }
    }

    const createMultiTxn = async ( send:any, safeToken: any) => {
        const safeTransactionData: SafeTransactionDataPartial[]  = await Promise.all(
            send.map(
                async (result: any, index: number) => {
                    const data = allowanceContract?.interface.encodeFunctionData('executeAllowanceTransfer', [
                        safeToken, 
                        toChecksumAddress(result.to), 
                        BigInt(parseFloat(result.amount) * 10 ** _get(safeToken, 'token.decimals', 18)),
                        "0x",
                        account as string,
                        
                    ])
                    const transactionData = {
                        to: GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`],
                        data: data as string,
                        value: "0",
                    };
                    return transactionData;
                }
            )
        );
        return safeTransactionData;
    }

    const createAllowanceTransaction = async ({ tokenAddress, amount, to, label }: { tokenAddress: string, amount: number, to: string, label: string} ) => {
        if(!safeAddress || !account || !chainId || !amount || !tokenAddress) return;
        const safeToken = _find(safeTokens, t => _get(t, 'tokenAddress', null) === tokenAddress)
        if(amount == 0) throw `Cannot send 0 ${_get(safeToken, 'token.symbol', '')}`
        if (tokenBalance(tokenAddress) < amount)
            throw `Low token balance. Available balance ${tokenBalance(tokenAddress)} ${_get(safeToken, 'token.symbol', '')}`
        const allowance = await getSpendingAllowance({ delegate: account as string, token: tokenAddress })
        if(!allowance)
            throw 'Unable to fetch allowance'
        const balance = +allowance.amount - +allowance.spent
        if(balance < +amount)
            throw `Low spending allowance. required additional ${+amount - balance} ${_get(safeToken, 'token.symbol', '')} token(s).`
        try {
            setCreateSafeTxnLoading(true);
            const executeTxResponse = await allowanceContract?.executeAllowanceTransfer(
                safeAddress, 
                tokenAddress, 
                toChecksumAddress(to), 
                `${BigInt(amount * 10 ** _get(safeToken, 'token.decimals', 18))}`, 
                chainId === SupportedChainId.GOERLI ? process.env.REACT_APP_GOERLI_TOKEN_ADDRESS : process.env.REACT_APP_MATIC_TOKEN_ADDRESS, 
                '0', 
                account as string, 
                "0x"
            )
            console.log("executeTxResponse", executeTxResponse);
            const { transactionHash } =
            executeTxResponse &&
            (await executeTxResponse.wait());
            let payload: any[] = [];
            payload.push({ safeAddress, safeTxHash: transactionHash, recipient: toChecksumAddress(to), label })
            await axiosHttp.post(`transaction/label`, payload)
            setCreateSafeTxnLoading(false)
            return { transactionHash };
        } catch(e) {
            setCreateSafeTxnLoading(false)
            console.log(e)
            return null
        }
    }

    return { setAllowance, getSpendingAllowance, createAllowanceTransaction, gnosisAllowanceLoading }
}

export default useGnosisAllowance