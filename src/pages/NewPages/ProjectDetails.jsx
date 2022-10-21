import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find } from 'lodash';
import SideBar from "./DashBoard/SideBar";
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';
import { LeapFrog } from "@uiball/loaders";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import membersGroup from '../../assets/svg/membersGroup.svg'

import editToken from '../../assets/svg/editToken.svg';
import deleteIcon from '../../assets/svg/deleteIcon.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import lock from '../../assets/svg/lock.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "state/hooks";

import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";
import AddMember from "./DashBoard/MemberCard/AddMember";

import { getProject, updateProjectLink, getDao, updateProjectMember } from "state/dashboard/actions";
import { resetUpdateProjectMemberLoader } from 'state/dashboard/reducer';
import AddLink from "./DashBoard/Project/AddLink";
import Footer from "components/Footer";

import { useWeb3React } from "@web3-react/core";
import { guild, role, user, setProjectName } from "@guildxyz/sdk";
import { getSigner } from 'utils'

const ProjectDetails = () => {
    const dispatch = useAppDispatch();
    const { provider, account, chainId } = useWeb3React();
    const signerFunction = useCallback((signableMessage) => getSigner(provider, account).signMessage(signableMessage), [provider, account]);
    const { projectId, daoURL } = useParams();
    const navigate = useNavigate();
    const [unlockLoading, setUnlockLoading] = useState(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showAddLink, setShowAddLink] = useState(false);
    const { DAO, Project, ProjectLoading, updateProjectMemberLoading } = useAppSelector((state) => state.dashboard);
    console.log("Project : ", Project)
    const daoName = _get(DAO, 'name', '').split(" ");

    const [lockedLinks, setLockedLinks] = useState([]);
    const [openLinks, setOpenLinks] = useState([]);

    const [extraMembers, setExtraMembers] = useState([]);
    const [newAddress, setNewAddress] = useState('');

    useEffect(() => {
        if (daoURL && (!DAO || (DAO && DAO.url !== daoURL)))
            dispatch(getDao(daoURL))
    }, [DAO, daoURL])

    useEffect(() => {
        if (projectId && (!Project || (Project && Project._id !== projectId)))
            dispatch(getProject(projectId));
    }, [projectId])

    useEffect(() => {
        if (Project) {
            setLockedLinks(_get(Project, 'links', []).filter(link => link.accessControl && _get(link, 'unlocked', []).indexOf(account.toLowerCase()) == -1))
            setOpenLinks(_get(Project, 'links', []).filter(link => ((!link.accessControl) || (_get(link, 'accessControl', null) && _get(link, 'unlocked', []).indexOf(account.toLowerCase()) > -1))))
        }
    }, [Project]);

    useEffect(() => {
        if (updateProjectMemberLoading === false) {
            dispatch(resetUpdateProjectMemberLoader());
            setExtraMembers([]);
            setShowList(false);
        }
    }, [updateProjectMemberLoading]);

    useEffect(() => {
        if (newAddress !== '') {
            const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === newAddress.toLowerCase());
            setExtraMembers([...extraMembers, user.member._id])
        }
    }, [DAO]);

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

    const toggleMemberList = () => {
        setExtraMembers([]);
        setShowList(!showList);
    };

    const toggleShowMember = () => {
        setShowList(!showList);
        setShowAddMember(!showAddMember);
    };

    const toggleShowLink = () => {
        setShowAddLink(!showAddLink);
    };

    const unlockLink = (link) => {
        dispatch(updateProjectLink({
            projectId, daoUrl: _get(DAO, 'url', ''), payload: { id: link.id }
        }))
    }

    const unlock = async (link, update = true) => {
        if (unlockLoading) return;
        try {
            setUnlockLoading(link.id)
            const g = await guild.get(link.guildId)
            let inviteLink = _get(_find(_get(g, 'guildPlatforms'), gp => gp.platformId == 1), 'invite', null)
            if (!inviteLink) return setUnlockLoading(null);

            let access = await guild.getUserAccess(link.guildId, account)
            access = access?.some?.(({ access }) => access)
            if (access) {
                const membership = await guild.getUserMemberships(link.guildId, account);
                if (!membership?.some?.(({ access }) => access)) {
                    const success = await user.join(link.guildId, account, signerFunction)
                    if (success) {
                        if (update)
                            unlockLink(link)
                        setUnlockLoading(null)
                        window.open(inviteLink, '_blank')
                    }
                } else {
                    if (update)
                        unlockLink(link)
                    setUnlockLoading(null)
                    window.open(inviteLink, '_blank')
                }
            } else {
                unlockLoading(null)
            }
        } catch (e) {
            unlockLoading(null)
        }
    }

    const handleAddMember = (user) => {
        if (extraMembers.includes(user.member._id)) {
            setExtraMembers(extraMembers.filter((m) => m !== user.member._id));
        }
        else {
            setExtraMembers([...extraMembers, user.member._id]);
        }

    }

    const handleUsers = (item, index) => {
        if (Project.members.some(m => m.wallet === item.member.wallet) === false) {
            return (
                <div className="member-li" key={index}>
                    <div className="member-img-name">
                        <img src={memberIcon} alt="member-icon" />
                        <p>{item.member.name}</p>
                    </div>
                    <div className="member-address">
                        <p>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</p>
                        {
                            extraMembers.some((m) => m === item.member._id) === false
                                ?
                                <input type="checkbox" onChange={() => handleAddMember(item)} />
                                :
                                <input type="checkbox" onChange={() => handleAddMember(item)} checked />
                        }
                    </div>
                </div>
            )
        }
    }

    const handleRenderRole = (item) => {
        const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === item.wallet.toLowerCase());
        if (user.role === 'CORE_CONTRIBUTOR') {
            return 'core contributor';
        }
        return user.role;
    }

    const handleSubmit = () => {
        dispatch(updateProjectMember({ projectId, payload: { daoId: DAO._id, memberList: extraMembers } }));
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
            >
                {
                    showList
                        ?
                        <div className="addMemberOverlay">
                            <div className='project-members'>
                                <div className='project-members-header'>
                                    <p>Invite members</p>
                                    <button onClick={toggleShowMember}>ADD NEW MEMBER</button>
                                </div>
                                <div className="member-list">
                                    {
                                        DAO && DAO.members.map((item, index) => handleUsers(item, index))
                                    }
                                </div>

                                <div className='project-buttons'>
                                    <button
                                        style={{ marginRight: '35px', background: '#FFF', color: '#C94B32' }}
                                        onClick={toggleMemberList}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        style={{ background: '#C94B32', color: '#FFF' }}
                                        onClick={handleSubmit}
                                    >
                                        ADD
                                    </button>
                                </div>
                            </div>


                        </div>
                        :
                        <>
                            {
                                showAddMember
                                    ?
                                    <AddMember
                                        toggleShowMember={toggleShowMember}
                                        addToList={(address) => setNewAddress(address)}
                                    />
                                    :
                                    null
                            }
                        </>
                }
                {
                    showAddLink &&
                    <AddLink
                        toggleShowLink={toggleShowLink}
                        projectId={projectId}
                        daoUrl={daoURL}
                        sbt={DAO?.sbt}
                    />
                }

                <div className="home-btn" onClick={() => navigate(-1)}>
                    <div className="invertedBox">
                        <div className="navbarText">
                            {
                                daoName.length === 1
                                    ? daoName[0].charAt(0)
                                    : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)
                            }
                        </div>
                    </div>
                </div>

                <div className="projectDetails-body">
                    <div className="projectDetails-left">
                        <div className="projectDetails-name">
                            <div>
                                <h1>Project /&nbsp;<span onClick={(e) => e.stopPropagation()}>{Project?.name}</span></h1>
                                <p>{Project?.description}</p>
                            </div>
                            <div>
                                <button>
                                    <img src={deleteIcon} alt="hk-logo" />
                                </button>
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
                                    onClick={toggleMemberList}
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
                                                    <span>{item.wallet.slice(0, 6) + "..." + item.wallet.slice(-4)}</span>
                                                </div>
                                                <div className="members-row-date">
                                                    <p>10/10/2023 </p>
                                                </div>
                                                <div className="members-row-status">
                                                    <span>{handleRenderRole(item)}</span>
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
                            lockedLinks.length > 0
                                ?
                                <div className="link-locked-section">
                                    <div>
                                        <img src={lock} alt="lock-icon" />
                                        <p>Links to unlock:</p>
                                    </div>
                                    {
                                        lockedLinks.map((item, index) => {
                                            if (item.accessControl) {
                                                return (
                                                    <div onClick={() => unlock(item)} className="link-button" style={{ position: 'relative' }} key={index}>
                                                        {handleParseUrl(item.link)}
                                                        <p style={{ flexGrow: 1 }}>{item.title}</p>
                                                        {unlockLoading === item.id ?
                                                            <div style={{ position: 'absolute', top: 10, right: 20 }}>
                                                                <LeapFrog size={20} color="#B12F15" />
                                                            </div> : null
                                                        }
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </div>
                                :
                                null
                        }

                        {/* unlocked section */}

                        {
                            openLinks.length > 0
                                ?
                                <div className="link-unlocked-section">
                                    {
                                        openLinks.map((item, index) => {
                                            return (
                                                <div onClick={() => {
                                                    if (!item.accessControl)
                                                        window.open(item.link, '_blank')
                                                    else
                                                        unlock(item, false)
                                                }} className="link-button" style={{ position: 'relative' }} key={index}>
                                                    {handleParseUrl(item.link)}
                                                    <p>{item.title}</p>
                                                    {unlockLoading === item.id ?
                                                        <div style={{ position: 'absolute', top: 10, right: 20 }}>
                                                            <LeapFrog size={20} color="#B12F15" />
                                                        </div> : null
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default ProjectDetails;