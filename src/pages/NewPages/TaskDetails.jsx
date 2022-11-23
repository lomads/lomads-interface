import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import '../../styles/pages/TaskDetails.css';

import Footer from "components/Footer";
import { LeapFrog } from "@uiball/loaders";

import SafeButton from "UIpack/SafeButton";

import { useAppSelector, useAppDispatch } from "state/hooks";
import { useNavigate, useParams } from 'react-router-dom';

import { IoIosArrowBack } from 'react-icons/io'
import { GoKebabVertical } from 'react-icons/go'
import { SiNotion } from "react-icons/si";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import editToken from '../../assets/svg/editToken.svg';
import deleteIcon from '../../assets/svg/deleteIcon.svg';
import compensationStar from '../../assets/svg/compensationStar.svg';
import calendarIcon from '../../assets/svg/calendar.svg'
import applicants from '../../assets/svg/applicants.svg'
import folder from '../../assets/svg/folder.svg'
import paid from '../../assets/svg/paid.svg'
import approved from '../../assets/svg/approved.svg'
import rejected from '../../assets/svg/rejected.svg'
import iconSvg from '../../assets/svg/createProject.svg';

import { useWeb3React } from "@web3-react/core";

import { getTask, getDao, archiveTask, deleteTask } from "state/dashboard/actions";
import { resetArchiveTaskLoader, resetDeleteTaskLoader } from 'state/dashboard/reducer';
import moment from "moment";
import ApplyTask from "./DashBoard/Task/ApplyTask";

import assign from '../../assets/svg/assign.svg'
import submitted from '../../assets/svg/submitted.svg'
import applied from '../../assets/svg/applied.svg'
import open from '../../assets/svg/open.svg'
import memberIcon from '../../assets/svg/memberIcon.svg';
import SubmitTask from "./DashBoard/Task/SubmitTask";
import ApplicantList from "./DashBoard/Task/ApplicantList";
import TaskReview from "./DashBoard/Task/TaskReview";

import { CgClose } from 'react-icons/cg'
import useRole from "hooks/useRole";

