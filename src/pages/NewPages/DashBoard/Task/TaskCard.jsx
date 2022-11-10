import { useEffect, useState, useMemo } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import { useNavigate } from "react-router-dom";

import { useWeb3React } from "@web3-react/core";

import calendarIcon from '../../../../assets/svg/calendar.svg'
import moment from "moment";

import assign from '../../../../assets/svg/assign.svg'
import open from '../../../../assets/svg/open.svg'
import applied from '../../../../assets/svg/applied.svg'

import { IoMdClose } from 'react-icons/io'

const TaskCard = ({ task, daoUrl }) => {
    const navigate = useNavigate();
    console.log("task card : ", task)
    const { provider, account, chainId } = useWeb3React();

    const amIApplicant = useMemo(() => {
        if (task) {
            let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user)
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

    return (
        <div className='tasks-card' onClick={() => navigate(`/${daoUrl}/task/${task._id}`, { state: { task } })}>
            <div>
                <p className="p-name">{task.project?.name}</p>
            </div>
            <div>
                <p className="t-name">{task.name}</p>
            </div>
            <div>
                {/* Task status */}
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
                                    <div>
                                        <img src={assign} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#0EC1B0' }}>Assigned</p>
                                    </div>
                            }
                        </>
                        :
                        null
                }

                {/* if task was open for all and task status is still open --- check if current user has applied or not */}
                {
                    task.contributionType === 'open' && task.taskStatus === 'open'
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
                                    <div>
                                        <img src={open} style={{ marginRight: '5px' }} />
                                        <p style={{ color: '#4BA1DB' }}>Open</p>
                                    </div>
                            }
                        </>
                        :
                        null
                }

                {/* if task was open for all and task has been assigned --- check if current user is approved or other */}
                {
                    task.contributionType === 'open' && task.taskStatus === 'assigned'
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
                                                    <IoMdClose color="red" size={20} />
                                                    <p style={{ color: 'red' }}>Rejected</p>
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

                <span>
                    <img src={calendarIcon} alt="calendarIcon" />
                    {moment(task.deadline).fromNow()}
                </span>
            </div>

        </div>
    )
}

export default TaskCard;