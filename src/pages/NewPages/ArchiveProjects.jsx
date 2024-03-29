import React from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import '../../styles/pages/ArchiveProjects.css';

import { useAppSelector } from "state/hooks";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from 'react-icons/io'
import ProjectCard from './DashBoard/Project/ProjectCard';
import useTerminology from 'hooks/useTerminology';

const ArchiveProjects = () => {
    const navigate = useNavigate();
    const { DAO } = useAppSelector((state) => state.dashboard);
    const { transformTask, transformWorkspace } = useTerminology(_get(DAO, 'terminologies', null))
    const daoName = _get(DAO, 'name', '').split(" ");
    return (
        <div className="archive-container">
            <div className="home-btn" onClick={() => navigate(-1)}>
                <div className="invertedBox">
                    {
                        _get(DAO, 'image', null)
                            ?
                            <img src={_get(DAO, 'image', null)} />
                            :
                            <div className="navbarText">
                                {daoName.length === 1
                                    ? daoName[0].charAt(0)
                                    : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
                            </div>
                    }
                </div>
            </div>

            <div className="archive-header">
                <div className="archive-heading-box">
                    <div className="left" onClick={() => navigate(-1)}>
                        <IoIosArrowBack size={20} color="#C94B32" />
                    </div>
                    <div className="right">
                        <p>Archived <span>{transformWorkspace().labelPlural}</span></p>
                    </div>
                </div>
            </div>

            <div className="archive-body">
                {
                    DAO?.projects.map((item, index) => {
                        if (item.archivedAt !== null && item.deletedAt === null) {
                            return (
                                <div key={index} style={{ marginBottom: '25px' }}>
                                    <ProjectCard
                                        project={item}
                                        daoUrl={DAO?.url}
                                    />
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}

export default ArchiveProjects;