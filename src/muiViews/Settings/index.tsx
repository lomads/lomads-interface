import React, { useEffect, useState } from "react";
import { get as _get, find as _find } from "lodash";
import settingIcon from "../../assets/svg/settingsXL.svg";
import { CgClose } from "react-icons/cg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosHttp from '../../api';
import Footer from "components/Footer";
import { ChevronRight } from "react-feather";
import IntegrationGrey from "../../assets/svg/IntegrationGrey.svg";

// ASSETS
import OrganistionDetails from "../../assets/images/settings-page/1-ogranisation-details.svg";
import RolesPermissions from "../../assets/images/settings-page/2-roles-permissions.svg";
import Safe from "../../assets/images/settings-page/3-safe.svg";
import PassTokens from "../../assets/images/settings-page/4-pass-tokens.svg";
import XpPoints from "../../assets/images/settings-page/5-xp-points.svg";
import Terminology from "../../assets/images/settings-page/6-terminology.svg";
import OrganisationDetailsModal from "muiModals/OrganisationDetailsModal";
import SafeModal from "muiModals/SafeModal";
import XpPointsModal from "muiModals/XpPointsModal";
import PassTokenModal from "muiModals/PassTokenModal";
import TerminologyModal from "muiModals/TerminologyModal";
import RolesAndPermissionModal from "muiModals/RolesAndPermissionModal";
import IntegrationsModal from "muiModals/IntegrationsModal";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { getDao } from "state/dashboard/actions";
import eventEmitter from "utils/eventEmmiter";
import useRole from "hooks/useRole";
import { useWeb3React } from "@web3-react/core";
import { makeStyles } from '@mui/styles';
import { Box, Button } from "@mui/material"
import IconButton from "muiComponents/IconButton";

const useStyles = makeStyles((theme: any) => ({
	settingsPage: {
		width: '100%',
		height: '100vh',
		background: 'linear-gradient(178.31deg, #C94B32 0.74%, #A54536 63.87%)',
		display: 'flex',
		justifyContent: 'space-between',
		position: 'relative',
		overflowY: 'scroll',
		zIndex: '999',
	},
	settingsLeftBar: {
		padding: '3rem',
		height: '100%',
		position: 'relative'
	},
	logoContainer: {
		position: 'absolute',
		width: 70.71,
		height: 70.71,
		left: 83,
		top: 69,
		background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: 10,
		transform: 'rotate(45deg)',
		overflow: 'hidden',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	logoContainerImg: {
    	transform: 'rotate(-45deg)',
    	width: '141%',
    	height: '141%',
   		flexShrink: '0',
    	maxWidth: '141%'
	},
	logoContainerP: {
    	fontFamily: 'var(--chakra-fonts-body)',
    	fontStyle: 'normal',
    	fontWeight: '600',
    	fontSize: '35px',
   		lineHeight: '25px',
    	textAlign: 'center',
    	transform: 'rotate(-45deg)',
    	letterSpacing: '-0.011em',
    	color: '#C94B32',
	},
	settingIcon: {
		position: 'absolute',
		top: 170,
		left: 0,
	},
	settingsCenter: {
		display: 'flex',
		height: '100%',
		width: '100%',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: '4rem',
		paddingLeft: '4rem',
	},
	settingsHeader: {
		width: '947px',
		display: 'flex',
		flexDirection: 'column',
	},
	settingsOrganisation: {
		height: '130px',
		width: '947px',
		backgroundColor: '#FFF',
		borderRadius: '20px',
		padding: '26px 22px 30px',
		display: 'flex',
		flexDirection: 'column',
		color: '#C94B32',
		marginBottom: '20px',
	},
	styleContent: {
		marginTop: '20px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	settingsOrganisationFlexbox: {
		width: '947px',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	settingsOrganisationChild: {
		cursor: 'pointer',
		height: '130px',
		width: '300px',
		backgroundColor: '#FFF',
		borderRadius: '20px',
		display: 'flex',
		flexDirection: 'column',
		marginBottom: '20px',
		color: '#C94B32',
	},
	settingsOrganisationChildDisabled: {
		backgroundColor: '#fff',
		opacity: '0.8',
	},
	settingsRightBar: {
		padding: '40px 3rem',
		height: '100%',
		position: 'relative',
	},
	settingsRightBarButton: {
		background: 'rgba(27, 43, 65, 0.2) !important',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 37,
		height: 37,
		cursor: 'pointer',
		borderRadius: 5
	},
	settingsHeaderHOne: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 30,
		color: '#FFFFFF',
		marginBottom: 20
	},
	settingsHeaderHTwo: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontweight: 400,
		fontSize: 30,
		color: '#FFFFFF',
		marginBottom: 40
	}
}));

