import { useEffect, useState, useMemo } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import { useNavigate } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import calendarIcon from '../../../../assets/svg/calendar.svg'
import submitted from '../../../../assets/svg/submitted.svg'
import moment from "moment";

import assign from '../../../../assets/svg/assign.svg'
import paid from '../../../../assets/svg/paid.svg'
import approved from '../../../../assets/svg/approved.svg'
import open from '../../../../assets/svg/open.svg'
import applied from '../../../../assets/svg/applied.svg'
import rejected from '../../../../assets/svg/rejected.svg'

import applicationDashboard from '../../../../assets/svg/application_dashboard.svg'
import submissionDashboard from '../../../../assets/svg/submission_dashboard.svg'

import { IoMdClose } from 'react-icons/io'
import { useAppSelector } from "state/hooks";

const TaskCard = ({ task, daoUrl }) => {
    const navigate = useNavigate();
    console.log("task card : ", task)
    const { provider, account, chainId } = useWeb3React();
    const { user } = useAppSelector((state) => state.dashboard);

    const amIApplicant = useMemo(() => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user)
                return true
            return false
        }
        return false;
    }, [account, task]);

    const hasMySubmission = useMemo(() => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user && user.submission)
                return true
            return false
        }
        return false;
    }, [account, task]);

    const amIApproved = useMemo(() => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === "approved")
            if (user)
                return true
            return false
        }
        return false;
    }, [account, task]);

    const amIRejected = useMemo(() => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === "submission_rejected")
            if (user)
                return true
            return false
        }
        return false;
    }, [account, task]);

    const applicationCount = useMemo(() => {
        if (task) {
            if (task.taskStatus === 'open') {
                let applications = _get(task, 'members', []).filter(m => (m.status !== 'rejected' && m.status !== 'submission_rejected'))
                if (applications)
                    return applications.length
            }
            return 0
        }
        return 0;
    }, [task]);

    const submissionCount = useMemo(() => {
        if (task) {
            let submissions = _get(task, 'members', []).filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
            if (submissions)
                return submissions.length
            return 0
        }
        return 0;
    }, [task]);


    return (
        <div className='tasks-card' onClick={() => navigate(`/${daoUrl}/task/${task._id}`, { state: { task } })}>
            {(submissionCount > 0 || applicationCount > 0) && task.creator === user._id &&
                <div className='tasks-card-icons'>
                    {(task.contributionType === 'open' && !task.isSingleContributor) || task.contributionType === 'assign' && submissionCount > 0 ?
                        <div className='icon-container'>
                            <img src={submissionDashboard} />
                            <p>+{submissionCount}</p>
                        </div> :
                        applicationCount > 0 &&
                        <div className='icon-container'>
                            <img src={applicationDashboard} />
                            <p>+{applicationCount}</p>
                        </div>
                    }
                </div>
            }
            <div>
                <p className="p-name">{task.project?.name}</p>
            </div>
            <div>
                <p className="t-name">{task.name.length > 20 ? task.name.substring(0, 20) + "..." : task.name}</p>
            </div>
            <div>
                {/* Task status */}
                {
                    (task.contributionType === 'assign' || task.contributionType === 'open') && task.taskStatus === 'submitted'
                        ?
                        <>
                            {
                                amIApproved
                                    ?
                                    <div>
                                        <img src={submitted} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#6B99F7' }}>Under review</p>

                                    </div>
                                    :
                                    <div>
                                        <img src={submitted} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#6B99F7' }}>Submitted</p>
                                    </div>
                            }
                        </>
                        :
                        null
                }

                {/* If task was manually assigned---check if current user is approved applicant or other user*/}
                {
                    task.contributionType === 'assign' && task.taskStatus === 'assigned'
                        ?
                        <>
                            {
                                amIApproved
                                    ?
                                    <div>
                                        <img src={assign} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#0EC1B0' }}>Assigned to me</p>

                                    </div>
                                    :
                                    // if not approved --- check if current user was rejected earlier
                                    <>
                                        {
                                            amIRejected
                                                ?
                                                <div>
                                                    <img src={rejected} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#E23B53' }}>Rejected</p>
                                                </div>
                                                :
                                                <div>
                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#0EC1B0' }}>Assigned</p>
                                                </div>
                                        }
                                    </>
                            }
                        </>
                        :
                        null
                }

                {/* if task was open for all and task status is still open --- check if current user has applied or not */}
                {
                    task.contributionType === 'open' && task.taskStatus === 'open' && task.reopenedAt === null
                        ?
                        <>
                            {
                                hasMySubmission
                                    ?
                                    <div>
                                        <img src={submitted} style={{ marginRight: '5px' }} />
                                        <span style={{ color: '#6B99F7' }}>Under review</span>
                                    </div>
                                    :
                                    <>
                                        {
                                            amIApplicant
                                                ?
                                                <div>
                                                    <img src={applied} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#FFB600' }}>Applied</p>
                                                </div>
                                                :
                                                <div>
                                                    <img src={open} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#4BA1DB' }}>Open</p>
                                                </div>
                                        }
                                    </>
                            }
                        </>
                        :
                        null
                }

                {/* if task was open for all and task has been assigned --- check if current user is approved or other */}
                {
                    task.contributionType === 'open' && task.taskStatus === 'assigned' && task.reopenedAt === null
                        ?
                        <>
                            {
                                amIApplicant
                                    ?
                                    <>
                                        {
                                            amIApproved
                                                ?
                                                <div>
                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#0EC1B0' }}>Assigned to me</p>
                                                </div>
                                                :
                                                <div>
                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#0EC1B0' }}>Assigned</p>
                                                </div>
                                        }
                                    </>
                                    :
                                    <div>
                                        <img src={assign} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#0EC1B0' }}>Assigned</p>
                                    </div>
                            }
                        </>
                        :
                        null
                }

                {
                    task.reopenedAt !== null
                        ?
                        <>
                            {
                                amIApplicant
                                    ?
                                    <div>
                                        <img src={applied} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#FFB600' }}>Applied</p>
                                    </div>
                                    :
                                    <>
                                        {
                                            amIRejected
                                                ?
                                                <div>
                                                    <img src={rejected} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#E23B53' }}>Rejected</p>
                                                </div>
                                                :
                                                <div>
                                                    <img src={open} style={{ marginRight: '5px' }} />
                                                    <p style={{ color: '#4BA1DB' }}>Open</p>
                                                </div>
                                        }
                                    </>
                            }
                        </>
                        :
                        null
                }

                {
                    task.taskStatus === 'approved'
                        ?
                        <>
                            <div>
                                <img src={approved} style={{ marginRight: '5px' }} />
                                <p style={{ color: '#27C46E' }}>Approved</p>
                            </div>
                        </>
                        :
                        null
                }

                {
                    task.taskStatus === 'paid'
                        ?
                        <>
                            <div>
                                <img src={paid} style={{ marginRight: '5px' }} />
                                <p style={{ color: '#74D415' }}>paid</p>
                            </div>
                        </>
                        :
                        null
                }

                {
                    task.taskStatus === 'rejected'
                        ?
                        <>
                            <div>
                                <img src={rejected} style={{ marginRight: '5px' }} />
                                <span style={{ color: '#E23B53' }}>Rejected</span>
                            </div>
                        </>
                        :
                        null
                }

                {
                    task.deadline && <span>
                        <img src={calendarIcon} alt="calendarIcon" />
                        {moment(task.deadline).fromNow()}
                    </span>
                }
            </div>

        </div>
    )
}

export default TaskCard;