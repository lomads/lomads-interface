import { useState, useContext, useEffect } from 'react';
import './MyProject.css';

import SafeButton from "UIpack/SafeButton";

import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

import { ProjectContext } from 'context/ProjectContext';
import ProjectCard from './Project/ProjectCard';

const MyProject = () => {
    const navigate = useNavigate();
    const { DAO, DAOList, DAOLoading } = useAppSelector((state) => state.dashboard);
    const { projects } = useContext(ProjectContext);
    const [tab, setTab] = useState(projects.length > 0 ? 1 : 2);

    return (
        <div className="myproject-container">
            <div className="myproject-header">
                <div className="myproject-title">
                    <button className={tab === 1 ? 'active' : null} onClick={() => setTab(1)} disabled={projects.length > 0 ? false : true}>
                        My projects
                    </button>
                    <div className="divider"></div>
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
                            projects && projects.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <ProjectCard
                                            project={item}
                                            daoUrl={DAO?.url}
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
                            DAO?.projects.length > 0
                                ?
                                <div className='myproject-body-fixed' style={DAO?.projects.length > 9 ? { overflow: 'scroll', height: '375px' } : null}>
                                    {
                                        DAO?.projects.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <ProjectCard
                                                        project={item}
                                                        daoUrl={DAO?.url}
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