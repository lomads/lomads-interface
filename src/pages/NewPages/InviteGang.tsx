import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../styles/Global.css";
import "../../styles/pages/InviteGang.css";
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

const InviteGang = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);
	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [ownerRole, setOwnerRole] = useState<string>("CONTRIBUTOR");
	const [errors, setErrors] = useState<any>({});
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
	const { account, provider, chainId } = useWeb3React();

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
				{ name: "", address: account as string, role: 'ADMIN' },
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
				const resolver = await provider?.getResolver(_ownerAddress);
				const EnsAddress = await resolver?.getAddress();
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
				if(chainId !== SupportedChainId.POLYGON)
					ENSname = await provider?.lookupAddress(_ownerAddress);
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
			for (let index = 0; index < data.length; index++) {
				let member = data[index];
				if (isAddressValid(member.address) && !isPresent(member.address)) {
					if (member.address.slice(-4) === ".eth") {
						const resolver = await provider?.getResolver(member.address);
						const EnsAddress = await resolver?.getAddress();
						if (EnsAddress) {
							member.name = member.name ? member.name : member.address;
							member.address = EnsAddress as string;
						}
					} else {
						let ENSname = null;
						if(chainId !== SupportedChainId.POLYGON)
							ENSname = await provider?.lookupAddress(member.address);
						if (ENSname)
							member.name = member.name ? member.name : ENSname
					}
					if (!_.find(validMembers, m => m.address.toLowerCase() === member.address.toLowerCase()) &&
						!_.find(invitedMembers, m => m.address.toLowerCase() === member.address.toLowerCase())
					) {
						validMembers.push({ ...member, role: 'CONTRIBUTOR' });
					}
				}
			}

			setValidMembers(validMembers);
			setUploadLoading(false)
			setShowModal(true);
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
			<div className="InviteGang">
				<div className="headerText">2/3 Original Gang</div>
				<div className="centerInputCard">
					<div style={{ width: '100%', marginBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<div className="inputTitle">Add member :</div>
						{uploadLoading ? <LeapFrog size={24} color="#C94B32" /> : <Uploader onComplete={handleInsertWallets} />}
					</div>
					<div className="inputArea">
						<div style={{ marginRight: '10px' }}>
							<SimpleInputField
								className="inputField"
								height={50}
								width={144}
								placeholder="Name"
								value={ownerName}
								onchange={(event) => {
									ownerName.length <= 12 && setOwnerName(event.target.value);
								}}
							/>
						</div>
						<div style={{ marginRight: '10px' }}>
							<AddressInputField
								className="inputField"
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
						</div>
						<div style={{ marginRight: '10px' }}>
							<select
								name="role"
								className="tokenDropdown"
								defaultValue={ownerRole}
								onChange={(e) => setOwnerRole(e.target.value)}
								style={{ margin: '0' }}
							>
								<option value="ADMIN">Admin</option>
								<option value="CORE_CONTRIBUTOR">Core Contributor</option>
								<option value="ACTIVE_CONTRIBUTOR">Active Contributor</option>
								<option value="CONTRIBUTOR">Contributor</option>
							</select>
						</div>
						<div>
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
						</div>
					</div>
				</div>
				{invitedMembers.length >= 1 && (
					<>
						<div className="invitedMembers">
							{invitedMembers.map((result: any, index: any) => {
								return (
									<div key={index} className="owner">
										<div className="avatarPlusName">
											<img src={daoMember2} alt={result.address} />
											<p className="nameText">{result.name}</p>
										</div>
										<div className="avatarAddress">
											<p className="text">
												{result.address &&
													result.address.slice(0, 6) +
													"..." +
													result.address.slice(-4)}
											</p>
										</div>
										<div className="avatarRole">
											<p className="text">
												{
													result.address !== undefined && result.address === account
														?
														`admin`
														:
														result.role?.replaceAll('_', ' ').toLowerCase()
												}
											</p>
										</div>

										<div className="avatarBtn">
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
										</div>

									</div>
								);
							})}
						</div>
					</>
				)}
				<div className="inviteGang">
					<SimpleButton
						className="inviteButton"
						title="INVITE"
						height={51}
						width={277}
						fontsize={20}
						fontweight={400}
						bgColor={
							invitedMembers.length >= 1 ? "#C94B32" : "rgba(27, 43, 65, 0.2)"
						}
						onClick={handleNavigate}
					/>
				</div>
				<div
					className="infoText"
					onClick={() => {
						navigate("/startsafe");
					}}
				>
					skip
				</div>


				{/* Dsiplay modal for uploaded users */}
				{
					showModal &&
					<div className="membersModal">
						<div className="membersModal-header">
							<img src={createProjectSvg} alt="create-project-svg" />
							<h1>Add Members</h1>
						</div>
						<div className="membersModal-body">
							{
								validMembers.length > 0
									?
									<>
										{
											validMembers.map((item, index) => (
												<div className="membersModal-row" key={index}>
													{
														deleteMembers.includes(item.address)
															?
															<div className='row-overcast'></div>
															:
															null
													}
													<div>
														<img src={memberIcon} alt="memberIcon" />
														<SimpleInputField
															className="inputField"
															id="nameInput"
															height={50}
															width={135}
															placeholder="Name"
															value={item.name}
															name="name"
															onchange={(e) => handleChangeState(e, index)}
														/>
													</div>
													<span>{item.address.slice(0, 6) + "..." + item.address.slice(-4)}</span>
													<select
														name="role"
														className="tokenDropdown"
														defaultValue={item.role}
														onChange={(e) => handleChangeState(e, index)}
													>
														<option value="ADMIN">Admin</option>
														<option value="CORE_CONTRIBUTOR">Core Contributor</option>
														<option value="ACTIVE_CONTRIBUTOR">Active Contributor</option>
														<option value="CONTRIBUTOR">Contributor</option>
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

												</div>
											))
										}
									</>
									:
									<p>All the users have been already added</p>
							}
						</div>
						<div className="membersModal-footer">
							<button onClick={handleCloseModal} className="cancel-btn">
								CANCEL
							</button>
							{
								validMembers.length > 0 && <button onClick={handleAppendUploadedMembers} className="confirm-btn">
									ADD MEMBERS
								</button>
							}
						</div>
					</div>
				}
			</div>
		</>
	);
};

export default InviteGang;
