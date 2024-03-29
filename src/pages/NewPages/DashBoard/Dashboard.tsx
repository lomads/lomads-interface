import React, { useEffect, useRef, useState, useMemo, useLayoutEffect } from "react";
import { usePrevious } from "@chakra-ui/react"
import { get as _get, find as _find } from 'lodash';
import lomadsfulllogo from "../../../assets/svg/lomadsfulllogo.svg";
import settingIcon from '../../../assets/svg/settings.svg';
import { useAppSelector } from "state/hooks";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import starDashboard from "../../../assets/svg/star_dashboard.svg";
import tokenDashboard from "../../../assets/svg/token_dashboard.svg";
import questionMarkDark from "../../../assets/svg/question-mark-dark.svg";
import questionMarkLight from "../../../assets/svg/question-mark-light.svg";
import MOBILEDEVICE from "../../../assets/svg/mobile_device.svg";
import LOMADLOGO from "../../../assets/svg/lomadsLogoRed.svg";
import { useAppDispatch } from "state/hooks";
import { getCurrentUser, getDao, loadDao, storeGithubIssues, updateDao, updateUserOnboardingCount } from "state/dashboard/actions";
import { setDAO, setDAOList } from "state/dashboard/reducer";
import copyIcon from "../../../assets/svg/copyIcon.svg";
import { useDispatch } from "react-redux";
import { updateCurrentNonce, updateSafeThreshold, updateSafeAddress } from "state/flow/reducer";
import { Tooltip } from "@chakra-ui/react";
import useDCAuth from "hooks/useDCAuth";
import MyProject from "./MyProject";
import Steps from './WalkThrough/steps';
import { useSBTStats } from "hooks/SBT/sbt";
import Footer from "components/Footer";
import EditMember from "./MemberCard/EditMember";
import LinksArea from "./LinksArea";
import WalkThroughModal from './WalkThrough/WalkThroughModal';
import WalkThroughPopover from './WalkThrough/WalkThroughPopover';
import useRole from "hooks/useRole";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains';
import { switchChain } from "utils/switchChain";
import { SupportedChainId, SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES } from 'constants/chains'
import Tasks from "./Tasks";
import CreateTask from "./Task/CreateTask";
import CreateRecurring from "./TreasuryCard/CreateRecurring";
import axiosHttp from 'api'
import useEns from "hooks/useEns";
import useMintSBT from "hooks/useMintSBT";
import useMintSBTV2 from "hooks/useMintSBT.v2";
import { default as MuiButton, ButtonProps } from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Button from "muiComponents/Button";
import steps from "./WalkThrough/steps";
import Dropdown from "muiComponents/Dropdown";
import Avatar from "muiComponents/Avatar";
import { Grid, Typography, Box, MenuItem, Menu, useMediaQuery } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { addDaoMemberList } from "state/dashboard/actions";

const { toChecksumAddress } = require('ethereum-checksum-address')
type WalkThroughObjType = {
	step: number;
	id: string;
	title: string;
	content: string;
	buttonText: string;
	imgPath: string;
	placement: string;
}

