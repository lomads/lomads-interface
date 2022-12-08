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
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState(null);
    const [roleName, setRoleName] = useState(null);
    const [spaceDomain, setSpaceDomain] = useState(null);
    const [accessControl, setAccessControl] = useState(false);
    const [accessControlError, setAccessControlError] = useState(null);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [newAddress, setNewAddress] = useState([]);

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
        try {
            if (link && link.length > 8 && link.indexOf('notion.') > -1) {
                let lnk = new URL(link).pathname;
                lnk = lnk.split('/')
                if (lnk && lnk.length > 2)
                    setSpaceDomain(lnk[1])
            }
        } catch (e) {
            console.log(e)
        }
    }, [link])

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

    useEffect(() => {
        if (link && link.indexOf('notion.') > -1 && _get(DAO, 'sbt.contactDetail', []).indexOf('email') === -1) {
            setAccessControlError('Notion gated access not possible (No email in SBT)')
        } else {
            setAccessControlError(null)
        }
    }, [link, DAO])

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

    const accesscontrolDisabled = useMemo(() => {
        return (!link || (link && link.length <= 8) || (link.indexOf('discord.') == -1 && link.indexOf('notion.') == -1))
    }, [link])

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
            console.log("lnk", link)
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


    const handleAddResource = async (status = undefined) => {
        if (title === '') {
            setTitleError('Please enter a title')
            return;
        }
        else if (link === '') {
            setLinkError("Please enter a link")
            return;
        }
        else if (!isValidUrl(link)) {
            setLinkError("Please enter a valid link")
            return;
        }
        // else if (!link.match(/^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/)) {
        //     return toast.error("Please enter a valid link");
        // }
        else {
            let tempLink = link;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
            if (link.indexOf('discord.') > -1) {
                let resource = {};
                resource.id = nanoid(16);
                resource.title = title;
                resource.link = tempLink;
                resource.provider = new URL(tempLink).hostname;
                let dcserverid = undefined;
                if (status)
                    dcserverid = new URL(tempLink).pathname.split('/')[2]
                resource.platformId = dcserverid;
                resource.accessControl = accessControl;
                if (status)
                    resource.roleId = status;
                setResourceList([...resourceList, resource]);
                setAccessControl(false);
                setTitle('');
                setLink('');
                setRoleName(null)
                setSpaceDomain(null)
            } else if (link.indexOf('notion.') > -1) {
                if (status.status) {
                    let resource = {};
                    resource.id = nanoid(16);
                    resource.title = title;
                    resource.link = tempLink;
                    resource.provider = new URL(tempLink).hostname;
                    resource.spaceDomain = spaceDomain;
                    resource.accessControl = accessControl;
                    setResourceList([...resourceList, resource]);
                    setAccessControl(false);
                    setTitle('');
                    setLink('');
                    setRoleName(null)
                    setSpaceDomain(null)
                } else {
                    setLinkError(status.message || 'Something went wrong.')
                }
            } else {
                let resource = {};
                resource.id = nanoid(16);
                resource.title = title;
                resource.link = tempLink;
                resource.accessControl = false
                setResourceList([...resourceList, resource]);
                setAccessControl(false);
                setTitle('');
                setLink('');
                setRoleName(null)
                setSpaceDomain(null)
            }
        }
    }

    const handleRemoveResource = (position) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

    const linkHasDomain = useMemo(() => {
        try {
            if (link && link.indexOf('notion.') > -1)
                return (new URL(link).pathname).split('/').length > 2
            return false;
        } catch (e) {
            return false
        }
    }, [link])

    const handleCreateProject = () => {
        let project = {};
        project.name = name;
        project.description = desc;
        project.members = selectedMembers;
        project.links = resourceList;
        project.daoId = DAO?._id;
        console.log(project)
        dispatch(createProject({ payload: project }))
    }

    const LinkBtn = (props) => {
        if (link && link.indexOf('discord.') > -1)
            return <AddDiscordLink {...props} />
        if (link && link.indexOf('notion.') > -1)
            return <AddNotionLink {...props} />
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
                                                    <p>Project ressources</p>
                                                    <button><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                </div>
                                                <span>Add links for your team to access </span>
                                            </div>

                                        </div>

                                        <div className="divider"></div>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <p>Milestones</p>
                                                    <button><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                </div>

                                                <span>Organise and link payments to milestones</span>
                                            </div>

                                        </div>

                                        <div className="divider"></div>

                                        <div className="projectName-container" style={{ width: '450px' }}>
                                            <div className="projectName-box" style={{ width: '100%' }}>
                                                <div className='name-btn'>
                                                    <p>Key results</p>
                                                    <button><HiOutlinePlus size={20} style={{ marginRight: '10px' }} /> ADD</button>
                                                </div>

                                                <span>Set objective for your team </span>
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