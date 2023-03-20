import React, { useState, useEffect, useCallback, useImperativeHandle } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { useWeb3React } from "@web3-react/core";
import IconButton from "UIpack/IconButton";
import { getSigner } from 'utils'
import { isValidUrl } from 'utils';
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import useDCAuth from 'hooks/useDCAuth';
import { toast, ToastContainer } from "react-toastify";
import { AiOutlinePlus } from "react-icons/ai";
import usePopupWindow from 'hooks/usePopupWindow';
import useLomadsBotPopupWindow from 'hooks/useLomadsBotPopupWindow';
import axios from "axios";
import { LeapFrog } from "@uiball/loaders";
import { usePrevious } from 'hooks/usePrevious';
import useInterval from "hooks/useInterval";
import { guild, role } from "@guildxyz/sdk";
import { useAppSelector, useAppDispatch } from "state/hooks";
import axiosHttp from '../api';
import { nanoid } from "@reduxjs/toolkit";
import { SupportedChainId } from "constants/chains";
import useGithubAuth from "hooks/useGithubAuth";

export default ({ title, desc, link, roleName, accessControl, okButton, onGuildCreateSuccess, renderButton , onSuccess, validate = true, innerRef, ...props }) => {

    const { onOpen, onResetAuth, authorization, isAuthenticating } = useGithubAuth();
    const [addLinkLoading, setAddLinkLoading] = useState(null);
    const [hasClickedAuth, setHasClickedAuth] = useState(false)

    const prevAuth = usePrevious(authorization)

    useEffect(() => {
        console.log("auth : ", authorization);
        if (((prevAuth == undefined && authorization) || (prevAuth && authorization && prevAuth !== authorization)) && link && hasClickedAuth) {
            handleAddResource()
        }
    }, [prevAuth, authorization, hasClickedAuth])

    const prevIsAuthenticating = usePrevious(isAuthenticating)

    useEffect(() => {
        if (prevIsAuthenticating && !isAuthenticating)
            setAddLinkLoading(null);
    }, [prevIsAuthenticating, isAuthenticating])

    const handleAddResource = () => {
        if (validate) {
            if (title === '') {
                return toast.error("Please enter title");
            }
            else if (link === '') {
                return toast.error("Please enter link");
            }
            else if (!isValidUrl(link)) {
                return toast.error("Please enter a valid link");
            }
        }
        setHasClickedAuth(true)
        try {
            setAddLinkLoading(true);
            if (!authorization)
                return onOpen()
            setHasClickedAuth(false);
            console.log("authorization", authorization)
            onSuccess({ code: authorization })
        }
        catch (e) {
            console.log(e)
            setAddLinkLoading(null);
        }

    }

    if (renderButton && validate) {
        return (
            <div onClick={() => {
                if (!(link === '' || title === '' || addLinkLoading))
                    handleAddResource()
            }}>
                {addLinkLoading ?
                    <button
                        style={{ background: link !== '' && title !== '' && !addLinkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0)', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        disabled={link === '' || title === '' || addLinkLoading}
                    >
                        {addLinkLoading ? <LeapFrog size={20} color="#C84A32" /> : <AiOutlinePlus color="#FFF" size={25} />}
                    </button>
                    : renderButton}
            </div>
        )
    }


    if (renderButton && !validate) {
        return (
            <div onClick={() => handleAddResource()}>
                {renderButton}
            </div>
        )
    }

    return (
        <>
            {
                okButton ?
                    <SimpleLoadButton condition={addLinkLoading} disabled={addLinkLoading} title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddResource()} /> :
                    <>
                        {
                            <IconButton
                                className="addButton"
                                onClick={() => handleAddResource()}
                                Icon={addLinkLoading ? <LeapFrog size={20} color="#C84A32" /> : <AiOutlinePlus color="#FFF" size={25} />}
                                height={40}
                                width={40}
                                bgColor={'#C84A32'}
                            />
                            // <button
                            //     style={{ background: link !== '' && title !== '' && !addLinkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            //     disabled={link === '' || title === '' || addLinkLoading}
                            //     onClick={() => handleAddResource()}>
                            //     {addLinkLoading ? <LeapFrog size={20} color="#FFF" /> : <AiOutlinePlus color="#FFF" size={25} />}
                            // </button>
                        }
                    </>
            }
        </>

    )
}