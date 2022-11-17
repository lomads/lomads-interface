import { useState, useEffect, useMemo } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy, findIndex as _findIndex } from 'lodash';
import './TaskReview.css';
import { CgClose } from 'react-icons/cg';
import { IoIosArrowBack } from 'react-icons/io'
import userPlaceholder from 'assets/svg/user-placeholder.svg';
import clipboard from 'assets/svg/clipboard.svg';
import editIcon from 'assets/svg/editButton.svg';
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

import { approveTask } from 'state/dashboard/actions'
import { resetAssignTaskLoader, resetRejectTaskMemberLoader } from 'state/dashboard/reducer';
import { id } from 'ethers/lib/utils';
import moment from 'moment';
import { nanoid } from '@reduxjs/toolkit';

const TaskReview = ({ task, close }: any) => {

    const dispatch = useAppDispatch();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const [newCompensation, setNewCompensation] = useState<number>(0)
    const [showModifyCompensation, setShowModifyCompensation] = useState<boolean>(false)
    const [showRejectSubmission, setShowRejectSubmission] = useState<boolean>(false)
    const { provider, account, chainId, connector } = useWeb3React();
    const [activeSubmission, setActiveSubmission] = useState<any>(null)
    const [approveLoading, setApproveLoading] = useState<any>(false)
    const { isSafeOwner } = useRole(DAO, account);
    const currentNonce = useAppSelector((state) => state.flow.currentNonce);

    const taskSubmissions = useMemo(() => {
        if (task)
            return _get(task, 'members', []).filter((member: any) => member.submission)
        return []
    }, [task])

    useEffect(() => {
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
            return user.member.name
    }, [task]);

    const createOnChainTxn = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!chainId) return;
                let sendTotal = newCompensation;
                const tokens = await getSafeTokens(chainId, _get(DAO, 'safe.address', null))
                let selToken = _find(tokens, t => t.tokenAddress === _get(task, 'compensation.currency', null))
                if (selToken && (_get(selToken, 'balance', 0) / 10 ** 18) < sendTotal)
                    return console.log('Low token balance');
                const token = await tokenCallSafe(_get(task, 'compensation.currency', null));
                const safeSDK = await ImportSafe(provider, _get(DAO, 'safe.address', ''));
                const nonce = await (await safeService(provider, `${chainId}`)).getNextNonce(_get(DAO, 'safe.address', null));
                const unsignedTransaction = await token.populateTransaction.transfer(
                    activeSubmission.member.wallet,
                    BigInt(parseFloat(`${newCompensation}`) * 10 ** 18)
                )
                const safeTransactionData: SafeTransactionDataPartial[] = [{
                    to: _get(task, 'compensation.currency', null),
                    data: unsignedTransaction.data as string,
                    value: "0",
                }];
                const safeTransaction = await safeSDK.createTransaction({
                    safeTransactionData,
                    options: { nonce }
                });
                const safeTxHash = await safeSDK.getTransactionHash(safeTransaction);
                const signature = await safeSDK.signTransactionHash(safeTxHash);
                const senderAddress = account as string;
                const safeAddress = _get(DAO, 'safe.address', '');
                await (await safeService(provider, `${chainId}`))
                    .proposeTransaction({
                        safeAddress,
                        safeTransactionData: safeTransaction.data,
                        safeTxHash,
                        senderAddress,
                        senderSignature: signature.data,
                    })
                    .then((value) => {
                        console.log("transaction has been proposed");
                    })
                    .catch((error) => {
                        console.log("an error occoured while proposing transaction", error);
                        reject(error)
                    });
                if (isSafeOwner) {
                    await (await safeService(provider, `${chainId}`))
                        .confirmTransaction(safeTxHash, signature.data)
                        .then(async (success) => {
                            resolve(safeTxHash)
                        })
                        .catch((err) => {
                            console.log("error occured while confirming transaction", err);
                            reject(err)
                        });
                } else {
                    resolve(safeTxHash)
                }
            } catch (e) {
                console.log(e)
                reject(e)
            }
        })
    }

    const handleApproveTask = async () => {
        setApproveLoading(true);
        let onChainSafeTxHash = undefined;
        if (isSafeOwner && _get(task, 'compensation.currency', 'SWEAT') !== 'SWEAT') {
            onChainSafeTxHash = await createOnChainTxn();
        }

        const offChainPayload = {
            daoId: _get(DAO, '_id', undefined),
            safe: _get(DAO, 'safe.address', undefined),
            nonce: moment().unix(),
            safeTxHash: nanoid(32),
            executor: account,
            submissionDate: moment().utc().toDate(),
            token: {
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
                    { name: 'value', type: "uint256", value: `${BigInt(parseFloat(`${newCompensation}`) * 10 ** 18)}` },
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
        axiosHttp.post(`task/${task._id}/approve?daoUrl=${DAO.url}`, payload)
            .then(res => {
                dispatch(setDAO(res.data.dao))
                dispatch(setTask(res.data.task))
                close()
            })
            .finally(() => setApproveLoading(false))
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
                    <div className='detail-container'>
                        {task.submissionLink.length == 0 ?
                            <>
                                <span>Links</span>
                                {
                                    submission.submission.submissionLink.map((item: any, index: number) => {
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
                </div>
                <div className='task-review-compensation'>
                    <div className='task-review-compensation-main'>
                        <div className='container'>
                            <div>Compensation</div>
                            <img src={starIcon} />
                            <div className='amount'>{_get(task, 'compensation.amount', 0)}</div>
                            {(newCompensation - _get(task, 'compensation.amount', 0)) !== 0 && <div className='extra'>{`${(newCompensation - _get(task, 'compensation.amount', 0)) > 0 ? '+' : ''} ${(newCompensation - _get(task, 'compensation.amount', 0))}`}</div>}
                            <div>{_get(task, 'compensation.symbol', "SWEAT")}</div>
                        </div>
                        <button onClick={() => setShowModifyCompensation(true)}>
                            <img src={editIcon} alt="edit-icon" />
                        </button>
                    </div>
                </div>
                <div className='task-review-foot'>
                    <button onClick={() => setShowRejectSubmission(true)}>REJECT</button>
                    <button disabled={approveLoading} style={{ backgroundColor: approveLoading ? 'grey' : '#C94B32' }} onClick={() => handleApproveTask()}>APPROVE</button>
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
                                value={''}
                            />
                            <span style={{ fontSize: '13px', color: '#C84A32' }} id="note-error"></span>
                        </div>

                        {
                            task.contributionType === 'open' && task.isSingleContributor
                                ?
                                <div className='taskApply-inputRow row-align'>
                                    <input type="checkbox" />
                                    <div>
                                        <span>REOPEN TASK</span>
                                        <p>{assignedUser} will be removed from the task</p>
                                    </div>
                                </div>
                                :
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
                                    >
                                        <option>Select member</option>
                                    </select>
                                </div>
                        }

                        <div className='taskApply-btn-container'>
                            <button onClick={() => setShowRejectSubmission(false)}>CANCEL</button>
                            <button>VALIDATE</button>
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