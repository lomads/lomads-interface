import React, { useMemo, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import sendToken from "../../../../assets/svg/sendToken.svg";
import receiveToken from "../../../../assets/svg/receiveToken.svg";
import SimpleInputField from "UIpack/SimpleInputField";
import { beautifyHexToken } from '../../../../utils';
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import moment from "moment";
import axiosHttp from '../../../../api';
import { updateSafeTransaction } from "state/dashboard/reducer";

const CompleteTxn = ({ transaction, tokens, owner, isAdmin }: any) => {

    const threshold = useAppSelector((state) => state.flow.safeThreshold);
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState({});
    const [editMode, setEditMode] = useState(null);
    const dispatch = useAppDispatch()

    const { isCredit, amount, symbol, recipient, date, reason } = useMemo(() => {
        let isCredit = _get(transaction, 'txType', '') === 'ETHEREUM_TRANSACTION'
        let amount = _get(transaction, 'transfers[0].value', '')
        let symbol = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        let recipient = _get(transaction, 'transfers[0].to', '')
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === _get(transaction, 'safeTxHash', _get(transaction, 'txHash', '')))

        let reason = null
        if (trans) {
            reason = _get(_find(trans.data, u => u.recipient.toLowerCase() === recipient.toLowerCase() || u.recipient.toLowerCase() === DAO.safe.address.toLowerCase()), 'reason', null)
        }

        let date = moment.utc(
            transaction.txType === 'ETHEREUM_TRANSACTION' ? transaction.executionDate :
                _get(transaction, 'dataDecoded.method', '') === 'multiSend' ? _get(transaction, `confirmations[${_get(transaction, 'confirmations', []).length - 1}]`) :
                    _get(transaction, 'submissionDate', null)
        ).local().format('MM/DD hh:mm')
        console.log('reason', reason)
        return { isCredit, amount, symbol, recipient, date, reason }
    }, [transaction])

    const _handleReasonKeyDown = (safeTxHash: string, recipient: string, reasonText: string) => {
        if (reasonText && reasonText !== '') {
            axiosHttp.patch('transaction', { reason: reasonText, safeTxHash: safeTxHash ? safeTxHash : transaction.txHash, recipient, txType: transaction.txType, safeAddress: DAO.safe.address })
                .then(res => { 
                    dispatch(updateSafeTransaction(res.data))
                    if (editMode && editMode === `${safeTxHash}-${recipient}`) {
                        setEditMode(null);
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
        if (isAdmin) {
            setEditMode(text);
            setReasonText(prev => {
                return {
                    ...prev,
                    [text] : reason
                }
            })
        }
    }

    const renderItem = (item: any, index: number) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value')
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value')
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let mulReason = '';
        if (trans)
            mulReason = _get(_find(trans.data, u => u.recipient.toLowerCase() === mulRecipient.toLowerCase()), 'reason', null)
        return (
            <div className="transactionRow">
                <div className="coinText">
                    <img src={isCredit ? receiveToken : sendToken} alt="" />
                    <div className="dashboardTextBold">
                        {`${mulAmount / 10 ** 18} ${symbol}`}
                    </div>
                </div>
                <div className="transactionName">
                        {
                             mulReason && (!editMode || (editMode && editMode !== `${transaction.safeTxHash}-${mulRecipient}`))
                                ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${transaction.safeTxHash}-${mulRecipient}`, mulReason)}>{mulReason}</div>
                                :
                                <>
                                    {
                                        isAdmin
                                            ?
                                            <SimpleInputField
                                                disabled={!owner}
                                                value={_get(reasonText, `${transaction.safeTxHash}-${mulRecipient}`, null)}
                                                onchange={e => {
                                                    setReasonText(prev => {
                                                        return {
                                                            ...prev,
                                                            [`${transaction.safeTxHash}-${mulRecipient}`]: e.target.value
                                                        }
                                                    })
                                                }}
                                                onKeyDown={(e: any) => { console.log(e.target); if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, mulRecipient, e.target.value) } }}
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
                            <div style={{ height: 1, backgroundColor: '#76808d', width: 100 }}></div>
                            <div style={{ height: isLast ? '50%' : '100%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, top: 0 }}></div>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {_get(transaction, 'dataDecoded.method', null) !== "multiSend" ?
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={isCredit ? receiveToken : sendToken} alt="" />
                        <div className="dashboardTextBold">
                            {`${amount / 10 ** 18} ${symbol}`}
                        </div>
                    </div>
                    <div className="transactionName">
                            {
                                reason && (!editMode || (editMode && editMode !== `${transaction.safeTxHash}-${recipient}`)) ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${transaction.safeTxHash}-${recipient}`, reason)}>{reason}</div> :
                                 <>
                                        {
                                            isAdmin
                                                ?
                                                <SimpleInputField
                                                    disabled={!owner}
                                                    value={_get(reasonText, `${transaction.safeTxHash}-${recipient}`, null)}
                                                    onchange={e => {
                                                        setReasonText(prev => {
                                                            return {
                                                                ...prev,
                                                                [`${transaction.safeTxHash}-${recipient}`]: e.target.value
                                                            }
                                                        })
                                                    }}
                                                    onKeyDown={(e: any) => {  console.log(e); if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, recipient, e.target.value) } }}
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