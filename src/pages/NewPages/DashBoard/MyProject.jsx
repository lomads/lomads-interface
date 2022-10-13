import { useState, useEffect } from 'react';
import './MyProject.css';
import { get as _get, find as _find } from 'lodash';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

import { ProjectContext } from 'context/ProjectContext';
import ProjectCard from './Project/ProjectCard';
import { useWeb3React } from "@web3-react/core";

const MyProject = () => {
    const navigate = useNavigate();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { account } = useWeb3React();
    const [tab, setTab] = useState(2);
    const [myProjects, setMyProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);
    const [initialCheck, setInitialCheck] = useState(false);

    useEffect(() => {
        if (DAO) {
            setMyProjects(DAO.projects.filter(project => _find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
            setOtherProjects(DAO.projects.filter(project => !_find(project.members, m => m.wallet.toLowerCase() === account.toLowerCase())))
        }
    }, [DAO, tab]);

    useEffect(() => {
        if (!initialCheck) {
            if (myProjects.length > 0) {
                setInitialCheck(true)
                setTab(1);
            }
        }
    }, [myProjects, initialCheck]);

    return (
        <div className="myproject-container">
            <div className="myproject-header">
                <div className="myproject-title">
                    {
                        myProjects.length > 0
                            ?
                            <>
                                <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)}>
                                    My projects
                                </button>
                                <div className="divider"></div>
                            </>
                            :
                            null
                    }

                    <button className={tab === 2 ? 'active' : null} onClick={() => setTab(2)}>
                        All projects
                    </button>
                </div>
                <div className="myproject-buttons">
                    <div style={{ marginRight: '20px' }}>
                        {/* <SafeButton
                            height={40}
                            width={150}
                            titleColor="#C94B32"
                            title="ARCHIVES"
                            bgColor="#FBF4F2"
                            opacity="1"
                            disabled={false}
                            fontweight={400}
                            fontsize={16}
                            onClick={() => console.log("Button")}
                        /> */}
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

            {
                tab === 1
                    ?
                    <div className='myproject-body'>
                        {
                            myProjects.length > 0 && myProjects.map((item, index) => {
                                return (
                                    <div key={index}>
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
                                <div className='myproject-body-fixed' style={DAO?.projects.length > 9 ? { overflow: 'scroll', height: '375px' } : null}>
                                    {
                                        otherProjects.map((item, index) => {
                                            return (
                                                <div key={index}>
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
                                :
                                <div className='myproject-body-nocontent'>
                                    <p>No projects</p>
                                </div>
                        }
                    </>
                    :
                    null
            }
        </div>
    )
}

export default MyProject;