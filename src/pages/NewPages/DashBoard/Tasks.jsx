import { useState, useEffect, useMemo } from 'react';
import './Tasks.css';
import { get as _get, find as _find } from 'lodash';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { useWeb3React } from "@web3-react/core";
import TaskCard from './Task/TaskCard';

import archiveIcon from '../../../assets/svg/archiveIcon.svg';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

const Tasks = () => {
    const navigate = useNavigate();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const [tab, setTab] = useState(2);
    const [myProjects, setMyProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);
    // const [initialCheck, setInitialCheck] = useState(false);

    // useEffect(() => {
    //     if (DAO) {
    //         setMyProjects(_get(DAO, 'projects', []).filter(project => _find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
    //         setOtherProjects(_get(DAO, 'projects', []).filter(project => !_find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
    //     }
    // }, [DAO, tab]);

    // useEffect(() => {
    //     if (!initialCheck) {
    //         if (myProjects.length > 0) {
    //             setInitialCheck(true)
    //             setTab(1);
    //         }
    //     }
    // }, [myProjects, initialCheck]);

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
                        All projects
                    </button>
                </div>
                <div className="tasks-buttons">
                    <div style={{ marginRight: '20px' }}>
                        <button className='archive-btn'>
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                    </div>
                    {
                        amIAdmin && <div>
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
                                onClick={() => { }}
                            />
                        </div>
                    }
                </div>
            </div>

            <div className='tasks-body' style={data.length > 6 ? { height: '272px', overflow: 'scroll' } : null}>
                {
                    data.map((item, index) => {
                        if (index < 20) {
                            return (
                                <div key={index}>
                                    <TaskCard />
                                </div>
                            )
                        }
                        else {
                            return (
                                <div className='all-tasks'>
                                    <p>Show All</p>
                                </div>
                            )
                        }

                    })
                }

            </div>
        </div>
    )
}

export default Tasks;