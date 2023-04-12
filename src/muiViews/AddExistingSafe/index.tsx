import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { updateHolder } from "state/proposal/reducer";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { ImportSafe } from "connection/SafeCall";
import {
	updateSafeAddress,
	updatesafeName,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateDaoName,
	updateInvitedGang
} from "state/flow/reducer";
import { ethers } from "ethers";
import { Box, Button, Typography, Container, Grid } from "@mui/material"
import MuiSelect from '../../muiComponents/Select'
import axios from "axios";
import { InviteGangType } from "types/UItype";
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { CHAIN_IDS_TO_NAMES } from 'constants/chains'
import { makeStyles } from '@mui/styles';
import downArrow from '../../assets/svg/downArrow.svg'
import seeklogo from '../../assets/svg/seeklogo.svg'

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
	listItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		boxShadow: '3px 5px 4px rgba(27, 43, 65, 0.05), -3px -3px 8px rgba(201, 75, 50, 0.1)',
		borderRadius: 5,
		maxHeight: 'fit-content',
		width: '554.75px',
		padding: 20,
		margin: 35,
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
		borderRadius: '5px',
		maxHeight: 'fit-content',
		width: 500,
		padding: '20px',
		marginTop: '2px',
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
		minWidth: 'fit-content'
	},
	seeklogo: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#D1D4D9',
		borderRadius: '50%',
		width: 32,
		height: 32
	}
}));

export default () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const safeName = useAppSelector((state) => state.flow.safeName);
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const [safeOwners, setSafeOwners] = useState<string[]>([]);
	const [tokens, setTokens] = useState<any>([]);
	const [errors, setErrors] = useState<any>({});
	const [balance, setBalance] = useState<string>("");
	const [isLoading, setisLoading] = useState<boolean>(false);
	const [safeList, setSafeList] = useState<any>([]);
	const owners = useRef<InviteGangType[]>([]);
	const [selectedChain, setSelectedChain] = useState<string>('')
	const flow = useAppSelector((state) => state.flow);
	const createDAOLoading = useAppSelector((state) => state.flow.createDAOLoading);
	const { provider, account, chainId } = useWeb3React();


	useEffect(() => {
		dispatch(updateSafeAddress(""));
		dispatch(updateTotalMembers([]))
	}, [])

	const UseExistingSafe = useCallback(async () => {
		if (isLoading) return;
		if (chainId) {
			owners.current = [];
			setisLoading(true);
			ImportSafe(provider, safeAddress)
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

	// const handleAddSafe = useCallback(() => {
	// 	const totalAddresses = [...invitedMembers, ...owners.current];
	// 	const value = totalAddresses.reduce((final: any, current: any) => {
	// 		let object = final.find((item: any) => item.address === current.address);
	// 		if (object) {
	// 			return final;
	// 		}
	// 		return final.concat([current]);
	// 	}, []);
	// 	dispatch(updateTotalMembers(value));
	// 	const payload: any = {
	// 		chainId,
	// 		contractAddress: '',
	// 		name: flow.daoName,
	// 		url: flow.daoAddress.replace(`${process.env.REACT_APP_URL}/`, ''),
	// 		image: flow.daoImage,
	// 		members: value.map((m: any) => {
	// 			if (m.address.toLowerCase() === account?.toLowerCase()) {
	// 				return { ...m, creator: m?.address.toLowerCase() === account?.toLowerCase(), role: owners.current.map(c => c.address.toLowerCase()).indexOf(m.address.toLowerCase()) > -1 ? 'role1' : 'role2' }
	// 			}
	// 			return { ...m, creator: m?.address.toLowerCase() === account?.toLowerCase(), role: owners.current.map(c => c.address.toLowerCase()).indexOf(m.address.toLowerCase()) > -1 ? 'role1' : m.role ? m.role : 'role4' }
	// 		}),
	// 		safe: {
	// 			name: safeName,
	// 			address: safeAddress,
	// 			owners: owners.current.map(o => o.address),
	// 		}
	// 	}
	// 	dispatch(createDAO(payload))
	// }, [chainId, safeAddress]);

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
	const handleDownClick = () => ''

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
							selected={selectedChain}
							options={[
								'Polygon',
							]}
							selectStyle={{ py: 1 }}
							setSelectedValue={(value) => {
								setSelectedChain(value)
								//add api call
								setSafeList([
									{
										name: 'asdas'
									}
								])
							}}
						/>
					</Box>
					{safeList.length ? <Box className={classes.StartSafe}>
						<Box className={classes.bottomLine} />
						{safeList.map((item: any, index: any) => (
							<Box
								key={index}
								className={classes.listItem}
								sx={{ width: 500, boxShadow: 'none' }}>
								<Box className={classes.seeklogo}>
										<img src={seeklogo} alt="seek-logo" />
								</Box>
								<Box>
									<Typography className={classes.safeName}>Safe Name</Typography>
									<Typography>{item.name}</Typography>
								</Box>
								<Button className={classes.downArrow} onClick={() => handleDownClick}>
									<img src={downArrow} alt="down-arrow" />
								</Button>
							</Box>
						))}
						<Box className={classes.findSafe}>
							<Button
								style={{
									fontWeight: 400,
									minWidth: 'max-content'
								}}
								variant='outlined'
								onClick={handleClickDelayed}
							>CANCEL
							</Button>
							<Button
								style={{
									color: '#FFF',
									fontWeight: 400,
									minWidth: 'max-content'
								}}
								variant='contained'
								onClick={handleClickDelayed}
							>FIND SAFE
							</Button>
						</Box></Box>
						: ''
					}
				</Box>
			</Grid>
		</Container>
	);
};
