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
import axiosHttp from '../../../../api';
import { updateSafeTransaction } from "state/dashboard/reducer";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";
import { usePopper } from 'react-popper';

const PendingTxn = ({ tokens, threshold, transaction, owner, confirmTransaction, rejectTransaction, executeTransactions, confirmTxLoading, rejectTxLoading, executeTxLoading, isAdmin }: any) => {
    const { provider, account } = useWeb3React();
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState('');
    const [editMode, setEditMode] = useState(false);
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

    const _handleReasonKeyDown = (safeTxHash: string, recipient: string) => {
        if (reasonText && reasonText !== '') {
            axiosHttp.patch('transaction', { reason: reasonText, safeTxHash, recipient })
                .then(res => dispatch(updateSafeTransaction(res.data)))
        }
        if (editMode) {
            setEditMode(false);
        }
    }

    const handleEnableEditMode = (text: any) => {
        if (isAdmin) {
            setReasonText(text);
            setEditMode(true);
        }
    }

    const renderItem = (item: any, index: any) => {
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
                            mulReason
                                ?
                                <div className="dashboardText">{mulReason}</div>
                                :
                                <>
                                    {
                                        isAdmin
                                            ?
                                            <SimpleInputField
                                                disabled={!owner}
                                                onchange={e => setReasonText(e.target.value)}
                                                onKeyDown={(e: any) => { console.log(e.key); if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, mulRecipient) } }}
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
                        {threshold && index == 0 && <div className="dashboardTextBold">
                            {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`}
                        </div>}
                    </div>
                    {owner && index == 0 ? <div className="confirmIconGrp">
                        {!confirmReached && !hasMyConfirmVote && !rejectReached &&
                            <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={
                                confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                            } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                        {!confirmReached && !hasMyConfirmVote && !rejectReached && !transaction.rejectedTxn &&
                            <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={
                                rejectTxLoading === _get(transaction, 'nonce', '') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                            } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                        {confirmReached &&
                            <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'safeTxHash')} disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={"#C94B32"} className="button" />
                        }
                        {rejectReached &&
                            <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={"#C94B32"} className="button" />
                        }
                        {
                            (!(!confirmReached && !hasMyConfirmVote && !rejectReached) && !(!confirmReached && !hasMyConfirmVote && !rejectReached && !transaction.rejectedTxn) && !(confirmReached) && !(rejectReached)) &&
                            <div className="ex" style={{ position: 'relative' }}>
                                <div>
                                    <div style={{ height: 1, backgroundColor: '#76808d', width: 100 }}></div>
                                    <div style={{ height: '50%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, bottom: 0 }}></div>
                                </div>
                            </div>
                        }
                    </div> : <div className="confirmIconGrp">
                        <div className="ex" style={{ position: 'relative' }}>
                            {
                                index !== 0 ?
                                    <div>
                                        <div style={{ height: 1, backgroundColor: '#76808d', width: 100 }}></div>
                                        <div style={{ height: isLast ? '50%' : '100%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, top: 0 }}></div>
                                    </div> : null
                            }
                        </div>
                    </div>}
                </div>
                {threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached && isLast &&
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
                }
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
                                reason
                                    ?
                                    <>
                                        {
                                            editMode
                                                ?
                                                <SimpleInputField
                                                    disabled={!owner}
                                                    value={reasonText}
                                                    onchange={(e: any) => { setReasonText(e.target.value) }}
                                                    onKeyDown={(e: any) => { if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, recipient) } }}
                                                    className="inputField"
                                                    height={30}
                                                    width={"100%"}
                                                    placeholder="Reason for transaction"
                                                />
                                                :
                                                <div className="dashboardText" onClick={() => handleEnableEditMode(reason)}>{reason}</div>
                                        }
                                    </>
                                    :
                                    <>
                                        {
                                            isAdmin
                                                ?
                                                <SimpleInputField
                                                    disabled={!owner}
                                                    onchange={(e: any) => { setReasonText(e.target.value) }} onKeyDown={(e: any) => { if (e.key === 'Enter') { _handleReasonKeyDown(transaction.safeTxHash, recipient) } }}
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
                            {threshold && <div className="dashboardTextBold">
                                {rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} sign` : `${_get(transaction, 'confirmations', []).length}/${threshold} sign`}
                            </div>}
                        </div>
                        {owner == true ? <div className="confirmIconGrp">
                            {!confirmReached && !hasMyConfirmVote && !rejectReached &&
                                <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={
                                    confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                                } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                            {!confirmReached && !hasMyConfirmVote && !rejectReached && !transaction.rejectedTxn &&
                                <IconButton disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={
                                    rejectTxLoading === _get(transaction, 'nonce') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                                } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" />}
                            {confirmReached &&
                                <SimpleLoadButton condition={executeTxLoading == _get(transaction, 'safeTxHash')} disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={"#C94B32"} className="button" />
                            }
                            {rejectReached &&
                                <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={"#C94B32"} className="button" />
                            }
                        </div> : <div className="confirmIconGrp"></div>}
                    </div>
                    {threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached &&
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
                    }
                </> :
                <>
                    {_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).map(renderItem)}
                </>}
        </>
    )
}

export default PendingTxn;