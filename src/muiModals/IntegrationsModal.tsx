import React, { useState, useEffect, useCallback } from 'react';
import { get as _get, find as _find, debounce as _debounce } from 'lodash'
import {
	Drawer,
	Box,
	Typography,
	Divider,
	Button,
	Card,
	CardContent,
	Radio
} from '@mui/material';
import { Image } from "@chakra-ui/react";
import IconButton from 'muiComponents/IconButton'
import CloseSVG from 'assets/svg/close-new.svg'
// import Integrations from "assets/svg/Integrations.svg"
import GreyIconHelp from "assets/svg/GreyIconHelp.svg"
import Integrationtrello from "assets/svg/Integrationtrello.svg"
import Integrationgithub from "assets/svg/Integrationgithub.svg"
import Integrationdiscord from "assets/svg/Integrationdiscord.svg"
import checkmark from "assets/svg/completeCheckmark.svg";
import downHandler from "assets/svg/downHandler.svg";
import rightArrow from "assets/svg/rightArrow.svg"
import palette from 'muiTheme/palette';
import { useAppSelector, useAppDispatch } from "state/hooks";
import { LeapFrog } from "@uiball/loaders";
import { makeStyles } from '@mui/styles';
import { syncTrelloData } from 'state/dashboard/actions';
import { resetSyncTrelloDataLoader } from "state/dashboard/reducer";
import axiosHttp from 'api';
import useDCAuth from 'hooks/useDCAuth';
import { usePrevious } from 'hooks/usePrevious';
import useInterval from "hooks/useInterval";
import usePopupWindow from 'hooks/usePopupWindow';
import axios from "axios";
import { setDAO } from 'state/dashboard/reducer';

const useStyles = makeStyles((theme: any) => ({
	card: {
		height: '60px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: '20px',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		padding: '0 15px'
	},
	cardDisabled: {
		background: 'rgba(24, 140, 124, 0.1)',
		height: '60px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: '20px',
		borderRadius: '5px',
		boxShadow: 'none',
		padding: '0 15px'
	},
	organizationCount: {
		fontFamily: 'Inter, sans-serif',
		opacity: 0.5
	}
}));

const integrationAccounts = [
	{
		icon: Integrationgithub,
		name: "GitHub"
	},
	{
		icon: Integrationdiscord,
		name: "Discord"
	},
	{
		icon: Integrationtrello,
		name: "Trello"
	}
];

