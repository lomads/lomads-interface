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
import { addDaoLinks } from 'state/dashboard/actions'
import { resetAddDaoLinksLoader } from 'state/dashboard/reducer';
import { isValidUrl } from 'utils';

const AddDaoLink = (props) => {
    const dispatch = useAppDispatch();
    const { addDaoLinksLoading } = useAppSelector((state) => state.dashboard);

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState(null);
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState(null);

    useEffect(() => {
        if (addDaoLinksLoading === false) {
            dispatch(resetAddDaoLinksLoader())
            setTitle("");
            setLink("");
            setLinkError(null);
            setTitleError(null);
            props.toggleShowLink();
        }
    }, [addDaoLinksLoading])


    const handleAddLink = () => {
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
        //     setLinkError("Please enter a valid link")
        //     return;
        // }
        else {
            let tempLink = link;
            if (tempLink.indexOf('https://') === -1 && tempLink.indexOf('http://') === -1) {
                tempLink = 'https://' + tempLink;
            }
            dispatch(addDaoLinks({ url: props.daoUrl, payload: { title, link: tempLink } }))
        }
    };

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
                            <SimpleButton
                                title="OK"
                                bgColor="#C94B32"
                                className="button"
                                fontsize={16}
                                fontweight={400}
                                height={40}
                                width={129}
                                onClick={() => handleAddLink()}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddDaoLink;
