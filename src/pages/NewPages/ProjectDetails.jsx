import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { get as _get, find as _find, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import SafeButton from "UIpack/SafeButton";
import '../../styles/pages/ProjectDetails.css';
import { LeapFrog } from "@uiball/loaders";
import lomadsfulllogo from "../../assets/svg/lomadsfulllogo.svg";

import membersGroup from '../../assets/svg/membersGroup.svg'
import iconSvg from '../../assets/svg/createProject.svg';
import axios from "axios";

import archiveIcon from '../../assets/svg/archiveIcon.svg';
import editToken from '../../assets/svg/editToken.svg';
import deleteIcon from '../../assets/svg/deleteIcon.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import lock from '../../assets/svg/lock.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from "state/hooks";

import { SiNotion } from "react-icons/si";
import { HiOutlinePlus } from "react-icons/hi";
import { FiCheck } from "react-icons/fi";
import { BiLock } from "react-icons/bi";
import { CgClose } from 'react-icons/cg'
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe } from "react-icons/bs";
import AddMember from "./DashBoard/MemberCard/AddMember";

import { getProject, updateProjectLink, getDao, updateProjectMember, deleteProjectMember, archiveProject, deleteProject, updateProject } from "state/dashboard/actions";
import { resetUpdateProjectMemberLoader, resetDeleteProjectMemberLoader, resetArchiveProjectLoader, resetDeleteProjectLoader } from 'state/dashboard/reducer';
import AddLink from "./DashBoard/Project/AddLink";
import Footer from "components/Footer";

import { useWeb3React } from "@web3-react/core";
import { guild, role, user, setProjectName } from "@guildxyz/sdk";
import { getSigner } from 'utils'
import useRole from "hooks/useRole";
import { useSBTStats } from "hooks/SBT/sbt";
import axiosHttp from '../../api';
import { updateCurrentUser } from "state/dashboard/actions";

import { IoIosArrowBack } from 'react-icons/io';
import SimpleInputField from "UIpack/SimpleInputField";
import Tasks from "./DashBoard/Tasks";
import CreateTask from "./DashBoard/Task/CreateTask";

import { Editor } from '@tinymce/tinymce-react';
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import useDCAuth from 'hooks/useDCAuth';
import { usePrevious } from 'hooks/usePrevious';

import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import AssignContributions from "./DashBoard/Project/AssignContributions";
import KRAReview from "./DashBoard/Project/KRAReview";
import useTerminology from 'hooks/useTerminology';
import moment from "moment";
import useEncryptDecrypt from "hooks/useEncryptDecrypt";

import settingIcon from '../../assets/svg/settings.svg';
import ProjectEdit from "./DashBoard/Project/ProjectEdit";
import ProjectMilestone from "./DashBoard/Project/ProjectMilestone";
import ProjectKRA from "./DashBoard/Project/ProjectKRA";
import WorkspaceInfo from "./DashBoard/Project/WorkspaceInfo";
import ProjectMembers from "./DashBoard/Project/ProjectMembers";
import ProjectResource from "./DashBoard/Project/ProjectResource";

