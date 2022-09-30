import { useState, useContext } from 'react';
import './MyProject.css';

import SafeButton from "UIpack/SafeButton";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { BsDiscord } from 'react-icons/bs';
import { SiNotion } from 'react-icons/si';

import { useNavigate } from "react-router-dom";

import { ProjectContext } from 'context/ProjectContext';
// import { ProjectContextType } from "types/DashBoardType";

const arr = [
    {
        title: 'B to B marketing',
        desc: 'How to reach our 3 main targets',
    },
    {
        title: 'Color workshop',
        desc: 'Organise the workshops',
    },
    {
        title: 'Trends survey',
        desc: 'Weekly moodboard',
    },
    {
        title: 'B to B marketing',
        desc: 'How to reach our 3 main targets',
    },
    {
        title: 'Color workshop',
        desc: 'Organise the workshops',
    },
    {
        title: 'Trends survey',
        desc: 'Weekly moodboard',
    },
    {
        title: 'B to B marketing',
        desc: 'How to reach our 3 main targets',
    },
    {
        title: 'Color workshop',
        desc: 'Organise the workshops',
    },
    {
        title: 'Trends survey',
        desc: 'Weekly moodboard',
    },
    {
        title: 'B to B marketing',
        desc: 'How to reach our 3 main targets',
    },
    {
        title: 'Color workshop',
        desc: 'Organise the workshops',
    },
    {
        title: 'Trends survey',
        desc: 'Weekly moodboard',
    },
];

const MyProject = () => {
    const navigate = useNavigate();
    const { projects } = useContext(ProjectContext);
    console.log("34 projects : ", projects);
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
                        <SafeButton
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
                        />
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
                                    <div className='myproject-card' key={index} onClick={() => navigate('/projectDetails', { state: { project: item } })}>
                                        <div className='myproject-card-icons'>
                                            <div className='icon-container'>
                                                <SiNotion color='#FFF' size={20} />
                                                <p>+12</p>
                                            </div>
                                            <div className='icon-container'>
                                                <BsDiscord color='#FFF' size={20} />
                                                <p>+100</p>
                                            </div>
                                            <div className='icon-container'>
                                                <p>More</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p>{item.name}</p>
                                            <span>{item.desc.length > 25 ? item.desc.substring(0, 25) + '...' : item.desc}</span>
                                        </div>
                                        <MdKeyboardArrowRight color='#B12F15' size={24} />
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
                    <div className='myproject-body-fixed' style={arr.length > 9 ? { overflow: 'scroll', height: '375px' } : null}>
                        {
                            arr.map((item, index) => {
                                return (
                                    <div className='myproject-card' key={index}>
                                        <div>
                                            <p>{item.title}</p>
                                            <span>{item.desc}</span>
                                        </div>
                                        <MdKeyboardArrowRight color='#B12F15' size={24} />
                                    </div>
                                )
                            })
                        }
                    </div>
                    :
                    null
            }
        </div>
    )
}

export default MyProject;