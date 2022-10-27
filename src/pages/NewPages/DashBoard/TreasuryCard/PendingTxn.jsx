import React, { useMemo, useState } from "react";
import { get as _get, find as _find, debounce as _debounce } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import SimpleInputField from "UIpack/SimpleInputField";
import sendTokenOutline from "../../../../assets/svg/sendTokenOutline.svg";
import { beautifyHexToken } from '../../../../utils';
import { useAppDispatch, useAppSelector } from "state/hooks";
import IconButton from "UIpack/IconButton";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { LeapFrog } from "@uiball/loaders";
import { Tooltip } from "@chakra-ui/react";
import axiosHttp from '../../../../api';
import { updateSafeTransaction } from "state/dashboard/reducer";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import CloseBtn from '../../../../assets/svg/close-btn.svg';
import CheckBtn from '../../../../assets/svg/check-btn.svg';

const ToolTopContainer = React.forwardRef(({ children, ...rest }, ref) => (
      <div style={{ flex : 1}} ref={ref} {...rest}>
        {children}
      </div>
  ))

const PendingTxn = ({ tokens, executeFirst = '', threshold, transaction, owner, confirmTransaction, rejectTransaction, executeTransactions, confirmTxLoading, rejectTxLoading, executeTxLoading, isAdmin }) => {
    const { provider, account } = useWeb3React();
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState({});
    const [editMode, setEditMode] = useState(null);
    const dispatch = useAppDispatch()
    //const threshold = useAppSelector((state) => state.flow.safeThreshold);

    const { amount, recipient, reason } = useMemo(() => {
        let amount = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'value'), 'value', 0)
        let recipient = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'to'), 'value', '')
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let reason = null

        if (trans) {
            console.log('transaction', recipient, trans)
            reason = _get(_find(trans.data, u => u.recipient.toLowerCase() === recipient.toLowerCase()), 'reason', null)
        }
        console.log('reason', reason)
        return { amount, recipient, reason }
    }, [transaction])

    const { confirmReached, hasMyConfirmVote, rejectReached, hasMyRejectVote } = useMemo(() => {
        let confirmReached = _get(transaction, 'confirmations', []).length == threshold
        let hasMyConfirmVote = !!_find(_get(transaction, 'confirmations', []), v => v.owner.toLowerCase() === account?.toLowerCase())
        let rejectReached, hasMyRejectVote = undefined;
        if (transaction.rejectedTxn) {
            rejectReached = _get(transaction, 'rejectedTxn.confirmations', []).length == threshold
            hasMyRejectVote = !!_find(_get(transaction, 'rejectedTxn.confirmations', []), v => v.owner.toLowerCase() === account?.toLowerCase())
        }
        return { confirmReached, hasMyConfirmVote, rejectReached, hasMyRejectVote }
    }, [threshold, transaction])

    const _handleReasonKeyDown = (safeTxHash, recipient, reasonText) => {
        if (reasonText && reasonText !== '') {
            axiosHttp.patch('transaction', { reason: reasonText, safeTxHash, recipient })
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

    const handleEnableEditMode = (text, reason) => {
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

    const renderItem = (item, index) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value')
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value')
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        const token = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.symbol', '')
        let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let mulReason = '';
        if (trans)
            mulReason = _get(_find(trans.data, u => u.recipient.toLowerCase() === mulRecipient.toLowerCase()), 'reason', null)
        return (
            <>
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={sendTokenOutline} alt="" />
                        <div className="dashboardTextBold">
                            {`${mulAmount / 10 ** 18} ${token}`}
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
                                                onKeyDown={(e) => { console.log(e.target); if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, mulRecipient, e.target.value) } }}
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
                        {
                        threshold && index == 0 && <div className="dashboardTextBold">
                            {/* {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`} */}
                            {
                                threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached ?
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <div className="vote-view reject">
                                        <img src={CloseBtn} /> {_get(transaction, 'rejectedTxn.confirmations', []).length}/{threshold} sign
                                    </div>
                                    <div className="vote-view accept">
                                        <img src={CheckBtn} /> {_get(transaction, 'confirmations', []).length}/{threshold} sign
                                    </div>
                                </div> : 
                                <>
                                    {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`}
                                </>
                            }
                        </div> 
                        }
                    </div>
                    {owner && index == 0 ? <div className="confirmIconGrp">
                    {!confirmReached && !rejectReached &&
                            <IconButton disabled={hasMyRejectVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={
                                rejectTxLoading === _get(transaction, 'nonce', '') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineClose style={{ color: hasMyRejectVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32", height: "16px", width: "16px", }} />
                            } bgColor={hasMyRejectVote ? "rgba(27, 43, 65, 0)" : "#FFF00"} height={30} width={30} border={`2px solid ${hasMyRejectVote ? 'rgba(27, 43, 65, 0.2)' : '#C94B32'}`} className="iconButtons outline" />}
                        {!confirmReached && !rejectReached &&
                            <IconButton disabled={hasMyConfirmVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={
                                confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                            } bgColor={hasMyConfirmVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32"} height={30} width={30} border={`2px solid ${hasMyConfirmVote ? 'rgba(27, 43, 65, 0.1)' : '#C94B32'}`} className="iconButtons" />}
                        {confirmReached &&
                            <Tooltip placement='top' isDisabled={executeFirst === transaction.nonce} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'safeTxHash')} disabled={ executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={executeFirst === transaction.nonce ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                </ToolTopContainer>
                            </Tooltip>
                        }
                        {rejectReached &&
                            <Tooltip placement='top' isDisabled={executeFirst === transaction.nonce} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={executeFirst === transaction.nonce ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                </ToolTopContainer>
                            </Tooltip>
                        }
                        {
                            (!(!confirmReached && !hasMyConfirmVote && !rejectReached) && !(!confirmReached && !hasMyRejectVote && !rejectReached) && !(confirmReached) && !(rejectReached)) &&
                            <div className="ex" style={{ position: 'relative' }}>
                                <div>
                                    <div style={{ height: 1, backgroundColor: '#76808d', width: '120px', position: 'absolute', right: 0  }}></div>
                                    <div style={{ height: '50%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, bottom: 0 }}></div>
                                </div>
                            </div>
                        }
                    </div> : <div className="confirmIconGrp">
                        <div className="ex" style={{ position: 'relative' }}>
                            {
                                index !== 0 ?
                                    <div>
                                     <div style={{ height: 1, backgroundColor: '#76808d', width: '120px', position: 'absolute', right: 0  }}></div>
                                        <div style={{ height: isLast ? '50%' : '100%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, top: 0 }}></div>
                                    </div> : null
                            }
                        </div>
                    </div>}
                </div>
                {/* {threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached && isLast &&
                    <div className="transactionRow rejected">
                        <div className="coinText">
                            <div className="dashboardTextBold">
                            </div>
                        </div>
                        <div className="transactionName">
                        </div>
                        <div className="transactionAddress">
                            <div className="dashboardText">
                            </div>
                        </div>
                        <div id="voteArea">
                            {threshold && <div className="dashboardTextBold">
                                {`${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign`}
                            </div>}
                        </div>
                        {owner && <div className="confirmIconGrp">
                            {!rejectReached && !hasMyRejectVote && !confirmReached && !rejectReached &&
                                <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'rejectedTxn.safeTxHash'))} Icon={
                                    confirmTxLoading === _get(transaction, 'rejectedTxn.safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                                } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                        </div>}
                    </div>
                } */}
            </>
        )
    }

    return (
        <>
            {_get(transaction, 'dataDecoded.method', null) !== "multiSend" ?
                <>
                    <div className="transactionRow">
                        <div className="coinText">
                            <img src={sendTokenOutline} alt="" />
                            <div className="dashboardTextBold">
                                {`${amount / 10 ** 18} ${_get(_find(tokens, t => t.tokenAddress === _get(transaction, 'to', '')), 'token.symbol', '')}`}
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
                                                    onKeyDown={(e) => {  console.log(e); if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, recipient, e.target.value) } }}
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
                        {
                            threshold && <div className="dashboardTextBold">
                                {/* {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`} */}
                                {
                                    threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached ?
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                        <div className="vote-view reject">
                                            <img src={CloseBtn} /> {_get(transaction, 'rejectedTxn.confirmations', []).length}/{threshold} sign
                                        </div>
                                        <div className="vote-view accept">
                                            <img src={CheckBtn} /> {_get(transaction, 'confirmations', []).length}/{threshold} sign
                                        </div>
                                    </div> : 
                                    <>
                                        {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`}
                                    </>
                                }
                            </div> 
                            }
                        </div>
                        {owner == true ? <div className="confirmIconGrp">
                            {!confirmReached && !rejectReached &&
                                <IconButton disabled={hasMyRejectVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={
                                    rejectTxLoading === _get(transaction, 'nonce') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineClose style={{ color: hasMyRejectVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32", height: "16px", width: "16px", }} />
                                } bgColor={hasMyRejectVote ? "rgba(27, 43, 65, 0)" : "#FFF00"} height={30} width={30} border={`2px solid ${hasMyRejectVote ? 'rgba(27, 43, 65, 0.2)' : '#C94B32'}`} className="iconButtons" />}
                            {!confirmReached && !rejectReached &&
                                <IconButton disabled={hasMyConfirmVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={
                                    confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                                } bgColor={hasMyConfirmVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32"} height={30} width={30} border={`2px solid ${hasMyConfirmVote ? 'rgba(27, 43, 65, 0.1)' : '#C94B32'}`} className="iconButtons" />}
                            {confirmReached &&
                                <Tooltip placement='top' isDisabled={executeFirst === transaction.nonce} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                    <ToolTopContainer>
                                        <SimpleLoadButton condition={executeTxLoading == _get(transaction, 'safeTxHash')} disabled={executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={executeFirst === transaction.nonce ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                    </ToolTopContainer>
                                </Tooltip>
                            }
                            {rejectReached &&
                            <Tooltip placement='top' isDisabled={executeFirst === transaction.nonce} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton  condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={executeFirst === transaction.nonce ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                </ToolTopContainer>
                            </Tooltip>
                            }
                        </div> : <div className="confirmIconGrp"></div>}
                    </div>
                    {/* {threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached &&
                        <div className="transactionRow rejected">
                            <div className="coinText">
                                <div className="dashboardTextBold">
                                </div>
                            </div>
                            <div className="transactionName">
                            </div>
                            <div className="transactionAddress">
                                <div className="dashboardText">
                                </div>
                            </div>
                            <div id="voteArea">
                                {threshold && <div className="dashboardTextBold">
                                    {`${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign`}
                                </div>}
                            </div>
                            {owner && <div className="confirmIconGrp">
                                {!rejectReached && !hasMyRejectVote && !confirmReached && !rejectReached &&
                                    <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'rejectedTxn.safeTxHash'))} Icon={<AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />} bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                            </div>}
                        </div>
                    } */}
                </> :
                <>
                    {_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).map(renderItem)}
                </>}
        </>
    )
}

export default PendingTxn;