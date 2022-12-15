import { useCallback, useState } from 'react'
import { BigNumber } from '@ethersproject/bignumber';
import { MetaTransactionData, SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import { useWeb3React } from "@web3-react/core"
import { ImportSafe, safeService } from "connection/SafeCall";
import { GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT } from 'constants/chains';
import { SafeTransactionOptionalProps } from "@gnosis.pm/safe-core-sdk/dist/src/utils/transactions/types";
import { useAllowanceContract } from "hooks/useContract";
import { Contract, utils } from "ethers"


const useGnosisAllowance = (safeAddress: string | null) => {
    const { provider, chainId, account } = useWeb3React();
    const [gnosisAllowanceLoading, setGnosisAllowanceLoading] = useState(false);
	const allowanceContract = useAllowanceContract(GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`])

    const checkModuleEnabled = async () => {
        if(!safeAddress) return;
        const moduleAddress = GNOSIS_SAFE_ALLOWANCE_MODULE_CONTRACT[`${chainId}`]
        const safeSDK = await ImportSafe(provider, safeAddress);
        const response = await safeSDK.isModuleEnabled(moduleAddress)
        return response
    }

    const setAllowance = async ({ delegate, token, amount, resetMins } : { delegate: string, token: string, amount: string, resetMins: string }) => {
        if(!safeAddress || !account || !chainId) return;
        setGnosisAllowanceLoading(true)
        try {  
            const addDelegateData = allowanceContract?.interface.encodeFunctionData('addDelegate', [delegate])
            const allowanceData = allowanceContract?.interface.encodeFunctionData('setAllowance', [delegate, token, amount, resetMins, "27848737" ])
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
                    data: moduleTransactionData?.data.data as string,
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
            setGnosisAllowanceLoading(false)
            return { safeTxHash, currentNonce, signature };
        } catch (e) {
            setGnosisAllowanceLoading(false)
            console.log(e)
            return null
        }
    }

    return { setAllowance, gnosisAllowanceLoading }
}

export default useGnosisAllowance