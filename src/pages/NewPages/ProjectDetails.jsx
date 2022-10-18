import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find } from 'lodash';
import SideBar from "./DashBoard/SideBar";
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';
import { LeapFrog } from "@uiball/loaders";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import membersGroup from '../../assets/svg/membersGroup.svg'

import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import lock from '../../assets/svg/lock.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "state/hooks";

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";
import AddMember from "./DashBoard/MemberCard/AddMember";

import { getProject } from "state/dashboard/actions";
import AddLink from "./DashBoard/Project/AddLink";

import { useWeb3React } from "@web3-react/core";
import { guild, role, user, setProjectName } from "@guildxyz/sdk";
import { getSigner } from 'utils'

const ProjectDetails = () => {
    const dispatch = useAppDispatch();
    const { provider, account, chainId } = useWeb3React();
    const signerFunction = useCallback((signableMessage) => getSigner(provider, account).signMessage(signableMessage), [provider, account]);
    const { projectId, daoURL } = useParams();
    const navigate = useNavigate();
    const [showNavBar, setShowNavBar] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showAddLink, setShowAddLink] = useState(false);
    const { DAO, Project, ProjectLoading } = useAppSelector((state) => state.dashboard);
    console.log("project : ", Project);
    const daoName = _get(DAO, 'name', '');

    useEffect(() => {
        if (projectId && (!Project || (Project && Project._id !== projectId)))
            dispatch(getProject(projectId));
    }, [projectId])

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

    const toggleShowMember = () => {
        setShowAddMember(!showAddMember);
    };

    const toggleShowLink = () => {
        setShowAddLink(!showAddLink);
    };

    const unlock = async (guildId, link) => {
        console.log(guildId) 
        let access = await guild.getUserAccess(guildId, account)
        access = access?.some?.(({ access }) => access)
        console.log(access)
        if(access){
            const membership = await guild.getUserMemberships(guildId, account);
            if(!membership.access) {
               const success = await user.join(guildId, account, signerFunction)
               if(success){
                window.open(link, '_blank')
               }
            }
        }
        // const membership = await guild.getUserMemberships(guildId, account);
        // console.log(membership)
        // if(!membership.access) {
        //     await user.join(guildId, account, signerFunction)
        // }
        // const membership = await user.getMemberships(account)
        // console.log(membership)
    }
    

    return (
        <>
            {
                !Project || ProjectLoading || (projectId && (Project && Project._id !== projectId))
                    ?
                    <div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="logo">
                            <img src={lomadsfulllogo} alt="" />
                        </div>
                        <div style={{ marginTop: 32 }}>
                            <LeapFrog size={50} color="#C94B32" />
                        </div>
                    </div>
                    :
                    null
            }
            <div
                className='projectDetails-container'
                onMouseEnter={() => {
                    showSideBar(false);
                }}
            >
                {showAddMember &&
                    <AddMember
                        toggleShowMember={toggleShowMember}
                        projectId={projectId}
                        daoUrl={daoURL}
                    />
                }
                {
                    showAddLink &&
                    <AddLink
                        toggleShowLink={toggleShowLink}
                        projectId={projectId}
                        daoUrl={daoURL}
                    />
                }
                <div className="projectDetails-body">
                    <div className="projectDetails-left">
                        <div className="projectDetails-name">
                            <div>
                                <h1 onClick={() => navigate(-1)}>Project /&nbsp;<span onClick={(e) => e.stopPropagation()}>{Project?.name}</span></h1>
                                <p>{Project?.description}</p>
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
                                    <p>{Project?.members.length} members</p>
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
                                    onClick={toggleShowMember}
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
                                        Project?.members.map((item, index) => (
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
                                onClick={toggleShowLink}
                            />
                            {/* <button>
                                <img src={editToken} alt="hk-logo" />
                            </button> */}
                        </div>
                        {
                            Project?.links.length > 0
                                ?
                                <div className="link-locked-section">
                                    <div>
                                        <img src={lock} alt="lock-icon" />
                                        <p>Links to unlock:</p>
                                    </div>
                                    {
                                        Project?.links.map((item, index) => (
                                            <div onClick={() => unlock(item.guildId, item.link)} className="link-button" key={index}>
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
                            Project?.links.length > 0
                                ?
                                <div className="link-unlocked-section">
                                    {
                                        Project?.links.map((item, index) => (
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