const HideHelpIconButton = styled(Button)<ButtonProps>(({ theme }) => ({
	color: '#ffffff',
	backgroundColor: '#1B2B41',
	cursor: 'pointer',
	width: 198,
	height: 40,
	radius: 5,
	padding: 0,
	fontFamily: "Inter, sans-serif",
	fontSize: 16,
	'&:hover': {
		backgroundColor: '#1B2B41',
	},
}));
const PlayWalkThroughButton = styled(Button)<ButtonProps>(({ theme }) => ({
	color: '#C94B32',
	backgroundColor: '#FFFFFF',
	cursor: 'pointer',
	width: 198,
	height: 40,
	radius: 5,
	padding: 0,
	fontFamily: "Inter, sans-serif",
	fontSize: 16,
	'&:hover': {
		backgroundColor: '#FFFFFF',
	},
}));

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	logo: {
		width: 138,
		height: 81
	},
	cheers: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		display: 'flex',
		alignItems: 'center',
		justifyItems: 'center'
	},
	metamaskButton: {
		height: '111px !important',
		cursor: 'pointer',
		alignContent: "inherit",
		background: "#fff",
		borderColor: "#c94b32",
		borderRadius: '10px !important',
		borderWidth: 0,
		filter: "drop-shadow(3px 5px 4px rgba(27,43,65,.05)) drop-shadow(-3px -3px 8px rgba(201,75,50,.1)) !important",
		margin: "10px",
		padding: 40
	},
	select: {
		background: '#FFF',
		borderRadius: '10px !important',
		boxShadow: 'none !important',
		fontSize: '16px !important',
		minWidth: 'inherit !importnt',
		padding: '0px !important'
	},
	subtitle1: {
		fontSize: '25px !important',
		fontWeight: '400 !important',
		lineHeight: '30px !important',
		textAlign: 'center',
		color: '#B12F15',
		margin: '30px 0 !important'
	},
	subtitle2: {
		fontSize: '38px !important',
		lineHeight: '42px !important',
		textTransform: 'uppercase',
		color: '#1B2B41',
	},
}));

const Dashboard = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { daoURL } = useParams();
	const location = useLocation()
	const from = location?.state?.from;
	const { user, DAO, DAOList, DAOLoading } = useAppSelector((state: any) => state.dashboard);
	console.log("DAO : ", DAO);
	const matches = useMediaQuery('(min-width:992px)');
	const classes = useStyles()
	const [update, setUpdate] = useState(0);
	const treasuryRef = useRef<any>();
	const anchorRef = useRef<any>();
	const questionMarkRef = useRef<any>();
	const { provider, account, chainId: currentChainId, connector } = useWeb3React();
	const [chainId, setChainId] = useState(null)
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const totalMembers = useAppSelector((state) => state.flow.totalMembers);
	const [pendingTransactions, setPendingTransactions] =
		useState<SafeMultisigTransactionListResponse>();
	const [executedTransactions, setExecutedTransactions] =
		useState<AllTransactionsListResponse>();
	const [validDaoChain, setValidDaoChain] = useState<boolean>(true);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [ownerCount, setOwnerCount] = useState<number>();
	const [safeTokens, setSafeTokens] = useState<Array<any>>([]);
	const [showNotification, setShowNotification] = useState<boolean>(false);
	const [showAddMember, setShowAddMember] = useState<boolean>(false);
	const [showEditMember, setShowEditMember] = useState<boolean>(false);
	const [showCreateTask, setShowCreateTask] = useState<boolean>(false);
	const [showCreateRecurring, setShowCreateRecurring] = useState<boolean>(false);
	const [showNavBar, setShowNavBar] = useState<boolean>(false);
	const [manualChainSwitch, setManualChainSwitch] = useState<boolean>(false);
	const [recurringTxn, setRecurringTxn] = useState<any>(null);
	const [safeOwners, setSafeOwners] = useState<any>(null);
	const [checkLoading, setCheckLoading] = useState<boolean>(true);
	const [currWalkThroughObj, setWalkThroughObj] = useState<any>(null);
	const [showWalkThrough, setShowWalkThrough] = useState<boolean>(false);
	const [isHelpIconOpen, setIsHelpIconOpen] = useState<boolean>(false);
	const [displayHelpOptions, setDisplayHelpOptions] = useState<boolean>(false);
	const currentNonce = useAppSelector((state) => state.flow.currentNonce);
	const { myRole, displayRole, permissions, can, isSafeOwner } = useRole(DAO, account);
	const { getENSAddress, getENSName } = useEns()

	//const { contractNamebalanceOf,  } = useSBTStats(provider, account ? account : '', update, DAO?.sbt ? DAO.sbt.address : '', chainId);
	const { getStats } = useMintSBT(DAO?.sbt?.address, DAO?.sbt?.version)
	const { balanceOf } = useMintSBTV2(DAO?.sbt?.address, DAO?.sbt?.version)

	const token = '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';

	const requestReposIssues = (name: String) => {
		fetch(`https://api.github.com/repos/${name}/issues`,
			{
				headers: {
					'Accept': 'application/vnd.github.v3+json',
					'Authorization': `token ${token}`
				}
			})
			.then(response => response.json())
			.then(data => {
				console.log("github issues : ", data);
				// var newArray = data.map((i: any) => (
				// 	{
				// 		daoId: DAO?._id,
				// 		provider: 'Github',
				// 		name: i.title,
				// 		description: i.body,
				// 		creator: null,
				// 		members: [],
				// 		project: null,
				// 		discussionChannel: i.html_url,
				// 		deadline: null,
				// 		submissionLink: i.html_url,
				// 		compensation: null,
				// 		reviewer: null,
				// 		contributionType: 'open',
				// 		createdAt: i.created_at,
				// 		draftedAt: Date.now(),
				// 	}
				// ))

				// console.log("new array : ", newArray);
				// dispatch(storeGithubIssues({ payload: { daoId: _get(DAO, '_id', null), issueList: newArray } }))
			})
	}

	useEffect(() => {
		if (DAO)
			setChainId(DAO?.chainId)
	}, [DAO])

	useEffect(() => {
		if (myRole)
			setWalkThroughObj(steps(myRole)[0])
	}, [myRole])

	useEffect(() => {
		if (DAO) {
			if (!DAO?.safe) {
				navigate(`/${daoURL}/newsafe`)
			}
		}
	}, [DAO])

	useEffect(() => {
		// if (DAO && !DAO.githubIssues) {
		// 	console.log("fetching...")
		// 	// https://github.com/Lomads-Technologies/token-gating
		// 	requestReposIssues('Lomads-Technologies/token-gating');
		// }
		// requestReposIssues('Lomads-Technologies/soulbound-token');
	}, [DAO]);

	useEffect(() => {
		if (DAO && user && (!user?.onboardingViewCount || (user?.onboardingViewCount && user?.onboardingViewCount.indexOf(_get(DAO, '_id', '')) === -1 && user?.onboardingViewCount.length < 2)))
			setShowWalkThrough(true)
	}, [DAO, user])

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'role1')
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

	useEffect(() => {
		if (account)
			getENSName(account)
	}, [account])

	useEffect(() => {
		if(DAO && DAO?.sbt) {
			let mintMembers = DAO?.sbt?.metadata?.map((metadata: any) => {
				return { 
					name: _get(_find(metadata.attributes, attr => attr.trait_type === "Name"), "value", ""),
					address: _get(_find(metadata.attributes, attr => attr.trait_type === "Wallet Address/ENS Domain"), "value", ""),
					role: "role4"
				}
			})
			mintMembers = mintMembers.filter((member: any) => member.address !== "").filter((member: any) => _find(DAO?.members, (m:any) => toChecksumAddress(m?.member?.wallet) !== toChecksumAddress(member?.address)))
			if(mintMembers.length > 0){
				dispatch(addDaoMemberList({ url: DAO?.url, payload: { list: mintMembers } }))
			}
		}
	}, [DAO?.createdAt])

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

	const toggleShowCreateRecurring = () => {
		setShowCreateRecurring((prev: boolean) => {
			if (prev) {
				treasuryRef?.current?.reload()
				setRecurringTxn(null)
			}
			return !prev
		});
	}

	const showSideBar = (_choice: boolean) => {
		setShowNavBar(_choice);
	};

	const handleSwitchChain = async (nextChain: number) => {
		console.log("nextChain", nextChain)
		if (currentChainId !== nextChain) {
			//sessionStorage.setItem('___lmds_chain_switch', "1");
			await switchChain(connector, nextChain)
			// .then(res => {
			// 	//window.location.href = '/'
			// })
			// .catch(e => {
			// 	sessionStorage.clear();
			// })
		}
	}

	const prevDAO = usePrevious(DAO);

	useEffect(() => {
		if (prevDAO && !DAO) {
			setSafeTokens([])
			setSafeOwners(null)
		}
	}, [DAO, prevDAO])


	useEffect(() => {
		if (chainId && !account)
			navigate("/login", {
				replace: true,
				state: {
					from: window.location.pathname
				}
			});
	}, [chainId, account])

	useEffect(() => {
		if (account) {
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
	}, [account, DAOList, daoURL])

	const validateMetaData = () => {
		if(+DAO?.sbt?.version >=2){
			return
		}
		if (_get(DAO, 'sbt.contactDetail', null)) {
			const contactdetails = _get(DAO, 'sbt.contactDetail', []);
			for (let index = 0; index < contactdetails.length; index++) {
				const contact = contactdetails[index];
				if (['email', 'discord', 'github', 'telegram'].indexOf(contact) === -1) {
					continue;
				}
				let shouldUpdate = true;
				const myMetadata = _find(_get(DAO, 'sbt.metadata', []), m => {
					return _find(m.attributes, a => a.value === account)
				})
				if (myMetadata && myMetadata.attributes) {
					for (let index = 0; index < myMetadata.attributes.length; index++) {
						const attribute = myMetadata.attributes[index];
						if (contact === attribute.trait_type.toLowerCase()) {
							if (attribute.value && attribute.value !== "") {
								shouldUpdate = false
							}
						}
					}
				}
				if (shouldUpdate) {
					console.log("balanceOf::::",)
					if(+DAO.sbt.version >= 2) 
						navigate(`/${DAO.url}/mint/v2/${DAO.sbt.address}`);
					else
						navigate(`/${DAO.url}/mint/${DAO.sbt.address}`);
					break;
				}
			}
		}
		if (from)
			navigate(from)
	}

	useEffect(() => {
		const check = async () => {
			if (chainId && DAO && DAO.sbt && account) {
				let balance = null;
				if(+DAO?.sbt?.version >= 2) {
					let bal = await balanceOf()
					balance =  parseInt(bal._hex, 16)
					console.log("BALANCE_checkinttt", balance)
				} else {
					let res = await getStats(DAO.sbt.chainId || DAO?.chainId)
					balance = res[0];
					balance =  parseInt(res[0]._hex, 16)
				}
				//if (chainId === DAO.chainId) {
				if (DAO?.sbt?.whitelisted) {
					if (_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase())) {
						if (balance === 0) {
							if(+DAO.sbt.version >= 2) 
								navigate(`/${DAO.url}/mint/v2/${DAO.sbt.address}`);
							else
								navigate(`/${DAO.url}/mint/${DAO.sbt.address}`);
						} else {
							// check if data has been filled show mint page. with prefilled data. save data without minting again
							validateMetaData()
						}
					} else {
						navigate('/only-whitelisted')
					}
				} else if (!DAO?.sbt?.whitelisted) {
					if (_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase())) {
						if (balance === 0) {
							if(+DAO.sbt.version >= 2) 
								navigate(`/${DAO.url}/mint/v2/${DAO.sbt.address}`);
							else
								navigate(`/${DAO.url}/mint/${DAO.sbt.address}`);
						} else {
							// check if data has been filled show mint page. with prefilled data. save data without minting again
							validateMetaData()
						}
					} else {
						//add to DAO
						if (balance === 0) {
							if(+DAO.sbt.version >= 2) 
								navigate(`/${DAO.url}/mint/v2/${DAO.sbt.address}`);
							else
								navigate(`/${DAO.url}/mint/${DAO.sbt.address}`);
						} else {
							// check if data has been filled show mint page. with prefilled data. save data without minting again
							validateMetaData()
						}
					}
				}
			}
		}
		if (chainId && DAO && DAO.sbt && account) {
			check();
		}
	}, [chainId, DAO, account]);

	useEffect(() => {
		if (account && chainId && (!user || (user && user.wallet.toLowerCase() !== account.toLowerCase()))) {
			dispatch(getCurrentUser({}))
		}
	}, [account, chainId, user])


	// useEffect(() => {
	// 	if (DAO && chainId) {
	// 		const manualSwitch = sessionStorage.getItem('___lmds_chain_switch');
	// 		sessionStorage.clear()
	// 		if (((DAO.chainId !== chainId) && !manualSwitch)) {
	// 			setValidDaoChain(false)
	// 			switchChain(connector, DAO.chainId)
	// 		}
	// 		else
	// 			setValidDaoChain(true)
	// 	}
	// }, [DAO, chainId, manualChainSwitch]);

	useEffect(() => {
		if (DAO && account && chainId) {
			//if (chainId === DAO.chainId) {
			if (!DAO.sbt) {
				if (!_find(DAO.members, member => member.member.wallet.toLowerCase() === account.toLowerCase()))
					navigate('/noaccess')
			}
			//}
		}
	}, [DAO, account, chainId]);

	useEffect(() => {
		if (DAO && chainId) {
			dispatch(updateSafeAddress(_get(DAO, 'safe.address', '')))
		}
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
		if (chainId) {
			const safe = await axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${_safeAddress}`, { withCredentials: false }).then(res => res.data)
			// const safeSDK = await ImportSafe(provider, _safeAddress);
			const owners = safe?.owners
			//dispatch(syncSafeOwners({ daoUrl: DAO.url, payload: owners }))
			const threshold = safe?.threshold;
			dispatch(updateSafeThreshold(threshold));
			setOwnerCount(owners.length);
			const dao = await axiosHttp.patch(`dao/${DAO.url}/sync-safe-owners`, owners)
			//dispatch(setDAO(dao.data))
		}
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
					setCheckLoading(false)
				});
	};

	useEffect(() => {
		if (chainId && DAO && (DAO?.safe?.chainId === chainId || DAO?.chainId === chainId)) {
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

	const swtBalance = useMemo(() => {
		if (DAO && user) {
			const swt = _find(_get(user, 'earnings', []), (e: any) => e.currency === 'SWEAT' && e.daoId === _get(DAO, '_id'))
			if (swt)
				return _get(swt, 'value', 0)
		}
		return 0
	}, [user, DAO])

	const tokenDollarBalance = useMemo(() => {
		if (DAO && user) {
			let usdVal = 0
			const myTokens = _get(user, 'earnings', []).filter((e: any) => e.daoId === _get(DAO, '_id'))
			for (let index = 0; index < myTokens.length; index++) {
				const myToken = myTokens[index];
				const safeTkn = _find(safeTokens, (st: any) => (st.tokenAddress ? st.tokenAddress : process.env.REACT_APP_NATIVE_TOKEN_ADDRESS) === myToken.currency)
				if (safeTkn) {
					console.log("safeTkn", safeTkn, myToken)
					usdVal = usdVal + (+_get(safeTkn, 'fiatConversion', 0) * _get(myToken, 'value', 0))
				}
			}
			return (usdVal || 0).toFixed(2)
		}
		return 0
	}, [user, safeTokens, DAO])

	const handleOnRecurringEdit = (txn: any) => {
		setRecurringTxn(txn)
		setShowCreateRecurring(true)
	}

	const endWalkThrough = () => {
		dispatch(updateUserOnboardingCount({ payload: { daoId: _get(DAO, '_id', '') } }))
		setShowWalkThrough(false)
		clearWalkThroughStyles()
		setWalkThroughObj(Steps(myRole)[0])
	}

	const clearWalkThroughStyles = () => {
		if (anchorRef.current) {
			anchorRef.current.style = {}
		}
	}
	const incrementWalkThroughSteps = () => {
		clearWalkThroughStyles()
		if (currWalkThroughObj?.step === 7) {
			endWalkThrough()
			return
		}

		let nextStep = currWalkThroughObj?.step + 1
		while (showWalkThrough
			&& !document.getElementById(Steps(myRole)[nextStep]?.id)
			&& nextStep < 7) {
			nextStep++
		}
		const nextObj = Steps(myRole)[nextStep]
		setWalkThroughStyles(nextObj)
		setWalkThroughObj(nextObj)
	}

	const setWalkThroughStyles = (nextObj: WalkThroughObjType) => {
		anchorRef.current = document.getElementById(nextObj.id)
		anchorRef.current.style.zIndex = 2500
		anchorRef.current.scrollIntoView({
			behavior: 'smooth',
			block: 'end',
			inline: 'end'
		});
		if (nextObj.step === 6) {
			anchorRef.current.style.boxShadow = '0px 0px 20px rgba(181, 28, 72, 0.6)'
		}
	}
	const startWalkThroughAtStepOne = () => {
		setShowWalkThrough(true)
		const workspace = Steps(myRole)[1]
		setWalkThroughObj(workspace)
		setWalkThroughStyles(workspace)
	}

	const expandHelpOptions = () => {
		setIsHelpIconOpen(!isHelpIconOpen)
	}

	const getQuestionImage = (): string => {
		return ((showWalkThrough && currWalkThroughObj?.step === 7) || isHelpIconOpen)
			? questionMarkDark
			: questionMarkLight
	}

	useEffect(() => {
		function handleClick(event: any) {
			if (isHelpIconOpen && (event.target.matches('div.help-card')
				|| event.target.matches('div.walkThroughOverlay')
				|| event.target.matches('span.bold-text')
				|| event.target.matches('span.help-card-content'))) {
				event.preventDefault()
				setIsHelpIconOpen(false)
			}
		}
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	});

	if (matches) {
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
				{(!checkLoading && validDaoChain && DAO && !DAOLoading && daoURL && DAO && DAO.url === daoURL) && (showWalkThrough || isHelpIconOpen)
					&& <div className="walkThroughOverlay"></div>}
				{(!checkLoading && validDaoChain && DAO && !DAOLoading && daoURL && DAO && DAO.url === daoURL)
					?
					<WalkThroughModal
						incrementWalkThroughSteps={incrementWalkThroughSteps}
						showConfirmation={showWalkThrough && currWalkThroughObj?.step === 0}
						endWalkThrough={endWalkThrough}
						obj={currWalkThroughObj}
					/> : null
				}
				<WalkThroughPopover
					displayPopover={showWalkThrough && currWalkThroughObj?.step > 0}
					obj={currWalkThroughObj}
					incrementWalkThroughSteps={incrementWalkThroughSteps}
					endWalkThrough={endWalkThrough}
					anchorEl={anchorRef.current}
				/>
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

						<div className="DAOsettings-container">
							<div className="DAOsettings">
								<div className="DAOadminPill">
									<p>{displayRole}</p>
								</div>
								<div className="tokens">
									<div className="token">
										<img src={tokenDashboard} />
										<div className="text">${tokenDollarBalance}</div>
									</div>
									{_get(DAO, 'sweatPoints', false) === true &&
										<div className="token">
											<img src={starDashboard} />
											<div className="text">{swtBalance}</div>
										</div>
									}
								</div>
								<select name="chain" id="chain" value={currentChainId} onChange={e => handleSwitchChain(+e.target.value)} className="chain" style={{ width: 150 }}>
									{
										SUPPORTED_CHAIN_IDS.map(chain => <option value={+chain}>{CHAIN_IDS_TO_NAMES[chain]}</option>)
									}
								</select>

							</div>
						</div>
					</div>

					<LinksArea
						links={_get(DAO, 'links', [])}
						isHelpIconOpen={isHelpIconOpen}
					/>

					<Notifications isHelpIconOpen={isHelpIconOpen} />

					{/* {pendingTransactions !== undefined &&
					pendingTransactions?.count >= 1 &&
					showNotification && can(myRole, 'notification.view') && (
						<NotificationArea
							daoId={DAO._id}
							pendingTransactionCount={pendingTransactions?.count}
							showNotificationArea={showNotificationArea}
						/>
					)} */}
					<MyProject isHelpIconOpen={isHelpIconOpen} />
					<Tasks
						toggleShowCreateTask={toggleShowCreateTask}
						onlyProjects={false}
						isHelpIconOpen={isHelpIconOpen} />

					{(can(myRole, 'transaction.view') || isSafeOwner) && DAO && daoURL === _get(DAO, 'url', '') &&
						<TreasuryCard
							innerRef={treasuryRef}
							onRecurringEdit={handleOnRecurringEdit}
							safeAddress={safeAddress}
							pendingTransactions={pendingTransactions}
							executedTransactions={executedTransactions}
							ownerCount={ownerCount}
							toggleModal={toggleModal}
							fiatBalance={safeTokens}
							account={account}
							onChangePendingTransactions={(tx: any) => setPendingTransactions(tx)}
							tokens={safeTokens}
							toggleShowCreateRecurring={toggleShowCreateRecurring}
							isHelpIconOpen={isHelpIconOpen}
						/>}
					{can(myRole, 'members.view') &&
						<MemberCard
							totalMembers={totalMembers}
							toggleShowMember={toggleShowMember}
							toggleShowEditMember={toggleShowEditMember}
							isHelpIconOpen={isHelpIconOpen}
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
				<div className={`help-option ${isHelpIconOpen ? 'z-index-1000' : ''}`}
					id="question-mark"
					ref={questionMarkRef}
					onClick={expandHelpOptions}>
					{isHelpIconOpen
						&&
						<Stack spacing={2}>
							<PlayWalkThroughButton
								variant="contained"
								className="play-walkthrough"
								onClick={startWalkThroughAtStepOne}>
								Play walk through
							</PlayWalkThroughButton>
							<HideHelpIconButton
								startIcon={<CloseIcon />}
								onClick={() => questionMarkRef.current.style.display = 'none'}
								variant="contained">
								Hide help icon
							</HideHelpIconButton>
						</Stack>
					}
					<img src={getQuestionImage()} />
				</div>
				<SideBar
					name={_get(DAO, 'name', '')}
					showSideBar={showSideBar}
					showNavBar={showNavBar}
					isHelpIconOpen={isHelpIconOpen}
				/>
				{showAddMember && <AddMember toggleShowMember={toggleShowMember} />}
				{showEditMember && <EditMember toggleShowEditMember={toggleShowEditMember} DAO={DAO} amIAdmin={amIAdmin} account={account} />}

				{/* create task side modal */}
				{showCreateTask
					&& <CreateTask toggleShowCreateTask={toggleShowCreateTask} selectedProject={null} />}

				{/* Create recurring payment side modal */}
				{showCreateRecurring && <CreateRecurring transaction={recurringTxn} onRecurringPaymentCreated={() => treasuryRef?.current?.reload()} toggleShowCreateRecurring={toggleShowCreateRecurring} />}

			</>
		);
	}
	else {
		return (
			<Grid container className={classes.root}>
				<Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
					<Box position="absolute" top={0} left={0} sx={{ padding: '30px' }}>
						<img src={LOMADLOGO} />
					</Box>
					<Box>
						<img src={MOBILEDEVICE} />
					</Box>
					<Box sx={{ padding: '0 30px' }}>
						<Typography className={classes.subtitle1}>Lomads app needs a PC<br />for now.</Typography>
						<Typography className={classes.subtitle2} sx={{ fontWeight: '800' }}>CATCH YOU ON<br />THE <span style={{ fontWeight: '300', fontStyle: 'italic', color: '#C94B32' }}>BIG SCREEN</span></Typography>
					</Box>
				</Grid>
			</Grid>
		)
	}
};

export default Dashboard;
