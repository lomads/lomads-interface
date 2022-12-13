import { useState, useEffect, useMemo, useRef } from 'react';
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import './ProjectResource.css';
import { CgClose } from 'react-icons/cg'
import createTaskSvg from '../../../../assets/svg/milestone.svg';

import SimpleInputField from "UIpack/SimpleInputField";
import { SiNotion } from "react-icons/si";
import { BsDiscord, BsGoogle, BsGithub, BsTwitter, BsGlobe } from "react-icons/bs";
import { AiOutlinePlus, AiFillQuestionCircle } from "react-icons/ai";

import { useAppSelector } from "state/hooks"

import { isValidUrl } from 'utils';

import AddDiscordLink from 'components/AddDiscordLink';
import AddNotionLink from 'components/AddNotionLink';

import { nanoid } from '@reduxjs/toolkit';

const ProjectResource = ({ toggleShowResource, getResources }) => {
    const { DAO } = useAppSelector((state) => state.dashboard);

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState(null);
    const [roleName, setRoleName] = useState(null);
    const [spaceDomain, setSpaceDomain] = useState(null);
    const [accessControl, setAccessControl] = useState(false);
    const [accessControlError, setAccessControlError] = useState(null);
    const [resourceList, setResourceList] = useState([]);

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
    }, [link]);

    useEffect(() => {
        if (link && link.indexOf('notion.') > -1 && _get(DAO, 'sbt.contactDetail', []).indexOf('email') === -1) {
            setAccessControlError('Notion gated access not possible (No email in SBT)')
        } else {
            setAccessControlError(null)
        }
    }, [link, DAO]);

    const accesscontrolDisabled = useMemo(() => {
        return (!link || (link && link.length <= 8) || (link.indexOf('discord.') == -1 && link.indexOf('notion.') == -1))
    }, [link])

    const linkHasDomain = useMemo(() => {
        try {
            if (link && link.indexOf('notion.') > -1)
                return (new URL(link).pathname).split('/').length > 2
            return false;
        } catch (e) {
            return false
        }
    }, [link])

    const LinkBtn = (props) => {
        if (link && link.indexOf('discord.') > -1)
            return <AddDiscordLink {...props} />
        if (link && link.indexOf('notion.') > -1)
            return <AddNotionLink {...props} />
    }

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
                    resource.guildId = status;
                setResourceList([...resourceList, resource]);
                setAccessControl(false);
                setTitle('');
                setLink('');
                setRoleName(null)
                setSpaceDomain(null)
            }
            else if (link.indexOf('notion.') > -1) {
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
                }
                else {
                    setLinkError(status.message || 'Something went wrong.')
                }
            }
            else {
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

    const handleSubmit = () => {
        console.log("resource list : ", resourceList);
        // getResources(resourceList);
        // toggleShowResource();
    }

    return (
        <div className="resourceOverlay">
            <div className="resourceContainer">
                <div className='resource-header'>
                    <button onClick={() => toggleShowResource()}>
                        <CgClose size={20} color="#C94B32" />
                    </button>
                </div>
                <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
                    <div className='resource-body'>
                        <img src={createTaskSvg} alt="frame-icon" />
                        <h1>Project Resources</h1>
                        <span>Add links for online ressources </span>

                        <div className='resource-inputRow' style={{ marginBottom: '0', width: '410px' }}>
                            <span>Add links</span>
                            <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ width: '145px', height: '70px' }}>
                                    <SimpleInputField
                                        className="inputField"
                                        id="nameInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Ex Portfolio"
                                        value={title}
                                        onchange={(e) => { setTitle(e.target.value); setTitleError(null); }}
                                    />
                                    <span style={{ fontSize: '13px', color: '#C84A32' }}>{titleError}</span>
                                </div>
                                <div style={{ width: '190px', height: '70px' }}>
                                    <SimpleInputField
                                        className="inputField"
                                        id="nameInput"
                                        height={50}
                                        width={'100%'}
                                        placeholder="Link"
                                        value={link}
                                        onchange={(e) => { setLink(e.target.value); setLinkError(null); }}
                                    />
                                    <span style={{ fontSize: '13px', color: '#C84A32' }}>{linkError}</span>
                                </div>
                                <div style={{ height: '70px' }}>
                                    {
                                        link && (link.indexOf('discord.') > -1 || link.indexOf('notion.') > -1) ?
                                            <LinkBtn
                                                spaceDomain={spaceDomain}
                                                onNotionCheckStatus={handleAddResource}
                                                onGuildCreateSuccess={handleAddResource}
                                                title={title}
                                                link={link}
                                                roleName={roleName}
                                                accessControl={accessControl}
                                            />
                                            :
                                            <button className='rsrc-btn'
                                                style={link !== '' && title !== '' ? { background: '#C84A32' } : null}
                                                onClick={() => handleAddResource()}
                                            >
                                                <AiOutlinePlus color="#FFF" size={25} />
                                            </button>
                                    }
                                </div>
                            </div>
                        </div>

                        {accessControl && link && link.indexOf('discord.') > -1 &&
                            <div style={{ width: '410px' }}>
                                <SimpleInputField
                                    type="text"
                                    placeholder="Role name"
                                    className="input2"
                                    height={50}
                                    width={'100%'}
                                    style={{ marginTop: 16 }}
                                    name="rolename"
                                    value={roleName}
                                    onchange={(e) => setRoleName(e.target.value)}
                                />
                            </div>
                        }

                        {accessControl && link && link.indexOf('notion.') > -1 && !linkHasDomain &&
                            <div style={{ width: '410px' }}>
                                <SimpleInputField
                                    type="text"
                                    placeholder="Notion Domain"
                                    className="input2"
                                    height={50}
                                    width={'100%'}
                                    style={{ marginTop: 16 }}
                                    name="spaceDomain"
                                    value={spaceDomain}
                                    onchange={(e) => setSpaceDomain(e.target.value)}
                                />
                            </div>
                        }

                        {
                            accessControl && link && link.indexOf('notion.') > -1 &&
                            <div style={{ fontSize: 14, fontStyle: 'italic', color: "rgba(118, 128, 141, 0.5)" }}>Invite <span style={{ color: "#76808D" }}>{process.env.REACT_APP_NOTION_ADMIN_EMAIL}</span> to be an Admin of your workspace</div>
                        }

                        {
                            DAO?.sbt &&
                            <div className='rsrc-access'>
                                {
                                    (link && link.indexOf('notion.') > -1 && _get(DAO, 'sbt.contactDetail', '').indexOf('email') > -1) ||
                                        (link && link.indexOf('discord.') > -1 && _get(DAO, 'sbt.contactDetail', '').indexOf('discord') > -1)
                                        ?
                                        <input
                                            id="accessControl"
                                            type="checkbox"
                                            checked={accessControl}
                                            value={accessControl}
                                            disabled={accessControlError || accesscontrolDisabled}
                                            onChange={e => setAccessControl(prev => !prev)}
                                        />
                                        :
                                        null
                                }
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <h1>ACCESS CONTROL</h1>
                                        <h1><AiFillQuestionCircle /></h1>
                                    </div>
                                    <span>Currently available for Notion and Discord only</span>
                                    {accessControlError && <div><span style={{ color: 'red' }}>{accessControlError}</span></div>}
                                </div>
                            </div>
                        }

                        {/* added resource list */}
                        {
                            resourceList.length > 0 &&
                            <div className='rsrc-list'>
                                {
                                    resourceList.map((item, index) => {
                                        return (
                                            <div className="link-li" key={index}>
                                                <div className="link-icon-name">
                                                    {handleParseUrl(item.link)}
                                                    <span style={{ marginLeft: '5px' }}>{item.title}</span>
                                                </div>
                                                <div className="link-address">
                                                    <span>{item.link.length > 30 ? item.link.slice(0, 30) + "..." : item.link}</span>
                                                </div>

                                                <button onClick={() => handleRemoveResource(index)}>X</button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>

                    <div className='resource-footer'>
                        <button onClick={() => toggleShowResource()}>
                            CANCEL
                        </button>
                        <button onClick={handleSubmit}>
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectResource;