import { useState, useEffect, useMemo } from 'react';
import './MyProject.css';
import { get as _get, find as _find } from 'lodash';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

import ProjectCard from './Project/ProjectCard';
import { useWeb3React } from "@web3-react/core";
import { useParams } from 'react-router-dom';
import archiveIcon from '../../../assets/svg/archiveIcon.svg';

import useRole from 'hooks/useRole';

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

    useEffect(() => {
        if (DAO && DAO.url === daoURL) {
            setMyProjects(_get(DAO, 'projects', []).filter(project => !project.deletedAt && !project.archivedAt && _find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
            setOtherProjects(_get(DAO, 'projects', []).filter(project => !project.deletedAt && !project.archivedAt && !_find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
        }
    }, [DAO, tab]);

    useEffect(() => {
        console.log("myProjects", myProjects)
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
                    {
                        can(myRole, 'project.view.own')
                            ?
                            <>
                                <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                                    My projects
                                </button>
                                {can(myRole, 'project.view.all') && <div className="divider"></div>}
                            </>
                            :
                            null
                    }
                    {can(myRole, 'project.view.all') &&
                        <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                            All projects
                        </button>
                    }
                </div>
                <div className="myproject-buttons">
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
                tab === 1 && can(myRole, 'project.view.own')
                    ?
                    <div className='myproject-body'>
                        {
                            myProjects.length > 0 && myProjects.map((item, index) => {
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
                            })
                        }
                    </div>
                    :
                    null
            }

            {
                tab === 2 && can(myRole, 'project.view.all')
                    ?
                    <>
                        {
                            otherProjects.length > 0
                                ?
                                <div className='myproject-body-fixed' style={otherProjects.length > 9 ? { overflow: 'scroll', height: '375px' } : { height: 'auto' }}>
                                    {
                                        otherProjects.map((item, index) => {
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