const ProjectDetails = () => {
    const dispatch = useAppDispatch();
    const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("identify guilds")
    const { provider, account, chainId } = useWeb3React();
    const signerFunction = useCallback((signableMessage) => getSigner(provider, account).signMessage(signableMessage), [provider, account]);
    const { projectId, daoURL } = useParams();
    const navigate = useNavigate();
    const [unlockLoading, setUnlockLoading] = useState(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showAddLink, setShowAddLink] = useState(false);
    const [update, setUpdate] = useState(0);
    const { DAO, Project, ProjectLoading, updateProjectMemberLoading, deleteProjectMemberLoading, archiveProjectLoading, deleteProjectLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'))
    console.log("Project : ", Project)
    const daoName = _get(DAO, 'name', '').split(" ");
    const { myRole, can } = useRole(DAO, account);
    const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '');

    const [lockedLinks, setLockedLinks] = useState([]);
    const [openLinks, setOpenLinks] = useState([]);

    const [extraMembers, setExtraMembers] = useState([]);
    const [newAddress, setNewAddress] = useState([]);

    const [editMember, setEditMember] = useState(false);

    const [deleteMembers, setDeleteMembers] = useState([]);
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [closePrompt, setClosePrompt] = useState(false);

    const [showCreateTask, setShowCreateTask] = useState(false);
    const [hasClickedAuth, setHasClickedAuth] = useState(false)

    const [showAssign, setShowAssign] = useState(false);
    const [showKRAReview, setShowKRAReview] = useState(false);

    const [tab, setTab] = useState(null);

    const [selectedMilestone, setSelectedMilestone] = useState(null);

    const [showEdit, setShowEdit] = useState(false);

    const [openResource, setOpenResource] = useState(false);
    const [openMilestone, setOpenMilestone] = useState(false);
    const [openKRA, setOpenKRA] = useState(false);
    const [openWorkspaceInfo, setOpenWorkspaceInfo] = useState(false);
    const { decryptMessage } = useEncryptDecrypt()

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
        let p = permission;
        if (inProject)
            p = `${permission}.inproject`
        if (creator)
            p = `${permission}.creator`
        console.log("can(myRole, p) || can(myRole, permission)", can(myRole, p) || can(myRole, permission))
        return (can(myRole, p) || can(myRole, permission))
    }, [Project]);

    useEffect(() => {
        if (Project) {
            if (_get(Project, 'milestones', []).length > 0) {
                setTab(1);
            }
            else if (_get(Project, 'milestones', []).length === 0 && _get(Project, 'kra.results', []).length > 0) {
                setTab(2);
            }
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
        console.log("new address : ", newAddress);
        if (newAddress.length > 0) {
            newAddress.map((value) => {
                const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === value.toLowerCase());
                setExtraMembers((oldValue) => [...oldValue, user.member._id]);
            })
        }
    }, [DAO]);

    const prevAuth = usePrevious(authorization)
    useEffect(() => {
        console.log("prevAut", prevAuth, authorization, hasClickedAuth)
        if (((prevAuth == undefined && authorization) || (prevAuth && authorization && prevAuth !== authorization)) && hasClickedAuth) {
            console.log("prevAut", "unlock(hasClickedAuth)")
            unlock(hasClickedAuth)
        }
    }, [prevAuth, authorization, hasClickedAuth])

    const getPlatformMemberId = () => {
        return axios.get(`https://discord.com/api/users/@me`, { headers: { Authorization: authorization } })
            .then(res => res.data.id)
            .catch(e => {
                if (e.response.status === 401) {
                    console.log(e)
                    //setHasClickedAuth(true)
                    onResetAuth()
                    setTimeout(() => onOpen(), 1000)
                }
                return null;
            })
    }

    const getGuilds = () => {
        return axios.get(`https://discord.com/api/users/@me/guilds`, { headers: { Authorization: authorization } })
            .then(res => res.data)
    }

    const handleParseUrl = (url, accessControl, locked) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color={accessControl && locked ? '#FFF' : '#B12F15'} size={20} />
            }
            else {
                return <span><BsGlobe color={accessControl ? '#FFF' : '#B12F15'} size={20} /></span>
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

    const addGuildRole = async (guildId, memberId, roleId) => {
        return axiosHttp.get(`discord/guild/${guildId}/member/${memberId}/role/${roleId}/add`)
    }

    const myMetadata = useMemo(() => {
        return _find(_get(DAO, 'sbt.metadata', []), m => {
            return _find(m.attributes, a => a.value === account)
        })
    }, [DAO?.sbt, account])

    const getPersonalDetails = useCallback(attr => {
        if (DAO && DAO.sbt) {
            if (myMetadata && myMetadata.attributes) {
                for (let index = 0; index < myMetadata.attributes.length; index++) {
                    const attribute = myMetadata.attributes[index];
                    if (attr.toLowerCase() === attribute.trait_type.toLowerCase()) {
                        return attribute?.value;
                    }
                }
                return null
            }
        }
    }, [DAO?.sbt, myMetadata])

    const unlock = useCallback(async (link, update = true) => {
        //if (unlockLoading) return;
        setUnlockLoading(link.id)
        console.log(_uniqBy(Project?.members, '_id'))
        let memberExists = _find(_uniqBy(Project?.members, '_id'), member => member.wallet.toLowerCase() === account.toLowerCase())
        console.log("memberExists", memberExists)
        if (!memberExists)
            return setUnlockLoading(null);
        if (link.link.indexOf('discord.') > -1) {
            try {
                if (contractName !== '' && parseInt(balanceOf._hex, 16) === 1) {
                    if (parseInt(balanceOf._hex, 16) === 1) {
                        const url = new URL(link.link)
                        const dcserverid = url.pathname.split('/')[2]
                        const dcchannelid = url.pathname.split('/')[3]
                        setHasClickedAuth(link)
                        console.log("prevAut", "authorization", authorization)
                        if (!authorization)
                            return onOpen();
                        const discordMemberId = await getPlatformMemberId();
                        const guilds = await getGuilds();
                        const guildExists = _find(guilds, g => g.id === dcserverid)
                        if (guildExists) {
                            await addGuildRole(dcserverid, discordMemberId, link.roleId)
                            if (update)
                                unlockLink(link)
                            setUnlockLoading(null)
                            setHasClickedAuth(null)
                            window.open(`https://discord.com/channels/${dcserverid}/${dcchannelid}`, '_blank')
                        } else {
                            if (update)
                                unlockLink(link)
                            setUnlockLoading(null)
                            setHasClickedAuth(null)
                            const { code } = await axiosHttp.get(`/discord/guild/${dcserverid}/${dcchannelid}/invite-code`).then(res => res.data)
                            window.open(`https://discord.gg/${code}`, '_blank')
                        }
                    }
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
                                        let notion_email = null
                                        if (getPersonalDetails("Personal Details")) {
                                            const data = await decryptMessage(getPersonalDetails("Personal Details"))
                                            if (data && data.email) {
                                                notion_email = data.email
                                            }
                                        } else {
                                            notion_email = _get(_find(myMetadata.attributes, attr => attr.trait_type === "Email"), 'value', null)
                                        }
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
    }, [contractName, balanceOf, unlockLoading, Project, account, authorization])

    const handleAddMember = (user) => {
        if (extraMembers.includes(user.member._id)) {
            setExtraMembers(extraMembers.filter((m) => m !== user.member._id));
        }
        else {
            setExtraMembers([...extraMembers, user.member._id]);
        }
    }

    const handleUsers = (item, index) => {
        if (_uniqBy(Project?.members, '_id').some(m => m.wallet === item.member.wallet) === false) {
            return (
                <div onClick={() => handleAddMember(item)} className="member-li" key={index}>
                    <div className="member-img-name">
                        <img src={memberIcon} alt="member-icon" />
                        <p>{item.member.name}</p>
                    </div>
                    <div className="member-address">
                        <p>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</p>
                        <input type="checkbox" onChange={() => handleAddMember(item)} checked={!(extraMembers.some((m) => m === item.member._id) === false)} />
                    </div>
                </div>
            )
        }
    }

    const handleRenderRole = (item) => {
        const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === item.wallet.toLowerCase());
        //return _get(user, 'role', '').replaceAll('_', ' ').toLowerCase();
        return transformRole(_get(user, 'role', '')).label
    }

    const handleSubmit = () => {
        dispatch(updateProjectMember({ projectId, payload: { daoId: DAO._id, memberList: extraMembers } }));
    }

    const handleCloseProject = () => {
        dispatch(archiveProject({ projectId, daoUrl: daoURL }));
    }

    const handleDeleteProject = () => {
        dispatch(deleteProject({ projectId, daoUrl: daoURL }));
    }

    const toggleShowCreateTask = () => {
        setShowCreateTask(!showCreateTask);
    };

    const selectMilestone = (item, index) => {
        if (index === 0) {
            if (!item.complete) {
                let e = { ...item };
                e.pos = index;
                setSelectedMilestone(e);
                setShowAssign(true)
            }
        }
        else if (index > 0) {
            if (!item.complete && Project.milestones[index - 1].complete) {
                let e = { ...item };
                e.pos = index;
                setSelectedMilestone(e);
                setShowAssign(true)
            }
        }
    }

    const toggleShowEdit = () => {
        setShowEdit(!showEdit);
    }

    const amIMember = useMemo(() => {
        if (Project) {
            let user = _find(_get(Project, 'members', []), m => _get(m, 'wallet', '').toLowerCase() === account?.toLowerCase())
            if (user)
                return true
            return false
        }
        return false;
    }, [account, Project])

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
            <div className='projectDetails-container'>
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

                    {/* edit project side modal */}
                    {
                        showEdit &&
                        <ProjectEdit
                            toggleShowEdit={toggleShowEdit}
                            toggleDeletePrompt={(value) => setDeletePrompt(value)}
                            toggleClosePrompt={(value) => setClosePrompt(value)}
                            toggleWorkspaceInfo={(value) => setOpenWorkspaceInfo(value)}
                            toggleProjectMembers={(value) => setEditMember(value)}
                            toggleProjectMilestone={(value) => setOpenMilestone(value)}
                            toggleProjectKRA={(value) => setOpenKRA(value)}
                            toggleProjectResources={(value) => setOpenResource(value)}
                        />
                    }

                    {/* open workspace info modal */}
                    {
                        openWorkspaceInfo &&
                        <WorkspaceInfo
                            toggleWorkspaceInfo={() => setOpenWorkspaceInfo(false)}
                            projectId={projectId}
                            daoURL={daoURL}
                        />
                    }

                    {/* open milestone add & edit */}
                    {
                        openMilestone &&
                        <ProjectMilestone
                            list={_get(Project, 'milestones', [])}
                            toggleShowMilestone={() => setOpenMilestone(false)}
                            editMilestones={true}
                        />
                    }

                    {/* open kra add & edit */}
                    {
                        openKRA &&
                        <ProjectKRA
                            list={_get(Project, 'kra.results', [])}
                            freq={_get(Project, 'kra.frequency', '')}
                            toggleShowKRA={() => setOpenKRA(false)}
                            editKRA={true}
                        />
                    }

                    {/* open resources side modal */}
                    {
                        openResource &&
                        <ProjectResource
                            list={_get(Project, 'links', [])}
                            toggleShowResource={() => setOpenResource(false)}
                            editResources={true}
                        />
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
                            <ProjectMembers toggleEditMember={() => setEditMember(false)} />
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

                    {/* complete milestone and assign contributions side modal*/}
                    {showAssign && <AssignContributions toggleShowAssign={() => setShowAssign(false)} data={Project} selectedMilestone={selectedMilestone} daoURL={daoURL} />}

                    {/* Show KRA review side modal */}
                    {showKRAReview && <KRAReview toggleShowKRA={() => setShowKRAReview(false)} data={Project} daoURL={daoURL} />}

                    <div className="home-btn" onClick={() => navigate(-1)}>
                        <div className="invertedBox">
                            {
                                _get(DAO, 'image', null)
                                    ?
                                    <img src={_get(DAO, 'image', null)} />
                                    :
                                    <div className="navbarText">
                                        {daoName.length === 1
                                            ? daoName[0].charAt(0)
                                            : daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="projectDetails-top">
                        <div className="projectDetails-name">
                            <div className="left" onClick={() => navigate(-1)}>
                                <IoIosArrowBack size={20} color="#C94B32" />
                            </div>
                            <div className="right">
                                <div>
                                    <h1>{Project?.name}</h1>
                                </div>
                                {
                                    canMyrole('project.edit') &&
                                    <button className='settings' onClick={() => { setShowEdit(true) }}>
                                        <img src={settingIcon} alt="settings-icon" />
                                    </button>
                                }
                                {/* {
                                    <div>
                                        {canMyrole('project.delete') && <button onClick={() => setDeletePrompt(true)}>
                                            <img src={deleteIcon} alt="hk-logo" />
                                        </button>}
                                        {canMyrole('project.archive') &&
                                            Project?.archivedAt === null
                                            ?
                                            <SafeButton
                                                height={40}
                                                width={180}
                                                titleColor="#C94B32"
                                                title={`CLOSE ${transformWorkspace().label.toUpperCase()}`}
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
                                } */}
                            </div>
                        </div>

                        {/* <div className="projectDetails-chatlinks">
                            <button className="other-btn">
                                <SiNotion color="#B12F15" size={20} style={{ marginRight: '5px' }} />
                                CHAT
                            </button>
                        </div> */}

                        <div className="projectDetails-description">
                            <h1>Description</h1>
                            <div>
                                <p dangerouslySetInnerHTML={{ __html: Project?.description }}></p>
                            </div>
                        </div>

                        {/* new Links */}
                        {canMyrole('project.links.view') && amIMember &&
                            _get(Project, 'links', []).length > 0 &&
                            <div className="projectDetails-links">
                                <div className="links-left">
                                    {
                                        _get(Project, 'links', []).map((item, index) => {
                                            return (
                                                <div
                                                    className={item.accessControl && _get(item, 'unlocked', []).map(a => a.toLowerCase()).indexOf(account.toLowerCase()) == -1 ? "link-div locked" : "link-div"}
                                                    onClick={() => {
                                                        if (!item.accessControl) {
                                                            window.open(item.link, '_blank')
                                                        }
                                                        else {
                                                            unlock(item)
                                                        }
                                                    }}
                                                >
                                                    {handleParseUrl(item.link, item.accessControl, _get(item, 'unlocked', []).map(a => a.toLowerCase()).indexOf(account.toLowerCase()) == -1)}
                                                    <p>{item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}</p>
                                                    {
                                                        item.accessControl &&
                                                        <div className="lock-circle">
                                                            {
                                                                unlockLoading === item.id
                                                                    ?
                                                                    <LeapFrog size={20} color="#FFF" />
                                                                    :
                                                                    <BiLock color="#FFF" />
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {
                                    canMyrole('project.link.add') &&
                                    <div className="links-right"><button onClick={toggleShowLink}><HiOutlinePlus size={20} color="#C94B32" /></button></div>
                                }
                            </div>
                        }

                        {/* project milestones & kra */}
                        {canMyrole('project.milestone.view') &&
                            (_get(Project, 'milestones', []).length > 0 || _get(Project, 'kra.results', []).length > 0)
                            ?
                            <>
                                <div className="milestone-div">
                                    <div className="milestone-kra">
                                        {
                                            _get(Project, 'milestones', []).length > 0 && _get(Project, 'kra.results', []).length > 0
                                                ?
                                                <>
                                                    <div onClick={() => setTab(1)}>
                                                        <h1 style={tab === 1 ? { opacity: '1' } : { opacity: '0.4' }}>Milestones</h1>
                                                    </div>
                                                    <div className="divider"></div>
                                                    <div onClick={() => setTab(2)}>
                                                        <h1 style={tab === 2 ? { opacity: '1' } : { opacity: '0.4' }}>Key results</h1>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    {
                                                        _get(Project, 'milestones', []).length > 0 && !_get(Project, 'kra.results', []).length > 0
                                                            ?
                                                            <div>
                                                                <h1 style={{ opacity: '1' }}>Milestones</h1>
                                                            </div>
                                                            :
                                                            <div>
                                                                <h1 style={{ opacity: '1' }}>Key results</h1>
                                                            </div>
                                                    }
                                                </>
                                        }
                                    </div>
                                    <div className="milestone-kra-status">
                                        {
                                            tab === 1
                                                ?
                                                <>
                                                    <div className="status">
                                                        <div style={{ width: '300px' }}>
                                                            <ProgressBar
                                                                percent={((_get(Project, 'milestones', []).filter((item) => item.complete === true).length) / (_get(Project, 'milestones', []).length)) * 100}
                                                                filledBackground="#188C7C"
                                                                unfilledBackground="#F0F0F0"
                                                                height="5px"
                                                            >
                                                                <Step transition="scale">
                                                                    {({ accomplished, index }) => (
                                                                        <div className={`indexedStep ${accomplished ? "accomplished" : ""}`}></div>
                                                                    )}
                                                                </Step>
                                                                {
                                                                    _get(Project, 'milestones', []).map((item, index) => {
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
                                                        {
                                                            _get(Project, 'milestones', []).length > 0
                                                                ?
                                                                <span className="percent-text">{(((_get(Project, 'milestones', []).filter((item) => item.complete === true).length) / (_get(Project, 'milestones', []).length)) * 100).toFixed(2)}%</span>
                                                                :
                                                                <span className="percent-text">0%</span>
                                                        }
                                                    </div>
                                                </>
                                                :
                                                <div className="status" style={{ justifyContent: 'space-between' }}>
                                                    <span>Review frequency : {_get(Project, 'kra.frequency', [])}</span>
                                                    <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                                        <button className='archive-btn' onClick={() => navigate(`/${daoURL}/project/${projectId}/archiveKra`)}>
                                                            <img src={archiveIcon} alt="archive-icon" />
                                                        </button>
                                                        {canMyrole('project.review') && <button className="review-btn" onClick={() => setShowKRAReview(true)}>
                                                            REVIEW
                                                        </button>}
                                                    </div>
                                                </div>
                                        }
                                    </div>
                                </div>

                                <div className="milestone-kra-body">
                                    {
                                        tab === 1
                                            ?
                                            <>
                                                {
                                                    _get(Project, 'milestones', []).map((item, index) => {
                                                        return (
                                                            <div className={item.complete ? "milestone-card done" : "milestone-card"}>
                                                                <div className="mile-div">
                                                                    <span>{index + 1}</span>
                                                                    <h1>{item.name}</h1>
                                                                </div>
                                                                <div className="mile-date">
                                                                    <h1>{item.deadline}</h1>
                                                                </div>
                                                                {canMyrole('project.milestone.update') &&
                                                                    <div className="check-circle" onClick={() => selectMilestone(item, index)}>
                                                                        <FiCheck size={20} />
                                                                    </div>
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </>
                                            :
                                            <>
                                                {
                                                    _get(Project, 'kra.results', []).map((item, index) => {
                                                        return (
                                                            <div className="milestone-card">
                                                                <div className="kra-div"><h1>{item.name}</h1></div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </>
                                    }
                                </div>
                            </>
                            :
                            null
                        }

                        {/* old code for links */}
                        <div className="projectDetails-imp">
                            {/* {
                                canMyrole('project.links.view') &&
                                <div className="links-section">
                                    <div className="links-header">
                                        <div>
                                            <h1>Links</h1>
                                        </div>
                                        {
                                            canMyrole('project.link.add') &&
                                            <>
                                                <div>
                                                    <button onClick={toggleShowLink}>
                                                        <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                                        LINK
                                                    </button>
                                                </div>
                                            </>
                                        }
                                    </div>
                                    {(lockedLinks.length > 0 || openLinks.length > 0) && <div className="links-body">
                                        {
                                            lockedLinks.length > 0 &&
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
                                                                        <p>{item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}</p>
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
                                        }
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
                                                            <p>{item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}</p>
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
                                    </div>}
                                </div>
                            } */}
                        </div>
                    </div>

                    {/* Tasks section */}
                    {canMyrole('project.task.view') && <div style={{ width: '80%' }}>
                        <Tasks toggleShowCreateTask={toggleShowCreateTask} onlyProjects={true} />
                    </div>}

                    {/* members section */}
                    {canMyrole('members.view') &&
                        <div className="projectDetails-body">
                            <div className="projectDetails-members">
                                <div className="members-header">
                                    <h1>Members</h1>
                                    <div>
                                        <div className="divider"></div>
                                        <div className="member-count">
                                            <img src={membersGroup} alt="membersGroup" />
                                            <p>{_uniqBy(Project?.members, '_id').length} members</p>
                                        </div>
                                        <div>
                                            {canMyrole('project.member.add') &&
                                                <button onClick={toggleMemberList}>
                                                    <HiOutlinePlus size={20} style={{ marginRight: '10px' }} />
                                                    MEMBER
                                                </button>}
                                        </div>
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
                                            _sortBy(_uniqBy(Project?.members, '_id'), m => _get(m, 'name', '').toLowerCase()).map((item, index) => (
                                                <div className="members-row" key={index}>
                                                    <div className="members-row-name">
                                                        <div>
                                                            <img src={memberIcon} alt="memberIcon" />
                                                            <p>{item.name}</p>
                                                        </div>
                                                        <span>{item.wallet.slice(0, 6) + "..." + item.wallet.slice(-4)}</span>
                                                    </div>
                                                    <div className="members-row-date">
                                                        <p>{moment.utc(item.joined).local().format('MM/DD/YYYY')} </p>
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
                    }
                </div>

                <div style={{ width: '80%' }}>
                    <Footer theme="dark" />
                </div>
            </div>
        </>
    )
}

export default ProjectDetails;