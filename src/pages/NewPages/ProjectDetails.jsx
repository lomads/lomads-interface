import { useState } from "react";
import { get as _get, find as _find } from 'lodash';
import SideBar from "./DashBoard/SideBar";
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';

import membersGroup from '../../assets/svg/membersGroup.svg'

import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import lock from '../../assets/svg/lock.svg';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAppSelector } from "state/hooks";

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";

const ProjectDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const projectData = location.state.project;
    console.log("project : ", projectData);
    const [showNavBar, setShowNavBar] = useState(false);
    const { DAO } = useAppSelector((state) => state.dashboard);
    console.log("DAO : ", DAO)
    const daoName = _get(DAO, 'name', '');

    const showSideBar = (_choice) => {
        setShowNavBar(_choice);
    };

    const handleParseUrl = (url) => {
        const link = new URL(url);
        if (link.hostname === 'notion.com') {
            return <SiNotion color='#B12F15' size={20} />
        }
        else if (link.hostname === 'discord.com') {
            return <BsDiscord color='#B12F15' size={20} />
        }
        else if (link.hostname === 'github.com') {
            return <BsGithub color='#B12F15' size={20} />
        }
        else if (link.hostname === 'google.com') {
            return <BsGoogle color='#B12F15' size={20} />
        }
        else {
            return <BsLink color='#B12F15' size={20} />
        }
    }

    return (
        <>
            <div
                className='projectDetails-container'
                onMouseEnter={() => {
                    showSideBar(false);
                }}
            >
                <div className="projectDetails-body">
                    <div className="projectDetails-left">
                        <div className="projectDetails-name">
                            <div>
                                <h1 onClick={() => navigate(-1)}>Project /&nbsp;<span onClick={(e) => e.stopPropagation()}>{projectData.name}</span></h1>
                                <p>{projectData.description}</p>
                            </div>
                            <div>
                                <p>You're an Admin</p>
                            </div>
                            <div>
                                {/* <button>
                                    <img src={editToken} alt="hk-logo" />
                                </button> */}
                            </div>
                        </div>
                        <div className="projectDetails-members">
                            <div className="members-header">
                                <p>Members</p>
                                <div className="divider"></div>
                                <div className="member-count">
                                    <img src={membersGroup} alt="membersGroup" />
                                    <p>{projectData.members.length} members</p>
                                </div>
                                <SafeButton
                                    height={40}
                                    width={150}
                                    titleColor="#C94B32"
                                    title="ADD MEMBER"
                                    bgColor="#FFFFFF"
                                    opacity="1"
                                    disabled={false}
                                    fontweight={400}
                                    fontsize={16}
                                    onClick={() => {
                                        console.log("Add members");
                                    }}
                                />
                                {/* <button>
                                    <img src={editToken} alt="hk-logo" />
                                </button> */}
                            </div>
                            <div className="members-list">
                                <div className="members-list-head">
                                    <div>
                                        <p>Name</p>
                                    </div>
                                    <div>
                                        <p>joined</p>
                                    </div>
                                </div>
                                <div className="members-list-body">
                                    {
                                        projectData.members.map((item, index) => (
                                            <div className="members-row" key={index}>
                                                <div className="members-row-name">
                                                    <div>
                                                        <img src={memberIcon} alt="memberIcon" />
                                                        <p>{item.name}</p>
                                                    </div>
                                                    <span>{item.address}</span>
                                                </div>
                                                <div className="members-row-date">
                                                    <p>10/10/2023 </p>
                                                </div>
                                                <div className="members-row-status">
                                                    <span>active contributor</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="projectDetails-right">
                        <p className="link-header-text">Links</p>
                        <div className="add-link-section">
                            <SafeButton
                                height={40}
                                width={150}
                                titleColor="#C94B32"
                                title="ADD LINK"
                                bgColor="#FFFFFF"
                                opacity="1"
                                disabled={false}
                                fontweight={400}
                                fontsize={16}
                                onClick={() => {
                                    console.log("Add members");
                                }}
                            />
                            {/* <button>
                                <img src={editToken} alt="hk-logo" />
                            </button> */}
                        </div>
                        {
                            projectData.links.length > 0
                                ?
                                <div className="link-locked-section">
                                    <div>
                                        <img src={lock} alt="lock-icon" />
                                        <p>Links to unlock:</p>
                                    </div>
                                    {
                                        projectData.links.map((item, index) => (
                                            <div className="link-button" key={index}>
                                                {handleParseUrl(item.link)}
                                                <p>{item.title}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                null
                        }

                        {/* unlocked section */}

                        {
                            projectData.links.length > 0
                                ?
                                <div className="link-unlocked-section">
                                    {
                                        projectData.links.map((item, index) => (
                                            <div className="link-button" key={index}>
                                                {handleParseUrl(item.link)}
                                                <p>{item.title}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
            <SideBar
                name={daoName}
                showSideBar={showSideBar}
                showNavBar={showNavBar}
            />
        </>
    )
}

export default ProjectDetails;