const TaskDetails = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { provider, account, chainId } = useWeb3React();
    const { taskId, daoURL } = useParams();
    const { DAO, Task, TaskLoading, user, archiveTaskLoading, deleteTaskLoading } = useAppSelector((state) => state.dashboard);
    console.log("Task : ", Task);
    const daoName = _get(DAO, 'name', '').split(" ");
    const { myRole, can } = useRole(DAO, account)

    const [openApply, setOpenApply] = useState(false);
    const [openSubmit, setOpenSubmit] = useState(false);
    const [openApplicantsList, setOpenApplicantsList] = useState(false);
    const [openTaskReview, setOpenTaskReview] = useState(false);
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [closePrompt, setClosePrompt] = useState(false);

    useEffect(() => {
        if (daoURL && (!DAO || (DAO && DAO.url !== daoURL)))
            dispatch(getDao(daoURL))
    }, [DAO, daoURL]);

    useEffect(() => {
        if (DAO && taskId && (!Task || (Task && Task._id !== taskId)))
            dispatch(getTask(taskId));
    }, [taskId, DAO]);

    // runs after archiving a task
    useEffect(() => {
        if (archiveTaskLoading === false) {
            dispatch(resetArchiveTaskLoader());
            setClosePrompt(false);
            navigate(-1);
        }
    }, [archiveTaskLoading]);

    // runs after deleting a task
    useEffect(() => {
        if (deleteTaskLoading === false) {
            dispatch(resetDeleteTaskLoader());
            setDeletePrompt(false);
            navigate(-1);
        }
    }, [deleteTaskLoading]);

    const amIApplicant = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const hasMySubmission = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user && user.submission)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const isMySubmissionAccepted = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user && user.submission && user.status === 'submission_accepted')
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const amIApproved = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === 'approved')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const amIRejected = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === 'submission_rejected')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Task]);

    const renderRejectionNote = useMemo(() => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === 'submission_rejected')
            if (user)
                return user.rejectionNote;
        }
    }, [account, Task]);

    const amIEligible = useMemo(() => {
        if (DAO && Task) {
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
    }, [account, DAO, Task]);

    const amICreator = useMemo(() => {
        if (DAO && Task) {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user) {
                if (user.member._id === Task.reviewer._id) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return false;
        }
        return false;
    }, [account, DAO, Task])

    const applicationCount = useMemo(() => {
        if (Task) {
            let applications = _get(Task, 'members', []).filter(m => (m.status !== 'rejected' && m.status !== 'submission_rejected'))
            if (applications)
                return applications.length
            return 0
        }
        return 0;
    }, [Task]);

    const submissionCount = useMemo(() => {
        if (Task) {
            let submissions = _get(Task, 'members', []).filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
            if (submissions)
                return submissions.length
            return 0
        }
        return 0;
    }, [Task]);

    const assignedUser = useMemo(() => {
        let user = _find(_get(Task, 'members', []), m => m.status === 'approved')
        if (user)
            return user.member.name
    }, [Task]);

    const handleOpenApplicantsSlider = () => {
        if (taskMembers.length > 0) {
            setOpenApplicantsList(true);
        }
    }

    const taskMembers = useMemo(() => {
        return _get(Task, 'members', []).filter(m => m.status !== 'rejected');
    }, [Task])

    const handleCloseTask = () => {
        dispatch(archiveTask({ taskId, daoUrl: daoURL }));
    }

    const handleDeleteTask = () => {
        dispatch(deleteTask({ taskId, daoUrl: daoURL }));
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
                        {
                            openTaskReview && <TaskReview task={Task} close={() => setOpenTaskReview(false)} />
                        }

                        <div className="info">

                            {/* close prompt */}
                            {
                                closePrompt
                                    ?
                                    <div className="taskDetails-overlay">
                                        <div className="taskDetails-modal">
                                            <button className="close-btn" onClick={() => setClosePrompt(false)}>
                                                <CgClose size={20} color="#C94B32" />
                                            </button>
                                            <img src={iconSvg} alt="frame-icon" />
                                            <h1>Close {Task?.name}</h1>
                                            <p>This action <span>is irreversible</span> for now.<br />You will find closed tasks in the archives.</p>
                                            <div>
                                                <button onClick={() => setClosePrompt(false)}>NO</button>
                                                <button onClick={handleCloseTask}>YES</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }

                            {/* delete prompt */}
                            {
                                deletePrompt
                                    ?
                                    <div className="taskDetails-overlay">
                                        <div className="taskDetails-modal">
                                            <button className="close-btn" onClick={() => setDeletePrompt(false)}>
                                                <CgClose size={20} color="#C94B32" />
                                            </button>
                                            <img src={iconSvg} alt="frame-icon" />
                                            <h1>Delete {Task?.name}</h1>
                                            <p>This action <span>is irreversible</span>.</p>
                                            <div>
                                                <button onClick={() => setDeletePrompt(false)}>NO</button>
                                                <button onClick={handleDeleteTask}>YES</button>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }

                            <div className="home-btn" onClick={() => navigate(-1)}>
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
                                            {/* <p>Single contributor : {Task.isSingleContributor ? 'true' : 'false'}</p> */}
                                            <div className="menu">

                                                {/* Task status */}
                                                {/* If task was manually assigned---check if current user is approved applicant or other user*/}
                                                {
                                                    (Task.contributionType === 'assign' || Task.contributionType === 'open') && Task.taskStatus === 'submitted'
                                                        ?
                                                        <>
                                                            {
                                                                amIApproved
                                                                    ?
                                                                    <div>
                                                                        <img src={submitted} style={{ marginRight: '5px' }} />
                                                                        <span style={{ color: '#6B99F7' }}>Under review</span>
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <img src={submitted} style={{ marginRight: '5px' }} />
                                                                        <span style={{ color: '#6B99F7' }}>Submitted</span>
                                                                    </div>
                                                            }
                                                        </>
                                                        :
                                                        null
                                                }
                                                {/* If task was manually assigned---check if current user is approved applicant or other user*/}
                                                {
                                                    Task.contributionType === 'assign' && Task.taskStatus === 'assigned'
                                                        ?
                                                        <>
                                                            {
                                                                amIApproved
                                                                    ?
                                                                    <div>
                                                                        <img src={assign} style={{ marginRight: '5px' }} />
                                                                        <span style={{ color: '#0EC1B0' }}>Assigned to me</span>

                                                                    </div>
                                                                    :
                                                                    // if not approved --- check if current user was rejected earlier
                                                                    <>
                                                                        {
                                                                            amIRejected
                                                                                ?
                                                                                <div>
                                                                                    <img src={rejected} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#E23B53' }}>Rejected</span>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#0EC1B0' }}>Assigned</span>
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
                                                    Task.contributionType === 'open' && Task.taskStatus === 'open' && Task.reopenedAt === null
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
                                                                                    <span style={{ color: '#FFB600' }}>Applied</span>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <img src={open} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#4BA1DB' }}>Open</span>
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
                                                    Task.contributionType === 'open' && Task.taskStatus === 'assigned' && Task.reopenedAt === null
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
                                                                                    <span style={{ color: '#0EC1B0' }}>Assigned to me</span>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <img src={assign} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#0EC1B0' }}>Assigned</span>
                                                                                </div>
                                                                        }
                                                                    </>
                                                                    :
                                                                    <div>
                                                                        <img src={assign} style={{ marginRight: '5px' }} />
                                                                        <span style={{ color: '#0EC1B0' }}>Assigned</span>
                                                                    </div>
                                                            }
                                                        </>
                                                        :
                                                        null
                                                }

                                                {
                                                    Task.reopenedAt !== null
                                                        ?
                                                        <>
                                                            {
                                                                amIApplicant
                                                                    ?
                                                                    <div>
                                                                        <img src={applied} style={{ marginRight: '5px' }} />
                                                                        <span style={{ color: '#FFB600' }}>Applied</span>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                        {
                                                                            amIRejected
                                                                                ?
                                                                                <div>
                                                                                    <img src={rejected} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#E23B53' }}>Rejected</span>
                                                                                </div>
                                                                                :
                                                                                <div>
                                                                                    <img src={open} style={{ marginRight: '5px' }} />
                                                                                    <span style={{ color: '#4BA1DB' }}>Open</span>
                                                                                </div>
                                                                        }
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        null
                                                }

                                                {
                                                    Task.taskStatus === 'approved'
                                                        ?
                                                        <>
                                                            <div>
                                                                <img src={approved} style={{ marginRight: '5px' }} />
                                                                <span style={{ color: '#27C46E' }}>Approved</span>
                                                            </div>
                                                        </>
                                                        :
                                                        null
                                                }

                                                {
                                                    Task.taskStatus === 'paid'
                                                        ?
                                                        <>
                                                            <div>
                                                                <img src={paid} style={{ marginRight: '5px' }} />
                                                                <span style={{ color: '#74D415' }}>Paid</span>
                                                            </div>
                                                        </>
                                                        :
                                                        null
                                                }

                                                {
                                                    Task.taskStatus === 'rejected'
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


                                                {/* edit and menu button visible only to the creator */}
                                                {
                                                    // account.toLowerCase() === Task?.creator.toLowerCase()
                                                    amICreator || can(myRole, 'task.edit') || can(myRole, 'task.delete') || can(myRole, 'task.close')
                                                        ?
                                                        <>
                                                            {(amICreator || can(myRole, 'task.edit')) && false &&
                                                                <button style={{ marginRight: '25px' }}>
                                                                    <img src={editToken} alt="hk-logo" />
                                                                </button>
                                                            }
                                                            {(amICreator || can(myRole, 'task.delete')) &&
                                                                <button style={{ marginRight: '25px' }} onClick={() => setDeletePrompt(true)}>
                                                                    <img src={deleteIcon} alt="hk-logo" />
                                                                </button>
                                                            }
                                                            <>
                                                                {
                                                                    Task?.archivedAt === null && (amICreator || can(myRole, 'task.close')) ?
                                                                        <SafeButton
                                                                            height={40}
                                                                            width={150}
                                                                            titleColor="#C94B32"
                                                                            title="CLOSE TASK"
                                                                            bgColor="#FFFFFF"
                                                                            opacity="1"
                                                                            disabled={false}
                                                                            fontweight={400}
                                                                            fontsize={16}
                                                                            onClick={() => setClosePrompt(true)}
                                                                        />
                                                                        :
                                                                        null
                                                                }
                                                            </>

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
                                                Task.discussionChannel && Task.discussionChannel !== ''
                                                    ?
                                                    <button className="other-btn" onClick={() => window.open(Task.discussionChannel, '_blank', 'noopener,noreferrer')}>
                                                        <SiNotion color="#B12F15" size={20} style={{ marginRight: '5px' }} />
                                                        CHAT
                                                    </button>
                                                    :
                                                    null
                                            }
                                            {
                                                Task.submissionLink && Task.submissionLink.length > 0
                                                    ?
                                                    <button className="other-btn" onClick={() => window.open(Task.submissionLink[0], '_blank', 'noopener,noreferrer')}>
                                                        <img src={folder} />
                                                    </button>
                                                    :
                                                    null
                                            }
                                        </div>


                                        <div>
                                            {
                                                Task.compensation.amount !== 0

                                                    ?
                                                    <>
                                                        <div>
                                                            <span>Compensation</span>
                                                            <img src={compensationStar} />
                                                            <span>{Task.compensation.amount} {Task.compensation.symbol}</span>
                                                        </div>

                                                        <div className="v-line"></div>
                                                    </>
                                                    :
                                                    null

                                            }

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
                                    <div>
                                        <span>{Task.description}</span>
                                    </div>
                                </div>
                                <div className="body-right">

                                    {/* if task status is open then users can apply */}
                                    {
                                        Task.taskStatus === 'open'
                                            ?
                                            <>
                                                {/* if user is the creator --- display applicants*/}
                                                {
                                                    // account.toLowerCase() === Task?.creator.toLowerCase()
                                                    amICreator
                                                        ?
                                                        <>
                                                            {
                                                                Task.contributionType === 'open' && Task.isSingleContributor == false
                                                                    ?
                                                                    <>
                                                                        <div>
                                                                            <img src={applicants} />
                                                                            <span>{submissionCount}</span>
                                                                        </div>
                                                                        <h1>{submissionCount > 1 ? 'Submissions' : 'Submission'}</h1>
                                                                        <button onClick={() => { submissionCount > 0 && setOpenTaskReview(true) }}>CHECK</button>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <div>
                                                                            <img src={applicants} />
                                                                            <span>{applicationCount}</span>
                                                                        </div>
                                                                        <h1>{applicationCount > 1 ? 'Applicants' : 'Applicant'}</h1>
                                                                        <button onClick={handleOpenApplicantsSlider}>CHECK</button>
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        <>
                                                            {
                                                                // user is not creator --- check if user has applied or not
                                                                amIApplicant
                                                                    ?
                                                                    <>
                                                                        {
                                                                            amIRejected
                                                                                ?
                                                                                <>
                                                                                    <h1>Your submission was rejected</h1>
                                                                                    <p style={{ color: '#FFF' }}>{renderRejectionNote}</p>
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {
                                                                                        Task.contributionType === 'open' && hasMySubmission
                                                                                            ?
                                                                                            <>
                                                                                                {
                                                                                                    isMySubmissionAccepted
                                                                                                        ?
                                                                                                        <h1>Well Done!</h1>
                                                                                                        :
                                                                                                        <h1>Waiting<br /> for validation</h1>
                                                                                                }
                                                                                            </>
                                                                                            :
                                                                                            <h1>The reviewer is<br />looking at your<br />application.</h1>
                                                                                    }
                                                                                </>
                                                                        }

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
                                                                                                {
                                                                                                    Task.isSingleContributor
                                                                                                        ?
                                                                                                        // user need to apply --- single contributor
                                                                                                        <>

                                                                                                            <h1>This task<br />fits your role.</h1>
                                                                                                            <button onClick={() => setOpenApply(true)}>APPLY</button>
                                                                                                        </>
                                                                                                        :
                                                                                                        // mulitple contributor
                                                                                                        <>
                                                                                                            <h1>This task<br />fits your role.</h1>
                                                                                                            <button onClick={() => setOpenSubmit(true)}>SUBMIT WORK</button>
                                                                                                        </>
                                                                                                }

                                                                                            </>
                                                                                            :
                                                                                            <>
                                                                                                <h1>This task does not<br />fits your role.</h1>
                                                                                            </>
                                                                                    }
                                                                                </>
                                                                                :
                                                                                <>
                                                                                    {
                                                                                        Task.isSingleContributor
                                                                                            ?
                                                                                            // user need to apply --- single contributor
                                                                                            <>

                                                                                                <h1>This task needs a<br />contributor.</h1>
                                                                                                <button onClick={() => setOpenApply(true)}>APPLY</button>
                                                                                            </>
                                                                                            :
                                                                                            // mulitple contributor
                                                                                            <>
                                                                                                <h1>Open for all.</h1>
                                                                                                <button onClick={() => setOpenSubmit(true)}>SUBMIT WORK</button>
                                                                                            </>
                                                                                    }
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
                                                        <>
                                                            {
                                                                amIRejected
                                                                    ?
                                                                    // else display the name of the user who has been assigned
                                                                    <>
                                                                        <h1>Your submission was rejected</h1>
                                                                        <p style={{ color: '#FFF' }}>{renderRejectionNote}</p>
                                                                    </>
                                                                    :
                                                                    // else display the name of the user who has been assigned
                                                                    <>
                                                                        <h1>{assignedUser} is assigned</h1>
                                                                    </>
                                                            }
                                                        </>
                                                }
                                            </>
                                            :
                                            null
                                    }

                                    {
                                        Task.taskStatus === 'submitted'
                                            ?
                                            <>
                                                {
                                                    // submitted
                                                    amIApproved
                                                        ?
                                                        <>
                                                            <h1>Waiting<br /> for validation</h1>
                                                        </>
                                                        :
                                                        // for others
                                                        <>
                                                            <h1>Task is submitted</h1>
                                                            {amICreator && <button onClick={() => setOpenTaskReview(true)}>CHECK</button>}
                                                        </>
                                                }
                                            </>
                                            :
                                            null
                                    }

                                    {
                                        Task.taskStatus === 'approved' || Task.taskStatus === 'paid'
                                            ?
                                            <>
                                                {
                                                    // submitted
                                                    amIApproved
                                                        ?
                                                        <>
                                                            <h1>Well done !</h1>
                                                        </>
                                                        :
                                                        // for others
                                                        <>
                                                            <h1>Task has been<br /> {Task.taskStatus}</h1>
                                                        </>
                                                }
                                            </>
                                            :
                                            null
                                    }

                                    {
                                        Task.taskStatus === 'rejected'
                                            ?
                                            <>
                                                {
                                                    // rejected
                                                    amIRejected
                                                        ?
                                                        <>
                                                            {
                                                                Task.reopenedAt
                                                                    ?
                                                                    <>
                                                                        <h1>Your submission has been rejected!</h1>
                                                                        <p style={{ color: '#FFF' }}>{renderRejectionNote}</p>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <h1>Your submission has been rejected!</h1>
                                                                        <p style={{ color: '#FFF' }}>{renderRejectionNote}</p>
                                                                        <button onClick={() => setOpenSubmit(true)}>SUBMIT AGAIN</button>
                                                                    </>
                                                            }
                                                        </>
                                                        :
                                                        // for others
                                                        <>
                                                            <h1>Submission has been<br /> {Task.taskStatus}</h1>
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
                                {!(Task.isSingleContributor === false && Task.contributionType === 'open') &&
                                    <div>
                                        <span>Assigned</span>
                                        <img src={memberIcon} alt="member-icon" />
                                        <p>{assignedUser ? assignedUser : 'Not yet assigned'}</p>
                                    </div>}
                                {
                                    Task.taskStatus !== 'open' && Task.contributionType === 'open' && Task.isSingleContributor
                                        ?
                                        <div>
                                            <span style={{ cursor: 'pointer' }} onClick={() => setOpenApplicantsList(true)}>SEE PREVIOUS APPLICANTS</span>
                                        </div>
                                        :
                                        null
                                }
                                <div>
                                    <span>Created At {moment(Task.createdAt).format('L')} {moment(Task.createdAt).format('LT')}</span>
                                </div>
                            </div>

                        </div>

                        <div style={{ width: '80%', marginTop: '200px' }}>
                            <Footer theme="dark" />
                        </div>
                    </div>
            }

        </>
    )
}

export default TaskDetails;