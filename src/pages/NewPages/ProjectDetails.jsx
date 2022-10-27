import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find } from 'lodash';
import SideBar from "./DashBoard/SideBar";
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';
import { LeapFrog } from "@uiball/loaders";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import membersGroup from '../../assets/svg/membersGroup.svg'
import iconSvg from '../../assets/svg/createProject.svg';

import editToken from '../../assets/svg/editToken.svg';
import editPen from '../../assets/svg/editPen.svg';
import deleteIcon from '../../assets/svg/deleteIcon.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import lock from '../../assets/svg/lock.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "state/hooks";

import { SiNotion } from "react-icons/si";
import { HiOutlinePlus } from "react-icons/hi";
import { CgClose } from 'react-icons/cg'
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";
import AddMember from "./DashBoard/MemberCard/AddMember";

import { getProject, updateProjectLink, getDao, updateProjectMember, deleteProjectMember, archiveProject, deleteProject } from "state/dashboard/actions";
import { resetUpdateProjectMemberLoader, resetDeleteProjectMemberLoader, resetArchiveProjectLoader, resetDeleteProjectLoader } from 'state/dashboard/reducer';
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
    const { DAO, Project, ProjectLoading, updateProjectMemberLoading, deleteProjectMemberLoading, archiveProjectLoading, deleteProjectLoading } = useAppSelector((state) => state.dashboard);
    console.log("Project : ", Project)
    const daoName = _get(DAO, 'name', '').split(" ");

    const [lockedLinks, setLockedLinks] = useState([]);
    const [openLinks, setOpenLinks] = useState([]);

    const [extraMembers, setExtraMembers] = useState([]);
    const [newAddress, setNewAddress] = useState('');

    const [editMember, setEditMember] = useState(false);

    const [deleteMembers, setDeleteMembers] = useState([]);
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [closePrompt, setClosePrompt] = useState(false);

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

    // Runs after adding new members in project
    useEffect(() => {
        if (updateProjectMemberLoading === false) {
            dispatch(resetUpdateProjectMemberLoader());
            setExtraMembers([]);
            setShowList(false);
        }
    }, [updateProjectMemberLoading]);

    // runs after deleting selected members from the project
    useEffect(() => {
        if (deleteProjectMemberLoading === false) {
            dispatch(resetDeleteProjectMemberLoader());
            setDeleteMembers([]);
            setEditMember(false);
        }
    }, [deleteProjectMemberLoading]);

    // runs after archiving a project
    useEffect(() => {
        if (archiveProjectLoading === false) {
            dispatch(resetArchiveProjectLoader());
            setClosePrompt(false);
            navigate(-1);
        }
    }, [archiveProjectLoading]);

    // runs after deleting a project
    useEffect(() => {
        if (deleteProjectLoading === false) {
            dispatch(resetDeleteProjectLoader());
            setDeletePrompt(false);
            navigate(-1);
        }
    }, [deleteProjectLoading]);

    useEffect(() => {
        if (newAddress !== '') {
            const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === newAddress.toLowerCase());
            setExtraMembers([...extraMembers, user.member._id])
        }
    }, [DAO]);

    const handleParseUrl = (url) => {
        try {
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
        catch (e) {
            console.error(e);
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
            let memberExists = _find(Project.members, member => member.wallet.toLowerCase() === account.toLowerCase())
            if(!memberExists)
                return setUnlockLoading(null);
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

    const handleAddMemberDelete = (userId) => {
        if (deleteMembers.includes(userId)) {
            setDeleteMembers(deleteMembers.filter((m) => m !== userId));
        }
        else {
            setDeleteMembers([...deleteMembers, userId]);
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
        if (_get(user, 'role', '') === 'CORE_CONTRIBUTOR' || _get(user, 'role', '') === 'MEMBER') {
            return 'core contributor';
        }
        return _get(user, 'role', '');
    }

    const handleSubmit = () => {
        dispatch(updateProjectMember({ projectId, payload: { daoId: DAO._id, memberList: extraMembers } }));
    }

    const handleDeleteMembers = () => {
        dispatch(deleteProjectMember({ projectId, payload: { daoId: _get(DAO, '_id', null), memberList: deleteMembers } }));
    }

    const handleCloseProject = () => {
        dispatch(archiveProject({ projectId, daoUrl: daoURL }));
    }

    const handleDeleteProject = () => {
        dispatch(deleteProject({ projectId, daoUrl: daoURL }));
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
                <div className="info">
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

                    {/* add new link */}
                    {
                        showAddLink &&
                        <AddLink
                            toggleShowLink={toggleShowLink}
                            projectId={projectId}
                            daoUrl={daoURL}
                            sbt={DAO?.sbt}
                        />
                    }

                    {/* edit members --- side modal */}

                    {
                        editMember
                            ?
                            <div className="editMemberOverlay">
                                <div className="editMemberContainer">
                                    <div className="editMember-header">
                                        <p>Remove members from project</p>
                                        <button onClick={() => setEditMember(false)}>
                                            <CgClose size={20} color="#C94B32" />
                                        </button>
                                    </div>
                                    <div className="editMember-body">
                                        {
                                            Project?.members.map((item, index) => (
                                                <div className="editMember-row" key={index}>
                                                    <div>
                                                        <img src={memberIcon} alt="memberIcon" />
                                                        <p>{item.name}</p>
                                                    </div>
                                                    <span>{item.wallet.slice(0, 6) + "..." + item.wallet.slice(-4)}</span>
                                                    {
                                                        deleteMembers.some((m) => m === item._id) === false
                                                            ?
                                                            <input type='checkbox' onChange={() => handleAddMemberDelete(item._id)} />
                                                            :
                                                            <input type='checkbox' onChange={() => handleAddMemberDelete(item._id)} checked />
                                                    }
                                                </div>
                                            ))
                                        }

                                    </div>
                                    <div className="editMember-footer">
                                        <button onClick={() => setEditMember(false)}>
                                            CANCEL
                                        </button>
                                        <button onClick={handleDeleteMembers}>
                                            REMOVE FROM PROJECT
                                        </button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }

                    {/* close prompt */}
                    {
                        closePrompt
                            ?
                            <div className="projectDetails-overlay">
                                <div className="projectDetails-modal">
                                    <button className="close-btn" onClick={() => setClosePrompt(false)}>
                                        <CgClose size={20} color="#C94B32" />
                                    </button>
                                    <img src={iconSvg} alt="frame-icon" />
                                    <h1>Close { Project?.name }</h1>
                                    <p>This action <span>is irreversible</span> for now.<br />You will find closed projects in the archives.</p>
                                    <div>
                                        <button onClick={() => setClosePrompt(false)}>NO</button>
                                        <button onClick={handleCloseProject}>YES</button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
                    }

                    {/* delete prompt */}
                    {
                        deletePrompt
                            ?
                            <div className="projectDetails-overlay">
                                <div className="projectDetails-modal">
                                    <button className="close-btn" onClick={() => setDeletePrompt(false)}>
                                        <CgClose size={20} color="#C94B32" />
                                    </button>
                                    <img src={iconSvg} alt="frame-icon" />
                                    <h1>Delete { Project?.name }</h1>
                                    <p>This action <span>is irreversible</span>.</p>
                                    <div>
                                        <button onClick={() => setDeletePrompt(false)}>NO</button>
                                        <button onClick={handleDeleteProject}>YES</button>
                                    </div>
                                </div>
                            </div>
                            :
                            null
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

                    <div className="projectDetails-top">
                        <div className="projectDetails-name">
                            <div>
                                <h1>{Project?.name}</h1>
                            </div>
                            {
                                <div>
                                    {/* <button>
                                        <img src={editToken} alt="hk-logo" />
                                    </button> */}
                                    <button onClick={() => setDeletePrompt(true)}>
                                        <img src={deleteIcon} alt="hk-logo" />
                                    </button>
                                    {
                                        Project?.archivedAt === null
                                            ?
                                            <SafeButton
                                                height={40}
                                                width={150}
                                                titleColor="#C94B32"
                                                title="CLOSE PROJECT"
                                                bgColor="#FFFFFF"
                                                opacity="1"
                                                disabled={false}
                                                fontweight={400}
                                                fontsize={16}
                                                onClick={() => setClosePrompt(true)}
                                            />
                                            :
                                            null
                                    }
                                </div>
                            }
                        </div>
                        <div className="projectDetails-description">
                            <p>{Project?.description}</p>
                        </div>
                    </div>

                    <div className="projectDetails-body">
                        <div className="projectDetails-left">
                            <div className="projectDetails-members">
                                <div className="members-header">
                                    <p>Members</p>
                                    <div className="divider"></div>
                                    <div className="member-count">
                                        <img src={membersGroup} alt="membersGroup" />
                                        <p>{Project?.members.length} members</p>
                                    </div>
                                    <div>
                                        <button onClick={() => setEditMember(true)}>
                                            <img src={editToken} alt="hk-logo" />
                                        </button>
                                        <button onClick={toggleMemberList}>
                                            <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                            MEMBER
                                        </button>
                                    </div>
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
                            <div className="add-link-section">
                                <p className="link-header-text">Links</p>
                                <div>
                                    {/* <button>
                                        <img src={editPen} alt="hk-logo" />
                                    </button> */}
                                    <button onClick={toggleShowLink}>
                                        <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                        LINK
                                    </button>

                                </div>
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
                                                        <p>{item.title.length > 8 ? item.title.slice(0, 8) + "..." : item.title}</p>
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
                </div>
                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default ProjectDetails;