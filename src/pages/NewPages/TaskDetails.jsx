import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import '../../styles/pages/TaskDetails.css';

import Footer from "components/Footer";
import { LeapFrog } from "@uiball/loaders";

import { useAppSelector, useAppDispatch } from "state/hooks";
import { useNavigate, useParams } from 'react-router-dom';

import { IoIosArrowBack } from 'react-icons/io'
import { GoKebabVertical } from 'react-icons/go'
import { SiNotion } from "react-icons/si";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import editToken from '../../assets/svg/editToken.svg';
import compensationStar from '../../assets/svg/compensationStar.svg';
import calendarIcon from '../../assets/svg/calendar.svg'
import applicants from '../../assets/svg/applicants.svg'
import folder from '../../assets/svg/folder.svg'

import { useWeb3React } from "@web3-react/core";

import { getTask, getDao } from "state/dashboard/actions";
import moment from "moment";
import ApplyTask from "./DashBoard/Task/ApplyTask";

import assign from '../../assets/svg/assign.svg'
import applied from '../../assets/svg/applied.svg'
import open from '../../assets/svg/open.svg'
import memberIcon from '../../assets/svg/memberIcon.svg';
import SubmitTask from "./DashBoard/Task/SubmitTask";
import ApplicantList from "./DashBoard/Task/ApplicantList";

const TaskDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { provider, account, chainId } = useWeb3React();
    const { taskId, daoURL } = useParams();
    const { DAO, Task, TaskLoading, user } = useAppSelector((state) => state.dashboard);
    console.log("Task : ", Task);
    const daoName = _get(DAO, 'name', '').split(" ");

    const [openApply, setOpenApply] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [openApplicantsList, setOpenApplicantsList] = useState(false);

    useEffect(() => {
        if (daoURL && (!DAO || (DAO && DAO.url !== daoURL)))
            dispatch(getDao(daoURL))
    }, [DAO, daoURL])

    useEffect(() => {
        if (taskId && (!Task || (Task && Task._id !== taskId)))
            dispatch(getTask(taskId));
    }, [taskId])

    const amIApplicant = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const amIApproved = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.isApproved === true)
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const amIEligible = useMemo(() => {
        if (DAO) {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user) {
                let index = Task?.validRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase());
                if (index === -1) {
                    return false;
                }
                else {
                    return true;
                }
            }
            return false;
        }
        return false;
    }, [account, DAO]);

    const assignedUser = useMemo(() => {
        let user = _find(_get(Task, 'members', []), m => m.isApproved === true)
        if (user)
            return user.member.name
    }, [Task]);

    const handleOpenApplicantsSlider = () => {
        if (Task.members.length > 0) {
            setOpenApplicantsList(true);
        }
    }


    return (
        <>
            {
                !Task || TaskLoading || (taskId && (Task && Task._id !== taskId))
                    ?
                    <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="logo">
                            <img src={lomadsfulllogo} alt="" />
                        </div>
                        <div style={{ marginTop: 32 }}>
                            <LeapFrog size={50} color="#C94B32" />
                        </div>
                    </div>
                    :
                    null
            }
            <div className='taskDetails-container'>
                {/* open apply task form */}
                {
                    openApply && <ApplyTask task={Task} close={() => setOpenApply(false)} />
                }

                {/* open submit task form */}
                {
                    openSubmit && <SubmitTask task={Task} close={() => setOpenSubmit(false)} />
                }

                {/* show applicants */}
                {
                    openApplicantsList && <ApplicantList task={Task} close={() => setOpenApplicantsList(false)} />
                }

                <div className="info">

                    <div className="home-btn">
                        <div className="invertedBox">
                            <div className="navbarText">
                                {
                                    daoName.length === 1
                                        ? daoName[0].charAt(0)
                                        : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)
                                }
                            </div>
                        </div>
                    </div>


                    <div className="taskDetails-top">
                        <h1>{_get(Task, 'project.name', '')}</h1>

                        <div className="taskDetails-header">
                            <div className="header-name">
                                <div className="left" onClick={() => navigate(-1)}>
                                    <IoIosArrowBack size={20} color="#C94B32" />
                                </div>
                                <div className="right">
                                    <h1>{Task.name}</h1>
                                    <div className="menu">

                                        {/* Task status */}
                                        {
                                            amIApplicant && Task.contributionType === 'open'
                                                ?
                                                <div>
                                                    <img src={applied} style={{ marginRight: '5px' }} />
                                                    <span style={{ color: '#FFB600' }}>Applied</span>
                                                </div>
                                                :
                                                null
                                        }

                                        {
                                            amIApproved
                                                ?
                                                <div>
                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                    <span style={{ color: '#0EC1B0' }}>Assigned to me</span>
                                                </div>
                                                :
                                                null
                                        }

                                        {
                                            Task.taskStatus === 'assigned' && !amIApproved
                                                ?
                                                <div>
                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                    <span style={{ color: '#0EC1B0' }}>Assigned</span>
                                                </div>
                                                :
                                                null
                                        }

                                        {
                                            Task.taskStatus === 'open' && !amIApplicant
                                                ?
                                                <div>
                                                    <img src={open} style={{ marginRight: '5px' }} />
                                                    <span style={{ color: '#4BA1DB' }}>Open</span>
                                                </div>
                                                :
                                                null
                                        }


                                        {/* edit and menu button visible only to the creator */}
                                        {
                                            account.toLowerCase() === Task?.creator.toLowerCase()
                                                ?
                                                <>
                                                    <button style={{ marginRight: '25px' }}>
                                                        <img src={editToken} alt="hk-logo" />
                                                    </button>

                                                    {/* <button className="kebab-btn">
                                                        <GoKebabVertical size={24} color="#76808D" />
                                                    </button> */}
                                                </>
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="header-others">
                                <div>
                                    {
                                        Task.discussionChannel !== ''
                                            ?
                                            <button className="other-btn" onClick={() => window.open(Task.discussionChannel, '_blank', 'noopener,noreferrer')}>
                                                <SiNotion color="#B12F15" size={20} style={{ marginRight: '5px' }} />
                                                CHAT
                                            </button>
                                            :
                                            null
                                    }
                                    {
                                        Task.submissionLink !== ''
                                            ?
                                            <button className="other-btn" onClick={() => window.open(Task.submissionLink, '_blank', 'noopener,noreferrer')}>
                                                <img src={folder} />
                                            </button>
                                            :
                                            null
                                    }
                                </div>


                                <div>
                                    <div>
                                        <span>Compensation</span>
                                        <img src={compensationStar} />
                                        {
                                            Task.compensation.currency === 'MATIC'
                                                ?
                                                <span>{Task.compensation.amount} MATIC</span>
                                                :
                                                <span>{Task.compensation.amount} points</span>
                                        }

                                    </div>

                                    <div className="v-line"></div>

                                    <div>
                                        <span>Deadline</span>
                                        <img src={calendarIcon} alt="calendarIcon" />
                                        <span>{moment(Task.deadline).format('L')}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="taskDetails-body">
                        <div className="body-left">
                            <h1>Description</h1>
                            <span>{Task.description}</span>
                        </div>
                        <div className="body-right">

                            {/* if task status is open then users can apply */}
                            {
                                Task.taskStatus === 'open'
                                    ?
                                    <>
                                        {/* if creator --- display applicants*/}
                                        {
                                            account.toLowerCase() === Task?.creator.toLowerCase()
                                                ?
                                                <>
                                                    <div>
                                                        <img src={applicants} />
                                                        <span>{Task.members.length}</span>
                                                    </div>
                                                    <h1>{Task.members.length > 1 ? 'Applicants' : 'Applicant'}</h1>
                                                    <button onClick={handleOpenApplicantsSlider}>CHECK</button>
                                                </>
                                                :
                                                <>
                                                    {
                                                        // check if user has applied or not
                                                        amIApplicant
                                                            ?
                                                            <>
                                                                <h1>The reviewer is<br />looking at your<br />application.</h1>
                                                            </>
                                                            :
                                                            // Not applied yet --- check if valid roles condition exists
                                                            <>
                                                                {
                                                                    Task.validRoles.length > 0
                                                                        ?
                                                                        <>
                                                                            {
                                                                                // check if current user has access according to validRoles
                                                                                amIEligible
                                                                                    ?
                                                                                    <>
                                                                                        <h1>This task<br />fits your role.</h1>
                                                                                        <button onClick={() => setOpenApply(true)}>APPLY</button>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <h1>This task does not<br />fits your role.</h1>
                                                                                    </>
                                                                            }
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <h1>This task needs a<br />contributor.</h1>
                                                                            <button onClick={() => setOpenApply(true)}>APPLY</button>
                                                                        </>
                                                                }
                                                            </>

                                                    }
                                                </>
                                        }
                                    </>
                                    :
                                    null
                            }

                            {/* if the task has status assigned --- render the assigned user */}

                            {
                                Task.taskStatus === 'assigned'
                                    ?
                                    <>
                                        {
                                            // if user is approved as a contributor then he can submit work
                                            amIApproved
                                                ?
                                                <>
                                                    <h1>You are assigned.</h1>
                                                    <button onClick={() => setOpenSubmit(true)}>SUBMIT WORK</button>
                                                </>
                                                :
                                                // else display the name of the user who has been assigned
                                                <>
                                                    <h1>{assignedUser} is assigned</h1>
                                                </>
                                        }
                                    </>
                                    :
                                    null
                            }

                        </div>
                    </div>

                    {/* reviewer section */}
                    <div className="task-reviewer">
                        <div>
                            <span>Reviewer</span>
                            <img src={memberIcon} alt="member-icon" />
                            <p>{Task.reviewer.name}</p>
                        </div>
                        <div>
                            <span>Assigned</span>
                            <img src={memberIcon} alt="member-icon" />
                            <p>{assignedUser ? assignedUser : 'Not yet assigned'}</p>
                        </div>
                        <div>
                            <span>SEE PREVIOUS APPLICANTS</span>
                        </div>
                        <div>
                            <span>Created At {moment(Task.createdAt).format('L')} {moment(Task.createdAt).format('LT')}</span>
                        </div>
                    </div>

                </div>

                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default TaskDetails;