import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import TextInput from '../../muiComponents/TextInput'
import { InviteGangType } from "types/UItype";
import IconButton from "../../muiComponents/IconButton";
import Button from "muiComponents/Button";
import createProjectSvg from '../../assets/svg/createProject.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import binRed from '../../assets/svg/bin-red.svg';
import binWhite from '../../assets/svg/bin-white.svg';
import plusIcon from '../../assets/svg/plusIcon.svg';
import closeOrange from '../../assets/svg/closeOrange.svg';
import GreyAddIcon from '../../assets/svg/ADD.svg';
import useEns from 'hooks/useEns';
import useTerminology from "hooks/useTerminology";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { toast } from 'react-hot-toast';
import {
	updateOwners,
	updateSafeAddress,
	updatesafeName,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateDaoName,
	updateInvitedGang,
	appendInviteMembers
} from "state/flow/reducer";
import { SUPPORTED_CHAIN_IDS, SupportedChainId, CHAIN_GAS_STATION } from 'constants/chains'
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import { CHAIN_INFO } from 'constants/chainInfo';
import { createDAO } from '../../state/flow/actions';
import { loadDao } from '../../state/dashboard/actions';
import { Box, Typography, Container, Grid } from "@mui/material"
import { makeStyles } from '@mui/styles';
import MuiSelect from '../../muiComponents/Select'
import SwitchChain from 'components/SwitchChain';
import axios from "axios";
import Avatar from "muiComponents/Avatar";
import { margin } from "polished";

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: "100vh",
		maxHeight: 'fit-content',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		overflow: 'hidden !important'
	},
	text: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		fontWeight: 400,
		fontSize: 14,
		letterSpacing: '-0.011em',
		color: '#76808D'
	},
	inputFieldTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#1B2B41',
		opacity: 0.5
	},
	safeNameTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#1B2B41',
		opacity: 0.5,
		marginBottom: 6.71,
		marginTop: 15
	},
	centerCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyItems: 'flex-start',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: 5,
		maxHeight: 'fit-content',
		padding: 20,
		margin: 35,
		width: 385
	},
	thresholdText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#76808D',
	},
	StartSafe: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content',
		padding: '20vh 0vh 10vh 0vh'
	},
	addOwner: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyItems: 'flex-start',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: 5,
		maxHeight: 'fit-content',
		width: 551,
		padding: 20,
		marginTop: 35,
		marginBottom: 35
	},
	owner: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '2vh 0vh 2vh 0vh'
	},
	avatarName: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '30%'
	},
	nameText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 14,
		letterSpacing: '-0.011em',
		color: '#76808D',
		paddingLeft: 26,
		textAlign: 'center',
	},
	cardButton: {
		marginTop: 25,
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	centerText: {
		fontSize: 20,
		fontWeight: 400,
		color: '#C94B32',
		padding: 16
	},
	buttonArea: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 35
	},
	selectionArea: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		textAlign: 'center'
	},
	thresholdCount: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#76808D',
	},
	headerText: {
		fontFamily: 'Insignia',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '35px',
		lineHeight: '35px',
		paddingBottom: '30px',
		textAlign: 'center',
		color: '#C94B32'
	},
	boldText: {
		fontWeight: 800
	},
	safeFooter: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		fontWeight: 400,
		fontSize: 14,
		letterSpacing: '-0.011em',
		color: '#76808D',
		width: 480,
		textAlign: 'center',
		paddingBottom: 9,
		marginBottom: 35
	},
	bottomLine: {
		margin: 20,
		width: 210,
		height: 2,
		backgroundColor: '#C94B32',
		border: '2px solid #C94B32',
		position: 'relative',
		borderRadius: 50
	},
	InviteGang: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		margin: '35px 0px 15px 0px'
	},
	centerInputCard: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyItems: 'flex-start',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: '5px',
		maxHeight: 'fit-content',
		padding: '26px 22px 30px 22px',
		width: 541,
		gap: '10px'
	},
	inputTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 16,
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '0vh 0px 0vh 1vh'
	},
	inputArea: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	inputField: {
		width: '500px',
		height: '90px',
		textAlign: 'justify',
		paddingLeft: '10px',
		background: '#f5f5f5',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: '10px',
		borderWidth: '0px',
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '18px',
		color: '#76808D'
	},
	membersModalFooter: {
		width: '768px',
		height: '100px',
		position: 'fixed',
		bottom: '0',
		right: '0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	membersModalFooterCancelBtn: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: '5px',
		height: '40px',
		background: '#FFFFFF',
		border: '1px solid #C94B32',
		color: '#C94B32',
		width: '130px',
		marginRight: '20px',
	},
	invitedMembers: {
		padding: '26px 22px',
		backgroundColor: 'rgba(118, 128, 141, 0.09)',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: '0px 0px 5px 5px',
		width: 497,
		maxHeight: 500,
		overflow: 'hidden',
		overflowY: 'auto'
	},
	avatarPlusName: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '30%',
	},
	avatarAddress: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '25%',
	},
	avatarRole: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '35%',
	},
	tokenDropdown: {
		background: 'linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)',
		borderRadius: '10px',
		width: '13vw',
		height: '50px',
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		padding: '0px 15px 0px 15px',
		marginTop: '10px',
		marginRight: '25px',
	},
	membersModal: {
		width: 768,
		height: 768,
		backgroundColor: 'white',
		position: 'absolute',
		top: '50%',
		right: '50%',
		transform: 'translate(50%, -50%)',
		borderRadius: 20,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '65px 65px 0 65px',
		zIndex: 999
	},
	membersModalHeader: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: '20px'
	},
	membersModalBody: {
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		overflowY: 'scroll',
		marginBottom: '100px',
	},
	membersModalRow: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 20,
		position: 'relative',
	},
	rowOvercast: {
		width: '100%',
		height: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.5)',
		position: 'absolute',
		zIndex: 998
	},
	addButton: {
		padding: '0px 10px 0px 10px',
		borderRadius: '5px',
		borderWidth: '0px',
		borderColor: '#FFFFFF',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#FFFFFF'
	},
	avatarBtn: {
		display: 'flex',
		justifyContent: 'flex-end',
		alignItems: 'center',
		width: '10%',
	},
	deleteButton: {
		backgroundColor: '#76808D',
		padding: '5px',
		borderRadius: '5px',
		color: '#FFFFFF',
		cursor: 'pointer',
	},
	confirmBtn: {
		background: '#C94B32',
		color: '#FFF',
		width: '210px',
	},
	selected: {
		background: '#B12F15'
	},
	infoText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'italic',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '25px',
		textAlign: 'center',
		letterSpacing: '-0.011em',
		color: '#76808D',
		textDecoration: 'underline',
		cursor: 'pointer',
	}
}));

