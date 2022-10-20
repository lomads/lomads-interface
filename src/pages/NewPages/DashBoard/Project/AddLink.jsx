import React, { useEffect, useState } from "react";
import _ from "lodash";
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

const AddLink = (props) => {
    const dispatch = useAppDispatch();
    const { addProjectLinksLoading } = useAppSelector((state) => state.dashboard);

    const [title, setTitle] = useState('');
    const [link, setLink] = useState("");
    // for link access control
    const [accessControl, setAccessControl] = useState(false);

    useEffect(() => {
        if (addProjectLinksLoading === false) {
            dispatch(resetAddProjectLinksLoader())
            setTitle("");
            setLink("");
            setAccessControl(false);
            props.toggleShowLink();
        }
    }, [addProjectLinksLoading])

    useEffect(() => {
        if (link.length > 8) {
            try {
                const url = new URL(link);
                if (url.hostname === 'discord.com' || url.hostname === 'discord.gg')
                    document.getElementById('accessControl').disabled = false;
                else
                    document.getElementById('accessControl').disabled = true;
            } catch (e) {
                console.log(e)
            }
        }
    }, [link]);

    const handleAddLink = (guildId = undefined) => {
        const resource = { id: nanoid(16), title, link, accessControl, ...(guildId ? { guildId } : {}) };
        dispatch(addProjectLinks({ projectId: props.projectId, daoUrl: props.daoUrl, payload: resource }))
    };

    return (
        <>
            <div id="AddNewMemberComponent">
                <div onClick={props.toggleModal} id="AddNewMemberOverlay"></div>
                <div id="AddNewMember">
                    <div>
                        <div className="inputTitle">Add Link :</div>
                    </div>
                    <div className="inputArea">
                        <div>
                            <SimpleInputField
                                className="inputField"
                                height={50}
                                width={144}
                                placeholder="Title"
                                value={title}
                                onchange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div>
                            <AddressInputField
                                className="inputField"
                                height={50}
                                width={251}
                                placeholder="Link"
                                value={link}
                                onchange={(e) => setLink(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='resource-footer'>
                        <input id="accessControl" type="checkbox" value={accessControl} onChange={() => setAccessControl(prev => !prev)} disabled={true} />
                        <div>
                            <p>ACCESS CONTROL</p>
                            <span>Currently available for discord only</span>
                        </div>
                    </div>
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
                                link && link.indexOf('discord.com') > -1 ? 
                                <AddDiscordLink onGuildCreateSuccess={handleAddLink} okButton title={title} link={link} accessControl={accessControl}/> : 
                                <SimpleButton title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddLink()} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddLink;
