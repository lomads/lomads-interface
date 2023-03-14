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
import useTerminology from 'hooks/useTerminology';
import moment from 'moment';
import BootstrapTooltip from "./WalkThrough/HelpToolTip"

const MyProject = ({ isHelpIconOpen }) => {
    const navigate = useNavigate();
    const { daoURL } = useParams();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const [tab, setTab] = useState(2);
    const [myProjects, setMyProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);
    const [initialCheck, setInitialCheck] = useState(false);
    const { myRole, can } = useRole(DAO, account)
    const { transformWorkspace } = useTerminology(_get(DAO, 'terminologies', null))


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
            let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'role1')
            if (user)
                return true
            return false
        }
        return false;
    }, [account, DAO])

    return (
        <div className="myproject-container" id="my-workspace">
            <div className="myproject-header">
                <div className="myproject-title">
                    <>
                        <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                            My {transformWorkspace().labelPlural}
                        </button>
                        <div className="divider"></div>
                    </>
                    <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                        All {transformWorkspace().labelPlural}
                    </button>
                </div>
                <div className="myproject-buttons">
                    <div style={{ marginRight: '20px' }}>
                    <BootstrapTooltip open={isHelpIconOpen} 
			            placement="top-start" arrow
			            title="Open">
                        <button className={`archive-btn ${isHelpIconOpen ? 'help-highlight':''}`}
                             onClick={() => { navigate(`/${DAO.url}/projects`, { state: { activeTab: tab } }) }}>
                            <img src={expandIcon} alt="archive-icon" />
                        </button>
                        </BootstrapTooltip>
                    </div>
                    {can(myRole, 'project.view.archives') && <div style={{ marginRight: '20px' }}>
                        <BootstrapTooltip open={isHelpIconOpen} 
			                 placement="bottom" arrow
			                 title="Archives">
                        <button
                            className={`archive-btn ${isHelpIconOpen ? 'help-highlight':''}`}
                            onClick={() => navigate('/archives')}
                            disabled={_get(DAO, 'projects', []).filter(project => !project.deletedAt && project.archivedAt).length > 0 ? false : true}
                        >
                            <img src={archiveIcon} alt="archive-icon" />
                        </button>
                        </BootstrapTooltip>
                    </div>}
                    {
                        can(myRole, 'project.create') && 
                        <BootstrapTooltip open={isHelpIconOpen} 
			                placement="top-start" arrow
			                title="Create Workspace">
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
                                onClick={() => {
                                    navigate("/createProject");
                                }}
                            />
                        </div>
                        </BootstrapTooltip>
                    }
                </div>
            </div>
            {
                tab === 1 && myProjects && myProjects.length > 0
                    ?
                    <div className='myproject-body-fixed'>
                    {isHelpIconOpen && <div className="help-card">
                         <span>Here, you can create <span className="bold-text">customized workspaces</span> for all of your teams, <span className="bold-text"> manage milestones, </span> and <span className="bold-text"> track key results.</span></span>
			            </div>}
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
                tab === 2 && otherProjects && otherProjects.length > 0
                    ?
                    <>
                        {
                            otherProjects.length > 0
                                ?
                                <div className='myproject-body-fixed'>
                                 {isHelpIconOpen && <div className="help-card">
                                        Here, you can create <span className="bold-text">customized workspaces</span> for all of your teams, <span className="bold-text"> manage milestones, </span> and <span className="bold-text"> track key results.</span>
			                        </div>}
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