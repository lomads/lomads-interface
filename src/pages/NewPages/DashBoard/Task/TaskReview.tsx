import React, { useState, useEffect, useMemo } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy, findIndex as _findIndex, debounce as _debounce } from 'lodash';
import './TaskReview.css';
import { CgClose } from 'react-icons/cg';
import { IoIosArrowBack } from 'react-icons/io'
import userPlaceholder from 'assets/svg/user-placeholder.svg';
import clipboard from 'assets/svg/clipboard.svg';
import editIcon from 'assets/svg/editButton.svg';
import Button from 'muiComponents/Button';
import compensationIcon from 'assets/svg/compensation.svg';
import polygonIcon from 'assets/svg/polygon.svg';
import starIcon from 'assets/svg/star.svg';
import bigMember from 'assets/svg/bigMember.svg';
import folder from 'assets/svg/folder.svg';
import useRole from "hooks/useRole";
import { ImportSafe, safeService } from "connection/SafeCall";
import { SafeTransactionDataPartial } from "@gnosis.pm/safe-core-sdk-types";
import {
    Input,
    FormControl,
    FormErrorMessage,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberDecrementStepper,
    NumberIncrementStepper,
} from "@chakra-ui/react";
import { tokenCallSafe } from "connection/DaoTokenCall";
import { getSafeTokens } from 'utils'
import { useAppSelector, useAppDispatch } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import axiosHttp from 'api'
import { setDAO, setTask } from "state/dashboard/reducer";

import { approveTask, rejectTask } from 'state/dashboard/actions'
import { resetAssignTaskLoader, resetRejectTaskMemberLoader, resetRejectTaskLoader } from 'state/dashboard/reducer';
import { id } from 'ethers/lib/utils';
import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { beautifyHexToken } from '../../../../utils';
import { SupportedChainId } from 'constants/chains';
import useSafeTransaction from 'hooks/useSafeTransaction';
import { toast } from 'react-hot-toast';
import SwitchChain from 'components/SwitchChain';
import { useSafeTokens } from 'hooks/useSafeTokens';
import Dropdown from 'muiComponents/Dropdown';

