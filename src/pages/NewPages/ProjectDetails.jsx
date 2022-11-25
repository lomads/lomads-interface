import { useState, useEffect, useMemo, useCallback } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
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
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe } from "react-icons/bs";
import AddMember from "./DashBoard/MemberCard/AddMember";

import { getProject, updateProjectLink, getDao, updateProjectMember, deleteProjectMember, archiveProject, deleteProject, updateProject } from "state/dashboard/actions";
import { resetUpdateProjectMemberLoader, resetDeleteProjectMemberLoader, resetArchiveProjectLoader, resetDeleteProjectLoader, resetUpdateProjectLoader } from 'state/dashboard/reducer';
import AddLink from "./DashBoard/Project/AddLink";
import Footer from "components/Footer";

import { useWeb3React } from "@web3-react/core";
import { guild, role, user, setProjectName } from "@guildxyz/sdk";
import { getSigner } from 'utils'
import useRole from "hooks/useRole";
import { useSBTStats } from "hooks/SBT/sbt";
import axiosHttp from '../../api';
import { updateCurrentUser } from "state/dashboard/actions";

import SimpleInputField from "UIpack/SimpleInputField";
import Tasks from "./DashBoard/Tasks";
import CreateTask from "./DashBoard/Task/CreateTask";

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
    const [update, setUpdate] = useState(0);
    const { DAO, Project, ProjectLoading, updateProjectMemberLoading, deleteProjectMemberLoading, archiveProjectLoading, deleteProjectLoading, updateProjectLoading } = useAppSelector((state) => state.dashboard);
    console.log("Project : ", Project)
    const daoName = _get(DAO, 'name', '').split(" ");
    const { myRole, can } = useRole(DAO, account);
    const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '');
    console.log(contractName)
    console.log("myRole", myRole)
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [lockedLinks, setLockedLinks] = useState([]);
    const [openLinks, setOpenLinks] = useState([]);

    const [extraMembers, setExtraMembers] = useState([]);
    const [newAddress, setNewAddress] = useState([]);

    const [editMember, setEditMember] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [deleteMembers, setDeleteMembers] = useState([]);
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [closePrompt, setClosePrompt] = useState(false);

    const [showCreateTask, setShowCreateTask] = useState(false);

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

    const canMyrole = useCallback((permission) => {
        if (!Project) return false;
        let creator = _get(Project, 'creator', '').toLowerCase() === account.toLowerCase();
        let inProject = _find(_uniqBy(Project?.members, '_id'), m => m.wallet.toLowerCase() === account.toLowerCase())
        if (myRole === 'ADMIN' || myRole === "CONTRIBUTOR")
            return can(myRole, permission)
        if (myRole === 'CORE_CONTRIBUTOR')
            return inProject && can(myRole, permission)
        if (myRole === 'ACTIVE_CONTRIBUTOR')
            return creator && can(myRole, permission)
    }, [Project])


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

    // runs after updating project name & description
    useEffect(() => {
        if (updateProjectLoading === false) {
            dispatch(resetUpdateProjectLoader());
            setName('');
            setDescription('');
            setEditMode(false);
        }
    }, [updateProjectLoading]);

    useEffect(() => {
        console.log("new address : ", newAddress);
        if (newAddress.length > 0) {
            newAddress.map((value) => {
                const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === value.toLowerCase());
                setExtraMembers((oldValue) => [...oldValue, user.member._id]);
            })
        }
    }, [DAO]);

    const handleParseUrl = (url) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color='#B12F15' size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color='#B12F15' size={20} />
            }
            else {
                return <span><BsGlobe size={20} /></span>
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

    const unlock = useCallback(async (link, update = true) => {
        if (unlockLoading) return;
        setUnlockLoading(link.id)
        console.log(_uniqBy(Project?.members, '_id'))
        let memberExists = _find(_uniqBy(Project?.members, '_id'), member => member.wallet.toLowerCase() === account.toLowerCase())
        if (!memberExists)
            return setUnlockLoading(null);
        if (link.link.indexOf('discord.') > -1) {
            try {
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
                    setUnlockLoading(null)
                }
            } catch (e) {
                console.log(e)
                setUnlockLoading(null)
            }
        } else if (link.link.indexOf('notion.') > -1) {
            if (_get(DAO, 'sbt.contactDetail', []).indexOf('email') === -1) {
                return;
            }
            setUnlockLoading(link.id)
            try {
                axiosHttp.get(`/project/notion/space-admin-status?domain=${link.spaceDomain}`)
                    .then(async res => {
                        if (res.data) {
                            console.log(res.data)
                            console.log("BALANCEOF:", parseInt(balanceOf._hex, 16), contractName)
                            if (contractName !== '' && parseInt(balanceOf._hex, 16) === 1) {
                                if (parseInt(balanceOf._hex, 16) === 1) {
                                    const metadata = await axiosHttp.get(`/metadata/${_get(DAO, 'sbt._id', '')}`)
                                    console.log("metadata", metadata)
                                    if (metadata && metadata.data) {
                                        console.log(metadata.data)
                                        const notion_email = _get(_find(metadata.data.attributes, attr => attr.trait_type === "Email"), 'value', null)
                                        console.log(notion_email)
                                        //const notion_email = 'rish6ix@gmail.com'
                                        if (notion_email) {
                                            const notionUser = await axiosHttp.get(`project/notion/notion-user?email=${notion_email}`).then(res => res.data)
                                            console.log(notionUser)
                                            if (_get(notionUser, 'value.value.id', null)) {
                                                const notionUserId = _get(notionUser, 'value.value.id', null);
                                                dispatch(updateCurrentUser({ notionUserId }))
                                                axiosHttp.post(`project/notion/add-role`, { notionUserId, linkId: link.id, projectId, account })
                                                    .then(res => {
                                                        if (update)
                                                            unlockLink(link)
                                                        window.open(link.link, '_blank')
                                                    })
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                    .catch(e => {
                        setUnlockLoading(null)
                        console.log(e)
                    })
                    .finally(() => setUnlockLoading(null))
            } catch (e) {
                console.log(e)
                setUnlockLoading(null)
            }
        }
    }, [contractName, balanceOf, unlockLoading, Project, account])

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
        if (_uniqBy(Project?.members, '_id').some(m => m.wallet === item.member.wallet) === false) {
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
        return _get(user, 'role', '').replaceAll('_', ' ').toLowerCase();
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

    const handleEditMode = (e) => {
        e.stopPropagation();
        setName(Project.name);
        setDescription(Project.description);
        setEditMode(true);
    }
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch(updateProject({ projectId, daoUrl: daoURL, payload: { name, description } }))
        }
    }

    const toggleShowCreateTask = () => {
        setShowCreateTask(!showCreateTask);
    };

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
            <div className='projectDetails-container' onClick={() => setEditMode(false)}>
                <div className="info">
                    {
                        showList
                            ?
                            <div className="addMemberOverlay">
                                <div className='project-members'>
                                    <div className='project-members-header'>
                                        <p>Invite members</p>
                                        {/* <button onClick={toggleShowMember}>ADD NEW MEMBER</button> */}
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
                                            addToList={(addressArr) => setNewAddress(addressArr)}
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
                                            _uniqBy(Project?.members, '_id').map((item, index) => (
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
                                    <h1>Close {Project?.name}</h1>
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
                                    <h1>Delete {Project?.name}</h1>
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

                    {/* create task side modal */}
                    {showCreateTask && <CreateTask toggleShowCreateTask={toggleShowCreateTask} selectedProject={Project} />}

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
                                {
                                    editMode
                                        ?
                                        <SimpleInputField
                                            className="inputField"
                                            height={50}
                                            width={180}
                                            placeholder="Project name"
                                            value={name}
                                            onchange={(e) => { setName(e.target.value) }}
                                            onKeyDown={(e) => handleKeyDown(e)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        :
                                        <h1>{Project?.name}</h1>
                                }

                            </div>
                            {
                                <div>
                                    <button onClick={handleEditMode}>
                                        <img src={editToken} alt="hk-logo" />
                                    </button>

                                    {canMyrole('project.delete') && <button onClick={() => setDeletePrompt(true)}>
                                        <img src={deleteIcon} alt="hk-logo" />
                                    </button>}
                                    {canMyrole('project.archive') &&
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
                            {
                                editMode
                                    ?
                                    <SimpleInputField
                                        className="inputField"
                                        height={50}
                                        width={'50%'}
                                        placeholder="Project description"
                                        value={description}
                                        onchange={(e) => { setDescription(e.target.value) }}
                                        onKeyDown={(e) => handleKeyDown(e)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    :
                                    <p>{Project?.description}</p>
                            }

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
                                        <p>{_uniqBy(Project?.members, '_id').length} members</p>
                                    </div>
                                    <div>
                                        {canMyrole('project.member.edit') &&
                                            <button onClick={() => setEditMember(true)}>
                                                <img src={editToken} alt="hk-logo" />
                                            </button>}
                                        {canMyrole('project.member.add') &&
                                            <button onClick={toggleMemberList}>
                                                <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                                MEMBER
                                            </button>}
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
                                            _uniqBy(Project?.members, '_id').map((item, index) => (
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
                                    {canMyrole('project.link.add') &&
                                        <button onClick={toggleShowLink}>
                                            <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                            LINK
                                        </button>}

                                </div>
                            </div>
                            {
                                lockedLinks.length > 0
                                    ?
                                    <div>
                                        <div className="link-unlocked-section">
                                            <div className="locked">
                                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                                    <img src={lock} alt="lock-icon" />
                                                    <p style={{ marginLeft: "6px", fontStyle: "normal", fontSize: "16px", color: "#FFFFFF" }}>Links to unlock:</p>
                                                </div>
                                                <div className="container">
                                                    {
                                                        lockedLinks.map((item, index) => {
                                                            return (
                                                                <div onClick={() => unlock(item)} className="link-button" style={{ position: 'relative' }} key={index}>
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
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    null
                            }

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

                {/* Tasks section */}
                <div style={{ width: '80%', marginTop: '20px' }}>
                    <Tasks toggleShowCreateTask={toggleShowCreateTask} onlyProjects={true} />
                </div>
                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default ProjectDetails;