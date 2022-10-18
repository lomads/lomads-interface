import { useEffect, useState } from "react";
import { get as _get } from 'lodash'
import { useNavigate } from "react-router-dom";

import { MdKeyboardArrowRight } from 'react-icons/md';
import { BsDiscord } from 'react-icons/bs';
import { SiNotion } from 'react-icons/si';

const ProjectCard = ({ project, daoUrl, tab }) => {
    const navigate = useNavigate();

    let arr = { 'notion.com': 0, 'discord.com': 0, 'more': 0 };
    _get(project,'links', []).forEach((item) => {
        let link = new URL(item.link);
        if (link.hostname === 'notion.com') {
            arr[link.hostname] += 1;
        }
        else if (link.hostname === 'discord.com') {
            arr[link.hostname] += 1;
        }
        else {
            arr['more'] += 1;
        }
    });

    return (
        <div className='myproject-card' onClick={() => navigate(`/${daoUrl}/project/${project._id}`, { state: { project } })}>
            {
                project.links.length > 0 && tab === 1
                    ?
                    <div className='myproject-card-icons'>
                        {
                            arr['notion.com'] > 0 && <div className='icon-container'>
                                <SiNotion color='#FFF' size={20} />
                                {/* <p>+{arr['notion.com']}</p> */}
                            </div>
                        }
                        {
                            arr['discord.com'] > 0 && <div className='icon-container'>
                                <BsDiscord color='#FFF' size={20} />
                                {/* <p>+{arr['discord.com']}</p> */}
                            </div>
                        }
                        {
                            arr['more'] > 0 && <div className='icon-container'>
                                <p>More</p>
                            </div>
                        }
                    </div>
                    :
                    null
            }
            <div>
                <p>{project.name}</p>
                <span>{project.description.length > 25 ? project.description.substring(0, 25) + "..." : project.description}</span>
            </div>
            <MdKeyboardArrowRight color='#B12F15' size={24} />
        </div>
    )
}

export default ProjectCard;