const Settings = () => {
	const navigate = useNavigate();
	const classes = useStyles()
	const { daoURL, openState } = useParams();
	const { account } = useWeb3React()
	const dispatch = useAppDispatch();

	//! CONST DECLARATION
	const [openOrganisationDetails, setOpenOrganisationDetails] = useState(openState && openState === 'openOrganisation' ? true : false);
	const [openRolesPermissions, setOpenRolesPermissions] = useState(false);
	const [openSafe, setOpenSafe] = useState(false);
	const [openPassToken, setOpenPassToken] = useState(false);
	const [openXpPoints, setOpenXpPoints] = useState(false);
	const [openTerminology, setOpenTerminology] = useState(false);
	const [openIntegrationModal, setOpenIntegrationModal] = useState(false)
	const [openDiscord, setOpenDiscord] = useState(false);
	const [openCreatePassToken, setOpenCreatePassToken] = useState(false);
	const [repoInfo, setRepoInfo] = useState('');

	const { DAO, updateDaoLoading, updateDaoLinksLoading } = useAppSelector((state) => state.dashboard);
	const { myRole, displayRole, permissions, can, isSafeOwner } = useRole(DAO, account);

	console.log("DAO data : ", DAO);

	const [name, setName] = useState(_get(DAO, 'name', ''));

	const [code, setCode] = useState('');

	const [organizations, setOrganizations] = useState([]);
	const [trelloLoading, setTrelloLoading] = useState(false);
	const [isTrelloConnected, setTrelloConnected] = useState(false);

	useEffect(() => {
		setName(_get(DAO, 'name', ''))
	}, [DAO])

	useEffect(() => {
		if (!DAO || (DAO && DAO.url !== daoURL))
			dispatch(getDao(daoURL))
	}
		, [DAO])

	useEffect(() => {
		eventEmitter.on('close-xp-modal', () => {
			setOpenXpPoints(false)
		})
		return () => {
			eventEmitter.off('close-xp-modal', () => {
				setOpenXpPoints(false)
			})
		}
	}, [])

	//! TOGGLE FUNCTIONS
	let togglePassToken = () => {
		setOpenPassToken(prev => !prev);
	};

	const daoName = name.split(" ");

	const authorizeTrello = () => {
		setTrelloLoading(true);
		window.Trello.authorize({
			type: 'popup',
			persist: true,
			interactive: true,
			name: "Trello Authentication",
			scope: {
				read: "true",
				write: "true",
				account: "true"
			},
			expiration: "never",
			success: function () {
				var trelloToken = localStorage.getItem("trello_token");
				axiosHttp.get(`utility/get-trello-organizations?accessToken=${trelloToken}`)
					.then((organizations: any) => {
						if (organizations.data.type === 'success') {
							setTrelloLoading(false);
							setOrganizations(organizations.data.data);
							setTrelloConnected(true)
						}
						else {
							setTrelloLoading(false);
							alert(organizations.data.message);
						}
					})
			},
			error: function (e: any) {
				console.log("Error : ", e);
				setTrelloLoading(false);
			},
		});
	};

	return (
		<>
			<Box className={classes.settingsPage}>
				{/* <DisableXpPointDailog
                    toggleShowLink={toggleCreatePassTokenModal}
                    daoUrl={_get(DAO, 'url', '')}
                /> */}
				<Box className={classes.settingsLeftBar}>
					<Box onClick={() => navigate(-1)} className={classes.logoContainer}>
						{
							_get(DAO, 'image', null)
								?
								<img src={_get(DAO, 'image', null)} className={classes.logoContainerImg} />
								:
								<p style={{ textTransform: "capitalize" }} className={classes.logoContainerP}>
									{daoName.length === 1
										? daoName[0].charAt(0)
										: daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
								</p>
						}
					</Box>
					<img src={settingIcon} className={classes.settingIcon} />
				</Box>
				<Box className={classes.settingsCenter}>
					<Box>
						<Box className={classes.settingsHeader}>
							<Box className={classes.settingsHeaderHOne}>{name}</Box>
							<Box className={classes.settingsHeaderHTwo}>Settings</Box>
						</Box>
						{
							<Box className={classes.settingsOrganisation}
								onClick={() => {
									setOpenOrganisationDetails(true);
								}}
							>
								<Box>
									<img src={OrganistionDetails} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Organisation Details
										<ChevronRight />
									</Link>
								</Box>
							</Box>
						}
						<Box className={classes.settingsOrganisationFlexbox}>
							<Box className={classes.settingsOrganisationChild}
								onClick={() => {
									setOpenRolesPermissions(true);
								}}
							>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={RolesPermissions} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Roles & Permissions
										<ChevronRight />
									</Link>
								</Box>
							</Box>
							{<Box
								onClick={() => {
									setOpenSafe(true)
								}}
								className={classes.settingsOrganisationChild}>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={Safe} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Safe
										<ChevronRight />
									</Link>
								</Box>
							</Box>}

							<Box className={classes.settingsOrganisationChild}
								onClick={() => {
									togglePassToken()
								}}
							>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={PassTokens} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Pass Tokens
										<ChevronRight />
									</Link>
								</Box>
							</Box>
						</Box>

						<Box className={classes.settingsOrganisationFlexbox}>
							<Box className={classes.settingsOrganisationChild}
								onClick={() => {
									setOpenXpPoints(true);
								}}
							>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={XpPoints} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										SWEAT points
										<ChevronRight />
									</Link>
								</Box>
							</Box>
							<Box className={classes.settingsOrganisationChild}
								onClick={() => {
									setOpenTerminology(true);
								}}
							>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={Terminology} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Terminology
										<ChevronRight />
									</Link>
								</Box>
							</Box>

							{/* <Box className={classes.settingsOrganisationChildDisabled}
								onClick={() => {
									setOpenDiscord(true);
								}}
							>
								<Box
									style={{
										padding: "20px",
									}}
								>
									<img src={Discord} style={{ height: "35px" }} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
									>
										Discord
										<ChevronRight />
									</Link>
								</Box>
							</Box> */}
							<Box className={classes.settingsOrganisationChild}
								onClick={() => setOpenIntegrationModal(true)}
							>
								<Box style={{ padding: "20px" }}>
									<img src={IntegrationGrey} width={35} height={32} />
									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
										to={''}
									>
										Integrations
										<ChevronRight />
									</Link>
								</Box>
							</Box>
						</Box>

						{/* Trello */}
						{/* <Box className={classes.settingsOrganisationFlexbox}>
							<Box className={classes.settingsOrganisationChild}
								onClick={authorizeTrello}
							>
								<Box style={{ padding: "20px" }}>
									{
										trelloLoading
											?
											<LeapFrog size={24} color="#76808D" />
											:
											<CgTrello size={35} color="#76808D" />
									}

									<Link
										className={classes.styleContent}
										style={{ color: "#C94B32" }}
									>
										Trello
										<ChevronRight />
									</Link>
								</Box>
							</Box> 
						</Box>*/}

					</Box>

					<Footer theme="light" />
				</Box>
				<Box className={classes.settingsRightBar}>
					<Box
						onClick={() => navigate(-1)}
						className={classes.settingsRightBarButton}>
						<CgClose color="#FFF" size={24} />
					</Box>
				</Box>
			</Box>

			{/* // !-------------  Organisation Details ------------ */}
			{
				<OrganisationDetailsModal
					open={openOrganisationDetails}
					onClose={() => setOpenOrganisationDetails(false)}
				/>
			}
			{/* // !-------------  Roles & Permissions ------------ */}
			<RolesAndPermissionModal
				open={openRolesPermissions}
				onClose={() => setOpenRolesPermissions(false)}
			/>
			{/* {openRolesPermissions && (
				
				<RolesPermissionsModal toggleRP={toggleRP} />
			)} */}
			{/* // !-------------  Safe ------------ */}
			{
				<SafeModal
					open={openSafe}
					onClose={() => setOpenSafe(false)}
				/>
			}
			{/* // !-------------  Pass Token ------------ */}
			<PassTokenModal
				open={openPassToken}
				onClose={() => setOpenPassToken(false)}
			/>
			{/* {openCreatePassToken && (
				<CreateMorePassTokenModal
					navFromSetting={true}
					toggleCreatePassTokenModal={toggleCreatePassTokenModal}
				/>
			)} */}
			{/* // !-------------  SWEAT Points ------------ */}
			{
				<XpPointsModal 
					open={openXpPoints}
					onClose={() => setOpenXpPoints(false)}
				/>
			}
			{/* // !-------------  Terminology ------------ */}
			{
				<TerminologyModal
					open={openTerminology}
					onClose={() => setOpenTerminology(false)}
				/>
			}
			{/* // !-------------  Discord ------------ */}
			{/* {openDiscord && (
				<DiscordModal toggleDiscord={toggleDiscord} />
			)} */}
			{
				<IntegrationsModal
					open={openIntegrationModal}
					onClose={() => setOpenIntegrationModal(false)}
					organizationData={organizations}
					authorizeTrello={authorizeTrello}
					isTrelloConnected={isTrelloConnected}
					trelloLoading={trelloLoading}
				/>
			}
			{/* <TrelloOrganizationsModal
				open={openTrelloModal}
				onClose={() => setOpenTrelloModal(false)}
				organizationData={organizations}
			/> */}
		</>
	);
};

export default Settings;