export default () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { provider, account, chainId } = useWeb3React();
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const [myowers, setMyOwers] = useState<InviteGangType[]>(invitedMembers);
	const [showContinue, setshowContinue] = useState<boolean>(true);
	const [ownerSelected, setOwnerSelected] = useState<boolean>(false);
	const [errors, setErrors] = useState<any>({});
	const [selectedChainId, setSelectedChainId] = useState<number>(SupportedChainId.GOERLI)
	const [isLoading, setisLoading] = useState<boolean>(false);
	const safeName = useAppSelector((state) => state.flow.safeName);
	const selectedOwners = useAppSelector((state) => state.flow.owners);
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const createDAOLoading = useAppSelector((state) => state.flow.createDAOLoading);
	const { DAOList } = useAppSelector((state) => state.dashboard);
	const flow = useAppSelector((state) => state.flow);
	let Myvalue = useRef<Array<InviteGangType>>([...invitedMembers]);
	const [polygonGasEstimate, setPolygonGasEstimate] = useState<any>(null)

	//let thresholdValue = useRef<string>("");
	const [thresholdValue, setThresholdValue] = useState<number>(1);

	useEffect(() => {
		if (invitedMembers && invitedMembers.length > 0) {
			const { name, address } = invitedMembers[0];
			const creator = { name: name, address: address };
			const check = Myvalue.current.some(
				(owner) => owner.address === creator.address
			);
			if (!check) {
				Myvalue.current.push(creator);
			}
		}
	}, [invitedMembers]);

	useEffect(() => {
		if (chainId && +chainId === SupportedChainId.POLYGON) {
			axios.get(CHAIN_GAS_STATION[`${chainId}`].url)
				.then(res => setPolygonGasEstimate(res.data))
		}
	}, [chainId])

	useEffect(() => {
		if (chainId)
			dispatch(loadDao({ chainId }))
	}, [chainId])

	const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
		// const index: number = parseInt(event.target.value);
		const checked = event.target.checked;
		if (checked) {
			const index = myowers.findIndex(
				(result: InviteGangType) => result.address === event.target.value
			);
			const newData: InviteGangType = myowers[index];
			Myvalue.current.push(newData);
		} else {
			const refIndex = Myvalue.current.findIndex(
				(result: InviteGangType) => result.address === event.target.value
			);
			Myvalue.current.splice(refIndex, 1);
		}
	};

	useEffect(() => {
		if (createDAOLoading == false) {
			setisLoading(false)
			dispatch(updateSafeAddress(''))
			dispatch(updatesafeName(''))
			dispatch(updateDaoName(''))
			dispatch(updateInvitedGang([]))
			dispatch(updateTotalMembers([]))
			dispatch(resetCreateDAOLoader())
			return navigate(`/success?dao=${flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, '')}`);
		}
		if (createDAOLoading == true)
			setisLoading(true)
	}, [createDAOLoading])

	const handleSafeName = () => {
		let terrors: any = {};
		if (!safeName) {
			terrors.safeName = " * Multi-sig Wallet Name is required";
		}
		if (_.isEmpty(terrors)) {
			setshowContinue(false);
			//window.scrollTo(0, document.body.scrollHeight);
		} else {
			setErrors(terrors);
		}
	};


	const runAfterCreation = async (addr: string, owners: any) => {
		console.log("runAfterCreation", "safe addr", addr)
		if (!addr) return;
		dispatch(updateSafeAddress(addr as string));
		const totalAddresses = [...invitedMembers, ...Myvalue.current];
		const value = totalAddresses.reduce((final: any, current: any) => {
			let object = final.find(
				(item: any) => item.address === current.address
			);
			if (object) {
				return final;
			}
			return final.concat([current]);
		}, []);
		dispatch(updateTotalMembers(value));
		//setisLoading(false);
		const payload: any = {
			contractAddress: '',
			chainId,
			name: flow.daoName,
			url: flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, ''),
			image: flow.daoImage,
			members: value.map((m: any) => {
				return {
					...m, creator: m.address.toLowerCase() === account?.toLowerCase()
				}
			}),
			safe: {
				name: safeName,
				address: addr,
				owners: owners,
			}
		}
		dispatch(createDAO(payload))
		setisLoading(false);
	}

	const waitFor = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

	const retry = (promise: any, onRetry: any, maxRetries: number) => {
		const retryWithBackoff: any = async (retries: number) => {
			try {
				if (retries > 0) {
					const timeToWait = 2 ** retries * 1000;
					console.log(`waiting for ${timeToWait}ms...`);
					await waitFor(timeToWait);
				}
				return await promise();
			} catch (e) {
				if (retries < maxRetries) {
					onRetry();
					return retryWithBackoff(retries + 1);
				} else {
					console.warn("Max retries reached. Bubbling the error up");
					throw e;
				}
			}
		}
		return retryWithBackoff(0);
	}

	const hasNewSafe = async (currentSafes: any) => {
		try {
			const latestSafes = await axios.get(`https://safe-transaction-polygon.safe.global/api/v1/owners/${account}/safes/`).then(res => res.data.safes);
			if (latestSafes.length > currentSafes.length)
				return latestSafes
			else
				throw 'SAFE NOT FOUND'
		} catch (e) {
			throw e
		}
	}

	const checkNewSafe = async (currentSafes: any, owners: any) => {
		const latestSafes = await retry(
			() => hasNewSafe(currentSafes),
			() => { console.log('retry called...') },
			50
		)
		if (latestSafes) {
			let newSafeAddr = _.find(latestSafes, ls => currentSafes.indexOf(ls) === -1)
			console.log("FOUND NEW SAFE", newSafeAddr)
			if (newSafeAddr)
				runAfterCreation(newSafeAddr, owners)
			else
				console.log("checkNewSafe", "Could not find new safe")
		} else {
			setisLoading(false);
		}
	}

	const deployNewSafe = async () => {
		if(selectedChainId !== chainId) {
            toast.custom(t => <SwitchChain t={t} nextChainId={selectedChainId}/>)
        } else {
			try {
				setisLoading(true);
				dispatch(updateOwners(Myvalue.current));
				const safeOwner = provider?.getSigner(0);
		
				const ethAdapter = new EthersAdapter({
					ethers,
					signer: safeOwner as any,
				});
				console.log(await ethAdapter.getChainId())
				const safeFactory = await SafeFactory.create({
					ethAdapter,
				});
				const owners: any = Myvalue.current.map((result) => {
					return result.address;
				});
				console.log(owners);
				const threshold: number = thresholdValue;
				console.log(threshold);
				const safeAccountConfig: SafeAccountConfig = {
					owners,
					threshold,
				};
		
				let currentSafes: Array<string> = []
				if (chainId === SupportedChainId.POLYGON)
					currentSafes = await axios.get(`https://safe-transaction-polygon.safe.global/api/v1/owners/${account}/safes/`).then(res => res.data.safes);
		
				console.log("currentSafes", currentSafes)
		
				await safeFactory
					.deploySafe({ safeAccountConfig })
					.then(async (tx) => {
						dispatch(updateSafeAddress(tx.getAddress() as string));
						const totalAddresses = [...invitedMembers, ...Myvalue.current];
						const value = totalAddresses.reduce((final: any, current: any) => {
							let object = final.find(
								(item: any) => item.address === current.address
							);
							if (object) {
								return final;
							}
							return final.concat([current]);
						}, []);
						dispatch(updateTotalMembers(value));
						//setisLoading(false);
						const payload: any = {
							contractAddress: '',
							chainId,
							name: flow.daoName,
							url: flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, ''),
							image: null,
							members: value.map((m: any) => {
								return {
									...m, creator: m.address.toLowerCase() === account?.toLowerCase(), role: owners.map((a: any) => a.toLowerCase()).indexOf(m.address.toLowerCase()) > -1 ? 'role1' : m.role ? m.role : 'role4'
								}
							}),
							safe: {
								name: safeName,
								address: tx.getAddress(),
								owners: owners,
							}
						}
						dispatch(createDAO(payload))
					})
					.catch(async (err) => {
						console.log("An error occured while creating safe", err);
						if (chainId === SupportedChainId.POLYGON) {
							checkNewSafe(currentSafes, owners)
						} else {
							setisLoading(false);
						}
					});
			} catch (e) {
				setisLoading(false);
				console.log(e)
			}
		}
	};

	const deployNewSafeDelayed = useCallback(_.debounce(deployNewSafe, 1000), [deployNewSafe])

	const hiddenFileInput = useRef<HTMLInputElement>(null);
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);
	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [ownerRole, setOwnerRole] = useState<string>("role4");
	const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
	const { transformRole } = useTerminology(_.get(DAO, 'terminologies'))
	const { getENSAddress, getENSName } = useEns();
	const [showModal, setShowModal] = useState(false);
	const [deleteMembers, setDeleteMembers] = useState<string[]>([]);
	const [validMembers, setValidMembers] = useState<{ address: string; name: string, role: string }[]>([]);

	const isAddressValid = (holderAddress: string) => {
		const ENSdomain = holderAddress.slice(-4);
		if (ENSdomain === ".eth") {
			return true;
		} else {
			const isValid: boolean = ethers.utils.isAddress(holderAddress);
			return isValid;
		}
	};

	const isRightAddress = (holderAddress: string) => {
		const isValid: boolean = ethers.utils.isAddress(holderAddress);
		return isValid;
	};

	const isPresent = (_address: string) => {
		const check = invitedMembers.some((mem) => mem.address === _address);
		return check;
	};
	useEffect(() => {
		const check = invitedMembers.some(
			(member) => member.address === (account as string)
		);
		if (!check) {
			let creator = [
				...invitedMembers,
				{ name: "", address: account as string, role: 'role2' },
			];
			creator = creator.filter(c => c.address !== undefined)
			dispatch(updateInvitedGang(creator));
		}
	}, []);

	useEffect(() => {
		isAddressValid(ownerAddress);
	}, [ownerAddress]);

	useEffect(() => {
		isPresent(ownerAddress);
	}, [ownerAddress]);

	const addMember = useCallback((_ownerName: string, _ownerAddress: string, _ownerRole: string) => {
		return new Promise(async (resolve, reject) => {
			const member = { name: _ownerName, address: _ownerAddress, role: _ownerRole };
			if (_ownerAddress.slice(-4) === ".eth") {
				const EnsAddress = await getENSAddress(_ownerAddress);
				console.log("74 ensAddress : ", EnsAddress);
				if (EnsAddress !== undefined) {
					member.address = EnsAddress as string;
					member.name = _ownerName !== '' ? _ownerName : _ownerAddress;
					const present = isPresent(member.address);
					present && setErrors({ ownerAddress: " * address already exists." });
				}
				else {
					setErrors({ ownerAddress: " * address is not correct." });
					member.address = _ownerAddress;
				}
			}
			else {
				let ENSname = null;
				ENSname = await getENSName(_ownerAddress)
				if (ENSname) {
					member.name = _ownerName !== '' ? _ownerName : ENSname;
				}
				else {
					member.name = _ownerName;
				}

				Myvalue.current.push(member)
			}
			if (!isPresent(member.address) && isRightAddress(member.address)) {
				const newMember = [...invitedMembers, member];
				dispatch(updateInvitedGang(newMember));
				setOwnerName("");
				setOwnerAddress("");
			}
			resolve(true);
		})
	}, [invitedMembers]);

	const handleClick = (_ownerName: string, _ownerAddress: string, _ownerRole: string) => {
		let terrors: any = {};
		if (!isAddressValid(ownerAddress)) {
			terrors.ownerAddress = " * address is not correct.";
		}
		if (isPresent(ownerAddress)) {
			terrors.ownerAddress = " * address already exists.";
		}
		if (_.isEmpty(terrors)) {
			addMember(_ownerName, _ownerAddress, _ownerRole);
		}
		else {
			setErrors(terrors);
		}
	};

	const deleteMember = (_address: any) => {
		const deleteMember = [...invitedMembers];

		const newContract = deleteMember.splice(
			deleteMember.findIndex((ele) => ele.address === _address),
			1
		);
		dispatch(updateInvitedGang(deleteMember));
		console.log(newContract);
		const refIndex = Myvalue.current.findIndex(
			(result: InviteGangType) => result.address === _address
		);
		Myvalue.current.splice(refIndex, 1);
	};

	const handleCloseModal = () => {
		setValidMembers([]);
		setDeleteMembers([]);
		setShowModal(false);
	}

	const handleChangeState = (e: any, index: any) => {
		const newArray = validMembers.map((item, i) => {
			if (index === i) {
				return { ...item, [e.target.name]: e.target.value };
			}
			else {
				return item;
			}
		});
		setValidMembers(newArray);
	}

	const handleDeleteUser = (address: any) => {
		if (deleteMembers.includes(address)) {
			setDeleteMembers(deleteMembers.filter((m) => m !== address));
		}
		else {
			setDeleteMembers([...deleteMembers, address]);
		}
	}

	const handleAppendUploadedMembers = () => {
		try {
			let tempArray = [];
			for (var i = 0; i < validMembers.length; i++) {
				if (deleteMembers.includes(validMembers[i].address) === false) {
					tempArray.push(validMembers[i]);
				}
			}
			dispatch(appendInviteMembers(tempArray));
			setShowModal(false);
		}
		catch (e) {
			console.log(e)
			setShowModal(false);
		}
		finally {
			setDeleteMembers([]);
			setValidMembers([]);
		}
	}

	const setDebounceOwnerName = (event: any) => {
		if (ownerName.length <= 12) {
			setOwnerName(event.target.value);
		}
	}

	const setOwnerSafeAddress = (event: any) => {
		setErrors({ ownerAddress: "" });
		setOwnerAddress(event.target.value);
	}
	const setOwnerSafeAddressAsync = useCallback(_.debounce(setOwnerSafeAddress, 1000), [setOwnerSafeAddress])
	const setOwnerNameAsyn = useCallback(_.debounce(setDebounceOwnerName, 1000), [setDebounceOwnerName])

	const InviteMembersBlock = () => {
		return (
			<>
				<Box className={classes.bottomLine} />
				<Box className={classes.InviteGang}>
					<Box className={classes.centerInputCard}>
						<Box style={{
							width: '100%',
							marginBottom: 8,
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}>
							<Box className={classes.inputTitle}>Add Owner :</Box>
						</Box>
						<Box className={classes.inputArea}>
							<Box style={{ marginRight: '10px' }}>
								<TextInput
									sx={{
										height: 50,
										width: 144
									}}
									placeholder="Name"
									defaultValue={ownerName}
									onChange={setOwnerNameAsyn}
								/>
							</Box>
							<Box sx={{ marginRight: '10px' }}>
								<TextInput
									sx={{
										height: 50,
										width: 251
									}}
									placeholder="ENS Domain and Wallet Address"
									defaultValue={ownerAddress}
									onChange={setOwnerSafeAddressAsync}
									error={!!errors.ownerAddress}
									helperText={errors.ownerAddress}
								/>
							</Box>
							<Box>
								<IconButton
									className={classes.addButton}
									height={50}
									width={50}
									onClick={() => {
										handleClick(ownerName, ownerAddress, ownerRole);
									}}
								>
									<img src={ownerName && ownerAddress ? plusIcon : GreyAddIcon} alt={"add plus"} />
								</IconButton>
							</Box>
						</Box>
					</Box>
					{invitedMembers.length >= 1 && (
						<>
							<Box className={classes.invitedMembers}>
								{invitedMembers.map((result: any, index: any) => {
									return (
										<Box key={index} className={classes.owner}>
											<Box className={classes.avatarPlusName}>
												<Avatar name={result.name} wallet={result.address}/>
												{/* <img src={daoMember2} alt={result.address} />
												<Typography variant="body1" className={classes.nameText}>{result.name}</Typography> */}
											</Box>
											{/* <Box className={classes.avatarAddress}>
												<Typography className={classes.text}>
													{result.address &&
														result.address.slice(0, 6) +
														"..." +
														result.address.slice(-4)}
												</Typography>
											</Box> */}
											<Box className={classes.avatarBtn}>
												{result.address !== account && (
													<IconButton
														className={classes.deleteButton}
														onClick={() => {
															deleteMember(result.address);
														}}
													>
														<img src={closeOrange} alt="close-svg" />
													</IconButton>
												)}
											</Box>

										</Box>
									);
								})}
							</Box>
						</>
					)}
					{
						showModal &&
						<Box className={classes.membersModal}>
							<Box className={classes.membersModalHeader}>
								<img src={createProjectSvg} alt="create-project-svg" />
								<Typography variant="h1">Add Members</Typography>
							</Box>
							<Box className={classes.membersModalBody}>
								{
									validMembers.length > 0
										?
										<>
											{
												validMembers.map((item, index) => (
													<Box className={classes.membersModalRow} key={index}>
														{
															deleteMembers.includes(item.address)
																?
																<Box className={classes.rowOvercast}></Box>
																:
																null
														}
														<Box>
															<img src={memberIcon} alt="memberIcon" />
															<TextInput
																className={classes.inputField}
																id="nameInput"
																sx={{
																	height: 50,
																	width: 135
																}}
																error={!!errors.ownerAddress}
																helperText={errors.ownerAddress}
																placeholder="Name"
																value={item.name}
																name="name"
																onChange={(e: any) => handleChangeState(e, index)}
															/>
														</Box>
														<Typography>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</Typography>
														{
															deleteMembers.includes(item.address)
																?
																<Button onClick={() => handleDeleteUser(item.address)} className={classes.selected}>
																	<img src={binWhite} alt="bin-white" />
																</Button>
																:
																<Button onClick={() => handleDeleteUser(item.address)}>
																	<img src={binRed} alt="bin-red" />
																</Button>
														}

													</Box>
												))
											}
										</>
										:
										<Typography variant="body1">All the users have been already added</Typography>
								}
							</Box>
							<Box className={classes.membersModalFooter}>
								<Button onClick={handleCloseModal} className={classes.membersModalFooterCancelBtn}>
									CANCEL
								</Button>
								{
									validMembers.length > 0 && <Button onClick={handleAppendUploadedMembers} className={classes.confirmBtn}>
										ADD MEMBERS
									</Button>
								}
							</Box>
						</Box>
					}
				</Box>
				<SelectThreshold />
			</>
		);
	};

	const SelectThreshold = () => {
		return (
			<>
				<Box className={classes.bottomLine} />
				<Box className={classes.centerCard}>
					<Box>
						<Typography className={classes.thresholdText} sx={{ my: 1 }}>
							Any transaction requires the confirmation of
						</Typography>
					</Box>
					<Box className={classes.selectionArea}>
						<Box style={{ width: 109}}>
							<MuiSelect
								selected={thresholdValue}
								options={Myvalue.current.map((item, index) => ({ label: index + 1, value: index + 1 }))}
								setSelectedValue={(value) => {
									setThresholdValue(+value)
								}}
							/>
						</Box>
						<Box sx={{ mx: 1 }} className={classes.thresholdCount}>
							of {Myvalue.current.length} owner(s)
						</Box>
					</Box>
				</Box>
				<Typography className={classes.safeFooter}>
					By continuing you consent to the terms of use and privacy policy of Gnosis Safe
				</Typography>
				<Box className={classes.safeFooter}>
					You’re about to create a new safe and will have to confirm a
					transaction with your curentry connected wallet.
					<Typography variant="body1" className={classes.boldText}>
						{chainId && +chainId === SupportedChainId.POLYGON && polygonGasEstimate ? `The creation will cost approximately ${polygonGasEstimate?.standard?.maxFee} GWei.` : `The creation will cost approximately 0.01256 GOR.`}
					</Typography>
					The exact amount will be determinated by your wallet.
				</Box>
				<Button
					variant='contained'
					onClick={deployNewSafeDelayed}
					loading={isLoading}
					sx={{
						bgColor: isLoading ? 'grey' : "#C94B32",
						height: 50,
						width: 250,
						fontsize: 20,
						boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
					}}>
					CREATE
				</Button>
			</>
		);
	};

	return (
		<Container>
			<Grid className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>2/2 Organisation Multi-sig Wallet</Box>
					<Box className={classes.buttonArea}>
						<Box>
							<Button
								sx={{
									color: "#C94B32",
									backgroundColor: "#FFFFFF",
									fontWeight: 400,
									minWidth: 'max-content',
									width: 228,
									boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
								}}
								variant='contained'>
								CREATE
							</Button>
						</Box>
						<Box className={classes.centerText}>or</Box>
						<Box>
							<Button
								sx={{
									backgroundColor: "#FFFFFF",
									minWidth: 'max-content',
									fontWeight: 400,
									opacity: 0.6,
									color: 'rgba(201, 75, 50, 0.6)',
									width: 228
								}}
								onClick={() => navigate('/addsafe')}
								variant='contained'>
								ADD EXISTING
							</Button>
						</Box>
					</Box>
					<Box className={classes.bottomLine} />
					<Box className={classes.centerCard}>
						<Box className={classes.inputFieldTitle}>Select Chain</Box>
						<MuiSelect
							selected={selectedChainId}
							options={SUPPORTED_CHAIN_IDS.map(item => ({ label: CHAIN_INFO[item].label, value: item }))}
							selectStyle={{ py: 1 }}
							setSelectedValue={(value) => {
								setSelectedChainId(value)
							}}
						/>
						<Box className={classes.safeNameTitle}>Multi-sig Wallet Name</Box>
						<TextInput
							fullWidth
							placeholder="Pied Piper"
							value={safeName}
							onChange={(e: any) => {
								dispatch(updatesafeName(e.target.value));
							}}
							error={!!errors.safeName}
							helperText={errors.safeName}
						/>
					</Box>
					{showContinue ? (
						<>
							<Box>
								<Button
									style={{
										maxWidth: 'max-content',
										backgroundColor: safeName ? "#C94B32" : "rgba(27, 43, 65, 0.2)",
										boxShadow: safeName
											? "3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)"
											: undefined,
									}}
									onClick={handleSafeName}
									variant='contained'>
									CONTINUE
								</Button>
							</Box>
						</>
					) : <InviteMembersBlock />}
				</Box>
			</Grid>
		</Container>
	);
};

