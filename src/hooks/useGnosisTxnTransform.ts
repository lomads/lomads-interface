import React, { useCallback } from 'react';
import { get as _get, find as _find } from 'lodash'
import { useWeb3React } from "@web3-react/core"
import useSafeTokens from "hooks/useSafeTokens";
import { ethers } from 'ethers';
import { CHAIN_INFO } from 'constants/chainInfo';
import moment from 'moment';

export default (safeAddress: string | null) => {
    const { account, chainId } = useWeb3React();
    const { safeTokens } = useSafeTokens(safeAddress)

    const getERC20Token = useCallback((tokenAddr: string) => {
        console.log(safeTokens)
        if(safeTokens) 
            return _find(safeTokens,  st => _get(st, 'tokenAddress', '0x') === tokenAddr)
        return null
    }, [safeTokens])

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

    const isTokenMultiTransfer = (transaction: any) => {
        if(transaction?.value === "0" && _get(transaction, 'dataDecoded.method', '') === 'multiSend') 
            return true
        return false
    }

    const isERC20TokenSingleTransfer = (transaction: any) => {
        if(transaction?.value === "0" && _get(transaction, 'dataDecoded.method', '') === 'transfer') 
            return true
        return false
    }

    const isOperationTransaction = (transaction: any) => {
        if(transaction?.value === "0" && 
            (_get(transaction, 'dataDecoded.method', '') === 'addOwnerWithThreshold') ||
            (_get(transaction, 'dataDecoded.method', '') === 'changeThreshold')
        ) 
            return true
        return false
    }

    const transformNativeTokenSingleTransfer = (transaction: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === _get(transaction, 'confirmations', []).length
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === _get(transaction, 'rejectedTxn.confirmations', []).length
        return [{
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: false,
            nonce: _get(transaction, 'nonce', "0"),
            value: _get(transaction, 'value', 0),
            formattedValue: (+_get(transaction, 'value', 0) / ( 10 ** nativeToken?.decimals )),
            symbol: nativeToken?.symbol,
            decimals: nativeToken?.decimals,
            to: _get(transaction, 'to', "0x"),
            confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
            confirmations: _get(transaction, 'confirmations', []).length,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null)
        }]
    }

    const transformMultiOpeartion = (transaction: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === _get(transaction, 'confirmations', []).length
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === _get(transaction, 'rejectedTxn.confirmations', []).length
        let op = [];
        if(_get(transaction, 'dataDecoded.parameters[0].valueDecoded')) {
            for (let index = 0; index < _get(transaction, 'dataDecoded.parameters').length; index++) {
                const parameters = _get(transaction, 'dataDecoded.parameters')[index];
                const setAllowanceTxn = _find(parameters?.valueDecoded, vd => vd?.dataDecoded?.method === 'setAllowance');
                console.log("transaction", transaction)
                if(!setAllowanceTxn) {
                    if(parameters.valueDecoded) {
                        for (let index = 0; index < parameters.valueDecoded.length; index++) {
                            const decoded = parameters.valueDecoded[index];
                            if(!decoded.dataDecoded) {
                                op.push({
                                    safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                                    rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                                    offChain: transaction?.offChain,
                                    nonce: _get(transaction, 'nonce', "0"),
                                    value: _get(decoded, 'value', 0),
                                    formattedValue: (+_get(decoded, 'value', 0) / ( 10 ** nativeToken?.decimals )),
                                    symbol: nativeToken?.symbol,
                                    decimals: nativeToken?.decimals,
                                    to: _get(decoded, 'to', "0x"),
                                    confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
                                    confirmations: _get(transaction, 'confirmations', []).length,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null),
                                })
                            } else if (decoded.dataDecoded) {
                                const erc20Token: any = getERC20Token(_get(decoded, 'to', '0x'));
                                const parameters = _get(decoded, 'dataDecoded.parameters');
                                const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
                                const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
                        
                                op.push({
                                    safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                                    rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                                    offChain: transaction?.offChain,
                                    nonce: _get(transaction, 'nonce', "0"),
                                    value: value,
                                    formattedValue: (+value / ( 10 ** erc20Token?.token?.decimals )),
                                    symbol: erc20Token?.token?.symbol,
                                    decimals: erc20Token?.token?.decimal || erc20Token?.token?.decimals,
                                    to: to,
                                    confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
                                    confirmations: _get(transaction, 'confirmations', []).length,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null)
                                })
                            }
                        }
                    }
                } else {
                    const value = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'allowanceAmount'), 'value', '0')
                    const allowanceToken: any = getERC20Token(_get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'token'), 'value', ''))
                    const to = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'delegate'), 'value', 0)
                    op.push({
                        safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                        rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                        offChain: transaction?.offChain,
                        nonce: _get(transaction, 'nonce', "0"),
                        value: value,
                        formattedValue: (+value / ( 10 ** (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals) )),
                        symbol: allowanceToken?.token?.symbol,
                        decimals: (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals),
                        to: to,
                        confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
                        confirmations: _get(transaction, 'confirmations', []).length,
                        hasMyConfirmation: hasMyConfirmation ? true: false,
                        hasRejection: transaction?.rejectedTxn ? true : false,
                        hasMyRejection: hasMyRejection ? true : false,
                        rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
                        canExecuteTxn,
                        canRejectTxn,
                        executor: _get(transaction, 'executor', '0x'),
                        submissionDate: _get(transaction, 'submissionDate', null),
                        executionDate: _get(transaction, 'executionDate', null)
                    }) 
                }
            }
        } else {
            const to = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'to'), 'value', '0x')
            const value = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'value'), 'value', 0)
            return [{
                safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
                rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
                offChain: transaction?.offChain,
                nonce: _get(transaction, 'nonce', "0"),
                value: value,
                formattedValue: value === '0x' ? '0x' : (+value / ( 10 ** transaction?.token?.decimals )),
                symbol: transaction?.token?.symbol,
                decimals: transaction?.token?.decimals,
                to: to,
                confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
                confirmations: _get(transaction, 'confirmations', []).length,
                hasMyConfirmation: hasMyConfirmation ? true: false,
                hasRejection: transaction?.rejectedTxn ? true : false,
                hasMyRejection: hasMyRejection ? true : false,
                rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
                canExecuteTxn,
                canRejectTxn,
                executor: _get(transaction, 'executor', '0x'),
                submissionDate: _get(transaction, 'submissionDate', null),
                executionDate: moment.utc(_get(transaction, 'executionDate', null)).format()
            }]
        }
        return op
    }

    const transferERC20TokenSingleTransfer = (transaction: any) => {
        const erc20Token: any = getERC20Token(_get(transaction, 'to', '0x'));
        if(!erc20Token)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === _get(transaction, 'confirmations', []).length
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === _get(transaction, 'rejectedTxn.confirmations', []).lengths
        const parameters = _get(transaction, 'dataDecoded.parameters');
        const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
        const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
        let op = [];
        op.push({
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: transaction?.offChain,
            nonce: _get(transaction, 'nonce', "0"),
            value: value,
            formattedValue: (+value / ( 10 ** erc20Token?.token?.decimals )),
            symbol: erc20Token?.token?.symbol,
            decimals: erc20Token?.token?.decimal || erc20Token?.token?.decimals,
            to: to,
            confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
            confirmations: _get(transaction, 'confirmations', []).length,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null)
        })
        return op
    }

    const transformOperationTxn = (transaction: any) => {
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === _get(transaction, 'confirmations', []).length
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === _get(transaction, 'rejectedTxn.confirmations', []).length
        let op = [];
        op.push({
            safeTxHash: _get(transaction, 'safeTxHash', _get(transaction, 'txHash', "0x")),
            rejectionSafeTxHash: _get(transaction, 'rejectedTxn.safeTxHash', null),
            offChain: transaction?.offChain,
            nonce: _get(transaction, 'nonce', "0"),
            value: 0,
            formattedValue: "0",
            symbol: "",
            decimals: "",
            to: "0x",
            confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
            confirmations: _get(transaction, 'confirmations', []).length,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', []).length,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null)
        })
        return op
    }

    const transformEthTxn = (transaction: any) => {
        const erc20Token: any = getERC20Token(_get(transaction, 'transfers[0].tokenAddress', '0x'));
        if(!erc20Token)
            return [];
        const value = _get(transaction, 'transfers[0].value', '0')
        return [{
            safeTxHash: _get(transaction, 'txHash', "0"),
            rejectionSafeTxHash: null,
            nonce: _get(transaction, 'nonce', 0),
            offChain: transaction?.offChain,
            value: value,
            formattedValue: (+value / ( 10 ** (erc20Token?.token?.decimals || erc20Token?.token?.decimal) )),
            symbol: _get(transaction, 'transfers[0].tokenInfo.symbol', null),
            decimals: _get(transaction, 'transfers[0].tokenInfo.decimals', null),
            to: _get(transaction, 'to', "0x"),
            confimationsRequired: _get(transaction, 'confirmationsRequired', 0),
            confirmations: _get(transaction, 'confirmations', []).length,
            hasMyConfirmation: false,
            hasRejection: false,
            hasMyRejection: false,
            rejections: 0,
            canExecuteTxn: false,
            canRejectTxn: false,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null)
        }]
    }

    const transform = (transactions: any, exportCSV: boolean = false) => {
        let output = []
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];
            console.log("MULTISIG_TRANSACTION", transaction)
            if (transaction.txType === "ETHEREUM_TRANSACTION") {
                const data = transformEthTxn(transaction)
                output.push(data)
            } else {
                if(isNativeTokenSingleTransfer(transaction)) {
                    const data = transformNativeTokenSingleTransfer(transaction)
                    output.push(data)
                } else if(isTokenMultiTransfer(transaction)) {
                    const data = transformMultiOpeartion(transaction)
                    output.push(data)
                } else if(isERC20TokenSingleTransfer(transaction)) {
                    const data = transferERC20TokenSingleTransfer(transaction)
                    output.push(data)
                } else if(isOperationTransaction(transaction)) {
                    const data = transformOperationTxn(transaction)
                    output.push(data)
                } else {
                    const data = transformMultiOpeartion(transaction)
                    output.push(data)
                }
            }
        }
        if(exportCSV) {
            let exportData = []
            for (let index = 0; index < output.length; index++) {
                const arr: any = output[index];
                for (let j = 0; j < arr.length; j++) {
                    const element = arr[j];
                    if(element.value !== 0)
                        exportData.push(element);
                }
            }
            return exportData
        }
        return output
    }
    return { transform }
}