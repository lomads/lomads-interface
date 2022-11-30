import { useEffect, useState, useMemo } from "react";
import { get as _get, groupBy as _groupBy } from 'lodash'
import { useNavigate } from "react-router-dom";

import { MdKeyboardArrowRight } from 'react-icons/md';
import { BsDiscord } from 'react-icons/bs';
import { SiNotion } from 'react-icons/si';

const ProjectCard = ({ project, daoUrl, tab }) => {
    const navigate = useNavigate();

    // let arr = { 'notion.com': 0, 'discord.com': 0, 'more': 0 };
    // project.links.forEach((item) => {
    //     let link = new URL(item.link);
    //     if (link.hostname === 'notion.com') {
    //         arr[link.hostname] += 1;
    //     }
    //     else if (link.hostname === 'discord.com') {
    //         arr[link.hostname] += 1;
    //     }
    //     else {
    //         arr['more'] += 1;
    //     }
    // });

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
                        {/* {
                            arr['notion.'] > 0 && <div className='icon-container'>
                                <SiNotion color='#FFF' size={20} />
                                <p>+{arr['notion.com']}</p>
                            </div>
                        }
                        {
                            arr['discord.'] > 0 && <div className='icon-container'>
                                <BsDiscord color='#FFF' size={20} />
                                <p>+{arr['discord.com']}</p>
                            </div>
                        }
                        {
                            arr['more'] > 0 && <div className='icon-container'>
                                <p>More</p>
                            </div>
                        } */}
                    </div>
                    :
                    null
            }
            <div>
                <p className="project-name">{project.name}</p>
                <div className="project-desc" dangerouslySetInnerHTML={{ __html: project.description.length > 25 ? project.description.substring(0, 25) + "..." : project.description }}></div>
            </div>
            {
                project.archivedAt
                    ?
                    null
                    :
                    <MdKeyboardArrowRight color='#B12F15' size={24} />
            }
        </div>
    )
}

export default ProjectCard;