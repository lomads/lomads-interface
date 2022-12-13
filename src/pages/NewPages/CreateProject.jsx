import { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import '../../styles/pages/CreateProject.css';
import AddMember from "./DashBoard/MemberCard/AddMember";
import createProjectSvg from '../../assets/svg/createProject.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import notionIcon from '../../assets/svg/Notion-logo.svg';
import { AiOutlinePlus } from "react-icons/ai";
import { SiNotion } from "react-icons/si";
import { HiOutlinePlus } from "react-icons/hi";
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { ProjectContext } from "context/ProjectContext";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { createProject } from 'state/dashboard/actions'
import { isValidUrl } from 'utils';
import { resetCreateProjectLoader } from 'state/dashboard/reducer';
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

const CreateProject = () => {

    const { provider, account, chainId } = useWeb3React();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO, createProjectLoading } = useAppSelector((state) => state.dashboard);

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

    const [openResource, setOpenResource] = useState(false);
    const [openMilestone, setOpenMilestone] = useState(false);
    const [openKRA, setOpenKRA] = useState(false);

    const [milestones, setMilestones] = useState([]);
    const [results, setResults] = useState([]);
    const [frequency, setFrequency] = useState('');

    const daoName = _get(DAO, 'name', '').split(" ");

    useEffect(() => {
        if (DAO)
            setMemberList(DAO.members)
    }, [DAO])

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
    }, []);

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
        // let found = false;
        // for (let i = 0; i < selectedMembers.length; i++) {
        //     if (selectedMembers[i].name === member.name) {
        //         found = true;
        //         break;
        //     }
        // }
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

    const handleRemoveMember = (position) => {
        setSelectedMembers(selectedMembers.filter((_, index) => index !== position));
    }

    const handleCreateProject = () => {
        let project = {};
        project.name = name;
        project.description = desc;
        project.members = selectedMembers;
        project.links = resourceList;
        project.milestones = milestones;
        project.kra = {
            frequency,
            results
        };
        project.daoId = DAO?._id;
        console.log(project)
        dispatch(createProject({ payload: project }))
    }

    return (
        <>

            <div className="createProject-container">
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
                        toggleShowResource={() => setOpenResource(false)}
                        getResources={(value) => setResourceList(value)}
                    />
                }
                {/* open milestone modal */}
                {
                    openMilestone
                    &&
                    <ProjectMilestone
                        toggleShowMilestone={() => setOpenMilestone(false)}
                        getMilestones={(value) => setMilestones(value)}
                    />
                }
                {/* open key result modal*/}
                {
                    openKRA
                    &&
                    <ProjectKRA
                        toggleShowKRA={() => setOpenKRA(false)}
                        getResults={(value1, value2) => { setResults(value1); setFrequency(value2) }}
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
                                        <p className="heading-text">Project details</p>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <p>Project resources</p>
                                                    <button onClick={() => setOpenResource(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                </div>
                                                <span style={{ marginBottom: '20px' }}>Add links for your team to access </span>
                                                {
                                                    resourceList && resourceList.map((item, index) => {
                                                        return (
                                                            <div className="link-li" key={index}>
                                                                <div className="link-icon-name">
                                                                    {handleParseUrl(item.link)}
                                                                    <span style={{ marginLeft: '5px' }}>{item.title}</span>
                                                                </div>
                                                                <div className="link-address">
                                                                    <span>{item.link.length > 30 ? item.link.slice(0, 30) + "..." : item.link}</span>
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
                                                    <p>Milestones</p>
                                                    <button onClick={() => setOpenMilestone(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
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
                                                    <p>Key results</p>
                                                    <button onClick={() => setOpenKRA(true)}><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
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
                                            <button
                                                style={{ background: '#C94B32', color: '#FFF' }}
                                                onClick={() => handleCreateProject()}
                                            >
                                                CREATE PROJECT
                                            </button>
                                        </div>

                                    </div>
                                    :
                                    <div className='createProject-body'>
                                        <img src={createProjectSvg} alt="frame-icon" />
                                        <p className="heading-text">Create New Project</p>
                                        {
                                            !next
                                                ?
                                                <div className='createProject-form-container'>
                                                    <div className='input-div'>
                                                        <label>Name of the project</label>
                                                        <input
                                                            className="text-input"
                                                            placeholder="Enter project name"
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
                                                            <p>{name}</p>
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
                                                    <div className='project-members'>
                                                        <div className='project-members-header'>
                                                            <p>Invite members</p>
                                                            <button onClick={toggleShowMember}>ADD NEW MEMBER</button>
                                                        </div>
                                                        <div className="member-list">
                                                            {
                                                                memberList.map((item, index) => {
                                                                    if (item.member.wallet.toLowerCase() !== account.toLowerCase()) {
                                                                        return (
                                                                            <div className="member-li" key={index}>
                                                                                <div className="member-img-name">
                                                                                    <img src={memberIcon} alt="member-icon" />
                                                                                    <p>{item.member.name}</p>
                                                                                </div>
                                                                                <div className="member-address">
                                                                                    <p>{item.member.wallet.slice(0, 6) + "..." + item.member.wallet.slice(-4)}</p>
                                                                                    {/* {
                                                                                    selectedMembers.some((m) => m.address.toLowerCase() === item.member.wallet.toLowerCase()) === false
                                                                                        ?
                                                                                        <input type="checkbox" onChange={() => handleAddMember(item.member)} />
                                                                                        :
                                                                                        <input type="checkbox" onChange={() => handleAddMember(item.member)} checked />
                                                                                } */}
                                                                                    <div className='checkbox'>
                                                                                        <input type="checkbox" onChange={(e) => alert("dfdf")} />
                                                                                        <span className='inner-check check'></span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className='project-buttons'>
                                                        <button
                                                            style={{ marginRight: '35px', background: '#FFF', color: '#C94B32' }}
                                                            onClick={() => setShowMore(true)}
                                                        >
                                                            ADD MORE DETAIL
                                                        </button>
                                                        <button
                                                            style={{ background: '#C94B32', color: '#FFF' }}
                                                            onClick={() => handleCreateProject()}
                                                        >
                                                            CREATE PROJECT
                                                        </button>
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