import { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/AllTasks.css';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';

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
import approved from '../../assets/svg/approved.svg';
import TaskCard from './DashBoard/Task/TaskCard';

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

    useEffect(() => {
        if (DAO && user) {
            setMyTasks(_get(DAO, 'tasks', []).filter(task => _find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())))
            setManageTasks(_get(DAO, 'tasks', []).filter(task => task.creator === user._id || task.reviewer === user._id));
            setDraftTasks(_get(DAO, 'tasks', []).filter(task => task.draftedAt !== null));
            setOtherTasks(_get(DAO, 'tasks', []).filter(task => !task.deletedAt && !task.archivedAt && !task.draftedAt && task.creator !== user._id && task.reviewer !== user._id && !_find(task.members, m => m.member.wallet.toLowerCase() === account.toLowerCase())));
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

    return (
        <div className='allTasks-container'>

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

                    <div style={{ marginRight: '20px' }}>
                        <button className='archive-btn'>
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
                        />
                    </div>
                </div>
            </div>

            <div className='allTasks-body'>

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

            </div>

        </div>
    )
}

export default AllTasks;