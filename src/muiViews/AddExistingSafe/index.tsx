import React, { useEffect, useRef, useState, useCallback } from "react";
import _ from "lodash";
import "../../styles/pages/AddExistingSafe.css";
import "../../styles/Global.css";
import SafeButton from "UIpack/SafeButton";
import SimpleInputField from "UIpack/SimpleInputField";
import SimpleButton from "UIpack/SimpleButton";
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
import AddressInputField from "UIpack/AddressInputField";
import coin from "../../assets/svg/coin.svg";
import axios from "axios";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import OutlineButton from "UIpack/OutlineButton";
import { InviteGangType } from "types/UItype";
import { createDAO } from '../../state/flow/actions';
import { GNOSIS_SAFE_BASE_URLS } from 'constants/chains'
import { SupportedChainId, SUPPORTED_CHAIN_IDS, CHAIN_IDS_TO_NAMES } from 'constants/chains'
import { usePrevious } from "hooks/usePrevious";
import { makeStyles } from '@mui/styles';
import { updateDaoMember } from "state/dashboard/actions";

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
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 700,
		fontSize: 16,
		lineHeight: 18,
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '15px 0px 15px 0px'
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
	thresholdText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
		lineHeight: 15,
		letterSpacing: '-0.011em',
		color: '#76808D'
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
		width: 500,
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
		lineHeight: 15,
		letterSpacing: '-0.011em',
		color: '#76808D',
		marginLeft: 16,
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
		color: '#C94B32'
	},
	buttonArea: {
		display: 'flex',
		width: '500px',
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
		lineHeight: 15,
		letterSpacing: '-0.011em',
		color: '#76808D',
	},
	headerText: {
		fontFamily: 'Insignia',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 35,
		lineHeight: 35,
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
		<>
			<Box className={classes.startSafe}>
				<Box className={classes.headerText}>3/3 DAO Treasury</Box>
				<Box className={classes.buttonArea}>
					<Box>
						<SafeButton
							title="CREATE NEW SAFE"
							titleColor="rgba(201, 75, 50, 0.6)"
							bgColor="#FFFFFF"
							height={58}
							width={228}
							fontsize={20}
							fontweight={400}
							disabled={false}
							opacity="0.6"
							onClick={() => navigate("/newsafe")}
						/>
					</Box>
					<Box className={classes.centerText}>or</Box>
					<Box>
						<SafeButton
							title="ADD EXISTING SAFE"
							titleColor="#C94B32"
							bgColor="#FFFFFF"
							height={58}
							width={228}
							fontsize={20}
							fontweight={400}
							disabled={false}
						/>
					</Box>
				</Box>
				<Box className={classes.boxider}>
					<hr />
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
											<SimpleInputField
												className={classes.inputField}
												height={30}
												width={151}
												placeholder="Pied Piper"
												name="safeName"
												onchange={(e) => {
													safeNameRef.current = e.target.value;
												}}
											/>
										</>
									)}
								</Box>
								<Box className={classes.safeBoxider}>
									<hr />
								</Box>
								<Box className={classes.address}>
									{safeAddress.slice(0, 6) + "..." + safeAddress.slice(-4)}
								</Box>
							</Box>
							{/* assets */}
							<Box className={classes.safedata}>
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
														<SimpleInputField
															className="inputField"
															height={30}
															width={151}
															placeholder="Name"
															type="text"
															onchange={(e) => {
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
									<OutlineButton
										title="CHANGE SAFE"
										borderColor="#C94B32"
										bgColor="#FFFFFF"
										height={55}
										width={225}
										fontsize={20}
										fontweight={400}
										onClick={(e) => {
											setShowSafeDetails(false);
										}}
									/>
								</Box>
								<Box>
									<SimpleButton
										className="button"
										title="ADD SAFE"
										bgColor="#C94B32"
										height={55}
										width={225}
										fontsize={20}
										fontweight={400}
										onClick={() => {
											handleAddSafe();
										}}
									/>
								</Box>
							</Box>
						</Box>
					</>
				) : (
					<>
						<Box className="centerCard">
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
										<Box className={classes.inputFieldTitle}>Safe Name</Box>
									</Box>
									<SimpleInputField
										className="inputField"
										height={50}
										width={150}
										placeholder="Pied Piper"
										name="safeName"
										value={safeName}
										onchange={(e) => {
											dispatch(updatesafeName(e.target.value));
										}}
									/>
								</Box>
								<Box>
									<Box>
										<Box className={classes.inputFieldTitle}>Safe Address</Box>
									</Box>
									<AddressInputField
										className="inputField"
										height={50}
										width={280}
										placeholder="0xbeee39"
										value={safeAddress}
										name="safeAddress"
										onchange={(e) => {
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
		</>
	);
};
