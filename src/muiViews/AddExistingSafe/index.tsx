import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { updateHolder } from "state/proposal/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { ImportSafe } from "connection/SafeCall";
import { createDAO } from '../../state/flow/actions';
import coin from "../../assets/svg/coin.svg";
import {
	updateSafeAddress,
	updatesafeName,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateDaoName,
	updateInvitedGang
} from "state/flow/reducer";
import { ethers } from "ethers";
import TextInput from '../../muiComponents/TextInput'
import Button from "muiComponents/Button";
import { Box, Typography, Container, Grid, IconButton } from "@mui/material"
import MuiSelect from '../../muiComponents/Select'
import axios from "axios";
import { InviteGangType } from "types/UItype";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import { makeStyles } from '@mui/styles';
import { CHAIN_INFO } from 'constants/chainInfo';
import safeUserIcon from '../../assets/svg/safeUserIcon.svg'
import downArrow from '../../assets/svg/downArrow.svg'
import { beautifyHexToken } from "utils"
import Avatar from "boring-avatars";

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
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 14,
		lineHeight: 15,
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
	List: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'center',
		background: '#FFFFFF',
		borderRadius: 5,
		maxHeight: 'fit-content',
		margin: 8
	},
	ListItemParent: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		borderRadius: 5,
		width: 360,
		padding: 10,
		height: 64,
		gap: 5,
		cursor: 'pointer'
	},
	ListItemContent: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-start',
		gap: 5,
		cursor: 'pointer'
	},
	ListContent: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		background: '#FFFFFF',
	},
	StartSafe: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content',
		padding: '14vh 0vh 10vh 0vh'
	},
	centerFlexContainer: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content'
	},
	owner: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '2vh 0vh 2vh 0vh'
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
	safeFooter: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: 14,
		lineHeight: 15,
		letterSpacing: '-0.011em',
		color: '#76808D',
		width: 480,
		textAlign: 'center',
		marginBottom: 9,
	},
	inputArea: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	// safeData: {
	// 	display: 'flex',
	// 	flexDirection: 'column',
	// 	alignItems: 'flex-start',
	// 	justifyContent: 'space-between',
	// 	background: '#FFFFFF',
	// 	border: '1px solid #f1f4f4',
	// 	borderRadius: 5,
	// 	maxHeight: 'fit-content',
	// 	width: 385,
	// 	padding: 20,
	// 	marginTop: 2
	// },
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
	safeName: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: 16,
		textAlign: 'left',
		color: '#76808D',
	},
	safeOwners: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		border: '1px solid #f1f4f4',
		borderRadius: 5,
		maxHeight: 'fit-content',
		padding: 20,
		marginTop: 2,
		width: 360,
		textAlign: 'left'
	},
	ownerList: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	address: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
		textAlign: 'right',
		color: '#76808D',
	},
	balance: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	footerText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 14,
		lineHeight: 15,
		letterSpacing: '-0.011em',
		color: '#76808D',
		width: 480,
		textAlign: 'center',
		marginTop: '25px',
		marginBottom: '25px',
	},
	safeBalance: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: 16,
		marginLeft: 8,
		textAlign: 'center',
		color: '#188C7C',
	},
	tokenAssets: {
		display: 'flex',
		flexDirection: 'row',
		gap: '10px',
	},
	asset: {
		height: '5vh',
		width: '5vh',
		backgroundColor: '#F5F5F5',
		borderRadius: '50%',
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	amount: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: 16,
		textAlign: 'center',
		color: '#76808D',
		marginLeft: '1vh',
	},
	ownerCount: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '800',
		fontSize: 18,
		textAlign: 'center',
		color: '#76808D',
		marginLeft: '1vh',
	},
	safeOwner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		marginTop: 10,
		width: 325
	},
	userDetail: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		background: '#FFFFFF',
		gap: 5,
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
	ChainLogo: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#D1D4D9',
		borderRadius: '50%',
		width: 32,
		height: 32,
		margin: 10
	},
	safeContainer: {
		marginBottom: 30,
		display: "flex",
		flexDirection: "column",
		// height: 550,
		// overflowY: "scroll"
	},
	addSafe: {
		position: 'fixed',
		bottom: 13,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	}
}));

