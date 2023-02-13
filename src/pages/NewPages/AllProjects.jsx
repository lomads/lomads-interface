import { useState, useEffect, useMemo } from 'react';
import '../../styles/pages/AllTasks.css';
import { find as _find, get as _get, debounce as _debounce, groupBy as _groupBy, orderBy as _orderBy } from 'lodash';
import { useAppSelector } from "state/hooks";
import { useLocation, useNavigate } from 'react-router-dom';
import { useWeb3React } from "@web3-react/core";
import useTerminology from 'hooks/useTerminology';
import { IoIosArrowBack } from 'react-icons/io';
import SafeButton from "UIpack/SafeButton";

import archiveIcon from '../../assets/svg/archiveIcon.svg';
import ProjectCard from './DashBoard/Project/ProjectCard';

import moment from 'moment';

const AllProjects = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { DAO, user } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const daoName = _get(DAO, 'name', '').split(" ");
    const { transformWorkspace } = useTerminology(_get(DAO, 'terminologies', null))

    const [tab, setTab] = useState(location.state.activeTab);
    const [myProjects, setMyProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);

    const [currentProjects, setCurrentProjects] = useState([]);

    const notificationCount = (project) => {
        let count = [];
        let links = project.links.map(l => {
            return { ...l, provider: new URL(l.link).hostname }
        })
        let grp = _groupBy(links, l => l.provider)
        for (let index = 0; index < Object.keys(grp).length; index++) {
            const provider = Object.keys(grp)[index];
            count.push({ provider, count: grp[provider].reduce((p, c) => (p + (+_get(c, 'notification', 0))), 0) })
        }
        console.log(count)
        return count
    }

    useEffect(() => {
        if (DAO && user) {
            let myProjects = _get(DAO, 'projects', []).filter(project => !project.deletedAt && !project.archivedAt && _find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase()));
            myProjects = myProjects.map(p => {
                let prj = { ...p, notification: 0 }
                if (notificationCount(prj) > 0)
                    prj.notification = 1
                return prj;
            })
            setMyProjects(_orderBy(myProjects, ['notification', p => moment(p.createdAt).unix()], ['desc', 'desc']))
            let otherProjects = _get(DAO, 'projects', []).filter(project => !project.deletedAt && !project.archivedAt && !_find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase()))
            otherProjects = otherProjects.map(p => {
                let prj = { ...p, notification: 0 }
                if (notificationCount(prj) > 0)
                    prj.notification = 1
                return prj;
            })
            setOtherProjects(_orderBy(myProjects.concat(otherProjects), p => moment(p.createdAt).unix(), 'desc'))
        }
    }, [DAO, tab, user]);

    useEffect(() => {
        if (tab === 1) {
            setCurrentProjects(myProjects);
        }
        else {
            setCurrentProjects(otherProjects);
        }
    }, [tab, myProjects, otherProjects]);

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
                <p>{transformWorkspace().labelPlural}</p>
            </div>

            {/* Tabs header */}
            <div className='allTasks-tabHeader'>
                <div className="tasks-title">
                    <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                        My {transformWorkspace().labelPlural}
                    </button>
                    <div className="divider"></div>

                    <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                        All {transformWorkspace().labelPlural}
                    </button>
                </div>
                <div className="tasks-buttons">

                    <div style={{ marginRight: '20px' }}>
                        <button
                            className='archive-btn'
                            onClick={() => navigate('/archives')}
                            disabled={_get(DAO, 'projects', []).filter(project => !project.deletedAt && project.archivedAt).length > 0 ? false : true}
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
                            onClick={() => {
                                navigate("/createProject");
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='allTasks-body'>
                {
                    tab === 1 &&
                    <div className='allTask-container'>
                        {
                            currentProjects && currentProjects.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginBottom: '25px' }}>
                                        <ProjectCard
                                            project={item}
                                            daoUrl={DAO?.url}
                                            tab={tab}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                }

                {
                    tab === 2 &&
                    <div className='allTask-container'>
                        {
                            currentProjects && currentProjects.map((item, index) => {
                                return (
                                    <div key={index} style={{ marginBottom: '25px' }}>
                                        <ProjectCard
                                            project={item}
                                            daoUrl={DAO?.url}
                                            tab={tab}
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

export default AllProjects;