import { useState, useEffect, useMemo, useCallback } from 'react';
import './Tasks.css';
import { get as _get, find as _find, orderBy as _orderBy, uniqBy as _uniqBy } from 'lodash';

import SafeButton from "UIpack/SafeButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import TaskCard from './Task/TaskCard';
import useRole from '../../../hooks/useRole'
import useTerminology from 'hooks/useTerminology';
import archiveIcon from '../../../assets/svg/archiveIcon.svg';
import expandIcon from '../../../assets/svg/expand.svg';
import moment from 'moment';
import BootstrapTooltip from "./WalkThrough/HelpToolTip"
import useTasks from 'hooks/useTasks';

const Tasks = ({ toggleShowCreateTask, onlyProjects, isHelpIconOpen }) => {
    const navigate = useNavigate();
    const { DAO, user, Project } = useAppSelector((state) => state.dashboard);
    const { transformTask } = useTerminology(_get(DAO, 'terminologies', null))
    const { parsedTasks } = useTasks(_get(DAO, 'tasks', []))
    const { account } = useWeb3React();
    const [tab, setTab] = useState(4);
    const [myTasks, setMyTasks] = useState([]);
    const [manageTasks, setManageTasks] = useState([]);
    const [draftTasks, setDraftTasks] = useState([]);
    const [otherTasks, setOtherTasks] = useState([]);
    const [initialCheck, setInitialCheck] = useState(false);
    const { myRole, can } = useRole(DAO, account)
    console.log("My roel : ", myRole);

    useEffect(() => {
        if (onlyProjects) {
            fetchProjectTasks();
        }
        else {
            fetchDaoTasks();
        }
    }, [DAO, Project, tab, user, onlyProjects]);

    // const amIEligible_discord=(Task)=>{
    //     console.log('Task.jsx--------------------',Task);

    //     if (DAO && Task && Task.contributionType === 'open') {
    //         let current_user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
    //        // console.log('currentuser',current_user);
    //         let reurntype_function=false;
    //         if(current_user.discordRoles){


    //             Task?.validRoles.map(channelid=>{
    //                // console.log('task chanellid',channelid);


    //                 Object.keys(current_user.discordRoles).forEach(function(key, index) {
    //                     console.log(current_user.discordRoles[key]);
    //                     if(current_user.discordRoles[key].includes(channelid)){
    //                         //console.log('mathched');
    //                         reurntype_function=true;
    //                         console.log('Taskk.jsx--------------------in task function TaskMatched',Task.name);
    //                         return reurntype_function;

    //                         }else{

    //                             console.log('Taskk.jsx--------------------in task function TaskunMatched',Task.name);
    //                             return reurntype_function;
    //                         }
    //                 });


    //             })
    //             return reurntype_function;
    //         }

    //         return false;

    //     }

    // };
    const amIEligible = (Task) => {
        if (DAO && Task && Task.contributionType === 'open') {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
            if (user) {
                if (Task?.validRoles.length > 0) {
                    let myDiscordRoles = []
                    const discRoles = _get(user, 'discordRoles', {})
                    Object.keys(discRoles).forEach(key => {
                        myDiscordRoles = [...myDiscordRoles, ...discRoles[key]]
                    })
                    let index = Task?.validRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);
                    return index > -1 ? true : false
                } else {
                    return true;
                }
            }
            return true;
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
            let submissions = _get(task, 'members', [])?.filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
            if (submissions)
                return submissions.length
            return 0
        }
        return 0;
    };

    const fetchProjectTasks = () => {
        if (Project && user) {
            const myTasks = _get(Project, 'tasks', []).filter(task => task.reviewer !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && amIEligible(task) && ((task.contributionType === 'open' && !task.isSingleContributor) || !isOthersApproved(task)) && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || (task.contributionType === 'open' && !task.isSingleContributor))))
            setMyTasks(_orderBy(myTasks, i => moment(i.deadline).unix(), 'desc'))
            let manageTasks = _get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.reviewer === user._id));
            manageTasks = manageTasks.map(t => {
                let tsk = { ...t, notification: 0 };
                console.log("fetchProjectTasks",((t.contributionType === 'open' && !t.isSingleContributor) || t.contributionType === 'assign') )
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
            setDraftTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && (task.creator === user._id || task.provider === 'Github')));
            // setDraftTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && task.creator === user._id));
            const otherTasks = _get(Project, 'tasks', []).filter(task => !_find(myTasks, t => t._id === task._id) && !task.deletedAt && !task.archivedAt && !task.draftedAt && !(task.creator === user._id || task.reviewer === user._id))
            setOtherTasks(_uniqBy([..._orderBy(otherTasks, i => moment(i.deadline).unix(), 'desc'), ..._orderBy(myTasks.concat(manageTasks), i => moment(i.deadline).unix(), 'desc')]), t => t._id);
        }
    }

    const fetchDaoTasks = () => {
        if (DAO && user) {
            const myTasks = _get(DAO, 'tasks', []).filter(task => task.reviewer !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && amIEligible(task) && ((task.contributionType === 'open' && !task.isSingleContributor) || !isOthersApproved(task)) && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || (task.contributionType === 'open' && !task.isSingleContributor))))
            setMyTasks(_orderBy(myTasks, i => moment(i.deadline).unix(), 'asc'))
            let manageTasks = _get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.reviewer === user._id));
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
            console.log("fetchProjectTasks", manageTasks )
            setManageTasks(_orderBy(manageTasks, ['notification', i => moment(i.deadline).unix()], ['desc', 'desc']));
            // setDraftTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null && task.creator === user._id));
            setDraftTasks(_get(DAO, 'tasks', []).filter(task => (!task.deletedAt && !task.archivedAt && task.draftedAt !== null && (task.creator === user._id || task.provider === 'Github'))));
            const otherTasks = _get(DAO, 'tasks', []).filter(task => !_find(myTasks, t => t._id === task._id) && !task.deletedAt && !task.archivedAt && !task.draftedAt && !(task.creator === user._id || task.reviewer === user._id))
            setOtherTasks(_uniqBy([..._orderBy(otherTasks, i => moment(i.deadline).unix(), 'desc'), ..._orderBy(myTasks.concat(manageTasks), i => moment(i.deadline).unix(), 'desc')], t => t._id));
        }
    }

    const applicationCount = useMemo(() => {
        let sum = 0;
        if (manageTasks.length > 0) {
            for (let index = 0; index < manageTasks.length; index++) {
                const task = manageTasks[index];
                if (task.taskStatus === 'open' && task.isSingleContributor) {
                    let applications = _get(task, 'members', []).filter(m => (m.status !== 'rejected' && m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
                    if (applications)
                        sum = sum + applications.length
                }
            }
            return sum
        }
        return 0;
    }, [manageTasks]);

    const submissionCount = useMemo(() => {
        let sum = 0;
        if (manageTasks.length > 0) {
            for (let index = 0; index < manageTasks.length; index++) {
                const task = manageTasks[index];
                if ((task.contributionType === 'open' && !task.isSingleContributor) || task.contributionType === 'assign') {
                    let submissions = _get(task, 'members', [])?.filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
                    if (submissions)
                        sum = sum + submissions.length
                }
            }
            return sum
        }
        return 0;
    }, [manageTasks]);

    useEffect(() => {
        if (!initialCheck) {
            if (myTasks.length > 0) {
                setInitialCheck(true)
                setTab(1);
            }
            else if (manageTasks.length > 0) {
                setInitialCheck(true)
                setTab(2);
            }
        }
    }, [myTasks, manageTasks, initialCheck]);

    const amIAdmin = useMemo(() => {
        if (DAO) {
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'role1')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, DAO])


    return (
        <div className="tasks-container" id="my-task">
            <div className="tasks-header">
                <div className="tasks-title">
                    <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                        My {transformTask().labelPlural}
                    </button>
                    <div className="divider"></div>

                    {
                        myRole !== 'role4' && myRole !== 'role3'
                            ?
                            <>
                                <button style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                                    <div>Manage</div>
                                    <div className='tasks-card-icons'>
                                        {(applicationCount + submissionCount) > 0 &&
                                            <div className='icon-container'>
                                                <p>{(applicationCount + submissionCount)}</p>
                                            </div>
                                        }
                                    </div>
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
                        All {transformTask().labelPlural}
                    </button>
                </div>
                <div className="tasks-buttons">
                    <div style={{ marginRight: '20px' }}>
                    <BootstrapTooltip open={isHelpIconOpen} 
			            placement="top-start"
			            title="Open">
                        <button 
                            className={`archive-btn ${isHelpIconOpen ? 'help-highlight':''}`}
                            onClick={() => { onlyProjects ? navigate(`/${DAO.url}/tasks/${Project._id}`, { state: { activeTab: tab } }) : navigate(`/${DAO.url}/tasks`, { state: { activeTab: tab } }) }}>
                            <img src={expandIcon} alt="archive-icon" />
                        </button>
                    </BootstrapTooltip>
                    </div>
                    <div style={{ marginRight: '20px' }}>
                    <BootstrapTooltip 
                        open={isHelpIconOpen} 
			            placement="bottom"
			            title="Archives">
                        <button
                            className={`archive-btn ${isHelpIconOpen ? 'help-highlight':''}`}
                            onClick={() => { onlyProjects ? navigate(`/${DAO.url}/archiveTasks/${Project._id}`) : navigate(`/${DAO.url}/archiveTasks`) }}
                            disabled={_get(DAO, 'tasks', []).filter(task => !task.deletedAt && task.archivedAt).length > 0 ? false : true}
                        >
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                        </BootstrapTooltip>
                    </div>
                    {
                        can(myRole, 'task.create') && 
                        <BootstrapTooltip 
                            open={isHelpIconOpen} 
			                placement="top-start"
			                title="Create Task">
                            <div className={`${isHelpIconOpen ? 'help-highlight':''}`}>
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
                                onClick={() => { toggleShowCreateTask() }}
                            />
                        </div>
                        </BootstrapTooltip>
                    }
                </div>
            </div>
            {(tab === 1 && myTasks && myTasks.length > 0) ||
                (tab === 2 && manageTasks && manageTasks.length > 0) ||
                (tab === 3 && draftTasks && draftTasks.length > 0) ||
                (tab === 4 && otherTasks && otherTasks.length > 0) ?
                <div className='tasks-body' style={isHelpIconOpen ? {overflow: 'hidden'} : {}}>
                      {isHelpIconOpen && <div className="help-card">
                            <span className="help-card-content">By creating tasks, you can <span className="bold-text"> track progress, deadlines, </span> and <span className="bold-text"> rewards on bounties, </span> and <span className="bold-text"> assign contributors </span> to each task.</span>
                        </div>}
                    {
                        tab === 1 && parsedTasks['myTask'] && parsedTasks['myTask'].filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <div key={index}>
                                        <TaskCard
                                              task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='all-tasks' onClick={() => { onlyProjects ? navigate(`/${DAO.url}/tasks/${Project._id}`, { state: { activeTab: tab } }) : navigate(`/${DAO.url}/tasks`, { state: { activeTab: tab } }) }}>
                                        <span>Show All</span>
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        tab === 2 && parsedTasks['manage'] && parsedTasks['manage'].filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <div key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='all-tasks' onClick={() => { onlyProjects ? navigate(`/${DAO.url}/tasks/${Project._id}`, { state: { activeTab: tab } }) : navigate(`/${DAO.url}/tasks`, { state: { activeTab: tab } }) }}>
                                        <span>Show All</span>
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        tab === 3 && parsedTasks['drafts'] && parsedTasks['drafts'].filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <div key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='all-tasks' onClick={() => { onlyProjects ? navigate(`/${DAO.url}/tasks/${Project._id}`, { state: { activeTab: tab } }) : navigate(`/${DAO.url}/tasks`, { state: { activeTab: tab } }) }}>
                                        <span>Show All</span>
                                    </div>
                                )
                            }
                        })
                    }
                    {
                        tab === 4 && parsedTasks['allTasks'] && parsedTasks['allTasks'].filter((item, index) => index < 6).map((item, index) => {
                            if (index <= 4) {
                                return (
                                    <div key={index}>
                                        <TaskCard
                                            task={item}
                                            daoUrl={DAO?.url}
                                        />
                                    </div>
                                )
                            }
                            else {
                                return (
                                    <div className='all-tasks' onClick={() => { onlyProjects ? navigate(`/${DAO.url}/tasks/${Project._id}`, { state: { activeTab: tab } }) : navigate(`/${DAO.url}/tasks`, { state: { activeTab: tab } }) }}>
                                        <span>Show All</span>
                                    </div>
                                )
                            }
                        })
                    }
                </div> : null
            }
        </div>
    )
}

export default Tasks;