export default ({ open, onClose, authorizeTrello, organizationData, isTrelloConnected, trelloLoading }:
	{ open: boolean, onClose: any, authorizeTrello: any, organizationData: any, isTrelloConnected: any, trelloLoading: any }) => {
	const classes = useStyles();
	const { DAO, user, syncTrelloDataLoading } = useAppSelector((state) => state.dashboard);
	const [selectedValue, setSelectedValue] = useState('');
	const [boardsLoading, setBoardsLoading] = useState(false)
	const [expandTrello, setExpandTrello] = useState(false)
	const [expandGitHub, setExpandGitHub] = useState(false)
	const [expandDiscord, setExpandDiscord] = useState(false)
	const dispatch = useAppDispatch()

	const { onOpen, onResetAuth, authorization, isAuthenticating } = useDCAuth("identify guilds");
	const { onOpen: openAddBotPopup, windowInstance: activeAddBotPopup } = usePopupWindow()
	const [hasClickedAuth, setHasClickedAuth] = useState(false);
	const [isDiscordConnected, setIsDiscordConnected] = useState(false);
	const [serverData, setServerData] = useState<any[]>([]);
	const [selectedServerId, setSelectedServerId] = useState('');
	const [server, setServer] = useState(null);
	const [poll, setPoll] = useState<any>();
	const [syncServerLoading, setSyncServerLoading] = useState<boolean>(false);
	const [channels, setChannels] = useState<any[]>([]);

	useEffect(() => {
		if (syncTrelloDataLoading === false) {
			dispatch(resetSyncTrelloDataLoader());
			setBoardsLoading(false);
		}
	}, [syncTrelloDataLoading]);

	const handleClick = (item: any) => {
		if (item.name === "Trello") {
			authorizeTrello()
			setExpandTrello(true)
		}
		else if (item.name === 'Discord') {
			handleConnectDiscord();
		}
	}

	const getDiscordServers = useCallback(async () => {
		console.log("getDiscordServers", authorization, typeof (authorization));
		return axios.get('https://discord.com/api/users/@me/guilds', { headers: { Authorization: authorization! } })
			.then(res => res.data)
			.catch(e => {
				if (e.response.status === 401) {
					console.log(e)
					setHasClickedAuth(true)
					onResetAuth()
					setTimeout(() => onOpen(), 1000)
				}
				return null;
			})
	}, [authorization, onOpen])

	const prevAuth = usePrevious(authorization)
	const prevActiveAddBotPopup = usePrevious(activeAddBotPopup)
	const prevIsAuthenticating = usePrevious(isAuthenticating)

	useEffect(() => {
		if (((prevAuth == undefined && authorization) || (prevAuth && authorization && prevAuth !== authorization)) && hasClickedAuth) {
			handleConnectDiscord();
		}
	}, [prevAuth, authorization, hasClickedAuth])

	useInterval(async () => {
		axiosHttp.get(`discord/guild/${poll}`)
			.then(res => setChannels(res.data.channels))
	}, poll ? 5000 : null)

	useEffect(() => {
		if (!!prevActiveAddBotPopup && !activeAddBotPopup) {
			// onSelect(serverData.id)
			if (poll)
				setPoll(null)
		}
	}, [prevActiveAddBotPopup, activeAddBotPopup, poll])


	useEffect(() => {
		if (prevIsAuthenticating && !isAuthenticating)
			setSyncServerLoading(false);
	}, [prevIsAuthenticating, isAuthenticating])

	useEffect(() => {
		if (channels?.length > 0 && activeAddBotPopup) {
			setPoll(null)
			activeAddBotPopup.close()
			onGuildBotAddedDelayed()
		}
	}, [channels, activeAddBotPopup])

	const finish = () => {
		setChannels([]);
		setPoll(null);
		setHasClickedAuth(false)
		if (server) {
			axiosHttp.post(`discord/guild/${selectedServerId}/sync-roles`, { daoId: _get(DAO, '_id') })
				.then((daoData) => {
					if (daoData.data) {
						dispatch(setDAO(daoData.data))
					}
				})
				.finally(() => {
					setSyncServerLoading(false);

					// onGuildCreateSuccess(result)
					setServer(null);
				})
		}
		else {
			setSyncServerLoading(false);
			// onGuildCreateSuccess(result)
			setServer(null);
		}
	}

	const onGuildBotAdded = async () => {
		finish()
	}

	const onGuildBotAddedDelayed = useCallback(_debounce(onGuildBotAdded, 1000), [onGuildBotAdded, server])

	const handleConnectDiscord = async () => {
		if (!authorization)
			return onOpen();
		const dcServers = await getDiscordServers();
		console.log("dc servers : ", dcServers);
		if (dcServers && dcServers.length) {
			setServerData(dcServers.filter((item: any) => item.owner));
			setIsDiscordConnected(true);
			setExpandDiscord(true);
		}
	}

	const handleSyncServer = async () => {
		setSyncServerLoading(true);
		let validServer = _find(serverData, s => s.id.toString() === selectedServerId.toString());
		const guildId = await axiosHttp.get(`project/discord-server-exists/${selectedServerId}`).then(res => res.data);
		if (guildId) {
			setServer(validServer)
			const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
			setPoll(selectedServerId)
			openAddBotPopup(`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_APP_ID}&guild_id=${selectedServerId}&permissions=8&scope=bot%20applications.commands&redirect_uri=${redirectUri}`)

		} else {
			setServer(validServer)
			// check if bot already added 
			const discordGuild = await axiosHttp.get(`discord/guild/${validServer.id}`).then(res => res.data).catch(e => null);
			console.log("discordGuild", discordGuild)
			if (!discordGuild) {
				const redirectUri = typeof window !== "undefined" && `${window.location.href.split("/").slice(0, 3).join("/")}/dcauth`
				setPoll(selectedServerId)
				openAddBotPopup(`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_APP_ID}&guild_id=${selectedServerId}&permissions=8&scope=bot%20applications.commands&redirect_uri=${redirectUri}`)
			}
			else {
				onGuildBotAddedDelayed();
			}
		}
	}

	const handleExpand = (item: any) => {
		if (item.name === "Trello") {
			setExpandTrello(!expandTrello)
			return
		}
		if (item.name === "Discord") {
			setExpandDiscord(!expandDiscord)
			return
		}
		setExpandGitHub(!expandGitHub)
	}

	const getAllBoards = () => {
		// check if webhook already exists
		const trelloOb = _get(DAO, 'trello', null);
		if (trelloOb) {
			console.log("trello Ob exists...");
			if (_get(DAO, `trello.${selectedValue}`, null)) {
				console.log("org exists");
				alert("This organisation has already been synced!");
				return;
			}
			else {
				console.log("org doesnt exists...call handleTrello");
				handleTrello(selectedValue);
			}
		}
		else {
			console.log("trello ob doesnt exists...call handleTrello");
			handleTrello(selectedValue);
		}
	}

	const handleTrello = (selectedValue: any) => {
		setBoardsLoading(true);
		var trelloToken = localStorage.getItem("trello_token");
		axiosHttp.get(`utility/get-trello-boards?orgId=${selectedValue}&accessToken=${trelloToken}`)
			.then((boards: any) => {
				if (boards.data.type === 'success') {
					console.log("Boards : ", boards.data.data);
					var trelloToken = localStorage.getItem("trello_token");
					dispatch(syncTrelloData({
						payload: {
							user: { id: _get(user, '_id', null), address: _get(user, 'wallet', null) },
							daoId: _get(DAO, '_id', null),
							boardsArray: boards.data.data,
							accessToken: trelloToken,
							idModel: selectedValue
						}
					}));
				}
				else if (boards.data.type === 'error' && boards.data.message === 'No boards found') {
					console.log("no boards...")
					var trelloToken = localStorage.getItem("trello_token");
					dispatch(syncTrelloData({
						payload: {
							user: { id: _get(user, '_id', null), address: _get(user, 'wallet', null) },
							daoId: _get(DAO, '_id', null),
							boardsArray: [],
							accessToken: trelloToken,
							idModel: selectedValue
						}
					}));
				}
				else {
					setBoardsLoading(false);
					console.log(boards.data.message);
				}
			})
			.catch((e) => {
				setBoardsLoading(false);
				console.log("Error : ", e)
			})
	}

	const isIntegrationLoader = (item: any) => {
		return (item.name === 'Trello' && trelloLoading)
	}

	const isIntegrationConnected = (item: any) => {
		return (item.name === 'Trello' && isTrelloConnected)
			|| (item.name === 'GitHub' && expandGitHub) // expandGitHub to be replace by isGitHUbConnected
			|| (item.name === 'Discord' && isDiscordConnected)// expandDiscord to be replace by isDiscordConnected
	}

	const showIntegrationConnectButton = (item: any) => {
		return (item.name === 'Trello' && !isTrelloConnected)
			|| (item.name === 'GitHub' && !expandGitHub) // expandGitHub to be replace by isGitHUbConnected
			|| (item.name === 'Discord' && !isDiscordConnected)// expandDiscord to be replace by isDiscordConnected
	}

	const getConnectionCount = (item: any) => {
		if (item.name === 'Trello' && isTrelloConnected && !!organizationData.length) {
			return ` (${organizationData.length})`
		}
		if (item.name === 'Discord' && isDiscordConnected && !!serverData.length) {
			return ` (${serverData.length})`
		}
		return null
	}

	const expandList = (item: any) => {
		return (item.name === 'Trello' && expandTrello)
			|| (item.name === 'GitHub' && expandGitHub) // expandGitHub to be replace by isGitHUbConnected
			|| (item.name === 'Discord' && expandDiscord)
	}

	const IntegrationOrganizationList = (item: any) => {
		if (item.name === 'Trello' && expandTrello && isTrelloConnected) {
			return <>
				{organizationData.length ? organizationData.map((item: any) => {
					return (
						<Card className={_get(DAO, `trello.${item.id}`, null) ? classes.cardDisabled : classes.card}>
							<CardContent>
								<Typography sx={{ fontSize: 14 }}>
									{item.displayName}
								</Typography>
							</CardContent>
							{
								_get(DAO, `trello.${item.id}`, null)
									?
									<Image
										src={checkmark}
									/>
									:
									<Radio
										checked={selectedValue === item.id}
										onChange={(e) => setSelectedValue(e.target.value)}
										value={item.id}
										name="radio-buttons"
										inputProps={{ 'aria-label': 'A' }}
										disabled={_get(DAO, `trello.${item.id}`, null) ? true : false}
									/>
							}
						</Card>
					);
				}) : null}
				<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Button color="error" variant="contained" onClick={getAllBoards}>
						{
							boardsLoading
								?
								<LeapFrog size={24} color="#FFF" />
								:
								'SYNC'
						}
					</Button>
				</Box>
			</>
		}

		// add isGitHubConnected
		if (item.name === 'GitHub' && expandGitHub) {

		}
		// add isDiscordConnected
		if (item.name === 'Discord' && expandDiscord && isDiscordConnected) {
			return <>
				{
					serverData.length
						?
						serverData.map((item: any) => {
							return (
								<Card className={_get(DAO, `discord.${item.id}`, null) ? classes.cardDisabled : classes.card}>
									<CardContent>
										<Typography sx={{ fontSize: 14 }}>
											{item.name}
										</Typography>
									</CardContent>
									{
										_get(DAO, `discord.${item.id}`, null)
											?
											<Image
												src={checkmark}
											/>
											:
											<Radio
												checked={selectedServerId === item.id}
												onChange={(e) => setSelectedServerId(e.target.value)}
												value={item.id}
												name="radio-buttons"
												inputProps={{ 'aria-label': 'A' }}
												disabled={_get(DAO, `discord.${item.id}`, null) ? true : false}
											/>
									}
								</Card>
							)
						})
						:
						null
				}
				<Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
					<Button color="error" variant="contained" onClick={handleSyncServer}>
						{
							syncServerLoading
								?
								<LeapFrog size={24} color="#FFF" />
								:
								'SYNC'
						}
					</Button>
				</Box>
			</>
		}
		return null
	}

	return (
		<Drawer
			PaperProps={{ style: { borderTopLeftRadius: 20, borderBottomLeftRadius: 20 } }}
			sx={{ zIndex: 99999 }}
			anchor={'right'}
			open={open}
			onClose={() => onClose()}>
			<Box sx={{ width: 504, flex: 1, paddingBottom: '80px', paddingLeft: '40px', borderRadius: '20px 0px 0px 20px' }}>
				<IconButton sx={{ position: 'fixed', right: 32, top: 32 }} onClick={() => onClose()}>
					<img src={CloseSVG} />
				</IconButton>
				<Box display="flex" flexDirection="column" my={6} alignItems="center">
					{/* <img src={Integrations} /> */}
					<Typography my={2} style={{ color: palette.primary.main, fontSize: '30px', fontWeight: 400 }}>Integrations</Typography>
				</Box>

				<Box display="flex" flexDirection="row" my={6} alignItems="flex-start">
					<Typography sx={{
						fontWeight: '500',
						marginRight: 2,
						color: '#1B2B41',
						fontFamily: 'Inter, sans-serif'
					}}>Connect your accounts</Typography>
					<img src={GreyIconHelp} style={{ cursor: 'pointer' }} />
				</Box>

				{integrationAccounts.map((item, index) => {
					return <>
						<Box key={index} display="flex" flexDirection="row" my={4} justifyContent="space-between" width={440}>
							<Box display="flex" flexDirection="row">
								<img src={item.icon} height={24} style={{ padding: 4 }} />
								<Box sx={{
									paddingLeft: 3,
								}}>
									<Typography my={2} sx={{
										fontFamily: 'Inter, sans-serif',
										fontStyle: 'normal',
										fontWeight: 600,
										fontSize: 16,
									}}>{item.name}
										<span className={classes.organizationCount}>{getConnectionCount(item)}</span>
									</Typography>
									{isIntegrationConnected(item) ? <Box sx={{
										color: '#188C7C',
										fontSize: 12,
									}}>
										CONNECTED
									</Box> : null}
								</Box>
							</Box>
							<Box sx={{
								alignSelf: "flex-end",
								right: 0,
								justifySelf: "center"
							}}>
								{showIntegrationConnectButton(item)
									? <Button variant='contained'
										onClick={() => handleClick(item)}
									>
										{
											isIntegrationLoader(item)
												? <LeapFrog size={24} color="#FFF" />
												: 'CONNECT'
										}</Button>
									: <Box sx={{ marginRight: 5, cursor: 'pointer' }} onClick={() => handleExpand(item)}>{
										expandList(item)
											? <img src={downHandler} height={20} width={20} />
											: <img src={rightArrow} height={15} width={15} />
									}</Box>}
							</Box>
						</Box>
						<Divider sx={{ color: '#1B2B41', width: 440 }} variant="middle" />
						{IntegrationOrganizationList(item)}
					</>
				})}

			</Box>
		</Drawer>
	)
}