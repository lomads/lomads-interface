import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { updateHolder } from "state/proposal/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { ImportSafe } from "connection/SafeCall";
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
import { Box, Button, Typography, Container, Grid } from "@mui/material"
import MuiSelect from '../../muiComponents/Select'
import axios from "axios";
import { InviteGangType } from "types/UItype";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { CHAIN_IDS_TO_NAMES, SUPPORTED_CHAIN_IDS, SupportedChainId } from 'constants/chains'
import { makeStyles } from '@mui/styles';
import { CHAIN_INFO } from 'constants/chainInfo';
import downArrow from '../../assets/svg/downArrow.svg'
import { beautifyHexToken } from "utils"

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
		color: '#76808D',
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
	ListItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		borderRadius: 5,
		width: 500,
		padding: 10,
		height: 64
	},
	StartSafe: {
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
		fontWeight: 400,
		fontSize: 35,
		paddingBottom: 30,
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
	findSafe: {
		margin: 25
	},
	inputArea: {
		display: 'flex',
		justifyContent: 'space-around',
		alignItems: 'center',
		width: '100%'
	},
	safeInfo: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'start',
		alignItems: 'center',
		marginTop: 35,
	},
	safeData: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		border: '1px solid #f1f4f4',
		borderRadius: 5,
		maxHeight: 'fit-content',
		width: 500,
		padding: 20,
		marginTop: 2
	},
	safeName: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 600,
		fontSize: 16,
		textAlign: 'center',
		color: '#76808D',
	},
	safeOwners: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		justifyContent: 'flex-start',
		background: '#FFFFFF',
		border: '1px solid #f1f4f4',
		borderRadius: 5,
		maxHeight: 'fit-content',
		width: 500,
		padding: 20,
		marginTop: 2
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
		textAlign: 'center',
		color: '#76808D',
		marginLeft: '2vh'
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
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: 10,
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
	downArrow: {
		maxWidth: 'fit-content'
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
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'scroll'
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
		if(!expand || selectedSafeAddress !== item){
			setExpand(true)
			setSelectedSafeAddress(item)
			UseExistingSafe()
			return
		} 
		setExpand(false)
	}
	const UseExistingSafe = useCallback(async (value: string = selectedSafeAddress) => {
		if (isLoading) return;
		if (chainId) {
			owners.current = [];
			setisLoading(true);
			ImportSafe(provider, value)
				.then(async safeSDK => {
					dispatch(updateHolder(safeSDK.getAddress() as string));
					const safeowners: string[] = await safeSDK.getOwners();
					safeowners.map((ownerAddress: string, index: number) => {
						let obj: InviteGangType = { name: "", address: "" };
						obj["address"] = ownerAddress;
						if (!_.find(owners.current, (w: any) => w.address.toLowerCase() === obj.address.toLowerCase()))
							owners.current.push(obj);
					});
					const bal = await safeSDK.getBalance();
					setBalance(bal.toString());
					await getTokens(safeAddress);
					setisLoading(false);
				})
				.catch(e => {
					setisLoading(false);
					console.log(e)
					if (e.message === "SafeProxy contract is not deployed on the current network") {
						if (chainId) {
							const chain = chainId || 137;
							setErrors({ issafeAddress: `This safe is not on ${CHAIN_IDS_TO_NAMES[chain]}` });
						}
					}
				})
		}
	}, [chainId, safeAddress]);


	const getTokens = async (safeAddress: string) => {
		chainId &&
			axios
				.get(
					`${GNOSIS_SAFE_BASE_URLS[chainId]}/api/v1/safes/${safeAddress}/balances/usd/`
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
		isAddressValid(safeAddress);
	}, [safeAddress]);

	useEffect(() => {
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
		if (!isAddressValid(safeAddress)) {
			terrors.issafeAddress = " * Safe Address is not valid.";
		}
		if (_.isEmpty(terrors)) {
			UseExistingSafe();
		}
		else {
			setErrors(terrors);
		}
	}, [safeAddress]);

	const handleClickDelayed = useCallback(_.debounce(handleClick, 1000), [handleClick, safeAddress])
	const handleDownClick = () => {
		axios.get(`${GNOSIS_SAFE_BASE_URLS[selectedChainId]}/api/v1/owners/0xbd062EB9720c78f00c68770F3dE62118e66be404/safes/`)
			.then((response: any) => {
				// response
			});
	}

	const getSafes = () => {
		axios.get(`${GNOSIS_SAFE_BASE_URLS[selectedChainId]}/api/v1/owners/0xbd062EB9720c78f00c68770F3dE62118e66be404/safes/`)
			.then((response: any) => {
				setSafeList(response.data.safes)
			});
	}

	const SafeDetails = () => {
		return <Box className={classes.StartSafe}>
			<Box className={classes.safeData}>
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
										<TextInput
											placeholder="Name"
											type="text"
											onChange={(e: any) => {
												owners.current[index].name = e.target.value;
											}}
										/>
										<Box className="address">
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
	console.log(safeList, '....safeList....')
	return (
		<Container>
			<Grid className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>2/2 Organisation Treasury</Box>
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
								CREATE NEW SAFE
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
								ADD EXISTING SAFE
							</Button>
						</Box>
					</Box>
					<Box className={classes.bottomLine} />
					<Box className={classes.safeData}>
						<Typography className={classes.inputFieldTitle}>Select Chain</Typography>
						<MuiSelect
							selected={selectedChainId}
							options={SUPPORTED_CHAIN_IDS.map(item => ({ label: CHAIN_INFO[item].label, value: item }))}
							selectStyle={{ py: 1 }}
							setSelectedValue={(value) => {
								setSelectedChainId(value)
								if(safeList.length) {
									getSafes()
								}
							}}
						/>
					</Box>
					{safeList.length ?
						<Box className={classes.StartSafe}>
							<Box className={classes.bottomLine} />
							<Box className={classes.safeContainer}>
								{safeList.map((item: any, index: any) => (
									<Box key={index} className={classes.List}>
										<Box
											className={classes.ListItem}>
											<Box className={classes.ChainLogo}>
												<img src={CHAIN_INFO[selectedChainId].logoUrl} alt="seek-logo" />
											</Box>
											<Box>
												<Typography className={classes.safeName}>Safe Name</Typography>
												<Typography>{beautifyHexToken(item)}</Typography>
											</Box>
											<Button className={classes.downArrow} onClick={() => getSafeDetails(item)}>
												<img src={downArrow} alt="down-arrow" />
											</Button>
										</Box>
										{expand && selectedSafeAddress === item ? <SafeDetails /> :''}
									</Box>
								))}
							</Box>
							<Box className={classes.findSafe}>
								<Button
									style={{
										color: '#FFF',
										fontWeight: 400,
										minWidth: 'max-content'
									}}
									variant='contained'
									onClick={handleClickDelayed}
								>ADD SAFE
								</Button>
							</Box>
						</Box>
						: <Box className={classes.findSafe}>
							<Button
								style={{
									color: '#FFF',
									fontWeight: 400,
									minWidth: 'max-content'
								}}
								variant='contained'
								onClick={getSafes}
							>FIND SAFE
							</Button>
						</Box>
					}
				</Box>
			</Grid>
		</Container>
	);
};
