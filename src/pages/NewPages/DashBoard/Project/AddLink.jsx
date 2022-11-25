import React, { useEffect, useState, useMemo } from "react";
import _, { get as _get } from "lodash";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../../../styles/Global.css";
import "../../../../styles/pages/InviteGang.css";
import AddressInputField from "UIpack/AddressInputField";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import OutlineButton from "UIpack/OutlineButton";
import { addProjectLinks } from 'state/dashboard/actions'
import { resetAddProjectLinksLoader } from 'state/dashboard/reducer';
import AddDiscordLink from "components/AddDiscordLink";
import { nanoid } from "@reduxjs/toolkit";
import AddNotionLink from 'components/AddNotionLink';
import { isValidUrl } from 'utils';

const AddLink = (props) => {
    const dispatch = useAppDispatch();
    const { DAO, addProjectLinksLoading } = useAppSelector((state) => state.dashboard);
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [link, setLink] = useState("");
    const [linkError, setLinkError] = useState(null);
    const [roleName, setRoleName] = useState(null);
    const [spaceDomain, setSpaceDomain] = useState(null);
    // for link access control
    const [accessControl, setAccessControl] = useState(false);
    const [accessControlError, setAccessControlError] = useState(null);

    const [addLoading, setAddLoading] = useState(null);

    useEffect(() => {
        if (addProjectLinksLoading === false) {
            dispatch(resetAddProjectLinksLoader())
            setTitle("");
            setLink("");
            setRoleName(null)
            setAccessControl(false);
            props.toggleShowLink();
        }
    }, [addProjectLinksLoading])

    useEffect(() => {
        try {
            if(link && link.length > 8 && link.indexOf('notion.') > -1) {
                let lnk = new URL(link).pathname;
                lnk = lnk.split('/')
                if(lnk && lnk.length > 2){
                    console.log("setSpaceDomain", lnk[1])
                    setSpaceDomain(lnk[1])
                }
            }
        } catch (e) {
            console.log(e)
        }
    }, [link])

    const accesscontrolDisabled = useMemo(() => {
        return (!link || (link && link.length <=8) || (link.indexOf('discord.') == -1 && link.indexOf('notion.') == -1))
    }, [link])

    useEffect(() => {
        if(link && link.indexOf('notion.') > -1 && _.get(DAO, 'sbt.contactDetail', []).indexOf('email') === -1){
            setAccessControlError('Email does not exist in SBT')
        } else {
            setAccessControlError(null)
        }
    }, [link, DAO])

    const linkHasDomain = useMemo(() => {
        try {
            if(link && link.indexOf('notion.') > -1)
                return (new URL(link).pathname).split('/').length > 2
            return false;
        }
        catch (e) {
            return false;
        }
    }, [link])

    const handleAddLink = (status = undefined) => {
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
        else {
            setAddLoading(true)
            let tempLink = link;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
            if(link.indexOf('discord.') > -1) {
                let platformId = undefined;
                if (status){
                    console.log(new URL(link).pathname.split('/')[2])
                    platformId = new URL(link).pathname.split('/')[2]
                }
                const resource = { id: nanoid(16), title, link: tempLink, provider: new URL(link).hostname, platformId, accessControl, ...(status ? { guildId: status } : {}) };
                console.log(resource)
                dispatch(addProjectLinks({ projectId: props.projectId, daoUrl: props.daoUrl, payload: resource }))
                setAddLoading(false)
            } else if(link.indexOf('notion.') > -1) {                
                if(status.status === true) {
                    let resource = {};
                    resource.id = nanoid(16);
                    resource.title = title;
                    resource.link = tempLink;
                    resource.provider = new URL(tempLink).hostname;
                    resource.spaceDomain = spaceDomain;
                    resource.accessControl = accessControl;
                    dispatch(addProjectLinks({ projectId: props.projectId, daoUrl: props.daoUrl, payload: resource }))
                    setAccessControl(false);
                    setTitle('');
                    setLink('');
                    setRoleName(null)
                    setSpaceDomain(null)
                    setAddLoading(false)
                } else {
                    setAddLoading(false)
                    setLinkError(status.message || 'Something went wrong')
                }
            } else {
                let resource = {};
                resource.id = nanoid(16);
                resource.title = title;
                resource.link = tempLink;
                resource.accessControl = false
                dispatch(addProjectLinks({ projectId: props.projectId, daoUrl: props.daoUrl, payload: resource }))
                setAccessControl(false);
                setTitle('');
                setLink('');
                setRoleName(null)
                setSpaceDomain(null)
                setAddLoading(false)
            }
        }
    };

    const LinkBtn = (props) => {
        if(link && link.indexOf('discord.') > -1)
            return <AddDiscordLink {...props} />
        if(link && link.indexOf('notion.') > -1)
            return <AddNotionLink {...props} />
    }

    return (
        <>
            <div id="AddNewMemberComponent">
                <div onClick={props.toggleModal} id="AddNewMemberOverlay"></div>
                <div id="AddNewMember">
                    <div>
                        <div className="inputTitle">Add Link</div>
                    </div>
                    <div className="inputArea">
                        <div style={{ marginRight: '10px', height: '70px' }}>
                            <SimpleInputField
                                className="inputField"
                                height={50}
                                width={144}
                                placeholder="Title"
                                value={title}
                                onchange={(e) => { setTitle(e.target.value); setTitleError(null) }}
                            />
                            <span style={{ fontSize: '13px', color: '#C84A32' }}>{titleError}</span>
                        </div>
                        <div style={{ height: '70px' }}>
                            <AddressInputField
                                className="inputField"
                                height={50}
                                width={251}
                                placeholder="Link"
                                value={link}
                                onchange={(e) => { setLink(e.target.value); setLinkError(null) }}
                            />
                            <span style={{ fontSize: '13px', color: '#C84A32' }}>{linkError}</span>
                        </div>
                    </div>
                    {accessControl && link && link.indexOf('discord.') > -1 ? <div className='resource-footer'>
                        <AddressInputField
                            className="inputField"
                            height={50}
                            width={251}
                            placeholder="Role name"
                            value={roleName}
                            onchange={(e) => setRoleName(e.target.value)}
                        />
                    </div> : null }
                    {accessControl && link && link.indexOf('notion.') > -1 && !linkHasDomain ? <div className='resource-footer'>
                        <AddressInputField
                            placeholder="Notion Domain"
                            height={50}
                            width={251}
                            className="inputField"
                            style={{ marginTop: 16 }}
                            name="spaceDomain"
                            value={spaceDomain}
                            onChange={(e) => setSpaceDomain(e.target.value)}
                        />
                    </div> : null}
                    {
                        accessControl && link && link.indexOf('notion.') > -1 &&
                        <div style={{ fontSize: 14, fontStyle:'italic', color: "rgba(118, 128, 141, 0.5)" }}>Invite <span style={{ color: "#76808D" }}>{ process.env.REACT_APP_NOTION_ADMIN_EMAIL }</span> to be an Admin of your workspace</div>
                    }
                    {
                        props?.sbt ?
                            <div className='resource-footer'>
                              { ( link && link.indexOf('notion.') > -1 && _get(props, 'sbt.contactDetail', '').indexOf('email') > -1) ||
                             ( link && link.indexOf('discord.') > -1 && _get(props, 'sbt.contactDetail', '').indexOf('discord') > -1) ?  <input id="accessControl" type="checkbox" disabled={accessControlError || accesscontrolDisabled} checked={accessControl} value={accessControl} onChange={() => setAccessControl(prev => !prev)} /> : null }
                                <div>
                                    <p>ACCESS CONTROL</p>
                                    <span>Currently available for discord & notion only</span>
                                    { accessControlError && <div><span style={{ color: 'red' }}>{ accessControlError }</span></div> }
                                </div>
                            </div>
                            :
                            null
                        }
                    <div id="addMemberButtonArea">
                        <div>
                            <OutlineButton
                                borderColor="#C94B32"
                                bgColor="#FFFFFF"
                                title="CANCEL"
                                className="button"
                                height={40}
                                width={129}
                                fontsize={16}
                                fontweight={400}
                                onClick={props.toggleShowLink}
                            />
                        </div>
                        <div>
                            {
                                link && (link.indexOf('discord.') > -1 || link.indexOf('notion.') > -1) ?
                                    <LinkBtn okButton spaceDomain={spaceDomain} onNotionCheckStatus={handleAddLink} onGuildCreateSuccess={handleAddLink} title={title} link={link} roleName={roleName} accessControl={accessControl} /> :
                                    <SimpleButton disabled={addLoading} title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddLink()} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddLink;
