import React, { useMemo, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import sendToken from "../../../../assets/svg/sendToken.svg";
import receiveToken from "../../../../assets/svg/receiveToken.svg";
import SimpleInputField from "UIpack/SimpleInputField";
import { beautifyHexToken } from '../../../../utils';
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import moment from "moment";
import axiosHttp from '../../../../api';
import { updateSafeTransaction } from "state/dashboard/reducer";
import { SupportedChainId } from "constants/chains";
import useSafeTokens from "hooks/useSafeTokens";
import { legacy_createStore } from "@reduxjs/toolkit";

const CompleteTxn = ({ labels, transaction, tokens, owner, isAdmin, safeAddress, onLoadLabels, editMode, onSetEditMode }: any) => {
	const { chainId } = useWeb3React();
    const threshold = useAppSelector((state) => state.flow.safeThreshold);
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState({});
    //const [editMode, setEditMode] = useState(null);
    const {safeTokens} = useSafeTokens(safeAddress)
    const dispatch = useAppDispatch()

    const { isCredit, amount, tokenSymbol, symbol, recipient, date, reason, txHash, isAllowanceTransaction, isOwnerModificaitonTransaction } = useMemo(() => {
        let isCredit = _get(transaction, 'txType', '') === 'ETHEREUM_TRANSACTION'
        let decimal = 18;
        if(_get(transaction, 'transfers[0].tokenInfo.decimals', null))
            decimal = _get(transaction, 'transfers[0].tokenInfo.decimals', 18)
        let amount = (+(_get(transaction, 'transfers[0].value', _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'value' || p.name === '_value'), 'value', _get(transaction, 'value', 0)))) / 10 ** decimal)
        let symbol = chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR';
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            symbol = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        else
            symbol = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'to', '')), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))
        let recipient = _get(transaction, 'transfers[0].to', _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'to' || p.name === '_to'), 'value', _get(transaction, 'to', '')))
        let tokenSymbol = undefined;
        const setAllowance =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => _get(vd, 'dataDecoded.method', '') === "setAllowance")
        let isAllowanceTransaction = false;
        let isOwnerModificaitonTransaction = false;
        if(setAllowance)
            isAllowanceTransaction = true;
        const ownerModification =  _get(transaction, 'dataDecoded.method', '') === "addOwnerWithThreshold" || _get(transaction, 'dataDecoded.method', '') === "removeOwner" || _get(transaction, 'dataDecoded.method', '') === "changeThreshold" 
        if(ownerModification)
            isOwnerModificaitonTransaction = true;

        if(transaction?.dataDecoded?.method === 'multiSend' && transaction?.dataDecoded?.parameters[0]?.name === 'transactions' && isAllowanceTransaction) {
            const addDelegate =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => _get(vd, 'dataDecoded.method', '') === "addDelegate")
            recipient = _get(addDelegate, 'dataDecoded.parameters[0].value', '')
            const setAllowance =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => _get(vd, 'dataDecoded.method', '') === "setAllowance")
            amount = _get(setAllowance, 'dataDecoded.parameters[2].value', '')
            const tokenAddr = _get(setAllowance, 'dataDecoded.parameters[1].value', '')
            tokenSymbol = _get(_find(safeTokens, (st:any) => st.tokenAddress === tokenAddr), 'token.symbol', '')
            const tokenDecimal = _get(_find(safeTokens, (st:any) => st.tokenAddress === tokenAddr), 'token.decimal', _get(_find(safeTokens, (st:any) => st.tokenAddress === tokenAddr), 'token.decimals', 18))
            if(labels && labels.length > 0) {
                let am = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === transaction.safeTxHash), "recurringPaymentAmount", null)
                if(am)
                    amount = amount = am * 10 ** _get(transaction, 'token.decimals', 18);
            }
            amount = (amount / 10 ** tokenDecimal)
        }

        if(isOwnerModificaitonTransaction) {
            if(_get(transaction, 'dataDecoded.method', '') === "removeOwner")
                recipient = _get(transaction, 'dataDecoded.parameters[1].value', '')
            else if(_get(transaction, 'dataDecoded.method', '') === "addOwnerWithThreshold")
                recipient = _get(transaction, 'dataDecoded.parameters[0].value', '')
        }

        let reason = null
        if(labels && labels.length > 0) {
            reason = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === _get(transaction, 'safeTxHash', _get(transaction, 'txHash', _get(transaction, 'transactionHash', '')))), "label", null)
        }
        const txHash = _get(transaction, 'safeTxHash', _get(transaction, 'txHash', _get(transaction, 'transactionHash', '')));
        let date = _get(transaction, 'executionDate', null) ? moment.utc(_get(transaction, 'executionDate', null)).local().format('MM/DD hh:mm') : moment.utc(_get(transaction, 'submissionDate', null)).local().format('MM/DD hh:mm')
        console.log('reason', reason)
        return { isCredit, amount, tokenSymbol, symbol, recipient, date, reason, txHash, isAllowanceTransaction, isOwnerModificaitonTransaction }
    }, [transaction, safeTokens, tokens, labels])

    const _handleReasonKeyDown = (safeTxHash: string, recipient: string, reasonText: string) => {
        if (reasonText && reasonText !== '') {
            axiosHttp.patch('transaction/label', { safeAddress, label: reasonText, safeTxHash, recipient })
                .then(res => { 
                    onLoadLabels(res.data)
                    if (editMode && editMode === `${safeTxHash}-${recipient}`) {
                        onSetEditMode(null);
                        setReasonText(prev => {
                            return {
                                ...prev,
                                [`${safeTxHash}-${recipient}`] : undefined
                            }
                        })
                    }
                })
        }
    }

    const handleEnableEditMode = (text: any, reason: string) => {
        if (isAdmin || owner) {
            onSetEditMode(text);
            setReasonText(prev => {
                return {
                    ...prev,
                    [text] : reason
                }
            })
        }
    }

    const renderItem = (item: any, index: number) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value',  _get(item, 'value', 0))
        let mulRecipient = _get(item, 'dataDecoded.parameters[0].value', _get(item, 'to', 0))
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        let token = chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR';
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            token = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        else
            token = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))

        let muldecimal = 18;
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            muldecimal = _get(transaction, 'transfers[0].tokenInfo.decimals', 18)
        else
            muldecimal = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.decimals', _get(transaction, 'token.decimals', 18))

        console.log("muldecimal", muldecimal)


        const txHash = _get(transaction, 'safeTxHash', _get(transaction, 'txHash', _get(transaction, 'transactionHash', '')));

        const ownerModification =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => (_get(vd, 'dataDecoded.method', '') === "addOwnerWithThreshold") || _get(vd, 'dataDecoded.method', '') === "removeOwner")
        if(_get(item, 'dataDecoded.method', '') === 'removeOwner')
            mulRecipient = _get(item, 'dataDecoded.parameters[1].value', _get(item, 'to', 0))

        let mulReason = '';
        if(labels && labels.length > 0) {
            mulReason = _get(_find(labels, l => l.recipient.toLowerCase() === mulRecipient.toLowerCase() && _get(l, 'safeTxHash', _get(l, 'txHash', '')) === txHash), "label", null)
        }


        return (
            <div className="transactionRow">
                <div className="coinText">
                    <img src={isCredit ? receiveToken : sendToken} alt="" />
                    <div className="dashboardTextBold">
                        {ownerModification ? `-` : `${(mulAmount / 10 ** muldecimal).toFixed(3)} ${token}`}
                    </div>
                </div>
                <div className="transactionName">
                        {
                             mulReason && (!editMode || (editMode && editMode !== `${txHash}-${mulRecipient}`))
                                ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${txHash}-${mulRecipient}`, mulReason)}>{mulReason}</div>
                                :
                                <>
                                    {
                                        isAdmin || owner
                                            ?
                                            <SimpleInputField
                                                autoFocus={editMode === `${txHash}-${mulRecipient}`}
                                                disabled={!owner}
                                                value={_get(reasonText, `${txHash}-${mulRecipient}`, null)}
                                                onchange={e => {
                                                    setReasonText(prev => {
                                                        return {
                                                            ...prev,
                                                            [`${txHash}-${mulRecipient}`]: e.target.value
                                                        }
                                                    })
                                                }}
                                                onKeyDown={(e: any) => { console.log(e.target); if (e.key === 'Enter') { _handleReasonKeyDown(_get(transaction, 'safeTxHash', _get(transaction, 'txHash', undefined)), mulRecipient, e.target.value) } }}
                                                className="inputField"
                                                height={30}
                                                width={"100%"}
                                                placeholder="Reason for transaction"
                                            />
                                            :
                                            null
                                    }
                                </>
                        }
                    </div>
                <div className="transactionAddress">
                    <div className="dashboardText">
                        {`to ${beautifyHexToken(mulRecipient)}`}
                    </div>
                </div>
                <div id="voteArea">
                    {/* {threshold && index == 0 && <div className="dashboardTextBold">
                        {_get(transaction, 'confirmations', null) ? `${_get(transaction, 'confirmations', []).length}/${threshold} sign` : ''}
                    </div>} */}
                </div>
                <div className="confirmIconGrp">
                    <div className="ex" style={{ position: 'relative' }}>
                        {index == 0 && <div className="dashboardText">{date}</div>}
                        {index !== 0 && <div>
                            <div style={{ height: 1, backgroundColor: '#76808d', width: '120px', position: 'absolute', right: 0  }}></div>
                            <div style={{ height: isLast ? '50%' : '100%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, top: 0 }}></div>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {_get(transaction, 'dataDecoded.method', null) !== "multiSend" || (_get(transaction, 'dataDecoded.method', null) === "multiSend" && isAllowanceTransaction && _get(transaction, 'dataDecoded.parameters[0].name', null) === "transactions") ?
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={isCredit ? receiveToken : sendToken} alt="" />
                        <div className="dashboardTextBold">
                            {isOwnerModificaitonTransaction ? `-` : `${parseFloat(`${amount}`).toFixed(3)} ${tokenSymbol ? tokenSymbol : symbol}`}
                        </div>
                    </div>
                    <div className="transactionName">
                            {
                                reason && (!editMode || (editMode && editMode !== `${txHash}-${recipient}`)) ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${txHash}-${recipient}`, reason)}>{reason}</div> :
                                 <>
                                        {
                                            isAdmin || owner
                                                ?
                                                <SimpleInputField
                                                    autoFocus={editMode === `${txHash}-${recipient}`}
                                                    disabled={!owner}
                                                    value={_get(reasonText, `${txHash}-${recipient}`, null)}
                                                    onchange={e => {
                                                        setReasonText(prev => {
                                                            return {
                                                                ...prev,
                                                                [`${txHash}-${recipient}`]: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    onKeyDown={(e: any) => {  console.log(e); if (e.key === 'Enter') { _handleReasonKeyDown(_get(transaction, 'safeTxHash', _get(transaction, 'txHash', undefined)), recipient, e.target.value) } }}
                                                    className="inputField"
                                                    height={30}
                                                    width={"100%"}
                                                    placeholder="Reason for transaction"
                                                />
                                                :
                                                null
                                        }
                                    </>
                            }
                        </div>
                    <div className="transactionAddress">
                        <div className="dashboardText">
                            {`to ${beautifyHexToken(recipient)}`}
                        </div>
                    </div>
                    <div id="voteArea">
                        {/* {threshold && <div className="dashboardTextBold">
                            {_get(transaction, 'confirmations', null) ? `${_get(transaction, 'confirmations', []).length}/${threshold} sign` : ''}
                        </div>} */}
                    </div>
                    <div className="confirmIconGrp">
                        <div className="ex">
                            <div className="dashboardText">{date}</div>
                        </div>
                    </div>
                </div> :
                <>
                    {_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).map(renderItem)}
                </>
            }
        </>
    )
}

export default CompleteTxn