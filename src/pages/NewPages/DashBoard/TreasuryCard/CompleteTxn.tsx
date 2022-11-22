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

const CompleteTxn = ({ labels, transaction, tokens, owner, isAdmin, safeAddress, onLoadLabels }: any) => {
	const { chainId } = useWeb3React();
    const threshold = useAppSelector((state) => state.flow.safeThreshold);
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState({});
    const [editMode, setEditMode] = useState(null);
    const dispatch = useAppDispatch()

    const { isCredit, amount, symbol, recipient, date, reason } = useMemo(() => {
        let isCredit = _get(transaction, 'txType', '') === 'ETHEREUM_TRANSACTION'
        let decimal = 18;
        if(_get(transaction, 'transfers[0].tokenInfo.decimals', null))
            decimal = _get(transaction, 'transfers[0].tokenInfo.decimals', 18)
        let amount = (+(_get(transaction, 'transfers[0].value', 0)) / 10 ** decimal)
        let symbol = chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR';
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            symbol = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        else
            symbol = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'to', '')), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))
        let recipient = _get(transaction, 'transfers[0].to', '')
        let reason = null
        if(labels && labels.length > 0) {
            reason = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === _get(transaction, 'safeTxHash', _get(transaction, 'txHash', ''))), "label", null)
        }

        let date = moment.utc(
            transaction.txType === 'ETHEREUM_TRANSACTION' ? transaction.executionDate :
                _get(transaction, 'dataDecoded.method', '') === 'multiSend' ? _get(transaction, `confirmations[${_get(transaction, 'confirmations', []).length - 1}]`) :
                    _get(transaction, 'submissionDate', null)
        ).local().format('MM/DD hh:mm')
        console.log('reason', reason)
        return { isCredit, amount, symbol, recipient, date, reason }
    }, [transaction, labels])

    const _handleReasonKeyDown = (safeTxHash: string, recipient: string, reasonText: string) => {
        if (reasonText && reasonText !== '') {
            axiosHttp.patch('transaction/label', { safeAddress, label: reasonText, safeTxHash, recipient })
                .then(res => { 
                    onLoadLabels(res.data)
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
        if (isAdmin || owner) {
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
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value', "")
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        let token = chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR';
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            token = _get(transaction, 'transfers[0].tokenInfo.symbol', '')
        else
            token = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))

        let muldecimal = 18;
        if(_get(transaction, 'transfers[0].tokenAddress', null))
            muldecimal = _get(transaction, 'transfers[0].tokenInfo.decimals', '')
        else
            muldecimal = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.decimals', _get(transaction, 'token.decimals', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))

        let mulReason = '';
        if(labels && labels.length > 0) {
            mulReason = _get(_find(labels, l => l.recipient.toLowerCase() === mulRecipient.toLowerCase() && l.safeTxHash === _get(transaction, 'safeTxHash', _get(transaction, 'txHash', ''))), "label", null)
        }
        return (
            <div className="transactionRow">
                <div className="coinText">
                    <img src={isCredit ? receiveToken : sendToken} alt="" />
                    <div className="dashboardTextBold">
                        {`${mulAmount / 10 ** muldecimal} ${token}`}
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
                                        isAdmin || owner
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
            {_get(transaction, 'dataDecoded.method', null) !== "multiSend" ?
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={isCredit ? receiveToken : sendToken} alt="" />
                        <div className="dashboardTextBold">
                            {`${amount} ${symbol}`}
                        </div>
                    </div>
                    <div className="transactionName">
                            {
                                reason && (!editMode || (editMode && editMode !== `${transaction.safeTxHash}-${recipient}`)) ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${transaction.safeTxHash}-${recipient}`, reason)}>{reason}</div> :
                                 <>
                                        {
                                            isAdmin || owner
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