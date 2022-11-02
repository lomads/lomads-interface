import { useState, useContext, useEffect, useCallback } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import '../../styles/pages/CreateProject.css';
import AddMember from "./DashBoard/MemberCard/AddMember";
import createProjectSvg from '../../assets/svg/createProject.svg';
import editToken from '../../assets/svg/editToken.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import notionIcon from '../../assets/svg/Notion-logo.svg';
import { AiOutlinePlus } from "react-icons/ai";
import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsLink, BsTwitter, BsGlobe } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { ProjectContext } from "context/ProjectContext";
import { useNavigate } from "react-router-dom";
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
import { nanoid } from '@reduxjs/toolkit';

const CreateProject = () => {

    const { provider, account, chainId } = useWeb3React();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO, createProjectLoading } = useAppSelector((state) => state.dashboard);

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
    const [accessControl, setAccessControl] = useState(false);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [newAddress, setNewAddress] = useState([]);

    const daoName = _get(DAO, 'name', '').split(" ");

    useEffect(() => { 
        if(DAO)
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

    useEffect(() => {
        let accessControlElement = document.getElementById('accessControl');
        if (link.length > 8 && accessControlElement) {
            try {
                const url = new URL(link);
                if (url.hostname === 'discord.com' || url.hostname === 'discord.gg')
                    accessControlElement.disabled = false;
                else
                    accessControlElement.disabled = true;
            } catch (e) {
                console.log(e)
            }
        }
    }, [link]);

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


    const handleAddResource = async (guildId = undefined) => {
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
            let resource = {};
            resource.id = nanoid(16);
            resource.title = title;
            resource.link = tempLink;
            let dcserverid = undefined;
            if (guildId)
                dcserverid = new URL(tempLink).pathname.split('/')[2]
            resource.platformId = dcserverid;
            resource.accessControl = accessControl;
            if (guildId)
                resource.guildId = guildId;
            setResourceList([...resourceList, resource]);
            setTitle('');
            setLink('');
            setRoleName(null)
            setAccessControl(false);
        }
    }

    const handleRemoveResource = (position) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

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
                                            <textarea
                                                className='text-area'
                                                rows="4"
                                                cols="50"
                                                placeholder='Enter short description'
                                                name='desc'
                                                value={desc}
                                                onChange={(e) => setDesc(e.target.value)}
                                            ></textarea>
                                        </div>
                                        <button
                                            style={name !== '' && desc !== '' ? { background: '#C94B32' } : { background: 'rgba(27, 43, 65, 0.2)' }}
                                            onClick={handleNext}
                                        >NEXT</button>
                                    </div>
                                    :
                                    <>
                                        {/* show invite members */}
                                        <div className="projectName-container">
                                            <div className="projectName-box">
                                                <p>{name}</p>
                                                <span>{desc.length > 25 ? desc.substring(0, 25) + "..." : desc}</span>
                                            </div>
                                            <div className="projectName-btn">
                                                <button onClick={() => setNext(false)}>
                                                    <img src={editToken} alt="hk-logo" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="divider"></div>
                                        {/* If add more details button is not clicked then show add members else show list of already added members*/}
                                        {
                                            !showMore
                                                ?
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
                                                                                {
                                                                                    selectedMembers.some((m) => m.address.toLowerCase() === item.member.wallet.toLowerCase()) === false
                                                                                        ?
                                                                                        <input type="checkbox" onChange={() => handleAddMember(item.member)} />
                                                                                        :
                                                                                        <input type="checkbox" onChange={() => handleAddMember(item.member)} checked />
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <div className='project-members2'>
                                                        <p>Project members</p>
                                                        <button onClick={() => setShowMore(false)}>
                                                            <img src={editToken} alt="hk-logo" />
                                                        </button>
                                                    </div>
                                                    {
                                                        selectedMembers.length > 0
                                                            ?
                                                            <div className='transparent-list' style={{ width: '420px' }}>
                                                                {
                                                                    selectedMembers.map((item, index) => {
                                                                        if (item.address.toLowerCase() === account.toLowerCase()) {
                                                                            return (
                                                                                <div className="member-li" key={index}>
                                                                                    <div className="member-img-name">
                                                                                        <img src={memberIcon} alt="member-icon" />
                                                                                        <p>{item.name}</p>
                                                                                    </div>
                                                                                    <div className="member-address">
                                                                                        <p>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</p>
                                                                                        {/* <button onClick={() => handleRemoveMember(index)}>X</button> */}
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }
                                                                        else {
                                                                            return (
                                                                                <div className="member-li" key={index}>
                                                                                    <div className="member-img-name">
                                                                                        <img src={memberIcon} alt="member-icon" />
                                                                                        <p>{item.name}</p>
                                                                                    </div>
                                                                                    <div className="member-address">
                                                                                        <p>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</p>
                                                                                        <button onClick={() => handleRemoveMember(index)}>X</button>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        }

                                                                    })
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                </>
                                        }
                                        {/* If add more detail is clicked then show add resources section else show buttons */}
                                        {
                                            !showMore
                                                ?
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
                                                :
                                                null
                                        }


                                        {/* If add more detail is clicked then show section for adding project resources */}
                                        {
                                            showMore
                                                ?
                                                <>
                                                    <div className="divider"></div>
                                                    <div className="resource-container">
                                                        <div className="resource-header">
                                                            <h1>Add project resources</h1>
                                                            <div>
                                                                <p>Optional</p>
                                                            </div>
                                                        </div>
                                                        <div className="resource-body">
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Title"
                                                                    className="input1"
                                                                    name="title"
                                                                    value={title}
                                                                    onChange={(e) => { setTitle(e.target.value); setTitleError(null) }}
                                                                />
                                                                <span style={{ fontSize: '13px', color: '#C84A32' }}>{titleError}</span>
                                                            </div>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    placeholder="Link"
                                                                    className="input2"
                                                                    name="link"
                                                                    value={link}
                                                                    onChange={(e) => { setLink(e.target.value); setLinkError(null) }}
                                                                />
                                                                <span style={{ fontSize: '13px', color: '#C84A32' }}>{linkError}</span>
                                                            </div>
                                                            {
                                                                link && link.indexOf('discord.com') > -1
                                                                    ?
                                                                    <AddDiscordLink onGuildCreateSuccess={handleAddResource} title={title} link={link} roleName={roleName} accessControl={accessControl} />
                                                                    :
                                                                    <button
                                                                        style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                                                                        onClick={() => handleAddResource()}
                                                                    >
                                                                        <AiOutlinePlus color="#FFF" size={25} />
                                                                    </button>
                                                            }
                                                        </div>
                                                        {accessControl ? <div className='resource-body'>
                                                            <input
                                                                type="text"
                                                                placeholder="Role name"
                                                                className="input2"
                                                                style={{ marginTop: 16 }}
                                                                name="rolename"
                                                                value={roleName}
                                                                onChange={(e) => setRoleName(e.target.value)}
                                                            />
                                                        </div> : null}
                                                        {
                                                            DAO?.sbt
                                                                ?
                                                                <div className='resource-footer'>
                                                                    <input id="accessControl" type="checkbox" value={accessControl} disabled={true} onChange={e => setAccessControl(prev => !prev)} />
                                                                    <div>
                                                                        <p>ACCESS CONTROL</p>
                                                                        <span>Currently available for discord only</span>
                                                                    </div>
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                    {
                                                        resourceList.length > 0
                                                            ?
                                                            <div className='transparent-list' style={{ width: '500px' }}>
                                                                {
                                                                    resourceList.map((item, index) => {
                                                                        return (
                                                                            <div className="member-li" key={index}>
                                                                                <div className="member-img-name">
                                                                                    {handleParseUrl(item.link)}
                                                                                    <p style={{ marginLeft: '5px' }}>{item.title}</p>
                                                                                </div>
                                                                                <div className="member-address">
                                                                                    <p>{item.link.length > 30 ? item.link.slice(0, 30) + "..." : item.link}</p>
                                                                                    <button onClick={() => handleRemoveResource(index)}>X</button>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                            :
                                                            null
                                                    }
                                                    <button
                                                        className='create-project-button'
                                                        onClick={handleCreateProject}
                                                    >
                                                        CREATE PROJECT
                                                    </button>
                                                </>
                                                :
                                                null
                                        }

                                    </>
                            }
                        </div>
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