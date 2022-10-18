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
import { BsDiscord, BsGoogle, BsGithub, BsLink } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import { ProjectContext } from "context/ProjectContext";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "state/hooks";
import { createProject } from 'state/dashboard/actions'
import { isValidUrl } from 'utils';
import { resetCreateProjectLoading } from 'state/dashboard/reducer';
import useDCAuthWithCallback from 'hooks/useDCAuthWithCallback';
import usePopupWindow from 'hooks/usePopupWindow';
import axios from 'axios';
import { usePrevious } from 'hooks/usePrevious';
import useLocalStorage from "hooks/useLocalStorage";
import useServerData from "hooks/useServerData";
import useInterval from "hooks/useInterval";
import { guild } from "@guildxyz/sdk";
import { useWeb3React } from "@web3-react/core";
import { getSigner } from 'utils'

const CreateProject = () => {

    const { provider, account, chainId } = useWeb3React();
    const signerFunction = useCallback((signableMessage) => getSigner(provider, account).signMessage(signableMessage), [provider, account]);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { DAO, createProjectLoading } = useAppSelector((state) => state.dashboard);

    const { callbackWithDCAuth, isAuthenticating, authorization } = useDCAuthWithCallback("guilds", () => ``)
    const [auth, setAuth] = useLocalStorage(`dc_auth_guilds`, {})
    const [serverId, setServerId] = useState(null);
    const [channels, setChannels] = useState(null);
    const [poll, setPoll] = useState(null);
    console.log("21 DAO : ", DAO);
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
    const [accessControl, setAccessControl] = useState(false);
    const [title, setTitle] = useState('');

    // for link access control
    const [lock, setLock] = useState(false);

    useEffect(() => {
        setMemberList(DAO.members);
    }, [DAO])

    // useEffect(() => {
    //     if (createProjectLoading === false) {
    //         dispatch(resetCreateProjectLoading());
    //         setSuccess(true);
    //         setTimeout(() => {
    //             navigate('/dashboard')
    //         }, 2000);
    //     }
    // }, [createProjectLoading])

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
        if (link.length > 8) {
            const url = new URL(link);
            if (url.hostname === 'discord.com') {
                document.getElementById('accessControl').disabled = false;
            }
        }
    }, [link]);

    const handleNext = () => {
        if (name !== '' && desc !== '') {
            setNext(true);
        }
    }

    const toggleShowMember = () => {
        setShowAddMember(!showAddMember);
    };

    const handleParseUrl = (url) => {
        const link = new URL(url);
        if (link.hostname === 'notion.com') {
            return <span><SiNotion size={20} /></span>
        }
        else if (link.hostname === 'discord.com') {
            return <span><BsDiscord size={20} /></span>
        }
        else if (link.hostname === 'github.com') {
            return <span><BsGithub size={20} /></span>
        }
        else if (link.hostname === 'google.com') {
            return <span><BsGoogle size={20} /></span>
        }
        else {
            return <span><BsLink size={20} /></span>
        }
    }

    // const handleAddToMembersList = (member) => {
    //     let memberOb = {};
    //     memberOb.name = member.name;
    //     memberOb.wallet = member.address;
    //     setMemberList([...memberList, { member: memberOb }]);
    // }

    const handleAddMember = (member) => {
        console.log("member : ", member);
        let found = false;
        for (let i = 0; i < selectedMembers.length; i++) {
            if (selectedMembers[i].name === member.name) {
                found = true;
                break;
            }
        }
        if (found) {
            setSelectedMembers(selectedMembers.filter((item) => item.name !== member.name));
        }
        else {
            let memberOb = {};
            memberOb.name = member.name;
            memberOb.address = member.wallet;
            setSelectedMembers([...selectedMembers, memberOb]);
        }
    }

    const handleRemoveMember = (position) => {
        setSelectedMembers(selectedMembers.filter((_, index) => index !== position));
    }

    const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } =
    usePopupWindow()

    const getDiscordServers = async () => {
        return axios.get('https://discord.com/api/users/@me/guilds', { headers: { Authorization: authorization } })
        .then(res => res.data)
        .catch(e => {
            if(e.response.status === 401){
                console.log(e)
                setAuth({})
                return callbackWithDCAuth()
            }
            return null;
        })
    }

    const prevAuth = usePrevious(authorization)

    useEffect(() => {
        if(!prevAuth && authorization && link){
            handleAddResource()
        }
    }, [prevAuth, authorization])

    useInterval(async () => {
        axios.post(`https://api.guild.xyz/v1/discord/server/${poll}`)
        .then(res => setChannels(res.data.channels))
    }, poll ? 2000 : null)
    
    console.log('activeAddBotPopup', activeAddBotPopup)

    // const {
    //     data: { isAdmin, channels },
    //   } = useServerData(serverId, {
    //     refreshInterval: !!activeAddBotPopup ? 3000 : 0,
    //     refreshWhenHidden: true,
    //   })

    const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)

    useEffect(() => {
        if (!!prevActiveAddBotPopup && !activeAddBotPopup) {
       // onSelect(serverData.id)
        }
    }, [prevActiveAddBotPopup, activeAddBotPopup])

    useEffect(() => {
        if (channels?.length > 0 && activeAddBotPopup) {
            setPoll(null)
            activeAddBotPopup.close()
            onGuildBotAddedDelayed()
        }
    }, [channels, activeAddBotPopup])

    const onGuildBotAdded = useCallback(async () => {
        const url = new URL(link)
        const inviteId = url.pathname.replace('/', '');
        const inviteDetails = await axios.get(`https://discord.com/api/v8/invites/${inviteId}`).then(res => res.data)
        await guild.create(account, signerFunction, {
            name: _get(inviteDetails, 'guild.name', ''),
            description: "Guild create from API",
            guildPlatforms: [                           
                {
                    platformName: "DISCORD",
                    platformGuildId: serverId,
                    platformGuildData: {inviteChannel: inviteId}
                },
            ],
            roles: [
                {
                    imageUrl : "/guildLogos/46.svg",
                    logic: 'AND',
                    name: 'Member',
                    requirements: [
                        { type: 'FREE' }
                    ]
                    // name: "Member",
                    // logic : "AND",
                    // requirements: [{
                    //     type: "ERC20",
                    //     chain: "GOERLI",
                    //     address: _get(DAO, 'sbt.address', null),
                    //     data : {
                    //         minAmount: 1,
                    //         // "attribute" : {
                    //         //     "trait_type": "Access Level",
                    //         //     "value" : "advisor"
                    //         // }

                    //     }
                    // }]
                }
            ]})
            .then(e=> console.log("GUILD =>", e))
            .catch(e=> {
                let resource = {};
                resource.title = title;
                resource.link = link;
                resource.accessControl = accessControl;
                resource.guildId = 13496;
                setResourceList([...resourceList, resource]);
                setTitle('');
                setLink('');
                setAccessControl('');
            })
    }, [serverId, link])

    const onGuildBotAddedDelayed = useCallback(_debounce(onGuildBotAdded, 1000), [onGuildBotAdded])

    const handleAddResource = async () => {
        if (title === '') {
            return toast.error("Please enter title");
        }
        else if (link === '') {
            return toast.error("Please enter link");
        }
        else if (!isValidUrl(link)) {
            return toast.error("Please enter a valid link");
        }
        else {
            if(accessControl){
                if(!authorization) 
                    return callbackWithDCAuth()
                const url = new URL(link)
                const inviteId = url.pathname.replace('/', '');
                const inviteDetails = await axios.get(`https://discord.com/api/v8/invites/${inviteId}`).then(res => res.data).catch(e => null)
                if(!inviteDetails)
                    return toast.error("Invalid discord invite link");
                const dcserverid = _get(inviteDetails, 'guild.id', null)
                console.log('dcserverid', dcserverid)
                // const url = new URL(link)
                // const dcserverid = url.pathname.split('/')[2]
                const dcServers = await getDiscordServers();
                if(dcServers && dcServers.length) {
                    let validServer = _find(dcServers, s => s.id.toString() === dcserverid.toString() && s.owner)
                    const redirectUri =
                    typeof window !== "undefined" &&
                    `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
                    if(validServer){
                        setPoll(dcserverid)
                        setServerId(dcserverid)
                        openAddBotPopup(`https://discord.com/api/oauth2/authorize?client_id=${`868172385000509460`}&guild_id=${dcserverid}&permissions=2147483647&scope=bot%20applications.commands&redirect_uri=${encodeURIComponent(redirectUri)}`)
                    }
                }
            }
        }
    }

    const handleRemoveResource = (position) => {
        setResourceList(resourceList.filter((_, index) => index !== position));
    }

    const handleCreateProject = () => {
        // let project = {};
        // project.name = name;
        // project.description = desc;
        // project.members = selectedMembers;
        // project.links = resourceList;
        // project.daoId = DAO?._id;
        // dispatch(createProject({ payload: project }))
        // setSuccess(true);
        // setTimeout(() => {
        //     navigate(-1);
        // }, 2000);
        console.log("Selected Members : ", selectedMembers);
    }

    return (
        <>

            <div className="createProject-container">
                {showAddMember &&
                    <AddMember
                        toggleShowMember={toggleShowMember}
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
                                                                const ob = { name: item.member.name, address: item.member.wallet }
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
                                                                                    selectedMembers.indexOf(ob) === -1
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
                                                        onClick={handleCreateProject}
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
                                                            <input
                                                                type="text"
                                                                placeholder="Title"
                                                                className="input1"
                                                                name="title"
                                                                value={title}
                                                                onChange={(e) => setTitle(e.target.value)}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Link"
                                                                className="input2"
                                                                name="link"
                                                                value={link}
                                                                onChange={(e) => setLink(e.target.value)}
                                                            />
                                                            <button
                                                                style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                                                                onClick={handleAddResource}
                                                            >
                                                                <AiOutlinePlus color="#FFF" size={25} />
                                                            </button>
                                                        </div>
                                                        <div className='resource-footer'>
                                                            <input name="accessControl" type="checkbox" value={accessControl} disabled={true} onChange={e => setAccessControl(prev => !prev)} />
                                                            <div>
                                                                <p>ACCESS CONTROL</p>
                                                                <span>Currently available for discord only</span>
                                                            </div>
                                                        </div>
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
                                                                                    <p>{item.title}</p>
                                                                                </div>
                                                                                <div className="member-address">
                                                                                    <p>{item.link}</p>
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