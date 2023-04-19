import { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce, uniqBy as _uniqBy, sortBy as _sortBy } from 'lodash';
import '../../styles/pages/CreateProject.css';
import AddMember from "./DashBoard/MemberCard/AddMember";
import createProjectSvg from '../../assets/svg/createProject.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import notionIcon from '../../assets/svg/Notion-logo.svg';
import { AiOutlineLock } from "react-icons/ai";
import { SiNotion } from "react-icons/si";
import { HiOutlinePlus } from "react-icons/hi";
import { DEFAULT_ROLES } from "constants/terminology";
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe, BsCheck2 } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { ProjectContext } from "context/ProjectContext";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { createProject } from 'state/dashboard/actions'
import { isValidUrl } from 'utils';
import { resetCreateProjectLoader, resetProject } from 'state/dashboard/reducer';
import useDCAuth from 'hooks/useDCAuth';
import usePopupWindow from 'hooks/usePopupWindow';
import axios from 'axios';
import { usePrevious } from 'hooks/usePrevious';
import useLocalStorage from "hooks/useLocalStorage";
import useServerData from "hooks/useServerData";
import useInterval from "hooks/useInterval";
import { guild } from "@guildxyz/sdk";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from 'utils'
import AddDiscordLink from 'components/AddDiscordLink';
import AddNotionLink from 'components/AddNotionLink';
import { nanoid } from '@reduxjs/toolkit';

import { Editor } from '@tinymce/tinymce-react';
import ProjectMilestone from './DashBoard/Project/ProjectMilestone';
import ProjectKRA from './DashBoard/Project/ProjectKRA';
import moment from 'moment';
import ProjectResource from './DashBoard/Project/ProjectResource';
import useTerminology from 'hooks/useTerminology';
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import Avatar from 'muiComponents/Avatar';

