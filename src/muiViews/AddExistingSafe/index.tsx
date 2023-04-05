import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import TextInput from '../../muiComponents/TextInput';
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
	updateDaoAddress,
	updateDaoName,
	updateInvitedGang
} from "state/flow/reducer";
import { ethers } from "ethers";
import { Box, Button, Typography, Container, Grid } from "@mui/material"
import coin from "../../assets/svg/coin.svg";
import axios from "axios";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { InviteGangType } from "types/UItype";
import { createDAO } from '../../state/flow/actions';
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { CHAIN_IDS_TO_NAMES } from 'constants/chains'
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	root: {
		height: "100vh",
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
		fontFamily: 'Open Sans',
		fontStyle: 'normal',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
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
		width: '554.75px',
		padding: 20,
		marginTop: 35,
	},
	StartSafe: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content',
		padding: '20vh 0vh 10vh 0vh'
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
		color: '#C94B32'
	},
	buttonArea: {
		display: 'flex',
		width: '500px',
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
	boldText: {
		fontWeight: 800
	},
	safeFooter: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '14px',
		lineHeight: '15px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		width: '480px',
		textAlign: 'center',
		marginBottom: '9px',
	},
	findSafe: {
		margin: '25px 0px 15px 0px'
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
		marginTop: '35px',
	},
	safeData: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		background: '#FFFFFF',
		border: '1px solid #f1f4f4',
		borderRadius: '5px',
		maxHeight: 'fit-content',
		width: '500px',
		padding: '20px',
		marginTop: '2px',
	},
	safeName: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '600',
		fontSize: '16px',
		lineHeight: '35px',
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
		width: '500px',
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
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '35px',
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
		fontWeight: '400',
		fontSize: '14px',
		lineHeight: '15px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		width: '480px',
		textAlign: 'center',
		marginTop: '25px',
		marginBottom: '25px',
	},
	safeBalance: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '16px',
		lineHeight: '35px',
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
		fontSize: '16px',
		lineHeight: '35px',
		textAlign: 'center',
		color: '#76808D',
		marginLeft: '1vh',
	},
	ownerCount: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '800',
		fontSize: '18px',
		lineHeight: '35px',
		textAlign: 'center',
		color: '#76808D',
		marginLeft: '1vh',
	},
	safeOwner: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		marginTop: '10px',
	}
}));

export default () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const safeName = useAppSelector((state) => state.flow.safeName);
	const selectedOwners = useAppSelector((state) => state.flow.owners);
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const [safeOwners, setSafeOwners] = useState<string[]>([]);
	const [tokens, setTokens] = useState<any>([]);
	const [errors, setErrors] = useState<any>({});
	const [balance, setBalance] = useState<string>("");
	const [isLoading, setisLoading] = useState<boolean>(false);
	const owners = useRef<InviteGangType[]>([]);
	const safeNameRef = useRef<string>("");
	const [showSafeDetails, setShowSafeDetails] = useState<boolean>(false);
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
					setShowSafeDetails(true);
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
				address: safeAddress,
				owners: owners.current.map(o => o.address),
			}
		}
		dispatch(createDAO(payload))
	}, [chainId, safeAddress]);

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

	return (
		<Container>
			<Grid className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>3/3 DAO Treasury</Box>
					<Box className={classes.buttonArea}>
						<Box>
							<Button
								style={{
									backgroundColor: "#FFFFFF",
									minWidth: 'max-content',
									fontWeight: 400,
									opacity: 0.6,
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
									minWidth: 'max-content'
								}}
								variant='contained'>
								ADD EXISTING SAFE
							</Button>
						</Box>
						</Box>
						{owners.current.length >= 1 && showSafeDetails ? (
							<>
								<Box className={classes.safeInfo}>
									<Box className={classes.safeData}>
										<Box className={classes.safeName}>
											{safeName ? (
												safeName
											) : (
													<>
														<TextInput
															sx={{
																height: 30,
																width: 179
															}}
															placeholder="Pied Piper"
															name="safeName"
															onChange={(e: any) => {
																safeNameRef.current = e.target.value;
															}}
														/>
													</>
												)}
										</Box>
										<Box className={classes.address}>
											{safeAddress.slice(0, 6) + "..." + safeAddress.slice(-4)}
										</Box>
									</Box>
									{/* assets */}
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
																	sx={{
																		height: 30,
																		width: 179
																	}}
																	placeholder="Name"
																	type="text"
																	onChange={(e: any) => {
																		owners.current[index].name = e.target.value;
																	}}
																/>
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
									<Box className={classes.footerText}>
										By continuing you consent to the terms of use and privacy policy
										of Gnosis Safe
							</Box>
									<Box className={classes.buttonArea}>
										<Box>
											<Button
												variant="outlined"
												sx={{
													borderColor: "#C94B32",
													bgColor: "#FFFFFF",
													height: 55,
													width: 225,
													fontsize: 20,
													fontweight: 400
												}}
												onClick={(e) => {
													setShowSafeDetails(false);
												}}
											>CHANGE SAFE</Button>
										</Box>
										<Box>
											<Button
												variant="contained"
												sx={{
													backgroundColor: "#C94B32",
													height: 55,
													width: 225,
													fontsize: 20,
													fontweight: 400
												}}
												onClick={() => {
													handleAddSafe();
												}}
											>ADD SAFE</Button>
										</Box>
									</Box>
								</Box>
							</>
						) : (
								<>
									<Box className={classes.centerCard}>
										{/* <Box className="chainDetails">
								<Box>
									<Box className="inputFieldTitle">
										Select the network on which the Safe was created
									</Box>
								</Box>
								<select name="chain" id="chain" className="drop">
									{ SUPPORTED_CHAIN_IDS.map(chain => <option value={+chain}>{CHAIN_IDS_TO_NAMES[chain]}</option>) }
								</select>
							</Box> */}
										<Box className={classes.inputArea}>
											<Box>
												<Box>
													<Typography
														className={classes.inputFieldTitle}>
														Safe Name
												</Typography>
												</Box>
												<TextInput
													sx={{
														height: 50,
														width: 179
													}}
													placeholder="Pied Piper"
													name="safeName"
													value={safeName}
													onChange={(e: any) => {
														dispatch(updatesafeName(e.target.value));
													}}
												/>
											</Box>
											<Box>
												<Box>
													<Typography
														className={classes.inputFieldTitle}>
														Safe Address
												</Typography>
												</Box>
												<TextInput
													sx={{
														height: 50,
														width: 311
													}}
													placeholder="0xbeee39"
													value={safeAddress}
													name="safeAddress"
													onChange={(e: any) => {
														setErrors({ issafeAddress: "" });
														dispatch(updateSafeAddress(e.target.value));
													}}
													isInvalid={errors.issafeAddress}
												/>
											</Box>
										</Box>
									</Box>
									<Box className={classes.findSafe}>
										<SimpleLoadButton
											title="FIND SAFE"
											height={50}
											width={160}
											fontsize={20}
											fontweight={400}
											onClick={handleClickDelayed}
											bgColor={
												isAddressValid(safeAddress)
													? "#C94B32"
													: "rgba(27, 43, 65, 0.2)"
											}
											condition={isLoading}
										/>
									</Box>
								</>
							)}
					</Box>
			</Grid>
		</Container>
	);
};
