import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import TextInput from '../../muiComponents/TextInput'
import { InviteGangType } from "types/UItype";
import { Checkbox } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import {
	updateOwners,
	updateSafeAddress,
	updatesafeName,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateDaoName,
	updateInvitedGang
} from "state/flow/reducer";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import { createDAO } from '../../state/flow/actions';
import { loadDao } from '../../state/dashboard/actions';
import { CHAIN_GAS_STATION, SupportedChainId } from "constants/chains";
import { Box, Button, Typography, Container, Grid } from "@mui/material"
import { makeStyles } from '@mui/styles';
import MuiSelect from '../../muiComponents/Select'
import axios from "axios";

const useStyles = makeStyles((theme: any) => ({
	root: {
		minHeight: "100vh",
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	},
	text: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
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
		padding: 20,
		margin: 35,
		width: 551
	},
	thresholdText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: 16,
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
		margin: 10,
		width: 210,
		height: 2,
		backgroundColor: '#C94B32',
		border: '2px solid #C94B32',
		position: 'relative',
		borderRadius: 50
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
	const [selectedChain, setSelectedChain] = useState<string>('')
	const [isLoading, setisLoading] = useState<boolean>(false);
	const safeName = useAppSelector((state) => state.flow.safeName);
	const selectedOwners = useAppSelector((state) => state.flow.owners);
	const safeAddress = useAppSelector((state) => state.flow.safeAddress);
	const createDAOLoading = useAppSelector((state) => state.flow.createDAOLoading);
	const { DAOList } = useAppSelector((state) => state.dashboard);
	const flow = useAppSelector((state) => state.flow);
	let Myvalue = useRef<Array<InviteGangType>>([]);
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
			terrors.safeName = " * safe Name is required";
		}
		if (_.isEmpty(terrors)) {
			setshowContinue(false);
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
		setisLoading(true);
		dispatch(updateOwners(Myvalue.current));
		const safeOwner = provider?.getSigner(0);

		const ethAdapter = new EthersAdapter({
			ethers,
			signerOrProvider: safeOwner as any,
		});
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
	};

	const deployNewSafeDelayed = useCallback(_.debounce(deployNewSafe, 1000), [deployNewSafe])

	const AddOwners = () => {
		return (
			<div style={{border: '1px solid green'}}>
				<Box className={classes.bottomLine} />
				<Box className={classes.addOwner}>
					<Box className={classes.inputFieldTitle}>Select Owners</Box>
					<Box sx={{ width: '100%' }}>
						{invitedMembers.map((result: any, index: any) => {
							return (
								<>
									<Box key={index} className={classes.owner}>
										<Box className={classes.avatarName}>
											<img src={daoMember2} alt={result.address} />
											<p className={classes.nameText}>{result.name}</p>
										</Box>
										<p className={classes.text}>
											{result.address.slice(0, 6) +
												"..." +
												result.address.slice(-4)}
										</p>
										{result.address !== account ? (
											<>
												<Checkbox
													size="lg"
													colorScheme="orange"
													id={index}
													name="owner"
													value={result.address}
													onChange={(event) => handleCheck(event)}
												/>
											</>
										) : (
											<>
												<Checkbox
													size="lg"
													colorScheme="orange"
													name="owner"
													defaultChecked={true}
													disabled={true}
												/>
											</>
										)}
									</Box>
								</>
							);
						})}
						<Box className={classes.cardButton}>
							<Button sx={{ mt: 3 }}
								style={{
									backgroundColor: "#C94B32"
								}}
								onClick={() => {
									if (Myvalue.current.length >= 1) {
										setOwnerSelected(true);
									}
								}}
								variant='contained'
								size="small">
								NEXT
							</Button>
						</Box>
					</Box>
				</Box>
			</>
		);
	};

	const InviteMembersBlock = () => {
		return (
			<div style={{border: '1px solid red'}}>
				<Box className={classes.bottomLine} />
				
				<SelectThreshold />
			</div>
		);
	};

	const DropDown = React.memo((props: any) => {
		return (
			<MuiSelect
				selected={'0'}
				options={props.value.current}
				setSelectedValue={(value) => {
					setThresholdValue(+value)
				}}
			/>
		);
	});

	const SelectThreshold = () => {
		return (
			<>
				<Box className={classes.bottomLine} />
				<Box className={classes.centerCard}>
					<Box>
						<Typography className={classes.thresholdText}>
							Any transaction requires the confirmation of
						</Typography>
					</Box>
					<Box className={classes.selectionArea}>
						<Box>
							<DropDown value={Myvalue} threshold={thresholdValue} />
						</Box>
						<Box className={classes.thresholdCount}>
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
					<span className={classes.boldText}>
						{chainId && +chainId === SupportedChainId.POLYGON && polygonGasEstimate ? `The creation will cost approximately ${polygonGasEstimate?.standard?.maxFee} GWei.` : `The creation will cost approximately 0.01256 GOR.`}
					</span>
					The exact amount will be determinated by your wallet.
				</Box>
				<Button
					variant='contained'
					onClick={deployNewSafeDelayed}
					sx={{
						bgColor: isLoading ? 'grey' : "#C94B32",
						height: 50,
						width: 250,
						fontsize: 20,
						boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
					}}>
					CREATE SAFE
				</Button>
			</>
		);
	};

	return (
		<Container>
			<Grid className={classes.root}>
				<Box className={classes.StartSafe}>
					<Box className={classes.headerText}>2/2 Organisation Treasury</Box>
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
								CREATE NEW SAFE
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
								ADD EXISTING SAFE
							</Button>
						</Box>
					</Box>
					<Box className={classes.bottomLine} />
					<Box className={classes.centerCard}>
					   <Typography className={classes.inputFieldTitle}>Select Chain</Typography>
						<MuiSelect
							selected={selectedChain}
							options={[
								'Polygon',

							]}
							selectStyle={{py: 1}}
							setSelectedValue={(value) => {
								setSelectedChain(value)
							}}
						/>
						<Typography className={classes.inputFieldTitle}>Safe Name</Typography>
						<TextInput
							sx={{
								height: 50,
								width: 507
							}}
							placeholder="Pied Piper"
							value={safeName}
							onChange={(e: any) => {
								dispatch(updatesafeName(e.target.value));
							}}
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
