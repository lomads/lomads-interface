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

const CompleteTxn = ({ transaction, tokens, owner }:any) => {

    const threshold = useAppSelector((state) => state.flow.safeThreshold);
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState(null);
    const dispatch = useAppDispatch()

    const { isCredit, amount, symbol, recipient, date, reason } = useMemo(() => {
        let isCredit = _get(transaction, 'txType', '') === 'ETHEREUM_TRANSACTION'
        let amount = _get(transaction, 'transfers[0].value', '')
        let symbol = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        let recipient = _get(transaction, 'transfers[0].to', '')
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let reason = null
        if(trans)
            reason = _get(_find(trans.data, u => u.recipient.toLowerCase() === recipient.toLowerCase()), 'reason', null)
        let date = moment.utc(
            transaction.txType === 'ETHEREUM_TRANSACTION' ? transaction.executionDate :
            _get(transaction, 'dataDecoded.method', '') === 'multiSend' ? _get(transaction, `confirmations[${ _get(transaction, 'confirmations', []).length -1 }]`) :
            _get(transaction, 'submissionDate', null)
        ).local().format('MM/DD hh:mm')
        return { isCredit, amount, symbol, recipient, date, reason }
    }, [transaction])

    const _handleReasonKeyDown = (safeTxHash:string, recipient:string) => {
        if(reasonText && reasonText !== '') {
            axiosHttp.patch('transaction', { reason: reasonText, safeTxHash, recipient })
            .then(res => dispatch(updateSafeTransaction(res.data)))
        }
    }

    const renderItem = (item  :any, index: number) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value')
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value')
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let mulReason = null
        if(trans)
            mulReason = _get(_find(trans.data, u => u.recipient.toLowerCase() === mulRecipient.toLowerCase()), 'reason', null)
        return (
            <div className="transactionRow">
                <div className="coinText">
                    <img src={ isCredit? receiveToken : sendToken} alt="" />
                    <div className="dashboardTextBold">
                    { `${mulAmount / 10 ** 18} ${symbol}` }
                    </div>
                </div>
                <div className="transactionName">
                    { mulReason? <div className="dashboardText">{ mulReason }</div> :
                        <SimpleInputField disabled={!owner} onchange={(e:any) => { setReasonText(e.target.value) }} onKeyDown={(e:any) => { if(e.key === 'Enter'){ _handleReasonKeyDown(transaction.safeTxHash, mulRecipient) } }} className="inputField" height={30} width={"100%"} placeholder="Reason for transaction" /> }
                </div>
                <div className="transactionAddress">
                    <div className="dashboardText">
                        { `to ${ beautifyHexToken(mulRecipient) }` }
                    </div>
                </div>
                <div id="voteArea">
                    { threshold && index == 0 && <div className="dashboardTextBold">
                        { _get(transaction, 'confirmations', null) ? `${_get(transaction, 'confirmations', []).length}/${threshold} sign`: ''}
                    </div> }
                </div>
                <div className="confirmIconGrp">
                    <div className="ex" style={{ position: 'relative' }}>
                        { index == 0  && <div className="dashboardText">{ date }</div> }
                        { index !== 0 && <div>
                            <div style={{ height: 1, backgroundColor: '#76808d', width: 100 }}></div>
                            <div style={{ height: isLast ? '50%' : '100%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, top: 0 }}></div>
                        </div> }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
        { _get(transaction, 'dataDecoded.method', null) !== "multiSend" ? 
        <div className="transactionRow">
            <div className="coinText">
                <img src={ isCredit? receiveToken : sendToken} alt="" />
                <div className="dashboardTextBold">
                { `${amount / 10 ** 18} ${symbol}` }
                </div>
            </div>
            <div className="transactionName">
                { reason ? <div className="dashboardText"></div> :
                        <SimpleInputField  disabled={!owner} onchange={(e:any) => { setReasonText(e.target.value) }} onKeyDown={(e:any) => { if(e.key === 'Enter'){ _handleReasonKeyDown(transaction.safeTxHash, recipient) } }} className="inputField" height={30} width={"100%"} placeholder="Reason for transaction" /> }
			</div>
            <div className="transactionAddress">
                <div className="dashboardText">
                    { `to ${ beautifyHexToken(recipient) }` }
                </div>
            </div>
            <div id="voteArea">
                { threshold && <div className="dashboardTextBold">
                    { _get(transaction, 'confirmations', null) ? `${_get(transaction, 'confirmations', []).length}/${threshold} vote`: ''}
                </div> }
            </div>
            <div className="confirmIconGrp">
                <div className="ex">
                    <div className="dashboardText">{ date }</div>
                </div>
            </div>
        </div> : 
        <>
            {  _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).map(renderItem) }
        </> 
        }
        </>
    )
}

export default CompleteTxn