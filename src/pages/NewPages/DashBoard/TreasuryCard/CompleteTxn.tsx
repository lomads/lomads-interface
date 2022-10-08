import React, { useMemo } from "react";
import { get as _get, find as _find } from 'lodash';
import sendToken from "../../../../assets/svg/sendToken.svg";
import receiveToken from "../../../../assets/svg/receiveToken.svg";
import SimpleInputField from "UIpack/SimpleInputField";
import { beautifyHexToken } from '../../../../utils';
import { useAppSelector } from "state/hooks";
import moment from "moment";

const CompleteTxn = ({ transaction, tokens }:any) => {

    const threshold = useAppSelector((state) => state.flow.safeThreshold);

    const { isCredit, amount, symbol, recipient, date } = useMemo(() => {
        let isCredit = _get(transaction, 'txType', '') === 'ETHEREUM_TRANSACTION'
        let amount = _get(transaction, 'transfers[0].value', '')
        let symbol = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        let recipient = _get(transaction, 'transfers[0].to', '')
        let date = moment.utc(
            transaction.txType === 'ETHEREUM_TRANSACTION' ? transaction.executionDate :
            _get(transaction, 'dataDecoded.method', '') === 'multiSend' ? _get(transaction, `confirmations[${ _get(transaction, 'confirmations', []).length -1 }]`) :
            _get(transaction, 'submissionDate', null)
        ).local().format('MM/DD hh:mm')
        return { isCredit, amount, symbol, recipient, date }
    }, [transaction])

    const renderItem = (item  :any, index: number) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value')
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value')
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        return (
            <div className="transactionRow">
                <div className="coinText">
                    <img src={ isCredit? receiveToken : sendToken} alt="" />
                    <div className="dashboardTextBold">
                    { `${mulAmount / 10 ** 18} ${symbol}` }
                    </div>
                </div>
                <div className="transactionName">
                    <SimpleInputField className="inputField" height={30} width={"100%"} placeholder="Name Transaction" />
                </div>
                <div className="transactionAddress">
                    <div className="dashboardText">
                        { `to ${ beautifyHexToken(mulRecipient) }` }
                    </div>
                </div>
                <div id="voteArea">
                    { threshold && index == 0 && <div className="dashboardTextBold">
                        { _get(transaction, 'confirmations', null) ? `${_get(transaction, 'confirmations', []).length}/${threshold} vote`: ''}
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
				<SimpleInputField className="inputField" height={30} width={"100%"} placeholder="Name Transaction" />
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