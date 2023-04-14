import { useEffect, useState, useMemo } from "react";
import { get as _get, groupBy as _groupBy } from 'lodash'
import { useNavigate } from "react-router-dom";

import { BsDiscord,BsTrello } from 'react-icons/bs';
import { FaTrello } from 'react-icons/fa';

import { ProgressBar, Step } from "react-step-progress-bar";

import { useAppSelector, useAppDispatch } from "state/hooks";

import { updateViewProject } from "state/dashboard/actions";
import { resetUpdateViewProjectLoader } from 'state/dashboard/reducer';

const ProjectCard = ({ project, daoUrl, tab }) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { DAO,updateViewProjectLoading,user } = useAppSelector((state) => state.dashboard);

    // runs after updating viewer
    // useEffect(() => {
    //     if (updateViewProjectLoading === false) {
    //         dispatch(resetUpdateViewProjectLoader());
    //         navigate(`/${daoUrl}/project/${project._id}`, { state: { project } })
    //     }
    // }, [updateViewProjectLoading]);

    const notifications = useMemo(() => {
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
    }, [project]);

    const handleCardClick = () => {
        console.log("clicked... : ",project.name);
        dispatch(updateViewProject({ projectId:project._id, daoUrl:_get(DAO,'url','') }));
        navigate(`/${daoUrl}/project/${project._id}`, { state: { project } })
    }

    return (
        <div className='myproject-card' onClick={handleCardClick}>
            {
                project.links.length > 0 && tab === 1
                    ?
                    <div className='myproject-card-icons'>
                        {
                            notifications.map(notification => {
                                if (notification.provider.indexOf('discord') > -1 && notification.count) {
                                    return (<div className='icon-container'>
                                        <BsDiscord color='#FFF' size={20} />
                                        <p>+{notification.count}</p>
                                    </div>)
                                }
                            })
                        }
                    </div>
                    :
                    <>
                    {
                        project.provider === 'Trello' && !project.viewers.includes(_get(user,'_id',''))
                        ?
                        <div className='myproject-card-icons'>
                            <div className='icon-container'>
                                <FaTrello color='#FFF' size={20} />
                            </div>
                        </div> 
                        :
                        null
                    }
                    </>
            }
            <div className="container">
                <div className="project-name">
                    <p>{project.name}</p>
                </div>
                {/* <div className="project-desc" dangerouslySetInnerHTML={{ __html: project.description.length > 25 ? project.description.substring(0, 25) + "..." : project.description }}></div> */}
                {
                    _get(project, 'milestones', []).length > 0 &&
                    <div className="milestone-progress">
                        <div style={{ width: '200px' }}>
                            <ProgressBar
                                percent={((_get(project, 'milestones', []).filter((item) => item.complete === true).length) / (_get(project, 'milestones', []).length)) * 100}
                                filledBackground="#76808D"
                                unfilledBackground="#F0F0F0"
                                height="5px"
                            >
                                <Step transition="scale">
                                    {({ accomplished, index }) => (
                                        <div className={`indexedStep ${accomplished ? "accomplished" : ""}`}></div>
                                    )}
                                </Step>
                                {
                                    _get(project, 'milestones', []).map((item, index) => {
                                        return (
                                            <Step transition="scale">
                                                {({ accomplished, index }) => (
                                                    <div className={`indexedStep ${accomplished ? "accomplished" : ""}`}></div>
                                                )}
                                            </Step>
                                        )
                                    })
                                }
                            </ProgressBar>
                        </div>
                        <span className="percent-text">{(((_get(project, 'milestones', []).filter((item) => item.complete === true).length) / (_get(project, 'milestones', []).length)) * 100).toFixed(2)}%</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProjectCard;