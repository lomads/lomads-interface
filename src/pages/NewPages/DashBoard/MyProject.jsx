import { useState, useEffect, useMemo } from 'react';
import './MyProject.css';
import { get as _get, find as _find, groupBy as _groupBy, orderBy as _orderBy } from 'lodash';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

import ProjectCard from './Project/ProjectCard';
import { useWeb3React } from "@web3-react/core";
import { useParams } from 'react-router-dom';
import archiveIcon from '../../../assets/svg/archiveIcon.svg';
import expandIcon from '../../../assets/svg/expand.svg';

import useRole from 'hooks/useRole';
import moment from 'moment';

const MyProject = () => {
    const navigate = useNavigate();
    const { daoURL } = useParams();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const [tab, setTab] = useState(2);
    const [myProjects, setMyProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);
    const [initialCheck, setInitialCheck] = useState(false);
    const { myRole, can } = useRole(DAO, account)


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
        if (DAO && DAO.url === daoURL) {
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
    }, [DAO, tab]);

    useEffect(() => {
        if (!initialCheck) {
            if (myProjects.length > 0) {
                setInitialCheck(true)
                setTab(1);
            } else {
                setTab(2)
            }
        }
    }, [myProjects, initialCheck]);

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
        <div className="myproject-container">
            <div className="myproject-header">
                <div className="myproject-title">
                    <>
                        <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                            My workspace
                        </button>
                        <div className="divider"></div>
                    </>
                    <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                        All workspaces
                    </button>
                </div>
                <div className="myproject-buttons">
                    <div style={{ marginRight: '20px' }}>
                        <button className='archive-btn' onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}>
                            <img src={expandIcon} alt="archive-icon" />
                        </button>
                    </div>
                    {can(myRole, 'project.view.archives') && <div style={{ marginRight: '20px' }}>
                        <button
                            className='archive-btn'
                            onClick={() => navigate('/archives')}
                            disabled={_get(DAO, 'projects', []).filter(project => !project.deletedAt && project.archivedAt).length > 0 ? false : true}
                        >
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                    </div>}
                    {
                        can(myRole, 'project.create') && <div>
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
                    }
                </div>
            </div>

            {
                tab === 1
                    ?
                    <div className='myproject-body-fixed'>
                        {
                            myProjects.length > 0 && myProjects.filter((item, index) => index < 6).map((item, index) => {
                                if (index <= 4) {
                                    if (item.deletedAt === null && item.archivedAt === null) {
                                        return (
                                            <div key={index}>
                                                <ProjectCard
                                                    project={item}
                                                    daoUrl={DAO?.url}
                                                    tab={tab}
                                                />
                                            </div>
                                        )
                                    }
                                }
                                else {
                                    return (
                                        <div
                                            className='all-project'
                                            onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}
                                        >
                                            <span>Show All</span>
                                        </div>
                                    )
                                }
                            })
                        }
                    </div>
                    :
                    null
            }

            {
                tab === 2
                    ?
                    <>
                        {
                            otherProjects.length > 0
                                ?
                                <div className='myproject-body-fixed'>
                                    {
                                        otherProjects.filter((item, index) => index < 6).map((item, index) => {
                                            if (index <= 4) {
                                                if (item.deletedAt === null && item.archivedAt === null) {
                                                    return (
                                                        <div key={index}>
                                                            <ProjectCard
                                                                project={item}
                                                                daoUrl={DAO?.url}
                                                                tab={tab}
                                                            />
                                                        </div>
                                                    )
                                                }
                                            }
                                            else {
                                                return (
                                                    <div className='all-project' onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}>
                                                        <span>Show All</span>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                : null
                            // <div className='myproject-body-nocontent'>
                            //     <p>No projects</p>
                            // </div>
                        }
                    </>
                    :
                    null
            }
        </div>
    )
}

export default MyProject;