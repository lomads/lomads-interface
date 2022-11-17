import React, { useEffect, useRef, useState, useMemo } from "react";
import { usePrevious } from "@chakra-ui/react"
import { get as _get, find as _find } from 'lodash';
import lomadsfulllogo from "../../../assets/svg/lomadsfulllogo.svg";
import settingIcon from '../../../assets/svg/settings.svg';
import { useAppSelector } from "state/hooks";
import { useNavigate, useParams } from "react-router-dom";
import "../../../styles/Global.css";
import "../../../styles/pages/DashBoard/DashBoard.css";
import MemberCard from "./MemberCard";
import { LeapFrog } from "@uiball/loaders";
import TreasuryCard from "./TreasuryCard";
import { ImportSafe, safeService } from "connection/SafeCall";
import useDCAuthWithCallback from '../../../hooks/useDCAuthWithCallback';
import usePopupWindow from '../../../hooks/usePopupWindow';
import useUsersServers from "hooks/useUsersServers"
import useServerData from "hooks/useServerData";
import { useWeb3React } from "@web3-react/core";
import {
	AllTransactionsListResponse,
	AllTransactionsOptions,
	SafeMultisigTransactionListResponse,
} from "@gnosis.pm/safe-service-client";
import SideModal from "./SideModal";
import SideBar from "./SideBar";
import axios from "axios";
import NotificationArea from "./NotificationArea";
import Notifications from "../../../components/Notifications";
import AddMember from "./MemberCard/AddMember";
import dashboardfooterlogo from "../../../assets/svg/dashboardfooterlogo.svg";
import { useAppDispatch } from "state/hooks";
import { getCurrentUser, getDao } from "state/dashboard/actions";
import { setDAO, setDAOList } from "state/dashboard/reducer";
import { loadDao } from 'state/dashboard/actions';
import copyIcon from "../../../assets/svg/copyIcon.svg";
import { useDispatch } from "react-redux";
import { updateCurrentNonce, updateSafeThreshold, updateSafeAddress } from "state/flow/reducer";
import { Tooltip } from "@chakra-ui/react";
import useDCAuth from "hooks/useDCAuth";
import MyProject from "./MyProject";

import { useSBTStats } from "hooks/SBT/sbt";
import Footer from "components/Footer";
import EditMember from "./MemberCard/EditMember";
import LinksArea from "./LinksArea";
import useRole from "hooks/useRole";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains';
import { switchChain } from "utils/switchChain";
import { SupportedChainId, SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES } from 'constants/chains'
import Tasks from "./Tasks";
import CreateTask from "./Task/CreateTask";

