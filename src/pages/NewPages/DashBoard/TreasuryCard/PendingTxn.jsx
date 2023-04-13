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
import { SupportedChainId } from "constants/chains";
import useSafeTokens from "hooks/useSafeTokens";
import Dropdown from "muiComponents/Dropdown";
import Avatar from "muiComponents/Avatar";

const ToolTopContainer = React.forwardRef(({ children, ...rest }, ref) => (
      <div style={{ flex : 1}} ref={ref} {...rest}>
        {children}
      </div>
  ))

const PendingTxn = ({editMode, onSetEditMode,editTag,onSetEditTag,  safeAddress, labels, tokens, executeFirst = '', threshold, transaction, owner, confirmTransaction, rejectTransaction, executeTransactions, confirmTxLoading, rejectTxLoading, executeTxLoading, isAdmin, onLoadLabels }) => {
    console.log("labels:",labels);
    console.log("transactions : ",transaction);
    const { provider, account, chainId } = useWeb3React();
    const { DAO } = useAppSelector(store => store.dashboard);
    const [reasonText, setReasonText] = useState({});
    // const [editTag, setEditTag] = useState(false);
    const dispatch = useAppDispatch()
    const {safeTokens} = useSafeTokens(safeAddress)
    //const threshold = useAppSelector((state) => state.flow.safeThreshold);

    const { amount, tokenSymbol, recipient, reason,tag, decimal, isAllowanceTransaction, isOwnerModificaitonTransaction } = useMemo(() => {
        const tokendata = _find(tokens, t => t.tokenAddress === _get(transaction, 'to', ''))
        const decimal = _get(tokendata, 'token.decimals', _get(transaction, 'token.decimals', 18))
        let amount = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'value' || p.name === '_value'), 'value', _get(transaction, 'value', 0))
        let recipient = _get(_find(_get(transaction, 'dataDecoded.parameters', []), p => p.name === 'to' || p.name === '_to'), 'value', _get(transaction, 'to', ''))
        let tokenSymbol = undefined;

        let isAllowanceTransaction = false;
        let isOwnerModificaitonTransaction = false;

        const setAllowance =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => _get(vd, 'dataDecoded.method', '')=== "setAllowance")
        if(setAllowance)
            isAllowanceTransaction = true;
        const ownerModification =  _get(transaction, 'dataDecoded.method', '') === "addOwnerWithThreshold" || _get(transaction, 'dataDecoded.method', '') === "removeOwner" || _get(transaction, 'dataDecoded.method', '') === "changeThreshold" 
        if(ownerModification)
            isOwnerModificaitonTransaction = true;
        if(transaction?.dataDecoded?.method === 'multiSend' && transaction?.dataDecoded?.parameters[0]?.name === 'transactions' && isAllowanceTransaction) {
            const addDelegate =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => _get(vd, 'dataDecoded.method', '') === "addDelegate")
            recipient = _get(addDelegate, 'dataDecoded.parameters[0].value', '')
            amount = _get(setAllowance, 'dataDecoded.parameters[2].value', '')
            const tokenAddr = _get(setAllowance, 'dataDecoded.parameters[1].value', '')
            tokenSymbol = _get(_find(tokens, st => st.tokenAddress === tokenAddr), 'token.symbol', '')
            if(labels && labels.length > 0) {
                let am = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === transaction.safeTxHash), "recurringPaymentAmount", null)
                if(am)
                    amount = am * 10 ** _get(transaction, 'token.decimals', 18);
            }
        }

        if(isOwnerModificaitonTransaction) {
            if(_get(transaction, 'dataDecoded.method', '') === "removeOwner")
                recipient = _get(transaction, 'dataDecoded.parameters[1].value', '')
            else if(_get(transaction, 'dataDecoded.method', '') === "addOwnerWithThreshold")
                recipient = _get(transaction, 'dataDecoded.parameters[0].value', '')
        }

        //let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)
        let reason = null
        if(labels && labels.length > 0) {
            reason = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === transaction.safeTxHash), "label", null)
        }

        let tag = null
        if(labels && labels.length > 0) {
            tag = _get(_find(labels, l => l.recipient.toLowerCase() === recipient.toLowerCase() && l.safeTxHash === transaction.safeTxHash), "tag", null)
        }
        // if (trans) {
        //     console.log('transaction', recipient, trans)
        //     reason = _get(_find(trans.data, u => u.recipient.toLowerCase() === recipient.toLowerCase()), 'reason', null)
        // }
        console.log('reason', reason)
        return { amount, tokenSymbol, recipient, reason,tag, decimal, isAllowanceTransaction, isOwnerModificaitonTransaction }
    }, [transaction, labels, tokens])

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
            axiosHttp.patch('transaction/label', { safeAddress, label: reasonText, safeTxHash, recipient })
                .then(res => { 
                    //dispatch(updateSafeTransaction(res.data))
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

    const _handleSelectTag = (safeTxHash, recipient, tagText) => {
        if (tagText && tagText !== '') {
            axiosHttp.patch('transaction/tag', { safeAddress, tag: tagText, safeTxHash, recipient })
                .then(res => { 
                    onLoadLabels(res.data);
                    // setEditTag(false);
                    if (editTag && editTag === `${safeTxHash}-${recipient}`) {
                        onSetEditTag(null);
                    }
                })
        }
    }

    const handleEnableEditMode = (text, reason) => {
        if (isAdmin) {
            onSetEditMode(text);
            setReasonText(prev => {
                return {
                    ...prev,
                    [text] : reason
                }
            })
        }
    }

    const handleEnableEditTag = (text) => {
        if (isAdmin) {
            onSetEditTag(text);
        }
    }

    const renderItem = (item, index) => {
        const mulAmount = _get(item, 'dataDecoded.parameters[1].value', _get(item, 'value', 0))
        let mulRecipient = _get(item, 'dataDecoded.parameters[0].value', _get(item, 'to', 0))

        const isLast = _get(transaction, 'dataDecoded.parameters[0].valueDecoded', []).length - 1 === index;
        const muldecimal = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.decimals', _get(transaction, 'token.decimals', 18))
        const token = _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'dataDecoded.parameters[0].valueDecoded', [])[index].to), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))
        //let trans = _find(_get(DAO, 'safe.transactions', []), t => t.safeTxHash === transaction.safeTxHash)

        if(_get(item, 'dataDecoded.method', '') === 'removeOwner')
            mulRecipient = _get(item, 'dataDecoded.parameters[1].value', _get(item, 'to', 0))

        let mulReason = '';
        if(labels && labels.length > 0) {
            mulReason = _get(_find(labels, l => l.recipient && l.safeTxHash && (_get(l, "recipient", "").toLowerCase() === mulRecipient.toLowerCase()) && (l.safeTxHash.toLowerCase() === transaction.safeTxHash.toLowerCase())), "label", null)
        }
        let mulTag = null;
        if(labels && labels.length > 0) {
            mulTag = _get(_find(labels, l => l.recipient && l.safeTxHash && (_get(l, "recipient", "").toLowerCase() === mulRecipient.toLowerCase()) && (l.safeTxHash.toLowerCase() === transaction.safeTxHash.toLowerCase())), "tag", null)
        }
        const isOwnerModificaitonTransaction =  _find(_get(transaction, 'dataDecoded.parameters[0].valueDecoded', []), vd => (_get(vd, 'dataDecoded.method', '') === "addOwnerWithThreshold") || _get(vd, 'dataDecoded.method', '') === "removeOwner" || _get(vd, 'dataDecoded.method', '') === "changeThreshold" )

        return (
            <>
                <div className="transactionRow">
                    <div className="coinText">
                        <img src={sendTokenOutline} alt="" />
                        <div className="dashboardTextBold">
                            { isOwnerModificaitonTransaction ? `-` : `${mulAmount / 10 ** muldecimal} ${token}`}
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
                                                autoFocus={editMode === `${transaction.safeTxHash}-${mulRecipient}`}
                                                disabled={!owner && !isAdmin}
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
                            {handleRenderAvatar(mulRecipient)}
                        </div>
                    </div>
                    <div className="transactionAddress">
                            {
                                mulTag
                                ?
                                <>
                                {
                                    (!editTag || (editTag && editTag !== `${transaction.safeTxHash}-${mulRecipient}`))
                                    ?
                                    <div onClick={() => handleEnableEditTag(`${transaction.safeTxHash}-${mulRecipient}`)} className="dashboardText" style={{background:`${mulTag.color}20`,padding:'6px 10px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'20px',cursor:'pointer'}}>
                                        <span style={{color:mulTag.color,fontWeight:'700',fontSize:'10px'}}>{mulTag.value}</span>
                                    </div>
                                    :
                                    <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, mulRecipient,value)}/>
                                }
                                </>
                                :
                                <>
                                    {
                                        (!editTag || (editTag && editTag !== `${transaction.safeTxHash}-${mulRecipient}`))
                                        ?
                                        <div className="add-label-btn" onClick={() => handleEnableEditTag(`${transaction.safeTxHash}-${mulRecipient}`)}>
                                            <span style={{color:'#111111',fontWeight:'700',fontSize:'10px'}}>Add Label +</span>
                                        </div>
                                        :
                                        <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, mulRecipient,value)}/>
                                    }
                                </>
                            }
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
                    { index == 0 ? <div className="confirmIconGrp">
                    {!confirmReached && !rejectReached &&
                            <IconButton disabled={!owner || hasMyRejectVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'), transaction)} Icon={
                                rejectTxLoading === _get(transaction, 'nonce', '') ? <LeapFrog size={10} color="#C94B32" /> : <AiOutlineClose style={{ color: !owner || hasMyRejectVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32", height: "16px", width: "16px", }} />
                            } bgColor={!owner || hasMyRejectVote ? "rgba(27, 43, 65, 0)" : "#FFF00"} height={30} width={30} border={`2px solid ${!owner || hasMyRejectVote ? 'rgba(27, 43, 65, 0.2)' : '#C94B32'}`} className="iconButtons outline" />}
                        {!confirmReached && !rejectReached &&
                            <IconButton disabled={!owner || hasMyConfirmVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'), transaction)} Icon={
                                confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                            } bgColor={!owner || hasMyConfirmVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32"} height={30} width={30} border={`2px solid ${!owner || hasMyConfirmVote ? 'rgba(27, 43, 65, 0.1)' : '#C94B32'}`} className="iconButtons" />}
                        {confirmReached &&
                            <Tooltip placement='top' isDisabled={!owner || executeFirst === transaction.nonce || transaction.offChain} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'safeTxHash')} disabled={(!transaction.offChain || !owner) && (!owner || executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading)} onClick={() => executeTransactions(transaction, false, isOwnerModificaitonTransaction, isOwnerModificaitonTransaction ? null : mulAmount / 10 ** muldecimal)} width={"100%"} height={30} title="EXECUTE" bgColor={(transaction.offChain && owner) || (owner && executeFirst === transaction.nonce) ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                </ToolTopContainer>
                            </Tooltip>
                        }
                        {rejectReached &&
                            <Tooltip placement='top' isDisabled={!owner || executeFirst === transaction.nonce || transaction.offChain} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={ (!transaction.offChain || !owner) && ( !owner || executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading )} onClick={() => executeTransactions(transaction, true, isOwnerModificaitonTransaction, isOwnerModificaitonTransaction ? null : mulAmount / 10 ** muldecimal)} width={"100%"} height={30} title="REJECT" bgColor={transaction.offChain || (owner && executeFirst === transaction.nonce) ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                </ToolTopContainer>
                            </Tooltip>
                        }
                        {/* {
                            (!(!confirmReached && !hasMyConfirmVote && !rejectReached) && !(!confirmReached && !hasMyRejectVote && !rejectReached) && !(confirmReached) && !(rejectReached)) &&
                            <div className="ex" style={{ position: 'relative' }}>
                                <div>
                                    <div style={{ height: 1, backgroundColor: '#76808d', width: '120px', position: 'absolute', right: 0  }}></div>
                                    <div style={{ height: '50%', backgroundColor: '#76808d', width: 1, position: 'absolute', right: 0, bottom: 0 }}></div>
                                </div>
                            </div>
                        } */}
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

    const handleRenderAvatar = (reciever) => {
        const user = _find(_get(DAO,'members',[]),item => _get(item, 'member.wallet', '') === reciever);
        if(user){
            return(
                <Avatar name={user.member.name} wallet={user.member.wallet}/>
            )
        }
        else{
            return `to ${beautifyHexToken(reciever)}`
        }
    }

    return (
        <>
            {_get(transaction, 'dataDecoded.method', null) !== "multiSend" || (_get(transaction, 'dataDecoded.method', null) === "multiSend" && isAllowanceTransaction && _get(transaction, 'dataDecoded.parameters[0].name', null) === "transactions") ?
                <>
                    <div className="transactionRow">
                        <div className="coinText">
                            <img src={sendTokenOutline} alt="" />
                            <div className="dashboardTextBold">
                                {isOwnerModificaitonTransaction ? `-` : `${amount / 10 ** decimal} ${tokenSymbol ? tokenSymbol : _get(_find(tokens, t => t.tokenAddress === _get(transaction, 'to', '')), 'token.symbol', _get(transaction, 'token.symbol', chainId === SupportedChainId.POLYGON ? 'MATIC' : 'GOR'))}`}
                            </div>
                        </div>
                        <div className="transactionName">
                            {
                                reason && (!editMode || (editMode && editMode !== `${transaction.safeTxHash}-${recipient}`)) 
                                ?
                                <div className="dashboardText" onClick={() => handleEnableEditMode(`${transaction.safeTxHash}-${recipient}`, reason)}>{reason}</div> 
                                :
                                 <>
                                        {
                                            isAdmin || owner
                                                ?
                                                <SimpleInputField
                                                    autoFocus={editMode === `${transaction.safeTxHash}-${recipient}`}
                                                    disabled={!owner && !isAdmin}
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
                                {handleRenderAvatar(recipient)}
                            </div>
                        </div>
                        <div className="transactionAddress">
                            {
                                tag
                                ?
                                <>
                                    {
                                        (!editTag || (editTag && editTag !== `${transaction.safeTxHash}-${recipient}`))
                                        ?
                                        <div onClick={() => handleEnableEditTag(`${transaction.safeTxHash}-${recipient}`)} className="dashboardText" style={{background:`${tag.color}20`,padding:'6px 10px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'20px',cursor:'pointer'}}>
                                            <span style={{color:tag.color,fontWeight:'700',fontSize:'10px'}}>{tag.value}</span>
                                        </div>
                                        :
                                        <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, recipient,value)}/>
                                    }
                                </>
                                :
                                <>
                                    {
                                        (!editTag || (editTag && editTag !== `${transaction.safeTxHash}-${recipient}`))
                                        ?
                                        <div className="add-label-btn" onClick={() => handleEnableEditTag(`${transaction.safeTxHash}-${recipient}`)}>
                                            <span style={{color:'#111111',fontWeight:'700',fontSize:'10px'}}>Add Label +</span>
                                        </div>
                                        :
                                        <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, recipient,value)}/>
                                    }
                                </>
                            }
                        </div>
                        {/* <div className="transactionAddress">
                            {
                                tag
                                ?
                                <>
                                {
                                    editTag
                                    ?
                                    <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, recipient,value)}/>
                                    :
                                    <div onClick={() => setEditTag(true)} className="dashboardText" style={{background:`${tag.color}20`,padding:'6px 10px',display:'flex',alignItems:'center',justifyContent:'center',borderRadius:'20px',cursor:'pointer'}}>
                                        <span style={{color:tag.color,fontWeight:'700',fontSize:'10px'}}>{tag.value}</span>
                                    </div>
                                }
                                </>
                                :
                                <>
                                    {
                                        editTag
                                        ?
                                        <Dropdown onChangeOption={(value) => _handleSelectTag(transaction.safeTxHash, recipient,value)}/>
                                        :
                                        <div className="add-label-btn" onClick={() => setEditTag(true)}>
                                            <span style={{color:'#111111',fontWeight:'700',fontSize:'10px'}}>Add Label +</span>
                                        </div>
                                    }
                                </>
                            }
                        </div> */}
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
                        { true ? <div className="confirmIconGrp">
                            {!confirmReached && !rejectReached &&
                                <IconButton disabled={!owner || hasMyRejectVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => rejectTransaction(_get(transaction, 'nonce'), transaction)} Icon={
                                    rejectTxLoading === _get(transaction, 'nonce') ? <LeapFrog size={10} color="#C94B32" /> : <AiOutlineClose style={{ color: !owner || hasMyRejectVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32", height: "16px", width: "16px", }} />
                                } bgColor={!owner || hasMyRejectVote ? "rgba(27, 43, 65, 0)" : "#FFF00"} height={30} width={30} border={`2px solid ${!owner || hasMyRejectVote ? 'rgba(27, 43, 65, 0.2)' : '#C94B32'}`} className="iconButtons" />}
                            {!confirmReached && !rejectReached &&
                                <IconButton disabled={!owner || hasMyConfirmVote || confirmTxLoading || rejectTxLoading || executeTxLoading} onClick={(e) => confirmTransaction(_get(transaction, 'safeTxHash'), transaction)} Icon={
                                    confirmTxLoading === _get(transaction, 'safeTxHash') ? <LeapFrog size={10} color="#FFF" /> : <AiOutlineCheck style={{ color: "#FFFFFF", height: "16px", width: "16px", }} />
                                } bgColor={!owner || hasMyConfirmVote ? "rgba(27, 43, 65, 0.2)" : "#C94B32"} height={30} width={30} border={`2px solid ${ !owner ||hasMyConfirmVote ? 'rgba(27, 43, 65, 0.1)' : '#C94B32'}`} className="iconButtons" />}
                            {confirmReached &&
                                <Tooltip placement='top' isDisabled={!owner || executeFirst === transaction.nonce || transaction.offChain} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                    <ToolTopContainer>
                                        <SimpleLoadButton condition={executeTxLoading == _get(transaction, 'safeTxHash')} disabled={!transaction.offChain && (!owner || executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading)} onClick={() => executeTransactions(transaction, false, isOwnerModificaitonTransaction, amount / 10 ** decimal, isAllowanceTransaction)} width={"100%"} height={30} title="EXECUTE" bgColor={(transaction.offChain && owner) || (owner && executeFirst === transaction.nonce) ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
                                    </ToolTopContainer>
                                </Tooltip>
                            }
                            {rejectReached &&
                            <Tooltip placement='top' isDisabled={!owner || executeFirst === transaction.nonce || transaction.offChain} label={`Transaction with nonce ${executeFirst} needs to be executed first`}>
                                <ToolTopContainer>
                                    <SimpleLoadButton  condition={executeTxLoading === _get(transaction, 'rejectedTxn.safeTxHash', _get(transaction, 'safeTxHash', ''))} disabled={!transaction.offChain && (!owner || executeFirst !== transaction.nonce || confirmTxLoading || rejectTxLoading || executeTxLoading)} onClick={() => executeTransactions(transaction, true, isOwnerModificaitonTransaction, isOwnerModificaitonTransaction ? null : amount / 10 ** decimal)} width={"100%"} height={30} title="REJECT" bgColor={transaction.offChain || (owner && executeFirst === transaction.nonce) ? "#C94B32" : "rgba(27, 43, 65, 0.2)"} className="button" />
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