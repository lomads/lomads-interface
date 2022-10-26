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
import AddMember from "./MemberCard/AddMember";
import dashboardfooterlogo from "../../../assets/svg/dashboardfooterlogo.svg";
import { useAppDispatch } from "state/hooks";
import { getDao } from "state/dashboard/actions";
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

const Dashboard = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { daoURL } = useParams();
	const { DAO, DAOList, DAOLoading } = useAppSelector((state) => state.dashboard);
	console.log("DAO : ", DAO);
	const [update, setUpdate] = useState(0);
	const treasuryRef = useRef<any>();
	const { provider, account, chainId } = useWeb3React();
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const totalMembers = useAppSelector((state) => state.flow.totalMembers);
	const [pendingTransactions, setPendingTransactions] =
		useState<SafeMultisigTransactionListResponse>();
	const [executedTransactions, setExecutedTransactions] =
		useState<AllTransactionsListResponse>();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [ownerCount, setOwnerCount] = useState<number>();
	const [safeTokens, setSafeTokens] = useState<Array<any>>([]);
	const [showNotification, setShowNotification] = useState<boolean>(false);
	const [showAddMember, setShowAddMember] = useState<boolean>(false);
	const [showEditMember, setShowEditMember] = useState<boolean>(false);
	const [showNavBar, setShowNavBar] = useState<boolean>(false);
	const [checkLoading, setCheckLoading] = useState<boolean>(true);
	const currentNonce = useAppSelector((state) => state.flow.currentNonce);

	const { balanceOf, contractName } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '');

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

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

	const showSideBar = (_choice: boolean) => {
		setShowNavBar(_choice);
	};

	useEffect(() => {
		if (chainId && !account)
			window.location.href = '/login'
	}, [chainId, account])

	useEffect(() => {
		if (chainId && account) {
			if (!DAOList)
				dispatch(loadDao({}))
			else {
				if (DAOList && DAOList.length == 0) {
					if (!daoURL)
						navigate(`/namedao`)
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
		if (contractName !== '' && DAO && DAO.sbt && DAO.sbt && account) {
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
		}
	}, [DAO, balanceOf, contractName, account]);

	useEffect(() => {
		if (DAO && account) {
			if (!DAO.sbt) {
				if (!_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase()))
					navigate('/noaccess')
			}
		}
	}, [DAO, account]);

	// useEffect(() => {
	// 	if (chainId && account)
	// 		dispatch(loadDao({}))
	// }, [chainId, account])

	// const hasDAOAccess = useMemo(() => {
	// 	if (!DAOList || DAOList.length == 0) return false;
	// 	let hasAccess = _find(DAOList, d => d.url === daoURL)
	// 	if (hasAccess) return true;
	// 	return false
	// }, [DAOList, daoURL])

	// useEffect(() => {
	// 	if (DAOList && DAOList.length > 0) {
	// 		if (!hasDAOAccess) {
	// 			navigate('/noaccess')
	// 		}
	// 	}
	// }, [DAOList, hasDAOAccess])

	// useEffect(() => {
	// 	if (hasDAOAccess && chainId && account && daoURL && (!DAO || (DAO && DAO.url !== daoURL)))
	// 		dispatch(getDao(daoURL))
	// }, [hasDAOAccess, DAOList, daoURL, chainId, account])

	useEffect(() => {
		if (DAO)
			dispatch(updateSafeAddress(_get(DAO, 'safe.address', '')))
	}, [DAO])

	const prepare = async (_safeAddress: string) => {
		await ownersCount(_safeAddress);
		const nonce = await (await safeService(provider)).getNextNonce(_safeAddress);
		dispatch(updateCurrentNonce(nonce));
		await getTokens(_safeAddress);
	};

	const ownersCount = async (_safeAddress: string) => {
		const safeSDK = await ImportSafe(provider, _safeAddress);
		const owners = await safeSDK.getOwners();
		const threshold = await safeSDK.getThreshold();
		dispatch(updateSafeThreshold(threshold));
		setOwnerCount(owners.length);
	};

	const getTokens = async (safeAddress: string) => {
		await axios
			.get(
				`https://safe-transaction.goerli.gnosis.io/api/v1/safes/${safeAddress}/balances/usd/`,
				{
					withCredentials: false
				}
			)
			.then((tokens: any) => {
				setSafeTokens(tokens.data);
			});
	};

	useEffect(() => {
		if (DAO && _get(DAO, 'url') === daoURL) {
			prepare(_get(DAO, 'safe.address'))
			getTokens(_get(DAO, 'safe.address'));
		}
	}, [DAO, daoURL]);

	if (showModal) {
		document.body.classList.add("active-modal");
	} else {
		document.body.classList.remove("active-modal");
	}
	const showNotificationArea = (_choice: boolean) => {
		setShowNotification(_choice);
	};

	useEffect(() => {
		if (DAO) {
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
	}, [DAO, pendingTransactions])

	return (
		<>
			{!DAO || DAOLoading || (daoURL && (DAO && DAO.url !== daoURL)) ?
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
					<div className="DAOsettings">
						<div className="DAOadminPill">
							{
								amIAdmin
									?
									<p>You're an&nbsp;<span>Admin</span></p>
									:
									<p>You're a&nbsp;<span>Core contributor</span></p>
							}

						</div>
						{
							amIAdmin && <button onClick={() => { navigate('/settings') }}>
								<img src={settingIcon} alt="settings-icon" />
							</button>
						}
					</div>
				</div>
				{pendingTransactions !== undefined &&
					pendingTransactions?.count >= 1 &&
					showNotification && (
						<NotificationArea
							daoId={DAO._id}
							pendingTransactionCount={pendingTransactions?.count}
							showNotificationArea={showNotificationArea}
						/>
					)}

				<MyProject />

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
				<MemberCard
					totalMembers={totalMembers}
					toggleShowMember={toggleShowMember}
					toggleShowEditMember={toggleShowEditMember}
				/>
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
		</>
	);
};

export default Dashboard;
