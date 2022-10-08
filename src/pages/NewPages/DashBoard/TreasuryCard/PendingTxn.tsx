import React, { useMemo } from "react";
import { get as _get, find as _find } from 'lodash'
import { useWeb3React } from "@web3-react/core";
import SimpleInputField from "UIpack/SimpleInputField";
import sendTokenOutline from "../../../../assets/svg/sendTokenOutline.svg";
import { beautifyHexToken } from '../../../../utils';
import { useAppSelector } from "state/hooks";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import { AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

const PendingTxn = ({ tokens, threshold, transaction, owner, confirmTransaction, rejectTransaction, executeTransactions }: any) => {
    console.log(threshold)
    const { provider, account } = useWeb3React();

    //const threshold = useAppSelector((state) => state.flow.safeThreshold);

    const { amount, recipient } = useMemo(() => {
        let amount = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'value'), 'value', 0)
        let recipient = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'to'), 'value', '')
        return { amount, recipient }
    }, [transaction])

    const { confirmReached, hasMyConfirmVote, rejectReached, hasMyRejectVote } = useMemo(() => {
        let confirmReached =  _get(transaction, 'confirmations', []).length == threshold
        let hasMyConfirmVote =  !!_find(_get(transaction, 'confirmations', []), v => v.owner.toLowerCase() === account?.toLowerCase())
        let rejectReached, hasMyRejectVote = undefined;
        if(transaction.rejectedTxn) {
            rejectReached = _get(transaction, 'rejectedTxn.confirmations', []).length == threshold
            hasMyRejectVote =  !!_find(_get(transaction, 'rejectedTxn.confirmations', []), v => v.owner.toLowerCase() === account?.toLowerCase())
        }
        return { confirmReached, hasMyConfirmVote, rejectReached, hasMyRejectVote }
    }, [threshold, transaction])

    const renderItem = (item:any, index:any) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value')
        const mulRecipient = _get(item, 'dataDecoded.parameters[0].value')
        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        return (
            <>
            <div className="transactionRow">
                <div className="coinText">
                    <img src={sendTokenOutline} alt="" />
                    <div className="dashboardTextBold">
                        { `${mulAmount / 10 ** 18} ${ _get(_find(tokens, t => t.tokenAddress === transaction.to), 'token.symbol', '') }` }
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
                        { rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} vote` : `${_get(transaction, 'confirmations', []).length}/${threshold} vote`}
                    </div> }
                </div>
                { owner && index == 0 ? <div className="confirmIconGrp">
                   { !confirmReached && !hasMyConfirmVote && !rejectReached &&
                    <IconButton onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={ <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                   { !confirmReached && !hasMyConfirmVote && !rejectReached && !transaction.rejectedTxn &&
                    <IconButton onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={ <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                    { confirmReached && 
                      <SimpleButton onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={"#C94B32"} className="button" /> 
                    }
                    { rejectReached && 
                      <SimpleButton onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={"#C94B32"} className="button" /> 
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
                </div> }
            </div>
            { threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached && isLast &&
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
                    { threshold && <div className="dashboardTextBold">
                        {`${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} vote`}
                    </div> }
                </div>
                { owner && <div className="confirmIconGrp">
                  { !rejectReached && !hasMyRejectVote && !confirmReached && !rejectReached &&
                    <IconButton onClick={(e) => confirmTransaction(_get(transaction, 'rejectedTxn.safeTxHash'))} Icon={ <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                </div> }
            </div>
            }
        </>
        )
    }

    return (
        <>
        { _get(transaction, 'dataDecoded.method', null) !== "multiSend" ? 
            <>
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={sendTokenOutline} alt="" />
                        <div className="dashboardTextBold">
                            { `${amount / 10 ** 18} ${ _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'to', '')), 'token.symbol', '') }` }
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
                            { rejectReached ? `${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} vote` : `${_get(transaction, 'confirmations', []).length}/${threshold} vote`}
                        </div> }
                    </div>
                    { owner == true ? <div className="confirmIconGrp">
                    { !confirmReached && !hasMyConfirmVote && !rejectReached &&
                        <IconButton onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'))} Icon={ <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                    { !confirmReached && !hasMyConfirmVote && !rejectReached && !transaction.rejectedTxn &&
                        <IconButton onClick={(e) => rejectTransaction(_get(transaction, 'nonce'))} Icon={ <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                        { confirmReached && 
                        <SimpleButton onClick={() => executeTransactions(transaction)} width={"100%"} height={30} title="EXECUTE" bgColor={"#C94B32"} className="button" /> 
                        }
                        { rejectReached && 
                        <SimpleButton onClick={() => executeTransactions(transaction.rejectedTxn, true)} width={"100%"} height={30} title="REJECT" bgColor={"#C94B32"} className="button" /> 
                        }
                    </div> : <div className="confirmIconGrp"></div> }
                </div>
                { threshold && _get(transaction, 'rejectedTxn', null) && !confirmReached && !rejectReached &&
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
                        { threshold && <div className="dashboardTextBold">
                            {`${_get(transaction, 'rejectedTxn.confirmations', []).length}/${threshold} vote`}
                        </div> }
                    </div>
                    { owner && <div className="confirmIconGrp">
                    { !rejectReached && !hasMyRejectVote && !confirmReached && !rejectReached &&
                        <IconButton onClick={(e) => confirmTransaction(_get(transaction, 'rejectedTxn.safeTxHash'))} Icon={ <AiOutlineClose style={{ color: "#FFFFFF", height: "16px", width: "16px", }} /> } bgColor="#C94B32" height={30} width={30} border="2px solid #C94B32" className="iconButtons" /> }
                    </div> }
                </div>
                }
            </> : 
            <>
                {  _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).map(renderItem) }
            </> }
        </>
    )
}

export default PendingTxn;