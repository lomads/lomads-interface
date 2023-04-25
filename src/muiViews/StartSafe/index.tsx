import React, { useEffect, useState, useCallback }  from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { makeStyles } from '@mui/styles';
import { Box, Button, Container, Grid } from "@mui/material"
import binRed from '../../assets/svg/bin-red.svg';
import binWhite from '../../assets/svg/bin-white.svg';
import IconButton from "../../muiComponents/IconButton";
import TextInput from '../../muiComponents/TextInput';
import { AiOutlineClose } from "react-icons/ai";
import { useAppDispatch } from "state/hooks";
import { updateInvitedGang, appendInviteMembers } from "state/flow/reducer";
import { ethers } from "ethers";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import createProjectSvg from '../../assets/svg/createProject.svg';
import memberIcon from '../../assets/svg/memberIcon.svg';
import plusIcon from '../../assets/svg/plusIcon.svg';
import GreyAddIcon from '../../assets/svg/ADD.svg';
import { DEFAULT_ROLES } from "constants/terminology";
import useEns from 'hooks/useEns';
import useTerminology from "hooks/useTerminology";
import { useAppSelector } from "state/hooks";

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
		cursor: 'pointer'
	},
	inputFieldTitle: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '700',
		fontSize: '16px',
		lineHeight: '18px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		margin: '15px 0px 15px 0px'
	},
	StartSafe: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: 'fit-content',
		padding: '20vh 0vh 10vh 0vh'
	},
	buttonArea: {
		display: 'flex',
		width: '500px',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: '35px'
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
	centerText: {
		fontSize: '20px',
		fontWeight: '400',
		color: '#C94B32',
		padding: 16
	},
	link: {
		textDecoration: 'underline',
		color: '#76808D'
	},
	InviteGang: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		position: 'relative'
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
	nameText: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: 400,
		fontSize: '14px',
		lineHeight: '15px',
		letterSpacing: '-0.011em',
		color: '#76808D',
		marginLeft: '16px',
		textAlign: 'center'
	},
	inviteGang: {
		margin: '35px 0px 15px 0px'
	},
	invitedMembers: {
		padding: '26px 22px',
		backgroundColor: 'rgba(118, 128, 141, 0.09)',
		boxShadow: 'inset 1px 0px 4px rgba(27, 43, 65, 0.1)',
		borderRadius: '0px 0px 5px 5px',
		width: '500px',
		maxHeight: '500px',
		overflow: 'hidden',
		overflowY: 'auto'
	},
	owner: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: '1vh 0vh',
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
		width: '768px',
		height: '768px',
		backgroundColor: 'white',
		position: 'absolute',
		top: '50%',
		right: '50%',
		transform: 'translate(50%, -50%)',
		borderRadius: '20px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '65px 65px 0 65px',
		zIndex: '999'
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
	text: {
		fontFamily: 'Inter, sans-serif',
		fontStyle: 'normal',
		fontWeight: '400',
		fontSize: '14px',
		lineHeight: '15px',
		letterSpacing: '-0.011em',
		color: '#76808D',
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
	}
}));

const StartSafe = () => {
	const classes = useStyles()
	const navigate = useNavigate();
	const createNewSafe = () => {
		navigate("/newsafe");
	};
	const importExistingSafe = () => {
		navigate("/addsafe");
	};
	const dispatch = useAppDispatch();
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
			<Container>
				<Grid container className={classes.root}>
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
								variant='contained'
								size="medium"
								onClick={createNewSafe}
								>
								CREATE NEW SAFE
							</Button>
						</Box>
						<Box className={classes.centerText}>or</Box>
						<Box>
							<Button sx={{
								color: "#C94B32",
								backgroundColor: "#FFFFFF",
								fontWeight: 400,
								minWidth: 'max-content',
								width: 228,
								boxShadow: '3px 5px 20px rgba(27, 43, 65, 0.12), 0px 0px 20px rgba(201, 75, 50, 0.18)'
							}}
								onClick={importExistingSafe}
								variant='contained'
								size="medium"
								>
								ADD EXISTING SAFE
						</Button>
						</Box>
					</Box>
					<Box className={classes.infoText}>
						Powered By{" "}
						<a href="https://gnosis-safe.io/" className={classes.link}>
							Gnosis Safe
					</a>
					</Box>
				</Box>
				<Box className={classes.InviteGang}>
					<Box className={classes.headerText}>2/3 Original Gang</Box>
					<Box className={classes.centerInputCard}>
						<Box style={{ width: '100%', marginBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
							<Box className={classes.inputTitle}>Add member :</Box>
						</Box>
						<Box className={classes.inputArea}>
							<Box style={{ marginRight: '10px' }}>
								<TextInput
									height={50}
									width={144}
									placeholder="Name"
									value={ownerName}
									onChange={(event: any) => {
										ownerName.length <= 12 && setOwnerName(event.target.value);
									}}
								/>
							</Box>
							<Box sx={{ marginRight: '10px' }}>
								<TextInput
									height={50}
									width={251}
									placeholder="ENS Domain and Wallet Address"
									value={ownerAddress}
									onChange={(event: any) => {
										setErrors({ ownerAddress: "" });
										setOwnerAddress(event.target.value);
									}}
									error={!!errors.ownerAddress}
									helperText={errors.ownerAddress}
								/>
							</Box>
							<Box sx={{ marginRight: '10px' }}>
								<select
									name="role"
									className={classes.tokenDropdown}
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
									className={classes.addButton}
									height={50}
									width={50}
									onClick={() => {
										handleClick(ownerName, ownerAddress, ownerRole);
									}}
								>
									<img src={ownerName && ownerAddress ? plusIcon: GreyAddIcon} alt={"add plus"} />
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
												<img src={daoMember2} alt={result.address} />
												<p className={classes.nameText}>{result.name}</p>
											</Box>
											<Box className={classes.avatarAddress}>
												<p className={classes.text}>
													{result.address &&
														result.address.slice(0, 6) +
														"..." +
														result.address.slice(-4)}
												</p>
											</Box>
											<Box className={classes.avatarRole}>
												<p className={classes.text}>
													{
														result.address !== undefined && result.address === account
															?
															transformRole('role2').label
															:
															transformRole(result?.role).label
													}
												</p>
											</Box>

											<Box className={classes.avatarBtn}>
												{result.address !== account && (
													<Button
														className={classes.deleteButton}
														onClick={() => {
															deleteMember(result.address);
														}}
													>
														<AiOutlineClose style={{ height: 15, width: 15 }} />
													</Button>
												)}
											</Box>

										</Box>
									);
								})}
							</Box>
						</>
					)}
					<Box className={classes.inviteGang}>
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
						className={classes.infoText}
						onClick={() => {
							navigate("/startsafe");
						}}
					>
						skip
					</Box>


					{/* Dsiplay modal for uploaded users */}
					{
						showModal &&
						<Box className={classes.membersModal}>
							<Box className={classes.membersModalHeader}>
								<img src={createProjectSvg} alt="create-project-svg" />
								<h1>Add Members</h1>
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
																height={50}
																width={135}
																error={!!errors.ownerAddress}
																helperText={errors.ownerAddress}
																placeholder="Name"
																value={item.name}
																name="name"
																onchange={(e: any) => handleChangeState(e, index)}
															/>
														</Box>
														<span>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</span>
														<select
															name="role"
															className={classes.tokenDropdown}
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
										<p>All the users have been already added</p>
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
				</Grid>
		</Container>
	);
};

export default StartSafe;
