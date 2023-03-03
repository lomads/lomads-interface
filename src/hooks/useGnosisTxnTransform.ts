import React, { useCallback } from 'react';
import { get as _get } from 'lodash'
import { useWeb3React } from "@web3-react/core"
import useSafeTokens from "hooks/useSafeTokens";
import { ethers } from 'ethers';
import { CHAIN_INFO } from 'constants/chainInfo';

export default (safeAddress: string | null) => {
    const { account, chainId } = useWeb3React();
    const { safeTokens } = useSafeTokens(safeAddress)

    const getNativeToken = useCallback(() => {
        if(chainId)
            return CHAIN_INFO[chainId].nativeCurrency
        return { name: '', symbol: '', decimals: 18 }
    }, [chainId])

    const isNativeTokenSingleTransfer = (transaction: any) => {
        if(transaction?.value !== "0" && transaction?.dataDecoded === null) 
            return true
        return false
    }

    const transformNativeTokenSingleTransfer = (transaction: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        return [{
            value: _get(transaction, 'value', "0"),
            formattedValue: (+_get(transaction, 'value', 0) / ( 10 ** nativeToken?.decimals )),
            symbol: nativeToken?.symbol,
            to: _get(transaction, 'to', "0"),
            confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
            confirmations: _get(transaction, 'confirmationsRequired', []).length
        }]
    }

    const transform = (transactions: any) => {
        // let output = []
        // for (let index = 0; index < transactions.length; index++) {
        //     const transaction = transactions[index];
        //     if(transaction.txType === "MULTISIG_TRANSACTION") {
        //         if(isNativeTokenSingleTransfer(transaction)) {
        //             const data = transformNativeTokenSingleTransfer(transaction)
        //             output.push(data)
        //         } else if(isNativeTokenTransfer(transaction))
        //     } else if (transaction.txType === "ETHEREUM_TRANSACTION") {
                
        //     }
        // }
    }
    return { transform }
}