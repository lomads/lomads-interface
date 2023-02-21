import React, { useState, useEffect, useCallback } from "react";
import { find as _find, get as _get, debounce as _debounce } from 'lodash';
import { useWeb3React } from "@web3-react/core";
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

const CLIENT_ID = "8472b2207a0e12684382";

export default ({ title, desc, link, roleName, accessControl, okButton, onGuildCreateSuccess, renderButton = undefined, ...props }) => {

    const { onOpen, onResetAuth, authorization, isAuthenticating } = useGithubAuth();

    const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } = usePopupWindow()

    const { DAO } = useAppSelector((state) => state.dashboard);

    const [server, setServer] = useState(null);
    const [channels, setChannels] = useState(null);
    const [poll, setPoll] = useState(null);
    const [addLinkLoading, setAddLinkLoading] = useState(null);
    const [hasClickedAuth, setHasClickedAuth] = useState(false)

    const prevAuth = usePrevious(authorization)

    useEffect(() => {
        if (((prevAuth == undefined && authorization) || (prevAuth && authorization && prevAuth !== authorization)) && link && hasClickedAuth) {
            handleAddResource()
        }
    }, [prevAuth, authorization, hasClickedAuth])

    const prevIsAuthenticating = usePrevious(isAuthenticating)

    useEffect(() => {
        if (prevIsAuthenticating && !isAuthenticating)
            setAddLinkLoading(null);
    }, [prevIsAuthenticating, isAuthenticating])

    const finish = result => {
        setChannels(null);
        setPoll(null);
        setHasClickedAuth(false)
        if (server) {
            axiosHttp.post(`discord/guild/${server.id}/sync-roles`, { daoId: _get(DAO, '_id') })
                .finally(() => {
                    setAddLinkLoading(null);
                    onGuildCreateSuccess(result)
                    setServer(null);
                })
        } else {
            setAddLinkLoading(null);
            onGuildCreateSuccess(result)
            setServer(null);
        }
    }

    const extractGitHubRepoPath = (url) => {
        if (!url) return null;
        const match = url.match(
            /^https?:\/\/(www\.)?github.com\/(?<owner>[\w.-]+)\/(?<name>[\w.-]+)/
        );
        if (!match || !(match.groups?.owner && match.groups?.name)) return null;
        return `${match.groups.owner}/${match.groups.name}`;
    }

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
            setHasClickedAuth(true)
            try {
                setAddLinkLoading(true);
                if (!authorization)
                    return onOpen()
                setHasClickedAuth(false);
                const repoInfo = extractGitHubRepoPath(link);

                const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/githubauth`
                openAddBotPopup(`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=repo%20user%20admin:repo_hook%20admin:org&redirect_uri=${redirectUri}`)
            }
            catch (e) {
                console.log(e)
                setAddLinkLoading(null);
            }
        }
    }

    if (renderButton) {
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

    return (
        <>
            {
                okButton ?
                    <SimpleLoadButton condition={addLinkLoading} disabled={addLinkLoading} title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddResource()} /> :
                    <>
                        {
                            <button
                                style={{ background: link !== '' && title !== '' && !addLinkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                disabled={link === '' || title === '' || addLinkLoading}
                                onClick={() => handleAddResource()}>
                                {addLinkLoading ? <LeapFrog size={20} color="#FFF" /> : <AiOutlinePlus color="#FFF" size={25} />}
                            </button>
                        }
                    </>
            }
        </>

    )
}