const TaskReview = ({ task, close }: any) => {
    console.log("task review : ", task);
    const dispatch = useAppDispatch();
    const { DAO, user, rejectTaskLoading } = useAppSelector((state) => state.dashboard);
    const [newCompensation, setNewCompensation] = useState<number>(0)
    const [showModifyCompensation, setShowModifyCompensation] = useState<boolean>(false)
    const [showRejectSubmission, setShowRejectSubmission] = useState<boolean>(false)
    const { provider, account, chainId: currentChainId, connector } = useWeb3React();
    const [activeSubmission, setActiveSubmission] = useState<any>(null)
    const [approveLoading, setApproveLoading] = useState<any>(false)
    const { isSafeOwner } = useRole(DAO, account);
    const currentNonce = useAppSelector((state) => state.flow.currentNonce);
    //const [safeTokens, setSafeTokens] = useState([]);
    const { safeTokens } = useSafeTokens()
    const [reopen, setReopen] = useState(false);
    const [rejectionNote, setRejectionNote] = useState('');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [rejectUser, setRejectUser] = useState<any>(null);
    const [error, setError] = useState<any>(null);
    const [chainId, setChainId] = useState(null)
    const [selectedTag, setSelectedTag] = useState<any>(null);

    const { createSafeTransaction } = useSafeTransaction(_get(DAO, 'safe.address', ''))

    useEffect(() => {
        if(DAO)
            setChainId(_get(DAO, 'safe.chainId', _get(DAO, 'chainId')))
    }, [DAO])

    // useEffect(() => {
    //     if (chainId) {
    //         getSafeTokens(chainId, _get(DAO, 'safe.address', null))
    //             .then(tokens => setSafeTokens(tokens))
    //     }
    // }, [chainId, DAO])

    const taskSubmissions = useMemo(() => {
        console.log("59 task : ", task)
        if (task)
            return _get(task, 'members', []).filter((member: any) => member.submission && (member.status !== 'submission_accepted' && member.status !== 'submission_rejected'))
        return []
    }, [task])

    // runs after rejecting a task submission
    useEffect(() => {
        if (rejectTaskLoading === false) {
            dispatch(resetRejectTaskLoader());
            if (taskSubmissions.length > 0) {
                setShowRejectSubmission(false);
                const currIndex = _findIndex(taskSubmissions, (t: any) => t._id === activeSubmission._id)
                const nextSubmission = _get(taskSubmissions, `${currIndex + 1}`, undefined)
                const prevSubmission = _get(taskSubmissions, `${currIndex - 1}`, undefined)
                if (prevSubmission)
                    setActiveSubmission(prevSubmission)
                else if (nextSubmission)
                    setActiveSubmission(nextSubmission)
            }
            else {
                close();
            }
        }
    }, [rejectTaskLoading]);

    useEffect(() => {
        console.log("task submissions : ", taskSubmissions);
        if (!activeSubmission && taskSubmissions.length > 0)
            setActiveSubmission(taskSubmissions[0])
    }, [taskSubmissions])

    useEffect(() => {
        if (task)
            setNewCompensation(+_get(task, 'compensation.amount', 0))
    }, [task])

    const assignedUser = useMemo(() => {
        let user = _find(_get(task, 'members', []), m => m.status === 'approved')
        if (user)
            return user.member
        return null;
    }, [task]);

    const eligibleContributors = useMemo(() => {
        return _get(DAO, 'members', []).filter((m: { member: any; }) =>
            task.reviewer !== m.member._id &&
            m.member._id !== user._id &&
            (!assignedUser ||
                (assignedUser && m.member._id !==
                    assignedUser?._id)))
    }, [DAO, selectedUser, task])

    const createOnChainTxn = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!chainId) return;
                const send = [{ recipient: activeSubmission.member.wallet, amount: newCompensation,tag:selectedTag }]
                const txnResponse = await createSafeTransaction({ tokenAddress: _get(task, 'compensation.currency', null), send, confirm: isSafeOwner, createLabel: false })
                if(txnResponse) {
                    resolve(txnResponse.safeTxHash)
                }
            } catch (e) {
                setError(e)
                console.log(e)
                reject(e)
            }
        })
    }

    const tokenDecimal = useMemo(() => {
        if (task) {
            const tokenAddr = _get(task, 'compensation.currency', 'SWEAT');
            if (tokenAddr === 'SWEAT')
                return 18
            const tkn = _find(safeTokens, (stkn: any) => stkn.tokenAddress === tokenAddr)
            if (tkn) {
                console.log("tokenDecimal", tkn)
                return _get(tkn, 'token.decimals', 18)
            }
        }
        return 18
    }, [safeTokens, task])

    const handleApproveTask = async () => {
        try {
            setApproveLoading(true);
            setError(null)
            let onChainSafeTxHash: any = undefined;
            if (isSafeOwner && _get(task, 'compensation.currency', 'SWEAT') !== 'SWEAT') {
                if(currentChainId !== chainId) {
                    setApproveLoading(false);
                    return toast.custom(t => <SwitchChain t={t} nextChainId={chainId}/>)
                }
                onChainSafeTxHash = await createOnChainTxn();
            }
    
            const offChainPayload = {
                daoId: _get(DAO, '_id', undefined),
                taskId: _get(task, '_id', undefined),
                safe: _get(DAO, 'safe.address', undefined),
                nonce: moment().unix(),
                safeTxHash: nanoid(32),
                executor: account,
                submissionDate: moment().utc().toDate(),
                token: {
                    decimals: tokenDecimal,
                    symbol: _get(task, 'compensation.symbol', 'SWEAT'),
                    tokenAddress: _get(task, 'compensation.currency', 'SWEAT')
                },
                confirmations: isSafeOwner && _get(task, 'compensation.symbol', 'SWEAT') === 'SWEAT' ? [{
                    owner: account,
                    submissionDate: moment().utc().toDate()
                }] : [],
                dataDecoded: {
                    method: 'transfer',
                    parameters: [
                        { name: 'to', type: "address", value: _get(activeSubmission, 'member.wallet', null) },
                        { name: 'value', type: "uint256", value: `${BigInt(parseFloat(`${newCompensation}`) * 10 ** tokenDecimal)}` },
                    ]
                }
            }
            const payload = {
                daoUrl: _get(DAO, 'url', undefined),
                compensationDelta: newCompensation - _get(task, 'compensation.amount', 0),
                offChainPayload: !isSafeOwner || _get(task, 'compensation.symbol', 'SWEAT') == 'SWEAT' ? offChainPayload : undefined,
                onChainSafeTxHash,
                recipient: _get(activeSubmission, 'member._id', null)
            }
    
            return axiosHttp.post(`task/${task._id}/approve?daoUrl=${DAO.url}`, payload)
                .then(async res => {
                    let m = _get(activeSubmission, 'member.name', '') === '' ? _get(activeSubmission, 'member.wallet', '') : _get(activeSubmission, 'member.name', '')
                    await axiosHttp.post(`transaction/label`, {
                        safeAddress: _get(DAO, 'safe.address', null),
                        safeTxHash: onChainSafeTxHash ? onChainSafeTxHash : offChainPayload.safeTxHash,
                        recipient: _get(activeSubmission, 'member.wallet', null),
                        label: `${m} | ${_get(task, 'name', '')}`,
                        tag:selectedTag
                    })
                    dispatch(setDAO(res.data.dao))
                    dispatch(setTask(res.data.task))
                    close()
                })
                .finally(() => setApproveLoading(false))
        } catch (e) {
            setApproveLoading(false);
            console.log(e)
            return setError(e)
        }
    }

    const handleApproveTaskAsync = _debounce(handleApproveTask, 500)

    const handleRejectTask = () => {
        dispatch(rejectTask({
            payload:
            {
                reopen,
                rejectionNote,
                contributionType: _get(task, 'contributionType', ''),
                isSingleContributor: _get(task, 'isSingleContributor', ''),
                newContributorId: selectedUser ? selectedUser._id : null,
                rejectUser
            },
            daoUrl: _get(DAO, 'url', ''),
            taskId: _get(task, '_id', '')
        }));
    }

    const updateCompensation = () => {
        return (
            <div className="task-review-overlay">
                <div className="task-review-container">
                    <div className="task-review-header">
                        <span>{task.name}</span>
                        <button onClick={close}>
                            <CgClose size={20} color="#C94B32" />
                        </button>
                    </div>
                    <div className='task-review-edit-compensation'>
                        <div className='container'>
                            <img src={compensationIcon} />
                            <div className='title'>Change compensation</div>
                            <div className='picker-container'>
                                <div className='currency'>
                                    <div className='currency-container'>
                                        <img src={_get(task, 'compensation.symbol', 'SWEAT') === 'MATIC' ? polygonIcon : starIcon} />
                                        <div>{_get(task, 'compensation.symbol', 'SWEAT')}</div>
                                    </div>
                                </div>
                                <div className='number-input'>
                                    <NumberInput onChange={e => setNewCompensation(+e)} defaultValue={newCompensation} style={{ width: (64 + 50), height: 50, borderRadius: '0px 10px 10px 0px', boxShadow: 'inset -1px 0px 4px rgba(27, 43, 65, 0.1)' }} step={1} min={0}>
                                        <NumberInputField className='input' style={{ padding: 0, textAlign: "center", height: 50, width: 64, backgroundColor: '#F5F5F5', borderRadius: '0', borderWidth: 0 }} />
                                        <NumberInputStepper style={{ width: 50, backgroundColor: 'transparent', borderRadius: '0px 10px 10px 0px' }}>
                                            <NumberIncrementStepper color="#C94B32" />
                                            <NumberDecrementStepper color="#C94B32" style={{ borderTopWidth: 0 }} />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </div>
                            </div>
                            <div className='task-review-foot'>
                                <button onClick={() => {
                                    setShowModifyCompensation(false)
                                    setNewCompensation(+_get(task, 'compensation.amount', 0))
                                }}>CANCEL</button>
                                <button onClick={() => {
                                    setShowModifyCompensation(false)
                                }}>CHANGE</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderSingleSubmission = (submission: any) => {
        console.log("submission : ", submission);
        if (!submission) return null;
        return (
            <div className='task-review-card'>
                <div className='task-review-body'>
                    {taskSubmissions.length > 1 ?
                        <>
                            <img src={userPlaceholder} alt="icon" />
                            <h1 style={{ minHeight: '45px' }}>{submission.member.name}</h1>
                            <p className='wallet-address'>{submission.member.wallet.slice(0, 6) + "..." + submission.member.wallet.slice(-4)}</p>
                        </> :
                        <>
                            <img src={clipboard} alt="icon" />
                            <h1 style={{ minHeight: '45px' }}>{submission.member.name} did the job!</h1>
                        </>
                    }
                    <div className='detail-container'>
                        <span>Note</span>
                        <div className='note'>{submission.submission.note}</div>
                    </div>
                    
                </div>
                <div style={{width:'100%',display:'flex',flexDirection:'column'}}>
                    <div className='detail-container'>
                        {task && _get(task, 'submissionLink', []).length == 0 ?
                            <>
                                <span>Links</span>
                                { submission.submission &&
                                    _get(submission, 'submission.submissionLink', []).map((item: any, index: number) => {
                                        return (
                                            <button onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}>{item.title}</button>
                                        )
                                    })
                                }
                            </> :
                            <>
                                <span>Check submission:</span>
                                <button className='submitLink-btn' onClick={() => window.open(task.submissionLink, '_blank', 'noopener,noreferrer')}>
                                    <img style={{ marginRight: 8 }} src={folder} />
                                    SUBMISSION LINK
                                </button>
                            </>
                        }
                    </div>
                    <div className='task-review-compensation'>
                        <div className='task-review-compensation-main'>
                            <div style={{width:'100%',display:'flex'}}>
                                <div className='container'>
                                    <div>Compensation</div>
                                    <img src={starIcon} />
                                    <div className='amount'>{_get(task, 'compensation.amount', 0)}</div>
                                    {(newCompensation - _get(task, 'compensation.amount', 0)) !== 0 && <div className='extra'>{`${(newCompensation - _get(task, 'compensation.amount', 0)) > 0 ? '+' : ''} ${(newCompensation - _get(task, 'compensation.amount', 0))}`}</div>}
                                    <div>{_get(task, 'compensation.symbol', "SWEAT")}</div>
                                </div>
                                <button onClick={() => { setError(null); setShowModifyCompensation(true) }}>
                                    <img src={editIcon} alt="edit-icon" />
                                </button>
                            </div>
                            <div style={{width:'100%'}}>
                                <Dropdown 
                                    defaultMenuIsOpen={false} 
                                    onChangeOption={(value:any) => setSelectedTag(value)}
                                    menuPlacement={'top'}
                                />
                            </div>
                        </div>
                    </div>
                    { error && (typeof error === 'string') && <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{ error }</div> }
                    <div className='task-review-foot'>
                        <Button disabled={approveLoading || rejectTaskLoading} loading={rejectTaskLoading} onClick={() => { setRejectUser(submission.member._id); setShowRejectSubmission(true) }}>REJECT</Button>
                        <Button disabled={approveLoading || rejectTaskLoading} loading={approveLoading} style={{ backgroundColor: approveLoading ? 'grey' : '#C94B32' }} onClick={() => handleApproveTaskAsync()}>APPROVE</Button>
                    </div>
                </div>
            </div>
        )
    }

    const handleBack = () => {
        if (activeSubmission) {
            const currIndex = _findIndex(taskSubmissions, (t: any) => t._id === activeSubmission._id)
            const prevSubmission = _get(taskSubmissions, `${currIndex - 1}`, undefined)
            if (prevSubmission)
                setActiveSubmission(prevSubmission)
        }
    }

    const handleNext = () => {
        if (activeSubmission) {
            const currIndex = _findIndex(taskSubmissions, (t: any) => t._id === activeSubmission._id)
            const nextSubmission = _get(taskSubmissions, `${currIndex + 1}`, undefined)
            if (nextSubmission)
                setActiveSubmission(nextSubmission)
        }
    }

    const handleSetApplicant = (value: any) => {
        let user = _find(DAO.members, m => m.member._id === value);
        setSelectedUser({ _id: user.member._id, address: user.wallet });
    }

    const renderRejectTask = () => {
        return (
            <div className='task-review-overlay'>
                <div className='task-review-container'>
                    <div className="task-review-header">
                        <span>{task.name}</span>
                        <button onClick={close}>
                            <CgClose size={20} color="#C94B32" />
                        </button>
                    </div>

                    <div className='task-reject-body'>
                        <img src={clipboard} alt="icon" />
                        <h1 style={{ minHeight: '45px' }}>Reject Submission</h1>

                        <div className='taskApply-rowInput' style={{ margin: '35px 0' }}>
                            <label>Note</label>
                            <textarea
                                style={{ width: '100%' }}
                                className="inputField"
                                placeholder='Why I reject this submission,
                                What should be improved...'
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                            />
                            <span style={{ fontSize: '13px', color: '#C84A32' }} id="note-error"></span>
                        </div>

                        {
                            task.contributionType === 'open' && task.isSingleContributor
                                ?
                                <div className='taskApply-inputRow row-align'>
                                    <label className="switch">
                                        <input type="checkbox" checked={reopen} onChange={() => setReopen(!reopen)} />
                                        <span className="slider check round"></span>
                                    </label>
                                    <div>
                                        <span>REOPEN TASK</span>
                                        <p>{_get(assignedUser,'name', '')} will be removed from the task</p>
                                    </div>
                                </div>
                                :
                                null
                        }
                        {
                            task.contributionType === 'assign'
                                ?
                                <div className='taskApply-inputRow'>
                                    <div className='taskApply-optionalDiv'>
                                        <span>Change contributor</span>
                                        <div className='option-div'>
                                            Optional
                                        </div>
                                    </div>
                                    <select
                                        name="project"
                                        id="project"
                                        className="tokenDropdown"
                                        style={{ width: '100%' }}
                                        onChange={(e) => handleSetApplicant(e.target.value)}
                                    >
                                        <option>Select member</option>
                                        {
                                            eligibleContributors.map((item: any, index: any) => {
                                                return (
                                                    <option value={`${item.member._id}`}>{item.member.name && item.member.name !== "" ? `${item.member.name}  (${beautifyHexToken(item.member.wallet)})` : beautifyHexToken(item.member.wallet)}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                :
                                null
                        }

                        <div className='taskApply-btn-container'>
                            <button onClick={() => setShowRejectSubmission(false)}>CANCEL</button>
                            <button onClick={() => handleRejectTask()}>VALIDATE</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderTaskApproval = () => {
        return (
            <div className="task-review-overlay">
                <div className="task-review-container">
                    <div className="task-review-header">
                        <span>{task.name}</span>
                        <button onClick={close}>
                            <CgClose size={20} color="#C94B32" />
                        </button>
                    </div>
                    <div className='task-review-slider'>
                        <div className='slider-controls'>
                            {taskSubmissions.length > 1 ?
                                <button className='control-btn' onClick={handleBack}>
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </button> : null
                            }
                        </div>
                        <div className='slider-content'>
                            {
                                renderSingleSubmission(activeSubmission)
                            }
                        </div>
                        <div className='slider-controls'>
                            {taskSubmissions.length > 1 ?
                                <button className='control-btn' style={{ transform: 'rotate(180deg)' }} onClick={handleNext}>
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </button> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showModifyCompensation)
        return updateCompensation()

    if (showRejectSubmission)
        return renderRejectTask()

    return renderTaskApproval()

}

export default TaskReview;