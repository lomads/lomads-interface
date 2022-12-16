import { useEffect, useState, useMemo } from "react";
import { get as _get, groupBy as _groupBy } from 'lodash'
import { useNavigate } from "react-router-dom";

import { BsDiscord } from 'react-icons/bs';

import { ProgressBar, Step } from "react-step-progress-bar";

const ProjectCard = ({ project, daoUrl, tab }) => {
    const navigate = useNavigate();

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
    }, [project])

    return (
        <div className='myproject-card' onClick={() => navigate(`/${daoUrl}/project/${project._id}`, { state: { project } })}>
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
                    null
            }
            <div className="container">
                <p className="project-name">{project.name.length > 25 ? project.name.substring(0, 20) + "..." : project.name}</p>
                <div className="project-desc" dangerouslySetInnerHTML={{ __html: project.description.length > 25 ? project.description.substring(0, 25) + "..." : project.description }}></div>
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