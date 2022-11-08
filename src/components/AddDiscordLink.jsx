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

export default ({ title, desc, link, roleName, accessControl, okButton, onGuildCreateSuccess, ...props }) => {

    const { provider, account, chainId } = useWeb3React();
    const signerFunction = useCallback((signableMessage) => getSigner(provider, account).signMessage(signableMessage), [provider, account]);
    const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("guilds")

    const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } = usePopupWindow()
    const { onOpen: openAddLomadsBotPopup, windowInstance: activeAddLomadsBotPopup } = useLomadsBotPopupWindow()

    const { DAO, createProjectLoading } = useAppSelector((state) => state.dashboard);

    const [server, setServer] = useState(null);
    const [channels, setChannels] = useState(null);
    const [poll, setPoll] = useState(null);
    const [lomadsPoll, setLomadsPoll] = useState(null);
    const [addLinkLoading, setAddLinkLoading] = useState(null);
    const [hasClickedAuth, setHasClickedAuth] = useState(false)
    const [lomadsBotStatus, setLomadsBotStatus] = useState(false)
    const [guildxyz, setGuildXyz] = useState(null)

    const getDiscordServers = useCallback(async () => {
        console.log("getDiscordServers", authorization)
        return axios.get('https://discord.com/api/users/@me/guilds', { headers: { Authorization: authorization } })
        .then(res => res.data)
        .catch(e => {
            if(e.response.status === 401){
                console.log(e)
                setHasClickedAuth(true)
                onResetAuth()
                setTimeout(() => onOpen(), 1000) 
            }
            return null;
        })
    }, [authorization, onOpen])

    const prevAuth = usePrevious(authorization)
    console.log("prevAuth", prevAuth, authorization, hasClickedAuth)
    useEffect(() => {
        if(( (prevAuth == undefined && authorization) || ( prevAuth && authorization && prevAuth !== authorization ) ) && link && hasClickedAuth){
            handleAddResource() 
        }
    }, [prevAuth, authorization, hasClickedAuth])

    useInterval(async () => {
        axios.post(`https://api.guild.xyz/v1/discord/server/${poll}`)
        .then(res => setChannels(res.data.channels))
    }, poll ? 2000 : null)

    useInterval(async () => {
        const lbotStatus = await axiosHttp.post('utility/check-lomads-bot', { server: server.id }).then(res => res.data)
        setLomadsBotStatus(lbotStatus)
        // axios.post(`https://api.guild.xyz/v1/discord/server/${lomadsPoll}`)
        // .then(res => setChannels(res.data.channels))
    }, lomadsPoll ? 2000 : null)

    const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)
    const prevActiveAddLomadsBotPopup = usePrevious(activeAddLomadsBotPopup)
    const prevIsAuthenticating = usePrevious(isAuthenticating)

    useEffect(() => {
        if (!!prevActiveAddBotPopup && !activeAddBotPopup) {
       // onSelect(serverData.id)
            if(poll)
                setPoll(null)
        }
    }, [prevActiveAddBotPopup, activeAddBotPopup, poll])

    useEffect(() => {
        if (!!prevActiveAddLomadsBotPopup && !activeAddLomadsBotPopup) {
            if(lomadsPoll)
                setLomadsPoll(null)
        }
    }, [prevActiveAddLomadsBotPopup, activeAddLomadsBotPopup, lomadsPoll])

    useEffect(() => {
        if(prevIsAuthenticating && !isAuthenticating)
            setAddLinkLoading(null);
    }, [prevIsAuthenticating, isAuthenticating])

    useEffect(() => {
        if (channels?.length > 0 && activeAddBotPopup) {
            setPoll(null)
            activeAddBotPopup.close()
            onGuildBotAddedDelayed(server)
        }
    }, [channels, activeAddBotPopup])

    useEffect(() => {
        if (lomadsBotStatus == true && activeAddLomadsBotPopup) {
            setLomadsPoll(null)
            activeAddLomadsBotPopup.close()
            if(!guildxyz)
                createGuild();
            else
                finish(guildxyz.id)
            
        }
    }, [lomadsBotStatus, activeAddLomadsBotPopup, guildxyz])

    const finish = result => {
        console.log(result);
        setServer(null);
        setChannels(null);
        setPoll(null);
        setLomadsPoll(null);
        setAddLinkLoading(null);
        setHasClickedAuth(false)
        setLomadsBotStatus(false)
        setGuildXyz(null)
        onGuildCreateSuccess(result)
    }

    const createGuild = async () => {
        try{
            setAddLinkLoading(true)
            const url = new URL(link)
            let invId = url.pathname.split('/')[3]
            await guild.create(account, signerFunction, {
                name: title,
                description: desc,
                guildPlatforms: [                           
                    {
                        platformName: "DISCORD",
                        platformGuildId: server?.id || url.pathname.split('/')[2],
                        platformGuildData: {inviteChannel: invId}
                    },
                ],
                roles: [
                    {
                        name: roleName ? roleName : nanoid(8),
                        logic : "AND",
                        requirements: [{
                            type: "ERC721",
                            chain: chainId === SupportedChainId.POLYGON ? 'POLYGON': 'GOERLI',
                            address: _get(DAO, 'sbt.address', null),
                            data : {
                                minAmount: 1
                            }
                        }],
                        rolePlatforms: [
                            {
                                guildPlatformIndex: 0
                            },
                        ],
                    }
                ]})
                .then(async result => {
                    finish(result.id)
                })
                .catch(async e => {
                    console.log(e)
                    setAddLinkLoading(null);
                    if(_get(e, 'errors[0].msg').indexOf('create another guild for the same platform!') > -1){
                       // toast.error('Server is already token gated. Please choose another server');
                    //    await role.create(account, signerFunction, {
                    //      guildId
                    //    })
                    } else {
                        toast.error(_get(e, 'errors[0].msg'));
                    }
                })
    
            } catch (e){
                setAddLinkLoading(null);
                console.log(e)
            }
    }

    const onGuildBotAdded = async (serv, guild = undefined) => {
            const lbotStatus = await axiosHttp.post('utility/check-lomads-bot').then(res => res.data)
            if(!lbotStatus) {
                setLomadsPoll(serv.id)
                const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
                setTimeout(() => 
                    openAddLomadsBotPopup(`https://discord.com/api/oauth2/authorize?client_id=1036510041286639656&guild_id=${serv.id}&permissions=268782673&scope=bot%20applications.commands&redirect_uri=${redirectUri}`),
                    1000
                )
            } else {
                if(!guild)
                    createGuild()
                else
                    finish(guild.id)
            }
    }
    const onGuildBotAddedDelayed = useCallback(_debounce(onGuildBotAdded, 1000), [onGuildBotAdded, link, server])

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
                setHasClickedAuth(true)
                try {
                    setAddLinkLoading(true);
                    if(!authorization) 
                        return onOpen()
                    setHasClickedAuth(false)
                    const url = new URL(link)
                    const dcserverid = url.pathname.split('/')[2]
                    const dcServers = await getDiscordServers();
                    if(dcServers && dcServers.length) {
                        let validServer = _find(dcServers, s => s.id.toString() === dcserverid.toString() && s.owner)   
                        if(validServer){ 
                            const guildId = await axiosHttp.get(`project/discord-server-exists/${dcserverid}`).then(res => res.data);
                            if(guildId) {
                                const guild = await axios.get(`https://api.guild.xyz/v1/guild/${guildId}`).then(res => res.data)
                                if(guild) {
                                    const r = await role.create(
                                        account,
                                        signerFunction,
                                        {
                                            guildId,
                                            name: roleName ? roleName : nanoid(8),
                                            logic : "AND",
                                            requirements: [{
                                                type: "ERC721",
                                                chain: chainId === SupportedChainId.POLYGON ? 'POLYGON': 'GOERLI',
                                                address: _get(DAO, 'sbt.address', null),
                                                data : {
                                                    minAmount: 1
                                                }
                                            }],
                                            rolePlatforms: [
                                                {
                                                    guildPlatformId: _get(guild, 'guildPlatforms[0].id', '')
                                                },
                                            ],
                                        }
                                    )
                                    if(r) {
                                        setServer(validServer)
                                        setGuildXyz({ id: guildId })
                                        onGuildBotAddedDelayed(validServer, { id: guildId })
                                        // setServer(null)
                                        // setAddLinkLoading(null);
                                        // onGuildCreateSuccess(guildId)
                                    }
                                } else {
                                    setServer(validServer)
                                    // check if bot already added 
                                   const guildChannels = await axios.post(`https://api.guild.xyz/v1/discord/server/${validServer.id}`).then(res => res.data.channels);  
                                   if(guildChannels.length == 0){
                                       const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
                                       setPoll(dcserverid)
                                       openAddBotPopup(`https://discord.com/api/oauth2/authorize?client_id=868172385000509460&guild_id=${dcserverid}&permissions=268782673&scope=bot%20applications.commands&redirect_uri=${redirectUri}`)
                                   } else {
                                        onGuildBotAddedDelayed(validServer)
                                   }
                                }
                            } else {
                                setServer(validServer)
                                // check if bot already added 
                               const guildChannels = await axios.post(`https://api.guild.xyz/v1/discord/server/${validServer.id}`).then(res => res.data.channels);  
                               if(guildChannels.length == 0){
                                   const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
                                   setPoll(dcserverid)
                                   openAddBotPopup(`https://discord.com/api/oauth2/authorize?client_id=868172385000509460&guild_id=${dcserverid}&permissions=268782673&scope=bot%20applications.commands&redirect_uri=${redirectUri}`)
                               } else {
                                   onGuildBotAddedDelayed(validServer)
                               }
                            }
                        } else {
                            //setAddLinkLoading(null);
                            //toast.error("Invalid discord server");
                            setHasClickedAuth(true)
                            onResetAuth()
                            return setTimeout(() => onOpen(), 2000) 
                            // onResetAuth()
                            // setTimeout(() => onOpen(), 1000) 
                        }
                    } else {
                        setAddLinkLoading(null);
                        //toast.error("Invalid discord server");
                    }
                } catch (e) {
                    console.log(e)
                    setAddLinkLoading(null);
                }
            } else {
                onGuildCreateSuccess()
            }
        }
    }

    return (
        <>
            { 
                okButton ? 
                <SimpleLoadButton condition={addLinkLoading} disabled={addLinkLoading} title="OK" bgColor="#C94B32" className="button" fontsize={16} fontweight={400} height={40} width={129} onClick={() => handleAddResource()} /> : 
                <button
                    style={{ background: link !== '' && title !== '' && !addLinkLoading ? '#C84A32' : 'rgba(27, 43, 65, 0.2)', width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    disabled={link === '' || title === '' || addLinkLoading}
                    onClick={() => handleAddResource() }
                > 
                    <AiOutlinePlus color="#FFF" size={25} />
                </button>
            }
        </>

    )   
}