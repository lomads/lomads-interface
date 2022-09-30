import { useState } from "react";
import Header from 'components/Header';
import SideBar from "./DashBoard/SideBar";
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';

import membersGroup from '../../assets/svg/membersGroup.svg'

import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';

import { useLocation } from 'react-router-dom';

const ProjectDetails = () => {
    const location = useLocation();
    const projectData = location.state.project;
    console.log("17 project data : ", projectData);
    const [showNavBar, setShowNavBar] = useState(false);

    const showSideBar = (_choice) => {
        setShowNavBar(_choice);
    };

    return (
        <>
            <Header />
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
                                <h1>Project /&nbsp;<span>{projectData.name}</span></h1>
                                <p>{projectData.desc}</p>
                            </div>
                            <div>
                                <p>You're an Admin</p>
                            </div>
                            <div>
                                <button>
                                    <img src={editToken} alt="hk-logo" />
                                </button>
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
                                <button>
                                    <img src={editToken} alt="hk-logo" />
                                </button>
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
                    <div className="projectDetails-right"></div>
                </div>
            </div>
            <SideBar
                name={'Sample Dao'}
                showSideBar={showSideBar}
                showNavBar={showNavBar}
            />
        </>
    )
}

export default ProjectDetails;