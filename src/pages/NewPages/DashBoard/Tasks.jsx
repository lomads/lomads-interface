import { useState, useEffect, useMemo, useCallback } from 'react';
import './Tasks.css';
import { get as _get, find as _find } from 'lodash';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import TaskCard from './Task/TaskCard';
import useRole from '../../../hooks/useRole'

import archiveIcon from '../../../assets/svg/archiveIcon.svg';
import expandIcon from '../../../assets/svg/expand.svg';

const Tasks = ({ toggleShowCreateTask, onlyProjects }) => {
    const navigate = useNavigate();
    const { DAO, user, Project } = useAppSelector((state) => state.dashboard);
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

    const fetchProjectTasks = () => {
        if (Project && user) {
            setMyTasks(_get(Project, 'tasks', []).filter(task => task.creator !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || amIEligible(task) || (task.contributionType === 'open' && !task.isSingleContributor)))))
            setManageTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.creator === user._id || task.reviewer === user._id)));
            setDraftTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null));
            setOtherTasks(_get(Project, 'tasks', []).filter(task => !amIEligible(task) && (!(task.contributionType === 'open' && !task.isSingleContributor) && !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()))));
        }
    }

    const fetchDaoTasks = () => {
        if (DAO && user) {
            setMyTasks(_get(DAO, 'tasks', []).filter(task => task.creator !== user._id && (!task.deletedAt && !task.archivedAt && !task.draftedAt && (_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || amIEligible(task) || (task.contributionType === 'open' && !task.isSingleContributor)))))
            setManageTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && (task.creator === user._id || task.reviewer === user._id)));
            setDraftTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null));
            setOtherTasks(_get(DAO, 'tasks', []).filter(task => !amIEligible(task) && (!(task.contributionType === 'open' && !task.isSingleContributor) && !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()))));
        }
    }

    const applicationCount = useMemo(() => {
        let sum = 0;
        if (manageTasks.length > 0) {
            for (let index = 0; index < manageTasks.length; index++) {
                const task = manageTasks[index];
                if (task.taskStatus === 'open' && task.isSingleContributor) {
                    let applications = _get(task, 'members', []).filter(m => (m.status !== 'rejected' && m.status !== 'submission_rejected'))
                    if (applications)
                        return sum = sum + applications.length
                }
            }
        }
        return 0;
    }, [manageTasks]);

    const submissionCount = useMemo(() => {
        let sum = 0;
        if (manageTasks.length > 0) {
            for (let index = 0; index < manageTasks.length; index++) {
                const task = manageTasks[index];
                if ((task.contributionType === 'open' && !task.isSingleContributor) || task.contributionType === 'assign') {
                    let submissions = _get(task, 'members', []).filter(m => m.submission && (m.status !== 'submission_accepted' && m.status !== 'submission_rejected'))
                    if (submissions)
                        return sum = sum + submissions.length
                }
            }
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
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, DAO])


    return (
        <div className="tasks-container">
            <div className="tasks-header">
                <div className="tasks-title">
                    <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                        My Tasks
                    </button>
                    <div className="divider"></div>

                    {
                        myRole !== 'CONTRIBUTOR' && myRole !== 'ACTIVE_CONTRIBUTOR'
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
                        All tasks
                    </button>
                </div>
                <div className="tasks-buttons">
                    <div style={{ marginRight: '20px' }}>
                        {/* <button className='archive-btn' onClick={() => navigate('/tasks', { state: { activeTab: tab } })}>
                            <img src={expandIcon} alt="archive-icon" />
                        </button> */}
                    </div>
                    <div style={{ marginRight: '20px' }}>
                        <button
                            className='archive-btn'
                            onClick={() => { onlyProjects ? navigate(`/${DAO.url}/archiveTasks/${Project._id}`) : navigate(`/${DAO.url}/archiveTasks`) }}
                            disabled={_get(DAO, 'tasks', []).filter(task => !task.deletedAt && task.archivedAt).length > 0 ? false : true}
                        >
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                    </div>
                    {
                        can(myRole, 'task.create') && <div>
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
                    }
                </div>
            </div>

            <div className='tasks-body'>
                {
                    tab === 1 && myTasks && myTasks.map((item, index) => {
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
                {
                    tab === 2 && manageTasks && manageTasks.map((item, index) => {
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
                {
                    tab === 3 && draftTasks && draftTasks.map((item, index) => {
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
                {
                    tab === 4 && otherTasks && otherTasks.map((item, index) => {
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
        </div>
    )
}

export default Tasks;