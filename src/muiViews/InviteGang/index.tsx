import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import IconButton from "UIpack/IconButton";
import SimpleInputField from "UIpack/SimpleInputField";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddressInputField from "UIpack/AddressInputField";
import { useAppSelector } from "state/hooks";
import { LeapFrog } from "@uiball/loaders";
import { useAppDispatch } from "state/hooks";
import { updateInvitedGang, appendInviteMembers } from "state/flow/reducer";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import { useEnsAddress } from "react-moralis";
import Uploader from 'components/XlsxUploader';
import createProjectSvg from '../../assets/svg/createProject.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import binRed from '../../assets/svg/bin-red.svg';
import binWhite from '../../assets/svg/bin-white.svg';
import { SupportedChainId } from "constants/chains";
import { DEFAULT_ROLES } from "constants/terminology";
import useEns from 'hooks/useEns';
import useTerminology from "hooks/useTerminology";
import { makeStyles } from '@mui/styles';
import { Container, Box, Button } from "@mui/material"

const useStyles = makeStyles((theme: any) => ({
	InviteGang: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		position: 'relative'
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
		gap: '10px'
	},
	inputTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
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
	}
}))


const InviteGang = () => {
	const classes = useStyles()
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);
	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [ownerRole, setOwnerRole] = useState<string>("role4");
	const [errors, setErrors] = useState<any>({});
	const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
	const { transformRole } = useTerminology(_.get(DAO, 'terminologies'))
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const { account, provider, chainId } = useWeb3React();
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
			}
			if (!isPresent(member.address) && isRightAddress(member.address)) {
				console.log(invitedMembers)
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
		console.log("rest length:", deleteMember);
	};

	const handleNavigate = () => {
		if (invitedMembers.length >= 1) {
			navigate("/startsafe");
		}
	};

	const handleInsertWallets = useCallback(async (data: Array<{ name: string, address: string }>) => {
		try {
			setUploadLoading(true)
			let validMembers = [];
			let mem: any = {}
			if (data.length > 0) {
				const noHeader = _.find(Object.keys(data[0]), key => isAddressValid(key))
				if (noHeader) {
					Object.keys(data[0]).map((key: any) => {
						if (isAddressValid(key))
							mem.address = key
						else
							mem.name = key
					})
				}
				let newData = data;
				if (Object.keys(mem).length > 0)
					newData = [...newData, mem]
				for (let index = 0; index < newData.length; index++) {
					let preParseMember: any = newData[index];
					let member: any = {}
					Object.keys(preParseMember).map((key: any) => {
						if (isAddressValid(preParseMember[key]))
							member.address = preParseMember[key]
						else
							member.name = preParseMember[key]
					})
					if (member.address && isAddressValid(member.address) && !isPresent(member.address)) {
						if (member.address.slice(-4) === ".eth") {
							const EnsAddress = await getENSAddress(member.address);
							if (EnsAddress) {
								member.name = member.name ? member.name : member.address;
								member.address = EnsAddress as string;
							}
						} else {
							let ENSname = null;
							ENSname = await getENSName(member.address)
							if (ENSname)
								member.name = member.name ? member.name : ENSname
						}
						if (!_.find(validMembers, m => m.address.toLowerCase() === member.address.toLowerCase()) &&
							!_.find(invitedMembers, m => m.address.toLowerCase() === member.address.toLowerCase())
						) {
							validMembers.push({ ...member, role: 'role4' });
						}
					}
				}

				setValidMembers(validMembers);
				setUploadLoading(false)
				setShowModal(true);
			}
		} catch (e) {
			setUploadLoading(false)
		}
	}, [invitedMembers]);

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

	return (
		<>
			<Container>
				<Box className={classes.InviteGang}>
					<Box className={classes.headerText}>2/3 Original Gang</Box>
					<Box className={classes.centerInputCard}>
						<Box style={{ width: '100%', marginBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<Box className={classes.inputTitle}>Add member :</Box>
							{uploadLoading ? <LeapFrog size={24} color="#C94B32" /> : <Uploader onComplete={handleInsertWallets} />}
						</Box>
						<Box className={classes.inputArea}>
							<Box style={{ marginRight: '10px' }}>
								<SimpleInputField
									className={classes.inputField}
									height={50}
									width={144}
									placeholder="Name"
									value={ownerName}
									onchange={(event) => {
										ownerName.length <= 12 && setOwnerName(event.target.value);
									}}
								/>
							</Box>
							<Box sx={{ marginRight: '10px' }}>
								<AddressInputField
									className={classes.inputField}
									height={50}
									width={251}
									placeholder="ENS Domain and Wallet Address"
									value={ownerAddress}
									onchange={(event) => {
										setErrors({ ownerAddress: "" });
										setOwnerAddress(event.target.value);
									}}
									isInvalid={errors.ownerAddress}
								/>
							</Box>
							<Box sx={{ marginRight: '10px' }}>
								<select
									name="role"
									className="tokenDropdown"
									defaultValue={ownerRole}
									onChange={(e) => setOwnerRole(e.target.value)}
									style={{ margin: '0' }}
								>
									{/* <option value="role1">Admin</option> */}
									<option value="role2">Core Contributor</option>
									<option value="role3">Active Contributor</option>
									<option value="role4">Contributor</option>
								</select>
							</Box>
							<Box>
								<IconButton
									className="addButton"
									Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
									height={50}
									width={50}
									onClick={(e) => {
										handleClick(ownerName, ownerAddress, ownerRole);
									}}
									bgColor={
										isAddressValid(ownerAddress)
											? "#C94B32"
											: "rgba(27, 43, 65, 0.2)"
									}
								/>
							</Box>
						</Box>
					</Box>
					{invitedMembers.length >= 1 && (
						<>
							<Box className="invitedMembers">
								{invitedMembers.map((result: any, index: any) => {
									return (
										<Box key={index} className="owner">
											<Box className="avatarPlusName">
												<img src={daoMember2} alt={result.address} />
												<p className="nameText">{result.name}</p>
											</Box>
											<Box className="avatarAddress">
												<p className="text">
													{result.address &&
														result.address.slice(0, 6) +
														"..." +
														result.address.slice(-4)}
												</p>
											</Box>
											<Box className="avatarRole">
												<p className="text">
													{
														result.address !== undefined && result.address === account
															?
															transformRole('role2').label
															:
															transformRole(result?.role).label
													}
												</p>
											</Box>

											<Box className="avatarBtn">
												{result.address !== account && (
													<button
														className="deleteButton"
														onClick={() => {
															deleteMember(result.address);
														}}
													>
														<AiOutlineClose style={{ height: 15, width: 15 }} />
													</button>
												)}
											</Box>

										</Box>
									);
								})}
							</Box>
						</>
					)}
					<Box className="inviteGang">
						<Button
							style={{
								height: 51,
								width: 277,
								fontSize: 20,
								fontWeight: 400,
								backgroundColor: invitedMembers.length >= 1 ? "#C94B32" : "rgba(27, 43, 65, 0.2)",
							}}
							onClick={handleNavigate}
							variant='contained'>
								INVITE
							</Button>
					</Box>
					<Box
						className="infoText"
						onClick={() => {
							navigate("/startsafe");
						}}
					>
						skip
				</Box>


					{/* Dsiplay modal for uploaded users */}
					{
						showModal &&
						<Box className="membersModal">
							<Box className="membersModal-header">
								<img src={createProjectSvg} alt="create-project-svg" />
								<h1>Add Members</h1>
							</Box>
							<Box className="membersModal-body">
								{
									validMembers.length > 0
										?
										<>
											{
												validMembers.map((item, index) => (
													<Box className="membersModal-row" key={index}>
														{
															deleteMembers.includes(item.address)
																?
																<Box className='row-overcast'></Box>
																:
																null
														}
														<Box>
															<img src={memberIcon} alt="memberIcon" />
															<SimpleInputField
																className={classes.inputField}
																id="nameInput"
																height={50}
																width={135}
																placeholder="Name"
																value={item.name}
																name="name"
																onchange={(e) => handleChangeState(e, index)}
															/>
														</Box>
														<span>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</span>
														<select
															name="role"
															className="tokenDropdown"
															defaultValue={item.role}
															onChange={(e) => handleChangeState(e, index)}
														>
															{/* <option value="role1">Admin</option> */}
															{/* <option value="role2">Core Contributor</option>
														<option value="role3">Active Contributor</option>
														<option value="role4">Contributor</option> */}
															{
																Object.keys(DEFAULT_ROLES).map((key: any) => {
																	if (key !== 'role1')
																		return <option value={key}>{_.get(DEFAULT_ROLES, `[${key}].label`)}</option>
																	return null
																})
															}
														</select>
														{
															deleteMembers.includes(item.address)
																?
																<button onClick={() => handleDeleteUser(item.address)} className="selected">
																	<img src={binWhite} alt="bin-white" />
																</button>
																:
																<button onClick={() => handleDeleteUser(item.address)}>
																	<img src={binRed} alt="bin-red" />
																</button>
														}

													</Box>
												))
											}
										</>
										:
										<p>All the users have been already added</p>
								}
							</Box>
							<Box className="membersModal-footer">
								<button onClick={handleCloseModal} className="cancel-btn">
									CANCEL
							</button>
								{
									validMembers.length > 0 && <button onClick={handleAppendUploadedMembers} className="confirm-btn">
										ADD MEMBERS
								</button>
								}
							</Box>
						</Box>
					}
				</Box>
			</Container>
		</>
	);
};

export default InviteGang;