const CreateProject = () => {

    const { provider, account, chainId } = useWeb3React();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO, createProjectLoading } = useAppSelector((state) => state.dashboard);
    const { transformWorkspace, transformRole } = useTerminology(_get(DAO, 'terminologies'));
    const editorRef = useRef(null);

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [next, setNext] = useState(false);
    const [showAddMember, setShowAddMember] = useState(false);
    const [memberList, setMemberList] = useState(DAO?.members);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [resourceList, setResourceList] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const [success, setSuccess] = useState(false);
    const [newAddress, setNewAddress] = useState([]);

    const [toggle, setToggle] = useState(false);
    const [selectType, setSelectType] = useState('');

    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);

    const [openResource, setOpenResource] = useState(false);
    const [openMilestone, setOpenMilestone] = useState(false);
    const [openKRA, setOpenKRA] = useState(false);

    const [milestones, setMilestones] = useState([]);
    const [results, setResults] = useState([]);
    const [frequency, setFrequency] = useState('');

    const [compensation, setCompensation] = useState(null);

    const daoName = _get(DAO, 'name', '').split(" ");

    useEffect(() => {
        if (DAO)
            setMemberList(DAO.members)
    }, [DAO])

    useEffect(() => {
        dispatch(resetProject())
    }, [])

    useEffect(() => {
        if (createProjectLoading === false) {
            dispatch(resetCreateProjectLoader());
            setSuccess(true);
            setTimeout(() => {
                navigate(-1);
            }, 2000);
        }
    }, [createProjectLoading])

    useEffect(() => {
        const rolesArr = _get(DAO, 'terminologies.roles', DEFAULT_ROLES);
        const discordOb = _get(DAO, 'discord', {});
        let temp = [];
        if (rolesArr) {
            Object.keys(rolesArr).forEach(function (key, _index) {
                temp.push({
                    lastRole: _index === 3, title: key, value: rolesArr[key].label,
                    roleColor: _index == 0 ? '#92e1a8' :
                        _index == 1 ? '#89b3e5' :
                            _index == 2 ? '#e96447' : '#92e1a8'
                });
            });
        }
        if (discordOb) {
            Object.keys(discordOb).forEach(function (key, _index) {
                const discordChannel = discordOb[key];
                discordChannel.roles.forEach((item) => {
                    if (item.name !== '@everyone' && item.name !== 'LomadsTestBot' && item.name !== 'Lomads' && (temp.some((m) => m.title.toLowerCase() === item.id.toLowerCase()) === false)) {
                        temp.push({ title: item.id, value: item.name, roleColor: item?.roleColor });
                    }
                })
            });
        }
        setRoles(temp);
    }, [DAO])

    const all_roles = useMemo(() => {
        let roles = [];
        Object.keys(_get(DAO, 'discord', {})).map((server) => {
            const r = DAO.discord[server].roles
            roles = roles.concat(r);
        })
        return roles.filter(r => r.name !== "@everyone" && r.name !== 'Lomads' && r.name !== 'LomadsTestBot');
    }, [DAO.discord])

    useEffect(() => {
        const memberList = DAO?.members;
        if (memberList.length > 0 && selectedMembers.length === 0) {
            for (let i = 0; i < memberList.length; i++) {
                if (memberList[i].member.wallet.toLowerCase() === account.toLowerCase()) {
                    let memberOb = {};
                    memberOb.name = memberList[i].member.name;
                    memberOb.address = memberList[i].member.wallet;
                    setSelectedMembers([...selectedMembers, memberOb]);
                }
            }
        }
    }, [DAO]);

    // useEffect(() => {
    //     let accessControlElement = document.getElementById('accessControl');
    //     if (link && link.length > 8 && accessControlElement) {
    //         try {
    //             const url = new URL(link);
    //             if (url.hostname.indexOf('discord.') > -1 || url.hostname.indexOf('notion.') > -1 )
    //                 accessControlElement.disabled = false;
    //             else
    //                 accessControlElement.disabled = true;
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }
    //     if((!link || (link && link.length <=8)) && accessControlElement) {
    //         accessControlElement.disabled = false;
    //     }
    // }, [link]);

    useEffect(() => {
        console.log("new address : ", newAddress);
        if (newAddress.length > 0) {
            newAddress.map((value) => {
                const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === value.toLowerCase());
                let memberOb = {};
                memberOb.name = user.member.name;
                memberOb.address = user.member.wallet;
                setSelectedMembers((oldValue) => [...oldValue, memberOb]);
            })
        }
    }, [DAO]);

    const handleNext = () => {
        if (name !== '' && desc !== '') {
            setNext(true);
        }
    }

    const toggleShowMember = () => {
        setShowAddMember(!showAddMember);
    };

    const handleParseUrl = (url) => {
        try {
            const link = new URL(url);
            if (link.hostname.indexOf('notion.') > -1) {
                return <SiNotion color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('discord.') > -1) {
                return <BsDiscord color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('github.') > -1) {
                return <BsGithub color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('google.') > -1) {
                return <BsGoogle color='#76808D' size={20} />
            }
            else if (link.hostname.indexOf('twitter.') > -1) {
                return <BsTwitter color='#76808D' size={20} />
            }
            else {
                return <span><BsGlobe color="#76808D" size={20} /></span>
            }
        }
        catch (e) {
            console.error(e);
        }
    }

    const handleAddMember = (member) => {
        const memberExists = _find(selectedMembers, m => m.address.toLowerCase() === member.wallet.toLowerCase())
        if (memberExists)
            setSelectedMembers(prev => prev.filter((item) => item.address.toLowerCase() !== member.wallet.toLowerCase()));
        else {
            let memberOb = {};
            memberOb.name = member.name;
            memberOb.address = member.wallet;
            setSelectedMembers(prev => [...prev, memberOb]);
        }
    }

    const handleAddRoles = (role) => {
        const roleExists = _find(selectedRoles, m => m.toLowerCase() === role.toLowerCase())
        if (roleExists)
            setSelectedRoles(prev => prev.filter((item) => item.toLowerCase() !== role.toLowerCase()));
        else {
            setSelectedRoles([...selectedRoles, role]);
        }
    }

    const handleRemoveMember = (position) => {
        setSelectedMembers(selectedMembers.filter((_, index) => index !== position));
    }

    const handleCreateProject = () => {
        console.log("selectedRoles : ", selectedRoles);
        let project = {};
        project.name = name;
        project.description = desc;
        project.links = resourceList;
        project.milestones = milestones;
        project.compensation = compensation;
        project.kra = {
            frequency,
            results
        };
        project.daoId = DAO?._id;

        if (!toggle) {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                arr.push({ name: user.member.name, address: user.member.wallet })
            }
            project.members = arr;
            project.validRoles = [];
            project.inviteType = 'Open';
        }

        if (toggle && selectType === 'Invitation') {
            project.members = _uniqBy(selectedMembers, m => m.address);
            project.validRoles = [];
            project.inviteType = 'Invitation';
        }

        if (toggle && selectType === 'Roles') {
            let arr = [];
            for (let i = 0; i < DAO.members.length; i++) {
                let user = DAO.members[i];
                if (user.discordRoles) {
                    let myDiscordRoles = []
                    Object.keys(user.discordRoles).forEach(function (key, index) {
                        myDiscordRoles = [...myDiscordRoles, ...user.discordRoles[key]]
                    })
                    let index = selectedRoles.findIndex(item => item.toLowerCase() === user.role.toLowerCase() || myDiscordRoles.indexOf(item) > -1);

                    if (index > -1) {
                        arr.push({ name: user.member.name, address: user.member.wallet })
                    }
                }
                else {
                    if (selectedRoles.includes(user.role)) {
                        arr.push({ name: user.member.name, address: user.member.wallet })
                    }
                }
            }
            project.members = _uniqBy(arr, m => m.address);
            project.validRoles = selectedRoles;
            project.inviteType = 'Roles'
        }

        dispatch(createProject({ payload: project }));
    }

    return (
        <>

            <div className="createProject-container">
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
                {showAddMember &&
                    <AddMember
                        toggleShowMember={toggleShowMember}
                        addToList={(addressArr) => setNewAddress(addressArr)}
                    />
                }

                {/* open project resource modal */}
                {
                    openResource
                    &&
                    <ProjectResource
                        list={resourceList}
                        toggleShowResource={() => setOpenResource(false)}
                        getResources={(value) => setResourceList(value)}
                        editResources={false}
                    />
                }
                {/* open milestone modal */}
                {
                    openMilestone
                    &&
                    <ProjectMilestone
                        list={milestones}
                        getCompensation={(value) => setCompensation(value)}
                        toggleShowMilestone={() => setOpenMilestone(false)}
                        getMilestones={(value) => setMilestones(value)}
                        editMilestones={false}
                    />
                }
                {/* open key result modal*/}
                {
                    openKRA
                    &&
                    <ProjectKRA
                        list={results}
                        freq={frequency}
                        toggleShowKRA={() => setOpenKRA(false)}
                        getResults={(value1, value2) => { setResults(value1); setFrequency(value2) }}
                        editKRA={false}
                    />
                }
                {
                    success
                        ?
                        <div className='createProject-success'>
                            <img src={createProjectSvg} alt="frame-icon" />
                            <p className="heading-text">Success!</p>
                            <span style={{ textAlign: 'center', fontStyle: 'italic', color: ' #76808D' }}>The new project is created. <br /> You will be redirected in a few seconds.</span>
                        </div>
                        :
                        <>
                            {
                                showMore
                                    ?
                                    <div className='createProject-body'>
                                        <img src={createProjectSvg} alt="frame-icon" />
                                        <p className="heading-text">{transformWorkspace().label} details</p>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <h1>{transformWorkspace().label} resources</h1>
                                                    {
                                                        resourceList.length > 0
                                                            ?
                                                            <img src={editToken} alt="hk-logo" onClick={() => setOpenResource(true)} style={{ cursor: 'pointer' }} />
                                                            :
                                                            <button onClick={() => setOpenResource(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                    }

                                                </div>
                                                <span style={{ marginBottom: '20px' }}>Add links for your team to access </span>
                                                {
                                                    resourceList && resourceList.map((item, index) => {
                                                        return (
                                                            <div className="link-li" key={index}>
                                                                <div className="link-icon-name">
                                                                    {handleParseUrl(item.link)}
                                                                    <span style={{ marginLeft: '5px' }}>{item.title.length > 20 ? item.title.slice(0, 20) + "..." : item.title}</span>
                                                                </div>
                                                                <div className="link-address">
                                                                    <span>{item.link.length > 20 ? item.link.slice(0, 20) + "..." : item.link}</span>
                                                                    {item.accessControl && <AiOutlineLock color='#C94B32' />}
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                        <div className="divider"></div>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <h1>Milestones</h1>
                                                    {
                                                        milestones.length > 0
                                                            ?
                                                            <img src={editToken} alt="hk-logo" onClick={() => setOpenMilestone(true)} style={{ cursor: 'pointer' }} />
                                                            :
                                                            <button onClick={() => setOpenMilestone(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                    }
                                                </div>

                                                <span style={{ marginBottom: '20px' }}>Organise and link payments to milestones</span>

                                                {
                                                    milestones && milestones.map((item, index) => {
                                                        return (
                                                            <div className="milestone-card">
                                                                <div>
                                                                    <span>{index + 1}</span>
                                                                    <h1>{item.name}</h1>
                                                                </div>
                                                                <div>
                                                                    <h1>{moment(item.deadline).format('L')}</h1>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }

                                            </div>

                                        </div>

                                        <div className="divider"></div>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <h1>Key results</h1>
                                                    {
                                                        results.length > 0
                                                            ?
                                                            <img src={editToken} alt="hk-logo" onClick={() => setOpenKRA(true)} style={{ cursor: 'pointer' }} />
                                                            :
                                                            <button onClick={() => setOpenKRA(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                    }
                                                </div>

                                                <span style={{ marginBottom: '20px' }}>Set objective for your team </span>

                                                {
                                                    results && results.map((item, index) => {
                                                        return (
                                                            <div className="milestone-card">
                                                                <div>
                                                                    <h1>{item.name}</h1>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>

                                        </div>

                                        <div className='project-buttons'>
                                            <SimpleLoadButton
                                                title={`CREATE ${transformWorkspace().label.toUpperCase()}`}
                                                height={50}
                                                width={225}
                                                fontsize={16}
                                                fontweight={400}
                                                onClick={() => handleCreateProject()}
                                                bgColor={"#C94B32"}
                                                condition={createProjectLoading}
                                            />

                                        </div>

                                    </div>
                                    :
                                    <div className='createProject-body' style={{ height: '90vh' }}>
                                        <img src={createProjectSvg} alt="frame-icon" />
                                        <p className="heading-text">Create New {transformWorkspace().label}</p>
                                        {
                                            !next
                                                ?
                                                <div className='createProject-form-container'>
                                                    <div className='input-div'>
                                                        <label>Name of the {transformWorkspace().label}</label>
                                                        <input
                                                            className="text-input"
                                                            placeholder={`Enter ${transformWorkspace().label} name`}
                                                            value={name}
                                                            name="name"
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className='input-div'>
                                                        <label>Short description</label>
                                                        <Editor
                                                            apiKey='p0turvzgbtf8rr24txekw7sgjye6xunw2near38hwoohdg13'
                                                            onInit={(evt, editor) => editorRef.current = editor}
                                                            init={{
                                                                height: 150,
                                                                menubar: false,
                                                                statusbar: false,
                                                                toolbar: false,
                                                                branding: false,
                                                                body_class: "mceBlackBody",
                                                                default_link_target: "_blank",
                                                                extended_valid_elements: "a[href|target=_blank]",
                                                                link_assume_external_targets: true,
                                                                plugins: [
                                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                                                ],
                                                                // toolbar: 'undo redo | blocks | ' +
                                                                //     'bold italic forecolor | alignleft aligncenter ' +
                                                                //     'alignright alignjustify | bullist numlist outdent indent | ' +
                                                                //     'removeformat | help',
                                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                                                            }}
                                                            value={desc}
                                                            onEditorChange={(text) => { setDesc(text) }}
                                                        />
                                                    </div>
                                                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                                        <button
                                                            className='input-btn'
                                                            style={name !== '' && desc !== '' ? { background: '#C94B32' } : { background: 'rgba(27, 43, 65, 0.2)' }}
                                                            onClick={handleNext}
                                                        >
                                                            NEXT
                                                        </button>
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    {/* show invite members */}
                                                    <div className="projectName-container">
                                                        <div className="projectName-box">
                                                            <span className='project-name'>{name}</span>
                                                            <div dangerouslySetInnerHTML={{ __html: desc.length > 25 ? desc.substring(0, 25) + "..." : desc }}></div>
                                                        </div>
                                                        <div className="projectName-btn">
                                                            <button onClick={() => setNext(false)}>
                                                                <img src={editToken} alt="hk-logo" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="divider"></div>

                                                    {/* project members */}
                                                    <div className="toggle-box">
                                                        <label class="switch">
                                                            <input type="checkbox" onChange={() => setToggle(!toggle)} />
                                                            <span class="slider round"></span>
                                                        </label>
                                                        <span className="toggle-text">
                                                            {
                                                                toggle
                                                                    ?
                                                                    'FILTER BY'
                                                                    :
                                                                    'OPEN FOR ALL'
                                                            }
                                                        </span>
                                                    </div>
                                                    {
                                                        toggle &&
                                                        <div className="members-dropdown">
                                                            <select
                                                                name="project"
                                                                id="project"
                                                                className="tokenDropdown"
                                                                style={{ width: '100%', margin: '0' }}
                                                                value={selectType}
                                                                onChange={(e) => setSelectType(e.target.value)}
                                                            >
                                                                <option value="" selected disabled>Select</option>
                                                                <option value={"Invitation"}>Invitation</option>
                                                                <option value={"Roles"}>Roles</option>
                                                            </select>
                                                        </div>
                                                    }
                                                    {
                                                        toggle && selectType === 'Invitation'
                                                        &&
                                                        <div className='project-members'>
                                                            <div className='project-members-header'>
                                                                <p>Invite members</p>
                                                                <button onClick={toggleShowMember}>ADD NEW MEMBER</button>
                                                            </div>
                                                            <div className="member-list">
                                                                {
                                                                    _sortBy(memberList, m => _get(m, 'member.name', '').toLowerCase(), 'asc').map((item, index) => {
                                                                        if (item.member.wallet.toLowerCase() !== account.toLowerCase()) {
                                                                            return (
                                                                                <div className="member-li" key={index} onClick={() => handleAddMember(item.member)}>
                                                                                    <div className="member-img-name">
                                                                                        <Avatar name={item.member.name} wallet={item.member.wallet}/>
                                                                                        {/* <img src={memberIcon} alt="member-icon" />
                                                                                        <p>{item.member.name}</p> */}
                                                                                    </div>
                                                                                    <div className="member-address">
                                                                                        {/* <p>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</p> */}

                                                                                        <div className='checkbox' onClick={() => handleAddMember(item.member)}>
                                                                                            {
                                                                                                !(selectedMembers.some((m) => m.address.toLowerCase() === item.member.wallet.toLowerCase()) === false)
                                                                                                    ?
                                                                                                    <div className="active-box">
                                                                                                        <BsCheck2 color="#FFF" />
                                                                                                    </div>
                                                                                                    :
                                                                                                    <div className="inactive-box"></div>
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    }
                                                    {
                                                        toggle && selectType === 'Roles'
                                                        &&
                                                        <div className='project-members'>
                                                            <div className='project-members-header'>
                                                                <p>Organisation Roles</p>
                                                            </div>
                                                            <div className="member-list">
                                                                {
                                                                    Object.keys(_get(DAO, 'terminologies.roles', {})).map((key, index) => {
                                                                        return (
                                                                            <div className='roles-li'>
                                                                                <div
                                                                                    className='roles-pill'
                                                                                    style={index === 0 ? { background: 'rgba(146, 225, 168, 0.3)' } : index === 1 ? { background: 'rgba(137,179,229,0.3)' } : index === 2 ? { background: 'rgba(234,100,71,0.3)' } : { background: 'rgba(146, 225, 168, 0.3)' }}
                                                                                >
                                                                                    <div
                                                                                        className='roles-circle'
                                                                                        style={index === 0 ? { background: 'rgba(146, 225, 168, 1)' } : index === 1 ? { background: 'rgba(137,179,229,1)' } : index === 2 ? { background: 'rgba(234,100,71,1)' } : { background: 'rgba(146, 225, 168, 1)' }}
                                                                                    ></div>
                                                                                    <span>{_get(transformRole(key), 'label')}</span>
                                                                                </div>
                                                                                <div className='checkbox' onClick={() => handleAddRoles(key)}>
                                                                                    {
                                                                                        !(selectedRoles.some((m) => m.toLowerCase() === key.toLowerCase()) === false)
                                                                                            ?
                                                                                            <div className="active-box">
                                                                                                <BsCheck2 color="#FFF" />
                                                                                            </div>
                                                                                            :
                                                                                            <div className="inactive-box"></div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                                {/* {
                                                                    roles.map((item, index) => {
                                                                        return (
                                                                            <>
                                                                                <div className='roles-li' key={index}>
                                                                                    <div
                                                                                        className='roles-pill'
                                                                                        style={{ backgroundColor: `${_get(item, 'roleColor', '#99aab5')}50` }}
                                                                                    >
                                                                                        <div
                                                                                            className='roles-circle'
                                                                                            style={{ background: `${_get(item, 'roleColor', '#99aab5')}` }}
                                                                                        ></div>
                                                                                        <span>{item.value}</span>
                                                                                    </div>
                                                                                    <div className='checkbox' onClick={() => handleAddRoles(item.title)}>
                                                                                        {
                                                                                            !(selectedRoles.some((m) => m.toLowerCase() === item.title.toLowerCase()) === false)
                                                                                                ?
                                                                                                <div className="active-box">
                                                                                                    <BsCheck2 color="#FFF" />
                                                                                                </div>
                                                                                                :
                                                                                                <div className="inactive-box"></div>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                                {
                                                                                    item.lastRole && <div style={{ marginLeft: 30, marginTop: 10, marginBottom: 30, width: 230, backgroundColor: '#C94B32', height: 3 }}></div>
                                                                                }
                                                                            </>

                                                                        )
                                                                    })
                                                                } */}
                                                            </div>
                                                            {
                                                                all_roles && all_roles.length > 0
                                                                    ?
                                                                    <>
                                                                        <div className='project-members-header' style={{ marginTop: '1.5rem' }}>
                                                                            <p>Discord Roles</p>
                                                                        </div>
                                                                        <div className="member-list">
                                                                            {
                                                                                all_roles.map((discord_value, index) => {
                                                                                    return (
                                                                                        <div className='roles-li'>
                                                                                            <div
                                                                                                className='roles-pill'
                                                                                                style={{ background: `${_get(discord_value, 'roleColor', '#99aab5')}50` }}
                                                                                            >
                                                                                                <div
                                                                                                    className='roles-circle'
                                                                                                    style={{ background: _get(discord_value, 'roleColor', '#99aab5') }}
                                                                                                ></div>
                                                                                                <span>{discord_value.name}</span>
                                                                                            </div>
                                                                                            <div className='checkbox' onClick={() => handleAddRoles(discord_value.id)}>
                                                                                                {
                                                                                                    !(selectedRoles.some((m) => m.toLowerCase() === discord_value.id.toLowerCase()) === false)
                                                                                                        ?
                                                                                                        <div className="active-box">
                                                                                                            <BsCheck2 color="#FFF" />
                                                                                                        </div>
                                                                                                        :
                                                                                                        <div className="inactive-box"></div>
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    null
                                                            }
                                                        </div>
                                                    }

                                                    <div className='project-buttons'>
                                                        <button
                                                            style={{ marginRight: '35px', background: '#FFF', color: '#C94B32' }}
                                                            onClick={() => setShowMore(true)}
                                                        >
                                                            ADD MORE DETAIL
                                                        </button>
                                                        <SimpleLoadButton
                                                            title="CREATE WORKSPACE"
                                                            height={50}
                                                            width={225}
                                                            fontsize={16}
                                                            fontweight={400}
                                                            onClick={() => handleCreateProject()}
                                                            bgColor={"#C94B32"}
                                                            condition={createProjectLoading}
                                                        />
                                                        {/* <button
                                                            style={{ background: '#C94B32', color: '#FFF' }}
                                                            onClick={() => handleCreateProject()}
                                                        >
                                                            CREATE PROJECT
                                                        </button> */}
                                                    </div>
                                                </>
                                        }
                                    </div>
                            }
                        </>
                }
            </div>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                theme='dark'
                rtl={false} />
        </>

    )
}



export default CreateProject;