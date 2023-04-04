import React, { useCallback } from 'react';
import { get as _get, find as _find, pick as _pick } from 'lodash'
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
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === _get(transaction, 'rejectedTxn.confirmations', [])?.length
        return [{
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
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
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        }]
    }

    const transformMultiOpeartion = (transaction: any, labels: any) => {
        const nativeToken = getNativeToken();
        if(!nativeToken)
            return [];
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length | 0)
        let op = [];
        if(_get(transaction, 'dataDecoded.parameters[0].valueDecoded')) {
            for (let index = 0; index < _get(transaction, 'dataDecoded.parameters')?.length; index++) {
                const parameters = _get(transaction, 'dataDecoded.parameters')[index];
                const setAllowanceTxn = _find(parameters?.valueDecoded, vd => vd?.dataDecoded?.method === 'setAllowance');
                console.log("transaction", transaction)
                if(!setAllowanceTxn) {
                    if(parameters.valueDecoded) {
                        for (let index = 0; index < parameters.valueDecoded.length; index++) {
                            const decoded = parameters.valueDecoded[index];
                            if(!decoded.dataDecoded) {
                                op.push({
                                    txHash: _get(transaction, 'txHash', ''),
                                    transactionHash: _get(transaction, 'transactionHash', ''),
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
                                    confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null),
                                    isCredit: false
                                })
                            } else if (decoded.dataDecoded) {
                                const erc20Token: any = getERC20Token(_get(decoded, 'to', '0x'));
                                const parameters = _get(decoded, 'dataDecoded.parameters');
                                const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
                                const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
                        
                                op.push({
                                    txHash: _get(transaction, 'txHash', ''),
                                    transactionHash: _get(transaction, 'transactionHash', ''),
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
                                    confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                                    hasMyConfirmation: hasMyConfirmation ? true: false,
                                    hasRejection: transaction?.rejectedTxn ? true : false,
                                    hasMyRejection: hasMyRejection ? true : false,
                                    rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                                    canExecuteTxn,
                                    canRejectTxn,
                                    executor: _get(transaction, 'executor', '0x'),
                                    submissionDate: _get(transaction, 'submissionDate', null),
                                    executionDate: _get(transaction, 'executionDate', null),
                                    isCredit: false
                                })
                            }
                        }
                    }
                } else {
                    let value = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'allowanceAmount'), 'value', '0')
                    const allowanceToken: any = getERC20Token(_get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'token'), 'value', ''))
                    const to = _get(_find(setAllowanceTxn?.dataDecoded?.parameters, p => p?.name === 'delegate'), 'value', 0)
                    let am = _get(_find(labels, (l:any) => l?.recipient?.toLowerCase() === to?.toLowerCase() && l.safeTxHash === transaction?.safeTxHash), "recurringPaymentAmount", null)
                    if(am)
                        value = (+am * ( 10 ** (allowanceToken?.token?.decimal || allowanceToken?.token?.decimals) ));
                    op.push({
                        txHash: _get(transaction, 'txHash', ''),
                        transactionHash: _get(transaction, 'transactionHash', ''),
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
                        confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                        hasMyConfirmation: hasMyConfirmation ? true: false,
                        hasRejection: transaction?.rejectedTxn ? true : false,
                        hasMyRejection: hasMyRejection ? true : false,
                        rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                        canExecuteTxn,
                        canRejectTxn,
                        executor: _get(transaction, 'executor', '0x'),
                        submissionDate: _get(transaction, 'submissionDate', null),
                        executionDate: _get(transaction, 'executionDate', null),
                        isCredit: false
                    }) 
                }
            }
        } else {
            const to = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'to'), 'value', '0x')
            const value = _get(_find(_get(transaction, 'dataDecoded.parameters'), p => p.name === 'value'), 'value', 0)
      
            return [{
                txHash: _get(transaction, 'txHash', ''),
                transactionHash: _get(transaction, 'transactionHash', ''),
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
                confirmations: _get(transaction, 'confirmations', [])?.length || 0,
                hasMyConfirmation: hasMyConfirmation ? true: false,
                hasRejection: transaction?.rejectedTxn ? true : false,
                hasMyRejection: hasMyRejection ? true : false,
                rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
                canExecuteTxn,
                canRejectTxn,
                executor: _get(transaction, 'executor', '0x'),
                submissionDate: _get(transaction, 'submissionDate', null),
                executionDate: _get(transaction, 'executionDate', null) ? moment.utc(_get(transaction, 'executionDate', null)).format() : '',
                isCredit: false
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
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0)
        const parameters = _get(transaction, 'dataDecoded.parameters');
        const to = _get(_find(parameters, p => p.name === 'to'), 'value', '0x')
        const value = _get(_find(parameters, p => p.name === 'value'), 'value', 0)
        let op = [];
        op.push({
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
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
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0),
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        })
        return op
    }

    const transformOperationTxn = (transaction: any) => {
        const hasMyConfirmation = _find(transaction.confirmations, (c:any) => c?.owner === account)
        const hasMyRejection = _find(_get(transaction, 'rejectedTxn.confirmations', []), (c:any) => c.owner === account)
        const canExecuteTxn = _get(transaction, 'confirmationsRequired', 0) === (_get(transaction, 'confirmations', [])?.length || 0)
        const canRejectTxn = _get(transaction, 'rejectedTxn.confirmations', 0) === (_get(transaction, 'rejectedTxn.confirmations', [])?.length || 0)
        let op = [];
        op.push({
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
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
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: hasMyConfirmation ? true: false,
            hasRejection: transaction?.rejectedTxn ? true : false,
            hasMyRejection: hasMyRejection ? true : false,
            rejections: _get(transaction, 'rejectedTxn.confirmations', [])?.length || 0,
            canExecuteTxn,
            canRejectTxn,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: false
        })
        return op
    }

    const transformEthTxn = (transaction: any) => {
        const erc20Token: any = getERC20Token(_get(transaction, 'transfers[0].tokenAddress', '0x'));
        if(!erc20Token)
            return [];
        const value = _get(transaction, 'transfers[0].value', '0')
        return [{
            txHash: _get(transaction, 'txHash', ''),
            transactionHash: _get(transaction, 'transactionHash', ''),
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
            confirmations: _get(transaction, 'confirmations', [])?.length || 0,
            hasMyConfirmation: false,
            hasRejection: false,
            hasMyRejection: false,
            rejections: 0,
            canExecuteTxn: false,
            canRejectTxn: false,
            executor: _get(transaction, 'executor', '0x'),
            submissionDate: _get(transaction, 'submissionDate', null),
            executionDate: _get(transaction, 'executionDate', null),
            isCredit: true
        }]
    }

    const transform = (transactions: any, labels = [], exportCSV: boolean = false) => {
        let output = []
        for (let index = 0; index < transactions.length; index++) {
            const transaction = transactions[index];
            if (transaction.txType === "ETHEREUM_TRANSACTION") {
                const data = transformEthTxn(transaction)
                output.push(data)
            } else {
                if(isNativeTokenSingleTransfer(transaction)) {
                    const data = transformNativeTokenSingleTransfer(transaction)
                    output.push(data)
                } else if(isTokenMultiTransfer(transaction)) {
                    const data = transformMultiOpeartion(transaction, labels)
                    output.push(data)
                } else if(isERC20TokenSingleTransfer(transaction)) {
                    const data = transferERC20TokenSingleTransfer(transaction)
                    output.push(data)
                } else if(isOperationTransaction(transaction)) {
                    const data = transformOperationTxn(transaction)
                    output.push(data)
                } else {
                    const data = transformMultiOpeartion(transaction, labels)
                    output.push(data)
                }
            }
        }
        if(exportCSV) {
            let exportData = []
            for (let index = 0; index < output.length; index++) {
                const arr: any = output[index];
                for (let j = 0; j < arr.length; j++) {
                    let element = arr[j];
                    if(element.value !== 0 && !element.offChain) {
                        element = { 
                            transaction_hash: _get(element, 'transactionHash', '') === '' ? _get(element, 'txHash', '') : _get(element, 'transactionHash', ''),
                            incoming_amount: element.isCredit ? _get(element, 'formattedValue', '') : '',
                            incoming_token:  element.isCredit ? _get(element, 'symbol', '')  : '',
                            outgoing_amount: !element.isCredit ? _get(element, 'formattedValue', '') : '',
                            outgoing_token:  !element.isCredit ? _get(element, 'symbol', '')  : '',
                            description: _get(_find(labels, (l:any) => l?.recipient?.toLowerCase() === element.to.toLowerCase() && l?.safeTxHash === element.safeTxHash), "label", null),
                            recipient_wallet: _get(element, 'to', ''),
                            execution_date: _get(element, 'executionDate', null) ? _get(element, 'executionDate', "") : 'Pending'
                        }
                        exportData.push(element)
                    }
                }
            }
            return exportData
        }
        return output
    }
    return { transform }
}