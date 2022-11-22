import { useState, useEffect, useMemo } from 'react';
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

    useEffect(() => {
        if (onlyProjects) {
            fetchProjectTasks();
        }
        else {
            fetchDaoTasks();
        }
    }, [DAO, Project, tab, user, onlyProjects]);

    const fetchProjectTasks = () => {
        if (Project && user) {
            setMyTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && _find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || (task.contributionType === 'open' && !task.isSingleContributor)))
            setManageTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && (task.creator === user._id || task.reviewer === user._id)));
            setDraftTasks(_get(Project, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null));
            setOtherTasks(_get(Project, 'tasks', []).filter(task => !(task.contributionType === 'open' && !task.isSingleContributor) && !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())));
        }
    }

    const fetchDaoTasks = () => {
        if (DAO && user) {
            setMyTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && _find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase()) || (task.contributionType === 'open' && !task.isSingleContributor)))
            setManageTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && (task.creator === user._id || task.reviewer === user._id)));
            setDraftTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && task.draftedAt !== null));
            setOtherTasks(_get(DAO, 'tasks', []).filter(task => !(task.contributionType === 'open' && !task.isSingleContributor) && !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())));
        }
    }

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

                    <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                        Manage
                    </button>
                    <div className="divider"></div>

                    <button className={tab === 3 ? 'active' : null} onClick={() => setTab(3)}>
                        Drafts
                    </button>
                    <div className="divider"></div>

                    <button className={tab === 4 ? 'active' : null} onClick={() => setTab(4)}>
                        All tasks
                    </button>
                </div>
                <div className="tasks-buttons">
                    {/* <div style={{ marginRight: '20px' }}>
                        <button className='archive-btn' onClick={() => navigate('/tasks', { state: { activeTab: tab } })}>
                            <img src={expandIcon} alt="archive-icon" />
                        </button>
                    </div> */}
                    <div style={{ marginRight: '20px' }}>
                        <button className='archive-btn'>
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