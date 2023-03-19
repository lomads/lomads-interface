import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import "../../styles/pages/AddNewSafe.css";
import "../../styles/Global.css";
import SafeButton from "UIpack/SafeButton";
import SimpleInputField from "UIpack/SimpleInputField";
import SimpleButton from "UIpack/SimpleButton";
import { InviteGangType } from "types/UItype";
import { Checkbox } from "@chakra-ui/react";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import {
	updateOwners,
	updateSafeAddress,
	updatesafeName,
	updateThreshold,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateDaoName,
	updateInvitedGang
} from "state/flow/reducer";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { updateHolder } from "state/proposal/reducer";
import { useWeb3React } from "@web3-react/core";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { SafeFactory, SafeAccountConfig } from "@gnosis.pm/safe-core-sdk";
import { ethers } from "ethers";
import SimpleLoadButton from "UIpack/SimpleLoadButton";
import { createDAO } from '../../state/flow/actions';
import { loadDao } from '../../state/dashboard/actions';
import { CHAIN_GAS_STATION, SupportedChainId } from "constants/chains";
import axios from "axios";

const AddNewSafe = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { provider, account, chainId } = useWeb3React();
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const [myowers, setMyOwers] = useState<InviteGangType[]>(invitedMembers);
	const [showContinue, setshowContinue] = useState<boolean>(true);
	const [ownerSelected, setOwnerSelected] = useState<boolean>(false);
	const [errors, setErrors] = useState<any>({});
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
			signer: safeOwner as any,
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
			<>
				<div className="divider">
					<hr />
				</div>
				<div className="addOwner">
					<div className="inputFieldTitle">Select Owners</div>
					<div className="ownerArea">
						{invitedMembers.map((result: any, index: any) => {
							return (
								<>
									<div key={index} className="owner">
										<div className="avatarName">
											<img src={daoMember2} alt={result.address} />
											<p className="nameText">{result.name}</p>
										</div>
										<p className="text">
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
									</div>
								</>
							);
						})}
						<div className="cardButton">
							<SimpleButton
								className="button"
								title="NEXT"
								height={40}
								bgColor="#C94B32"
								width={180}
								onClick={() => {
									if (Myvalue.current.length >= 1) {
										setOwnerSelected(true);
									}
								}}
							/>
						</div>
					</div>
				</div>
			</>
		);
	};

	const SelectedOwners = () => {
		return (
			<>
				<div className="divider">
					<hr />
				</div>
				<div className="addOwner">
					<div className="inputFieldTitle">Owners</div>
					<div className="ownerArea">
						{Myvalue.current.map((result: any, index: any) => {
							return (
								<>
									<div key={index} className="owner">
										<div className="avatarName">
											<img src={daoMember2} alt={result.address} />
											<p className="nameText">{result.name}</p>
										</div>
										<p className="text">
											{result.address.slice(0, 6) +
												"..." +
												result.address.slice(-4)}
										</p>
									</div>
								</>
							);
						})}
					</div>
				</div>
				<SelectThreshold />
			</>
		);
	};

	const DropDown = React.memo((props: any) => {
		return (
			<>
				<select
					name="chain"
					id="chain"
					className="dropdown"
					onChange={(event) => {
						//props.threshold.current = event.target.value;
						setThresholdValue(+event.target.value)
					}}
					defaultValue={thresholdValue}
				>
					{props.value.current.map((result: any, index: any) => {
						return (
							<option value={index + 1} key={index}>
								{index + 1}
							</option>
						);
					})}
				</select>
			</>
		);
	});

	const SelectThreshold = () => {
		return (
			<>
				<div className="divider">
					<hr />
				</div>
				<div className="centerCard">
					<div>
						<div className="thresholdText">
							Any transaction requires the confirmation of
						</div>
					</div>
					<div className="selectionArea">
						<div>
							<DropDown value={Myvalue} threshold={thresholdValue} />
						</div>
						<div className="thresholdCount">
							of {Myvalue.current.length} owner(s)
						</div>
					</div>
				</div>
				<div className="safe-footer">
					By continuing you consent to the terms of use and privacy policy of
					Gnosis Safe
				</div>
				<div className="safe-footer">
					You’re about to create a new safe and will have to confirm a
					transaction with your curentry connected wallet.
					<span className="boldText">
						{chainId && +chainId === SupportedChainId.POLYGON && polygonGasEstimate ? `The creation will cost approximately ${polygonGasEstimate?.standard?.maxFee} GWei.` : `The creation will cost approximately 0.01256 GOR.`}
					</span>
					The exact amount will be determinated by your wallet.
				</div>
				<div className="createButton">
					<SimpleLoadButton
						title="CREATE SAFE"
						bgColor={isLoading ? 'grey' : "#C94B32"}
						height={50}
						width={250}
						fontsize={20}
						disabled={isLoading}
						onClick={deployNewSafeDelayed}
						condition={isLoading}
					/>
				</div>
			</>
		);
	};

	return (
		<>
			<div className="StartSafe">
				<div className="headerText">3/3 DAO Treasury</div>
				<div className="buttonArea">
					<div>
						<SafeButton
							title="CREATE NEW SAFE"
							titleColor="#C94B32"
							bgColor="#FFFFFF"
							height={58}
							width={228}
							fontsize={20}
							fontweight={400}
							disabled={false}
						/>
					</div>
					<div className="centerText">or</div>
					<div>
						<SafeButton
							title="ADD EXISTING SAFE"
							titleColor="rgba(201, 75, 50, 0.6)"
							bgColor="#FFFFFF"
							height={58}
							width={228}
							fontsize={20}
							fontweight={400}
							disabled={false}
							opacity="0.6"
							onClick={() => navigate('/addsafe')}
						/>
					</div>
				</div>
				<div className="divider">
					<hr />
				</div>
				<div className="centerCard">
					<div>
						<div className="inputFieldTitle">Safe Name</div>
						<SimpleInputField
							className="inputField"
							height={50}
							width={460}
							placeholder="Pied Piper"
							value={safeName}
							onchange={(e) => {
								dispatch(updatesafeName(e.target.value));
							}}
							isInvalid={errors.safeName}
						/>
					</div>
				</div>
				{showContinue ? (
					<>
						<div className="continueButton">
							<SimpleButton
								className="button"
								title="CONTINUE"
								height={50}
								width={250}
								fontsize={20}
								onClick={handleSafeName}
								bgColor={safeName ? "#C94B32" : "rgba(27, 43, 65, 0.2)"}
								shadow={
									safeName
										? "3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)"
										: undefined
								}
							/>
						</div>
					</>
				) : invitedMembers.length >= 1 ? (
					ownerSelected ? (
						<SelectedOwners />
					) : (
						<AddOwners />
					)
				) : (
					<SelectedOwners />
				)}
			</div>
		</>
	);
};

export default AddNewSafe;
