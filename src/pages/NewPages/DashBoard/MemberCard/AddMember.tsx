import React, { useEffect, useState, useCallback } from "react";
import _ from "lodash";
import IconButton from "UIpack/IconButton";
import SimpleButton from "UIpack/SimpleButton";
import SimpleInputField from "UIpack/SimpleInputField";
import "../../../../styles/Global.css";
import "../../../../styles/pages/InviteGang.css";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddressInputField from "UIpack/AddressInputField";
import { useAppSelector } from "state/hooks";
import { useAppDispatch } from "state/hooks";
import { updateInvitedGang, updateTotalMembers } from "state/flow/reducer";
import { ethers } from "ethers";
import { InviteGangType } from "types/UItype";
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { useWeb3React } from "@web3-react/core";
import { useEnsAddress } from "react-moralis";
import OutlineButton from "UIpack/OutlineButton";
import { addDaoMember, addProjectMember, addDaoMemberList } from 'state/dashboard/actions'
import { resetAddMemberLoader, resetAddProjectMemberLoader, resetAddMemberListLoader } from 'state/dashboard/reducer';

import Uploader from 'components/XlsxUploader';
import { LeapFrog } from "@uiball/loaders";

import createProjectSvg from '../../../../assets/svg/createProject.svg';
import memberIcon from '../../../../assets/svg/memberIcon.svg';
import binRed from '../../../../assets/svg/bin-red.svg';
import binWhite from '../../../../assets/svg/bin-white.svg';
import { SupportedChainId } from "constants/chains";
import useEns from 'hooks/useEns';
import useTerminology from 'hooks/useTerminology'
import { DEFAULT_ROLES } from "constants/terminology";

const AddMember = (props: any) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);
	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [ownerRole, setOwnerRole] = useState<string>("role4");
	const [errors, setErrors] = useState<any>({});
	const totalMembers = useAppSelector((state:any) => state.flow.totalMembers);
	const { DAO, addMemberLoading, addProjectMemberLoading, addMemberListLoading } = useAppSelector((state) => state.dashboard);
	const { account, provider, chainId } = useWeb3React();
	const { transformRole } = useTerminology(_.get(DAO, 'terminologies'))
	const [showModal, setShowModal] = useState(false)
	const [deleteMembers, setDeleteMembers] = useState<string[]>([]);
	const [validMembers, setValidMembers] = useState<{ address: string; name: string, role: string }[]>([]);
	const { getENSAddress, getENSName }  = useEns();

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
		const check = _.get(DAO, 'members', []).some((mem: any) => mem.member.wallet.toLowerCase() === _address.toLowerCase());
		return check;
	};
	useEffect(() => {
		const check = totalMembers.some(
			(member:any) => member.address === (account as string)
		);
		if (!check) {
			const creator = [
				...totalMembers,
				{ name: "", address: account as string },
			];
			dispatch(updateInvitedGang(creator));
		}
	}, []);

	useEffect(() => {
		isAddressValid(ownerAddress);
	}, [ownerAddress]);

	useEffect(() => {
		isPresent(ownerAddress);
	}, [ownerAddress]);

	useEffect(() => {
		if (addMemberLoading === false || addProjectMemberLoading === false) {
			dispatch(resetAddMemberLoader());
			dispatch(resetAddProjectMemberLoader());
			setOwnerName("");
			setOwnerAddress("");
			props.toggleShowMember();
		}
	}, [addMemberLoading, addProjectMemberLoading])

	useEffect(() => {
		if (addMemberListLoading === false) {
			dispatch(resetAddMemberListLoader());
			setShowModal(false);
			props.toggleShowMember();
		}
	}, [addMemberListLoading])

	const addMember = async (_ownerName: string, _ownerAddress: string, _ownerRole: string) => {
		const member = { name: _ownerName, address: _ownerAddress, role: _ownerRole };
		if (_ownerAddress.slice(-4) === ".eth") {
			const EnsAddress = await getENSAddress(_ownerAddress);
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
			dispatch(addDaoMember({ url: DAO?.url, payload: member }))
			if (props.addToList) {
				props.addToList([member.address]);
			}
		}
	};

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
		} else {
			setErrors(terrors);
		}
	};

	const handleInsertWallets = async (data: Array<{ name: string, address: string }>) => {
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
							const resolver = await provider?.getResolver(member.address);
							const EnsAddress = await resolver?.getAddress();
							if (EnsAddress) {
								member.name = member.name ? member.name : member.address;
								member.address = EnsAddress as string;
							}
						} else {
							let ENSname = null;
							if (chainId !== SupportedChainId.POLYGON)
								ENSname = await provider?.lookupAddress(member.address);
							if (ENSname)
								member.name = member.name ? member.name : ENSname
						}
						if (!_.find(validMembers, m => m.address.toLowerCase() === member.address.toLowerCase())
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
	};

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

	const handleCloseModal = () => {
		setValidMembers([]);
		setDeleteMembers([]);
		setShowModal(false);
	}

	const handleAddMembers = () => {
		try {
			let tempArray = [];
			let newArray = [];
			for (var i = 0; i < validMembers.length; i++) {
				if (deleteMembers.includes(validMembers[i].address) === false) {
					tempArray.push(validMembers[i]);
					newArray.push(validMembers[i].address);
				}
			}
			dispatch(addDaoMemberList({ url: DAO?.url, payload: { list: tempArray } }))
			if (props.addToList) {
				props.addToList(newArray);
			}
		}
		catch (e) {
			console.log(e)
			setShowModal(false);
			props.toggleShowMember();
		}
	}

	return (
		<>
			<div id="AddNewMemberComponent">
				<div onClick={props.toggleModal} id="AddNewMemberOverlay"></div>
				<div id="AddNewMember">
					<div style={{ width: '100%', marginBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<div className="inputTitle">Add member</div>
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
								{/* <option value="role1">Admin</option> */}
								{/* <option value="role2">Core Contributor</option>
								<option value="role3">Active Contributor</option>
								<option value="role4">Contributor</option> */}
								{
									Object.keys(_.get(DAO, 'terminologies.roles', DEFAULT_ROLES)).map((key: any) => {
										if(key !== 'role1')
											return <option value={key}>{ _.get(transformRole(key), 'label') }</option>
										return null
									})
								}
							</select>
						</div>
					</div>
					<div id="addMemberButtonArea">
						<div>
							<OutlineButton
								borderColor="#C94B32"
								bgColor="#FFFFFF"
								title="CANCEL"
								className="button"
								height={40}
								width={129}
								fontsize={16}
								fontweight={400}
								onClick={props.toggleShowMember}
							/>
						</div>
						<div>
							<SimpleButton
								title="OK"
								bgColor="#C94B32"
								className="button"
								fontsize={16}
								fontweight={400}
								height={40}
								width={129}
								onClick={() => {
									handleClick(ownerName, ownerAddress, ownerRole);
								}}
							/>
						</div>
					</div>
				</div>


				{/* Uploaded user modal */}
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
														{/* <option value="role1">Admin</option> */}
														<option value="role2">{ transformRole("role2").label }</option>
														<option value="role3">{ transformRole("role3").label }</option>
														<option value="role4">{ transformRole("role4").label }</option>
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
								validMembers.length > 0 && <button onClick={handleAddMembers} className="confirm-btn">
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

export default AddMember;
