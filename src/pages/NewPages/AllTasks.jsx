import { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/AllTasks.css';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { orderBy as _orderBy } from 'lodash';
import moment from 'moment';
import { useAppSelector } from "state/hooks";
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";

import { IoIosArrowBack } from 'react-icons/io';
import SafeButton from "UIpack/SafeButton";

import archiveIcon from '../../assets/svg/archiveIcon.svg';
import expandIcon from '../../assets/svg/expand.svg';
import open from '../../assets/svg/open.svg';
import submitted from '../../assets/svg/submitted.svg';
import assign from '../../assets/svg/assign.svg';
import paid from '../../assets/svg/paid.svg';
import applied from '../../assets/svg/applied.svg'
import approved from '../../assets/svg/approved.svg';
import rejected from '../../assets/svg/rejected.svg';
import TaskCard from './DashBoard/Task/TaskCard';
import useRole from '../../hooks/useRole';

import CreateTask from "./DashBoard/Task/CreateTask";

const AllTasks = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { DAO, user } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const daoName = _get(DAO, 'name', '').split(" ");

    const [tab, setTab] = useState(location.state.activeTab);
    const [myTasks, setMyTasks] = useState([]);
    const [manageTasks, setManageTasks] = useState([]);
    const [draftTasks, setDraftTasks] = useState([]);
    const [otherTasks, setOtherTasks] = useState([]);
    const [initialCheck, setInitialCheck] = useState(false);
    const [currentTasks, setCurrentTasks] = useState([]);

    const { myRole, can } = useRole(DAO, account)

    const [showCreateTask, setShowCreateTask] = useState(false);

    const amIEligible = (Task) => {
        if (DAO && Task && Task.contributionType === 'open') {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user) {
                if (Task?.validRoles.length > 0) {
                    let index = Task?.validRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase());
                    return index > -1
                } else {
                    return true;
                }
            }
            return false;
        }
        return true;
    };

    const isOthersApproved = (Task) => {
        if (Task) {
            let user = _find(_get(Task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() !== account?.toLowerCase() && m.status === 'approved')
            if (user)
                return true
            return false
        }
        return false;
    };

    const taskApplicationCount = (task) => {
        if (task) {
            if (task.taskStatus === 'open') {
                let applications = _get(task, 'members', []).filter(m => (m.status !== 'rejected' && m.status !== 'submission_rejected'))
                if (applications)
                    return applications.length
            }
            return 0
        }
        return 0;
    };

    const taskSubmissionCount = (task) => {
        if (task) {
            let submissions = _get(task, 'members', []).filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
            if (submissions)
                return submissions.length
            return 0
        }
        return 0;
    };

    useEffect(() => {
        if (DAO && user) {
            // setMyTasks(_get(DAO, 'tasks', []).filter(task => task.creator !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || amIEligible(task) || (task.contributionType === 'open' && !task.isSingleContributor)))))
            // setManageTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.creator === user._id || task.reviewer === user._id)));
            // setDraftTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null));
            // setOtherTasks(_get(DAO, 'tasks', []).filter(task => !amIEligible(task) && (!(task.contributionType === 'open' && !task.isSingleContributor) && !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()))));
            const myTasks = _get(DAO, 'tasks', []).filter(task => task.creator !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && ((task.contributionType === 'open' && !task.isSingleContributor) || !isOthersApproved(task)) && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || amIEligible(task) || (task.contributionType === 'open' && !task.isSingleContributor))))
            setMyTasks(_orderBy(myTasks, i => moment(i.deadline).unix(), 'desc'))
            let manageTasks = _get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.creator === user._id || task.reviewer === user._id));
            manageTasks = manageTasks.map(t => {
                let tsk = { ...t, notification: 0 };
                if (((t.contributionType === 'open' && !t.isSingleContributor) || t.contributionType === 'assign') && taskSubmissionCount(t) > 0) {
                    tsk['notification'] = 1
                } else {
                    if (taskApplicationCount(t) > 0) {
                        tsk['notification'] = 1
                    }
                }
                return tsk
            })
            setManageTasks(_orderBy(manageTasks, ['notification', i => moment(i.deadline).unix()], ['desc', 'desc']));
            setDraftTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && task.creator === user._id));
            const otherTasks = _get(DAO, 'tasks', []).filter(task => !_find(myTasks, t => t._id === task._id) && !task.deletedAt && !task.archivedAt && !task.draftedAt && !(task.creator === user._id || task.reviewer === user._id))
            setOtherTasks([..._orderBy(otherTasks, i => moment(i.deadline).unix(), 'desc'), ..._orderBy(myTasks.concat(manageTasks), i => moment(i.deadline).unix(), 'desc')]);
        }
    }, [DAO, tab, user]);

    useEffect(() => {
        if (tab === 1) {
            setCurrentTasks(myTasks);
        }
        else if (tab === 2) {
            setCurrentTasks(manageTasks);
        }
        else if (tab === 3) {
            setCurrentTasks(draftTasks);
        }
        else {
            setCurrentTasks(otherTasks);
        }
    }, [tab, myTasks, manageTasks, draftTasks, otherTasks]);

    // const amIApproved = useMemo(() => {
    //     if (task) {
    //         let user = _find(_get(task, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === "approved")
    //         if (user)
    //             return true
    //         return false
    //     }
    //     return false;
    // }, [account, task]);

    return (
        <div className='allTasks-container'>

            {/* create task side modal */}
            {showCreateTask && <CreateTask toggleShowCreateTask={() => setShowCreateTask(false)} selectedProject={null} />}

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

            {/* All tasks header */}

            <div className="allTasks-header">
                <button onClick={() => navigate(-1)}>
                    <IoIosArrowBack size={20} color="#C94B32" />
                </button>
                <p>Tasks</p>
            </div>

            {/* Tabs header */}
            <div className='allTasks-tabHeader'>
                <div className="tasks-title">
                    <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                        My Tasks
                    </button>
                    <div className="divider"></div>

                    {
                        myRole !== 'CONTRIBUTOR' && myRole !== 'ACTIVE_CONTRIBUTOR'
                            ?
                            <>
                                <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                                    Manage
                                </button>
                                <div className="divider"></div>

                                <button className={tab === 3 ? 'active' : null} onClick={() => setTab(3)}>
                                    Drafts
                                </button>
                                <div className="divider"></div>
                            </>
                            :
                            null
                    }

                    <button className={tab === 4 ? 'active' : null} onClick={() => setTab(4)}>
                        All tasks
                    </button>
                </div>
                <div className="tasks-buttons">

                    <div style={{ marginRight: '20px' }}>
                        <button
                            className='archive-btn'
                            onClick={() => navigate(`/${DAO.url}/archiveTasks`)}
                            disabled={_get(DAO, 'tasks', []).filter(task => !task.deletedAt && task.archivedAt).length > 0 ? false : true}
                        >
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                    </div>
                    <div>
                        <SafeButton
                            height={40}
                            width={150}
                            titleColor="#C94B32"
                            title="CREATE"
                            bgColor="#FFFFFF"
                            opacity="1"
                            disabled={false}
                            fontweight={400}
                            fontsize={16}
                            onClick={() => { setShowCreateTask(true) }}
                        />
                    </div>
                </div>
            </div>

            <div className='allTasks-body'>

                {/* My tasks --- with columns */}

                {
                    tab === 1 &&
                    <>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgba(14, 193, 176, 0.2)' }}>
                                    <img src={assign} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#0EC1B0' }}>Assigned to me</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'assigned' && _find(_get(item, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === 'approved')) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgba(107, 153, 247, 0.2)' }}>
                                    <img src={submitted} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#6B99F7' }}>Under review</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (
                                            ((item.contributionType === 'assign' || item.contributionType === 'open') && !item.reopenedAt && item.taskStatus === 'submitted' && _find(_get(item, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.status === 'approved'))
                                            ||
                                            (item.taskStatus === 'open' && item.contributionType === 'open' && !item.reopenedAt && _find(_get(item, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())?.submission)
                                        ) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgba(75, 161, 219, 0.2)' }}>
                                    <img src={open} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#4BA1DB' }}>Open</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'open' && !_find(_get(item, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgb(245,234,216)' }}>
                                    <img src={applied} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#FFB600' }}>Applied</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'open' && item.reopenedAt) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgba(226, 59, 83, 0.2)' }}>
                                    <img src={rejected} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#E23B53' }}>Rejected</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'rejected' || (_find(_get(item, 'members', []), m => m.status === "submission_rejected"))) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgba(39, 196, 110, 0.2)' }}>
                                    <img src={approved} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#27C46E' }}>Approved</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'approved') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>

                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgb(217,236,198)' }}>
                                    <img src={paid} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#74D415' }}>Paid</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'paid') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </>
                }

                {/* Manage tasks --- with columns */}
                {
                    tab === 2 &&
                    <>
                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgba(75, 161, 219, 0.2)' }}>
                                    <img src={open} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#4BA1DB' }}>Open</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'open') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ backgroundColor: 'rgba(107, 153, 247, 0.2)' }}>
                                    <img src={submitted} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#6B99F7' }}>Submitted</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'open' && _get(item, 'members', []).filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected')).length > 0) {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgba(14, 193, 176, 0.2)' }}>
                                    <img src={assign} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#0EC1B0' }}>Assigned</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'assigned') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgba(39, 196, 110, 0.2)' }}>
                                    <img src={approved} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#27C46E' }}>Approved</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'approved') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                        <div className='allTasks-column'>
                            <div className='col-head'>
                                <div className='head-pill' style={{ background: 'rgb(217,236,198)' }}>
                                    <img src={paid} style={{ marginRight: '5px' }} />
                                    <p style={{ color: '#74D415' }}>Paid</p>
                                </div>
                            </div>
                            <div className='col-body'>
                                {
                                    currentTasks && currentTasks.map((item, index) => {
                                        if (item.taskStatus === 'paid') {
                                            return (
                                                <div key={index}>
                                                    <TaskCard
                                                        task={item}
                                                        daoUrl={DAO?.url}
                                                    />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </>
                }

                {/* Draft tasks */}
                {
                    tab === 3 && currentTasks && currentTasks.map((item, index) => {
                        return (
                            <div key={index}>
                                <TaskCard
                                    task={item}
                                    daoUrl={DAO?.url}
                                />
                            </div>
                        )
                    })
                }

                {/* other tasks */}
                {
                    tab === 4 &&
                    <div className='allTask-container'>
                        {
                            currentTasks && currentTasks.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }

            </div>

        </div>
    )
}

export default AllTasks;