export default () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const safeAddress = useAppSelector((state: any) => state.flow.safeAddress);
	const safeName = useAppSelector((state: any) => state.flow.safeName);
	const invitedMembers = useAppSelector((state: any) => state.flow.invitedGang);
	const [safeOwners, setSafeOwners] = useState<string[]>([]);
	const [tokens, setTokens] = useState<any>([]);
	const [errors, setErrors] = useState<any>({});
	const [balance, setBalance] = useState<string>("");
	const [selectedSafeAddress, setSelectedSafeAddress] = useState<string>("");
	const [expand, setExpand] = useState<boolean>(false);
	const [isLoading, setisLoading] = useState<boolean>(false);
	const [safeList, setSafeList] = useState<any>([]);
	const owners = useRef<InviteGangType[]>([]);
	const [selectedChainId, setSelectedChainId] = useState<number>(SupportedChainId.GOERLI)
	const flow = useAppSelector((state: any) => state.flow);
	const createDAOLoading = useAppSelector((state: any) => state.flow.createDAOLoading);
	const { provider, account, chainId } = useWeb3React();

	useEffect(() => {
		dispatch(updateSafeAddress(""));
		dispatch(updateTotalMembers([]))
	}, [])

	const getSafeDetails = (item: string) => {
		if (!expand || selectedSafeAddress !== item) {
			setExpand(true)
			UseExistingSafe(item)
			return
		}
		setExpand(false)
	}
	const UseExistingSafe = useCallback(async (value: string = selectedSafeAddress) => {
		if (isLoading) return;
		if (selectedChainId) {
			owners.current = [];
			setisLoading(true);
			// const jsonRpcProvider = new ethers.providers.JsonRpcProvider(_.get(INFURA_NETWORK_URLS,`${selectedChainId}`))
			// ImportSafe(jsonRpcProvider, value)
			// 	.then(async safeSDK => {
			// 		console.log("safeSDK", safeSDK)
			dispatch(updateHolder(value as string));
			const safeowners: string[] = await axios.get(`${GNOSIS_SAFE_BASE_URLS[selectedChainId]}/api/v1/safes/${value}`).then(res => res?.data?.owners)
			safeowners.map((ownerAddress: string, index: number) => {
				let obj: InviteGangType = { name: "", address: "" };
				obj["address"] = ownerAddress;
				if (!_.find(owners.current, (w: any) => w.address.toLowerCase() === obj.address.toLowerCase()))
					owners.current.push(obj);
			});
			// const bal = await safeSDK.getBalance();
			// setBalance(bal.toString());
			await getTokens(value);
			setisLoading(false);
			// })
			// .catch(e => {
			// 	setisLoading(false);
			// 	console.log(e)
			// 	if (e.message === "SafeProxy contract is not deployed on the current network") {
			// 		if (selectedChainId) {
			// 			const chain = selectedChainId || 137;
			// 			setErrors({ issafeAddress: `This safe is not on ${CHAIN_IDS_TO_NAMES[chain]}` });
			// 		}
			// 	}
			// })
		}
	}, [selectedChainId, selectedSafeAddress]);

	const handleAddSafe = useCallback(() => {
		const totalAddresses = [...invitedMembers, ...owners.current];
		const value = totalAddresses.reduce((final: any, current: any) => {
			let object = final.find((item: any) => item.address === current.address);
			if (object) {
				return final;
			}
			return final.concat([current]);
		}, []);
		dispatch(updateTotalMembers(value));
		const payload: any = {
			chainId,
			contractAddress: '',
			name: flow.daoName,
			url: flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, ''),
			image: flow.daoImage,
			members: value.map((m: any) => {
				if (m.address.toLowerCase() === account?.toLowerCase()) {
					return { ...m, creator: m?.address.toLowerCase() === account?.toLowerCase(), role: owners.current.map(c => c.address.toLowerCase()).indexOf(m.address.toLowerCase()) > -1 ? 'role1' : 'role2' }
				}
				return { ...m, creator: m?.address.toLowerCase() === account?.toLowerCase(), role: owners.current.map(c => c.address.toLowerCase()).indexOf(m.address.toLowerCase()) > -1 ? 'role1' : m.role ? m.role : 'role4' }
			}),
			safe: {
				name: safeName,
				address: selectedSafeAddress,
				chainId: selectedChainId,
				owners: owners.current.map(o => o.address),
			}
		}
		dispatch(createDAO(payload))
	}, [selectedChainId, selectedSafeAddress]);

	const getTokens = async (safeAddress: string) => {
		selectedChainId &&
			axios
				.get(
					`${GNOSIS_SAFE_BASE_URLS[selectedChainId]}/api/v1/safes/${safeAddress}/balances/usd/`
				)
				.then((tokens: any) => {
					setTokens(tokens.data);
				});
	};

	const isAddressValid = (holderAddress: string) => {
		const isValid: boolean = ethers.utils.isAddress(holderAddress);
		return isValid;
	};

	useEffect(() => {
		isAddressValid(selectedSafeAddress);
	}, [selectedSafeAddress]);

	useEffect(() => {
		console.log(createDAOLoading, '....createDAOLoading....')
		if (createDAOLoading == false) {
			dispatch(updateSafeAddress(''))
			dispatch(updatesafeName(''))
			dispatch(updateDaoName(''))
			dispatch(updateInvitedGang([]))
			dispatch(updateTotalMembers([]))
			setisLoading(false)
			dispatch(resetCreateDAOLoader())
			return navigate(`/success?dao=${flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, '')}`);
		}
		if (createDAOLoading == true)
			setisLoading(true)
	}, [createDAOLoading])

	const handleClick = useCallback(() => {
		console.log("clicked")
		let terrors: any = {};
		if (!isAddressValid(selectedSafeAddress)) {
			terrors.issafeAddress = " * Safe Address is not valid.";
		}
		if (_.isEmpty(terrors)) {
			handleAddSafe()
		}
		else {
			setErrors(terrors);
		}
	}, [selectedSafeAddress]);

	const handleClickDelayed = useCallback(_.debounce(handleClick, 1000), [handleClick, selectedSafeAddress])

	const getSafes = (chainId: number = selectedChainId) => {
		axios.get(`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/owners/${account}/safes/`)
			.then((response: any) => {
				setSafeList(response.data.safes)
			});
		//window.scrollTo(0, document.body.scrollHeight);
	}

	const SafeDetails = ({ index }: any) => {
		return <Box className={classes.centerFlexContainer} key={index}>
			<Box className={classes.safeOwners}>
				<Box className={classes.balance}>
					<img src={coin} alt="coin" />
					<Box className={classes.safeBalance}>
						$ {tokens.length >= 1 && tokens[0].fiatBalance}
					</Box>
				</Box>
				<Box className={classes.tokenAssets}>
					{tokens.length > 1 ? (
						<>
							<Box className={classes.balance}>
								<Box className={classes.asset}>
									<Box className={classes.safeName}>
										{tokens[1].token.symbol.slice(0, 1) +
											tokens[1].token.symbol.slice(-1)}
									</Box>
								</Box>
								<Box className={classes.amount}>
									{tokens[1].balance / 10 ** 18}
								</Box>
							</Box>
						</>
					) : null}
					{tokens.length === 3 ? (
						<>
							<Box className={classes.balance}>
								<Box className={classes.asset}>
									<Box className={classes.safeName}>
										{tokens[2].token.symbol.slice(0, 1) +
											tokens[2].token.symbol.slice(-1)}
									</Box>
								</Box>
								<Box className={classes.amount}>
									{tokens[2].balance / 10 ** 18}
								</Box>
							</Box>
						</>
					) : null}
				</Box>
			</Box>
			<Box className={classes.safeOwners}>
				<Box className={classes.ownerCount}>
					{owners.current.length} Owners :
				</Box>
				<Box className={classes.ownerList}>
					{owners.current.map(
						(result: InviteGangType, index: number) => {
							return (
								<>
									<Box className={classes.safeOwner} key={index}>
										<Box className={classes.userDetail}>
											<Box sx={{marginTop: 1.5}}>
											<Avatar
												size={32}
												name={result.address}
												variant="bauhaus"
												colors={["#E67C40", "#EDCD27", "#8ECC3E", "#2AB87C", "#188C8C"]}
											/>
												{/* <img src={safeUserIcon} alt="safe-owner-icon" /> */}
											</Box>
											<TextInput
												placeholder="Name"
												type="text"
												sx={{
													marginTop: 1,
													width: 141,
													'& .MuiInputBase-input': {
														height: 30,
														padding: '2px'
													}
												}}
												onChange={(e: any) => {
													owners.current[index].name = e.target.value;
												}}
											/>
										</Box>
										<Box className={classes.address}>
											{result.address.slice(0, 6) +
												"..." +
												result.address.slice(-4)}
										</Box>
									</Box>
								</>
							);
						}
					)}
				</Box>
			</Box>
		</Box>
	}

	return (
		<Container>
			<Grid className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>2/2 Organisation Multi-sig Wallet</Box>
					<Box className={classes.buttonArea}>
						<Box>
							<Button
								style={{
									backgroundColor: "#FFFFFF",
									minWidth: 'max-content',
									fontWeight: 400,
									opacity: 0.6,
									width: 228,
									color: 'rgba(201, 75, 50, 0.6)'
								}}
								onClick={() => navigate('/newsafe')}
								variant='contained'>
								CREATE
							</Button>
						</Box>
						<Box className={classes.centerText}>or</Box>
						<Box>
							<Button
								style={{
									color: "#C94B32",
									backgroundColor: "#FFFFFF",
									fontWeight: 400,
									minWidth: 'max-content',
									width: 228,
									boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
								}}
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
								if (safeList.length) {
									getSafes(value)
								}
							}}
						/>
					</Box>
					{safeList.length ?
						<Box className={classes.centerFlexContainer}>
							<Box className={classes.bottomLine} />
							<Box className={classes.safeContainer}>
								{safeList.map((item: any, index: any) => (
									<Box key={index} className={classes.List}>
										<Box
											className={classes.ListItemParent}
											sx={{
												border: selectedSafeAddress == item
													? '1px solid #C94B32'
													: ''
											}}
											onClick={() => { setSelectedSafeAddress(item); getSafeDetails(item); }}
										>
											<Box className={classes.ListItemContent}>
												<Box className={classes.ChainLogo}>
													<img width={18} height={18} src={CHAIN_INFO[selectedChainId].logoUrl} alt="seek-logo" />
												</Box>
												<Box>
													<Typography className={classes.safeName}>Multi-sig Wallet</Typography>
													<Typography>{beautifyHexToken(item)}</Typography>
												</Box>
											</Box>
											<IconButton>
												<img src={downArrow} alt="down-arrow" />
											</IconButton>
										</Box>
										{expand && selectedSafeAddress === item ? <SafeDetails index={index} /> : ''}
									</Box>
								))}
							</Box>
							<Box className={classes.addSafe}>
								<Button
									loading={isLoading}
									style={{
										color: '#FFF',
										fontWeight: 400,
										minWidth: 'max-content',
										backgroundColor: selectedSafeAddress ? "#C94B32" : "rgba(27, 43, 65, 0.2)",
									}}
									variant='contained'
									onClick={handleClickDelayed}
								>ADD SAFE
								</Button>
							</Box>
						</Box>
						: <Box style={{ margin: 25 }}>
							<Button
								loading={isLoading}
								sx={{
									color: '#FFF',
									fontWeight: 400,
									minWidth: 'max-content'
								}}
								variant='contained'
								onClick={() => getSafes()}
							>FIND MY SAFE
							</Button>
						</Box>
					}
				</Box>
			</Grid>
		</Container>
	);
};
