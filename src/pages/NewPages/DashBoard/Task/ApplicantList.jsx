import { useState, useEffect, useMemo } from 'react';
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import './ApplicantList.css';
import { CgClose } from 'react-icons/cg';
import { IoIosArrowBack } from 'react-icons/io'

import bigMember from '../../../../assets/svg/bigMember.svg';

import { useAppSelector, useAppDispatch } from "state/hooks";

import { assignTask, rejectTaskMember } from 'state/dashboard/actions'
import { resetAssignTaskLoader, resetRejectTaskMemberLoader } from 'state/dashboard/reducer';

const ApplicantList = ({ task, close }) => {

    const dispatch = useAppDispatch();
    const { DAO, assignTaskLoading, rejectTaskMemberLoading } = useAppSelector((state) => state.dashboard);
    const [pos, setPos] = useState(0);

    useEffect(() => {
        if (assignTaskLoading === false) {
            dispatch(resetAssignTaskLoader());
            close();
            // setTimeout(() => {
            //     close();
            // }, 3000);
        }
    }, [assignTaskLoading]);


    const taskMembers = useMemo(() => {
        return _get(task, 'members', []).filter(m => m.status !== 'rejected');
    }, [task, rejectTaskMemberLoading, assignTaskLoading])


    console.log("taskMembers", taskMembers)

    useEffect(() => {
        if (rejectTaskMemberLoading === false) {
            dispatch(resetRejectTaskMemberLoader());
            if (taskMembers.length == 0) {
                close();
            } else {
                setPos(0)
            }
        }
    }, [rejectTaskMemberLoading, taskMembers])

    const handleNext = () => {
        if (pos < taskMembers.length - 1) {
            setPos(pos + 1);
        }
        else {
            setPos(0);
        }
    }

    const handleBack = () => {
        if (pos > 0) {
            setPos(pos - 1);
        }
        else {
            setPos(taskMembers.length - 1);
        }
    }

    const handleAssignTask = (applicant) => {
        dispatch(assignTask({ taskId: task._id, daoUrl: _get(DAO, 'url', ''), payload: { memberId: applicant.member._id } }));
    }

    const handleRejectMember = (applicant) => {
        dispatch(rejectTaskMember({ taskId: task._id, daoUrl: _get(DAO, 'url', ''), payload: { memberId: applicant.member._id } }));
    }

    const RenderApplicantCard = ({ applicant }) => {
        if (!applicant) return null;
        return (
            <div className='applicant-card'>
                <div className='applicant-body'>
                    <img src={bigMember} alt="icon" />
                    <h1 style={{ minHeight: '45px' }}>{_get(applicant, 'member.name', '')}</h1>
                    <p>{applicant.member.wallet.slice(0, 6) + "..." + applicant.member.wallet.slice(-4)}</p>
                    <div className='detail-container' style={{ overflowY: 'scroll' }}>
                        <span>Note</span>
                        <p>{applicant.note}</p>
                    </div>
                    <div className='detail-container'>
                        <span>Links</span>
                        {
                            applicant.links.map((item, index) => {
                                return (
                                    <button onClick={() => window.open(item.link, '_blank', 'noopener,noreferrer')}>{item.title}</button>
                                )
                            })
                        }
                    </div>
                </div>
                <div className='applicant-foot'>
                    {
                        applicant.status === 'pending'
                            ?
                            <>
                                <button disabled={rejectTaskMemberLoading} onClick={() => handleRejectMember(applicant)}>REJECT</button>
                                <button onClick={() => handleAssignTask(applicant)}>ASSIGN</button>
                            </>
                            :
                            null
                    }
                    {
                        applicant.status === 'submission_rejected'
                            ?
                            <>
                                <button disabled={rejectTaskMemberLoading}>SUBMISSION REJECT</button>
                            </>
                            :
                            null
                    }
                </div>
            </div>
        )
    }

    return (
        <div className="applicant-overlay">
            <div className="applicant-container">

                <div className="applicant-header">
                    <span>{task.name}</span>
                    <button onClick={close}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>

                <div className='applicant-slider'>
                    <div className='slider-controls'>
                        <button className='control-btn' onClick={handleBack}>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button>
                    </div>
                    <div className='slider-content'>
                        <RenderApplicantCard applicant={taskMembers[pos]} />
                    </div>
                    <div className='slider-controls'>
                        <button className='control-btn' style={{ transform: 'rotate(180deg)' }} onClick={handleNext}>
                            <IoIosArrowBack size={20} color="#C94B32" />
                        </button>
                    </div>
                </div>

                <div className='applicant-footer'>
                    <div className='dots-container'>
                        {
                            taskMembers.map((item, index) => {
                                return (
                                    <div className='dots' key={index} style={pos === index ? { backgroundColor: '#C94B32' } : null}></div>
                                )
                            })
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ApplicantList;