const Dashboard = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { daoURL } = useParams();
	const { user, DAO, DAOList, DAOLoading } = useAppSelector((state) => state.dashboard);
	console.log("DAO : ", DAO);
	const [update, setUpdate] = useState(0);
	const treasuryRef = useRef<any>();
	const { provider, account, chainId, connector } = useWeb3React();
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const totalMembers = useAppSelector((state) => state.flow.totalMembers);
	const [pendingTransactions, setPendingTransactions] =
		useState<SafeMultisigTransactionListResponse>();
	const [executedTransactions, setExecutedTransactions] =
		useState<AllTransactionsListResponse>();
	const [validDaoChain, setValidDaoChain] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [ownerCount, setOwnerCount] = useState<number>();
	const [safeTokens, setSafeTokens] = useState<Array<any>>([]);
	const [showNotification, setShowNotification] = useState<boolean>(false);
	const [showAddMember, setShowAddMember] = useState<boolean>(false);
	const [showEditMember, setShowEditMember] = useState<boolean>(false);
	const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
	const [showNavBar, setShowNavBar] = useState<boolean>(false);
	const [checkLoading, setCheckLoading] = useState<boolean>(true);
	const currentNonce = useAppSelector((state) => state.flow.currentNonce);
	const { myRole, displayRole, permissions, can, isSafeOwner } = useRole(DAO, account);

	console.log("role", myRole)

	const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '', chainId);

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

	const handleRenderRole = () => {
		const user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase());
		return _get(user, 'role', '').replaceAll('_', ' ').toLowerCase();
	}

	const [copy, setCopy] = useState<boolean>(false);
	const toggleModal = () => {
		setShowModal(!showModal);
	};

	const toggleShowMember = () => {
		setShowAddMember(!showAddMember);
	};

	const toggleShowEditMember = () => {
		setShowEditMember(!showEditMember);
	};

	const toggleShowCreateTask = () => {
		setShowCreateTask(!showCreateTask);
	};

	const showSideBar = (_choice: boolean) => {
		setShowNavBar(_choice);
	};

	const handleSwitchChain = async (chain: number) => {
		switchChain(connector, chain)
			.then(res => {
				sessionStorage.clear()
				dispatch(setDAOList([]))
				dispatch(setDAO(null))
				window.location.href = '/'
			})
	}

	const prevDAO = usePrevious(DAO);

	useEffect(() => {
		if (prevDAO && !DAO) {
			setSafeTokens([])
		}
	}, [DAO, prevDAO])

	useEffect(() => {
		if (chainId && !account)
			window.location.href = '/login'
	}, [chainId, account])

	useEffect(() => {
		if (chainId && account) {
			if (!DAOList)
				dispatch(loadDao({ chainId }))
			else {
				if (DAOList && DAOList.length == 0) {
					if (!daoURL)
						navigate(`/createorg`)
					else {
						if (!DAO || (DAO && DAO.url !== daoURL))
							dispatch(getDao(daoURL))
					}
				} else if (DAOList && DAOList.length > 0) {
					if (!daoURL)
						navigate(`/${DAOList[0].url}`)
					else if (!DAO || (DAO && DAO.url !== daoURL))
						dispatch(getDao(daoURL))
				}
			}
		}
	}, [chainId, account, DAOList, daoURL])

	useEffect(() => {
		if (chainId) {
			if (contractName !== '' && DAO && DAO.sbt && DAO.sbt && account && balanceOf) {
				console.log("BALANCEOF:", parseInt(balanceOf._hex, 16))
				if (chainId === DAO.chainId) {
					if (DAO?.sbt?.whitelisted) {
						if (_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase())) {
							if (parseInt(balanceOf._hex, 16) === 0)
								navigate(`/${DAO.url}/sbt/mint/${DAO.sbt.address}`);
						} else {
							navigate('/only-whitelisted')
						}
					} else if (!DAO?.sbt?.whitelisted) {
						if (_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase())) {
							if (parseInt(balanceOf._hex, 16) === 0)
								navigate(`/${DAO.url}/sbt/mint/${DAO.sbt.address}`);
						} else {
							//add to DAO
							if (parseInt(balanceOf._hex, 16) === 0)
								navigate(`/${DAO.url}/sbt/mint/${DAO.sbt.address}`);
						}
					}
				} else {
					console.log('Switch chain to', DAO.chainId)
				}
			}
		}
	}, [chainId, DAO, balanceOf, contractName, account]);

	useEffect(() => {
		if (account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
			dispatch(getCurrentUser({}))
		}
	}, [account, chainId, user])


	useEffect(() => {
		if (DAO && chainId) {
			if (DAO.chainId !== chainId) {
				setValidDaoChain(false)
				switchChain(connector, DAO.chainId)
			}
			else
				setValidDaoChain(true)
		}
	}, [DAO, chainId]);

	useEffect(() => {
		if (DAO && account && chainId) {
			if (chainId === DAO.chainId) {
				if (!DAO.sbt) {
					if (!_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase()))
						navigate('/noaccess')
				}
			}
		}
	}, [DAO, account, chainId]);

	useEffect(() => {
		if (DAO && account && chainId) {
			if (chainId === DAO.chainId) {
				if (!DAO.sbt) {
					if (!_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase()))
						navigate('/noaccess')
				}
			}
		}
	}, [DAO, account, chainId]);


	useEffect(() => {
		if (DAO && chainId && DAO.chainId === chainId)
			dispatch(updateSafeAddress(_get(DAO, 'safe.address', '')))
	}, [DAO, chainId])

	const prepare = async (_safeAddress: string) => {
		if (chainId) {
			await ownersCount(_safeAddress);
			const nonce = await (await safeService(provider, `${chainId}`)).getNextNonce(_safeAddress);
			dispatch(updateCurrentNonce(nonce));
			await getTokens(_safeAddress);
		}
	};

	const ownersCount = async (_safeAddress: string) => {
		const safeSDK = await ImportSafe(provider, _safeAddress);
		const owners = await safeSDK.getOwners();
		const threshold = await safeSDK.getThreshold();
		dispatch(updateSafeThreshold(threshold));
		setOwnerCount(owners.length);
	};

	const getTokens = async (safeAddress: string) => {
		chainId &&
			await axios
				.get(
					`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`,
					{
						withCredentials: false
					}
				)
				.then((tokens: any) => {
					setSafeTokens(tokens.data);
				});
	};

	useEffect(() => {
		if (chainId && DAO && DAO.chainId === chainId) {
			if (DAO && _get(DAO, 'url') === daoURL)
				prepare(_get(DAO, 'safe.address'))
		}
	}, [DAO, daoURL, chainId]);

	if (showModal) {
		document.body.classList.add("active-modal");
	} else {
		document.body.classList.remove("active-modal");
	}
	const showNotificationArea = (_choice: boolean) => {
		setShowNotification(_choice);
	};

	useEffect(() => {
		if (DAO && chainId && DAO.chainId === chainId) {
			const prevShow = localStorage.getItem(`lmds_notification_count_${DAO._id}_show`)
			if (!prevShow || (prevShow && prevShow === '1'))
				return setShowNotification(true)
			if (prevShow === '0') {
				if (pendingTransactions?.count) {
					const prevCount = localStorage.getItem(`lmds_notification_count_${DAO._id}`)

					if (!prevCount) {
						localStorage.setItem(`lmds_notification_count_${DAO._id}`, `${pendingTransactions?.count}`)
						localStorage.setItem(`lmds_notification_count_${DAO._id}_show`, '1')
						return setShowNotification(true)
					}
					console.log('prevCount', prevCount && prevCount.toString() === pendingTransactions?.count.toString())
					if (prevCount && prevCount.toString() === pendingTransactions?.count.toString())
						setShowNotification(false)
					else {
						localStorage.removeItem(`lmds_notification_count_${DAO._id}_show`)
						localStorage.removeItem(`lmds_notification_count_${DAO._id}`)
						setShowNotification(true)
					}
				} else {
					if (pendingTransactions && pendingTransactions.count === 0) {
						localStorage.removeItem(`lmds_notification_count_${DAO._id}_show`)
						localStorage.removeItem(`lmds_notification_count_${DAO._id}`)
					}
				}
			}
		}
	}, [chainId, DAO, pendingTransactions])

	return (
		<>
			{!validDaoChain || !DAO || DAOLoading || (daoURL && (DAO && DAO.url !== daoURL)) ?
				<div style={{ backgroundColor: '#FFF', height: '100vh', zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
					<div className="logo">
						<img src={lomadsfulllogo} alt="" />
					</div>
					<div style={{ marginTop: 32 }}>
						<LeapFrog size={50} color="#C94B32" />
					</div>
				</div> : null}
			<div
				className="dashBoardBody"
				onMouseEnter={() => {
					showSideBar(false);
				}}
			>
				<div className="DAOdetails">
					<div
						className="copyArea"
						onClick={() => {
							setCopy(true);
						}}
						onMouseOut={() => {
							setCopy(false);
						}}
					>
						<div>
							<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
								<div className="DAOname">
									{_get(DAO, 'name', '')}
								</div>
								<Tooltip label={copy ? "copied" : "copy"}>
									<div
										className="copyLinkButton"
										onClick={() => {
											navigator.clipboard.writeText(`${process.env.REACT_APP_URL}/${_get(DAO, 'url', '')}`);
										}}
									>
										<img src={copyIcon} alt="copy" className="safeCopyImage" />
									</div>
								</Tooltip>
							</div>
							<div className="DAODescription">{_get(DAO, 'description', '')}</div>
						</div>
					</div>
					<div className="DAOsettings">
						<div className="DAOadminPill">
							<p>{displayRole}</p>
						</div>
						<select name="chain" id="chain" value={chainId} onChange={e => handleSwitchChain(+e.target.value)} className="chain" style={{ width: 150 }}>
							{
								SUPPORTED_CHAIN_IDS.map(chain => <option value={+chain}>{CHAIN_IDS_TO_NAMES[chain]}</option>)
							}
						</select>
					</div>
				</div>

				{_get(DAO, 'links', []).length > 0 && <LinksArea links={_get(DAO, 'links', [])} />}

				<Notifications />

				{/* {pendingTransactions !== undefined &&
					pendingTransactions?.count >= 1 &&
					showNotification && can(myRole, 'notification.view') && (
						<NotificationArea
							daoId={DAO._id}
							pendingTransactionCount={pendingTransactions?.count}
							showNotificationArea={showNotificationArea}
						/>
					)} */}

				<Tasks toggleShowCreateTask={toggleShowCreateTask} />
				<MyProject />
				{(can(myRole, 'transaction.view') || isSafeOwner) && DAO && daoURL === _get(DAO, 'url', '') &&
					<TreasuryCard
						innerRef={treasuryRef}
						safeAddress={safeAddress}
						pendingTransactions={pendingTransactions}
						executedTransactions={executedTransactions}
						ownerCount={ownerCount}
						toggleModal={toggleModal}
						fiatBalance={safeTokens}
						account={account}
						onChangePendingTransactions={(tx: any) => setPendingTransactions(tx)}
						tokens={safeTokens}
					/>
				}
				{can(myRole, 'members.view') &&
					<MemberCard
						totalMembers={totalMembers}
						toggleShowMember={toggleShowMember}
						toggleShowEditMember={toggleShowEditMember}
					/>
				}
				<Footer theme="dark" />
			</div>
			{showModal && (
				<SideModal
					toggleModal={toggleModal}
					tokens={safeTokens}
					totalMembers={totalMembers}
					safeAddress={safeAddress}
					getPendingTransactions={() => { treasuryRef?.current?.reload() }}
					showNotificationArea={showNotificationArea}
					toggleShowMember={toggleShowMember}
				/>
			)}
			<SideBar
				name={_get(DAO, 'name', '')}
				showSideBar={showSideBar}
				showNavBar={showNavBar}
			/>
			{showAddMember && <AddMember toggleShowMember={toggleShowMember} />}
			{showEditMember && <EditMember toggleShowEditMember={toggleShowEditMember} DAO={DAO} amIAdmin={amIAdmin} account={account} />}

			{/* create task side modal */}
			{showCreateTask && <CreateTask toggleShowCreateTask={toggleShowCreateTask} />}

		</>
	);
};

export default Dashboard;
