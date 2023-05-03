import { useEffect, useState } from "react";
import "./Settings.css";
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
import OrganisationDetailsModal from "./OrganisationDetailsModal";
import SafeModal from "./SafeModal";
import XpPointsModal from "./XpPointsModal";
import PassTokenModal from "muiModals/PassTokenModal";
import TerminologyModal from "./TerminologyModal";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { getDao } from "state/dashboard/actions";
import eventEmitter from "utils/eventEmmiter";
import RolesAndPermissionModal from "muiModals/RolesAndPermissionModal";
import IntegrationsModal from "muiModals/IntegrationsModal";
import useRole from "hooks/useRole";
import { useWeb3React } from "@web3-react/core";

const Settings = () => {
	const navigate = useNavigate();
	const { daoURL,openState } = useParams();
	const { account } = useWeb3React() 
	const dispatch = useAppDispatch();

	//! CONST DECLARATION
	const [openOrganisationDetails, setOpenOrganisationDetails] = useState(openState && openState === 'openOrganisation'?true:false);
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
	let toggleOrganisationDetailsModal = () => {
		setOpenOrganisationDetails(false);
	};
	let toggleRP = () => {
		setOpenRolesPermissions(!openRolesPermissions);
	};
	let toggleS = () => {
		setOpenSafe(!openSafe);
	};
	let togglePassToken = () => {
		setOpenPassToken(prev => !prev);
	};
	let toggleXp = () => {
		setOpenXpPoints(!openXpPoints);
	};
	let toggleTerminology = () => {
		setOpenTerminology(!openTerminology);
	};
	let toggleDiscord = () => {
		setOpenDiscord(!openDiscord);
	};
	let toggleCreatePassTokenModal = () => {
		setOpenCreatePassToken(prev => !prev);
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
					.then((organizations) => {
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
			error: function (e) {
				console.log("Error : ", e);
				setTrelloLoading(false);
			},
		});
	};

	return (
		<>
			<div className="settings-page">
				{/* <DisableXpPointDailog
                    toggleShowLink={toggleCreatePassTokenModal}
                    daoUrl={_get(DAO, 'url', '')}
                /> */}
				<div className="settings-left-bar">
					<div onClick={() => navigate(-1)} className="logo-container">
						{
							_get(DAO, 'image', null)
								?
								<img src={_get(DAO, 'image', null)} />
								:
								<p style={{ textTransform: "capitalize" }}>
									{daoName.length === 1
										? daoName[0].charAt(0)
										: daoName[0].charAt(0) + daoName[daoName.length - 1].charAt(0)}
								</p>
						}
					</div>
					<img src={settingIcon} className="setting-icon" />
				</div>
				<div className="settings-center">
					<div>
						<div className="settings-header">
							<h1>{name}</h1>
							<h2>Settings</h2>
						</div>
						{
						<div className="settings-organisation"
							onClick={() => {
								setOpenOrganisationDetails(true);
							}}
						>
							<div>
								<img src={OrganistionDetails} style={{ height: "35px" }} />
								<Link
									className="style-content"
									style={{ color: "#C94B32" }}
								>
									Organisation Details
									<ChevronRight />
								</Link>
							</div>
						</div>
						}
						<div className="settings-organisation-flexbox">
							<div className="settings-organisation-child"
								onClick={() => {
									setOpenRolesPermissions(true);
								}}
							>
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={RolesPermissions} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Roles & Permissions
										<ChevronRight />
									</Link>
								</div>
							</div>
							{ <div
								onClick={() => {
									setOpenSafe(true)
								}}
								className="settings-organisation-child">
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={Safe} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Safe
										<ChevronRight />
									</Link>
								</div>
							</div> }

							<div className="settings-organisation-child"
								onClick={() => {
									togglePassToken()
								}}
							>
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={PassTokens} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Pass Tokens
										<ChevronRight />
									</Link>
								</div>
							</div>
						</div>

						<div className="settings-organisation-flexbox">
							<div className="settings-organisation-child"
								onClick={() => {
									setOpenXpPoints(true);
								}}
							>
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={XpPoints} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										SWEAT points
										<ChevronRight />
									</Link>
								</div>
							</div>
							<div className="settings-organisation-child"
								onClick={() => {
									setOpenTerminology(true);
								}}
							>
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={Terminology} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Terminology
										<ChevronRight />
									</Link>
								</div>
							</div>

							{/* <div className="settings-organisation-child disabled"
								onClick={() => {
									setOpenDiscord(true);
								}}
							>
								<div
									style={{
										padding: "20px",
									}}
								>
									<img src={Discord} style={{ height: "35px" }} />
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Discord
										<ChevronRight />
									</Link>
								</div>
							</div> */}
							<div className="settings-organisation-child"
								onClick={() => setOpenIntegrationModal(true)}
							>
								<div style={{ padding: "20px" }}>
									<img src={IntegrationGrey} width={35} height={32}/>
									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Integrations
										<ChevronRight />
									</Link>
								</div>
							</div>
						</div>

						{/* Trello */}
						<div className="settings-organisation-flexbox">
							{/* <div className="settings-organisation-child"
								onClick={authorizeTrello}
							>
								<div style={{ padding: "20px" }}>
									{
										trelloLoading
											?
											<LeapFrog size={24} color="#76808D" />
											:
											<CgTrello size={35} color="#76808D" />
									}

									<Link
										className="style-content"
										style={{ color: "#C94B32" }}
									>
										Trello
										<ChevronRight />
									</Link>
								</div>
							</div> */}
						</div>

					</div>

					<Footer theme="light" />
				</div>
				<div className="settings-right-bar">
					<button onClick={() => navigate(-1)}>
						<CgClose color="#FFF" size={24} />
					</button>
				</div>
			</div>

			{/* // !-------------  Organisation Details ------------ */}
			{openOrganisationDetails && (
				<OrganisationDetailsModal
					toggleOrganisationDetailsModal={toggleOrganisationDetailsModal}
				/>
			)}
			{/* // !-------------  Roles & Permissions ------------ */}
			<RolesAndPermissionModal
				open={openRolesPermissions}
				onClose={() => setOpenRolesPermissions(false)}
			/>
			{/* {openRolesPermissions && (
				
				<RolesPermissionsModal toggleRP={toggleRP} />
			)} */}
			{/* // !-------------  Safe ------------ */}
			{openSafe && (
				<SafeModal toggleS={toggleS} />
			)}
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
			{openXpPoints && (
				<XpPointsModal toggleXp={toggleXp} />
			)}
			{/* // !-------------  Terminology ------------ */}
			{openTerminology && (
				<TerminologyModal
					toggleTerminology={toggleTerminology}
				/>
			)}
			{/* // !-------------  Discord ------------ */}
			{/* {openDiscord && (
				<DiscordModal toggleDiscord={toggleDiscord} />
			)} */}
			{openIntegrationModal &&
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