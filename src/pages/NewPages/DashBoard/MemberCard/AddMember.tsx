import React, { useEffect, useState } from "react";
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
import { addDaoMember, addProjectMember } from 'state/dashboard/actions'
import { resetAddMemberLoader } from 'state/dashboard/reducer';

const AddMember = (props: any) => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [errors, setErrors] = useState<any>({});
	const totalMembers = useAppSelector((state) => state.flow.totalMembers);
	const { DAO, addMemberLoading } = useAppSelector((state) => state.dashboard);
	const { account, provider } = useWeb3React();

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
		const check = totalMembers.some((mem) => mem.address === _address);
		return check;
	};
	useEffect(() => {
		const check = totalMembers.some(
			(member) => member.address === (account as string)
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
		if (addMemberLoading === false) {
			dispatch(resetAddMemberLoader())
			setOwnerName("");
			setOwnerAddress("");
			props.toggleShowMember();
		}
	}, [addMemberLoading])

	const addMember = async (_ownerName: string, _ownerAddress: string) => {
		const member: InviteGangType = { name: _ownerName, address: _ownerAddress };
		if (_ownerAddress.slice(-4) === ".eth") {
			const resolver = await provider?.getResolver(_ownerAddress);
			const EnsAddress = await resolver?.getAddress();
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
			const ENSname = await provider?.lookupAddress(_ownerAddress);
			if (ENSname) {
				member.name = _ownerName !== '' ? _ownerName : ENSname;
			}
			else {
				member.name = _ownerName;
			}
		}
		if (!isPresent(member.address) && isRightAddress(member.address)) {
			if (props.projectId) {
				dispatch(addProjectMember({ projectId: props.projectId, daoUrl: props.daoUrl, payload: member }))
			}
			else {
				dispatch(addDaoMember({ url: DAO?.url, payload: member }))
			}
		}
	};

	const handleClick = (_ownerName: string, _ownerAddress: string) => {
		let terrors: any = {};
		if (!isAddressValid(ownerAddress)) {
			terrors.ownerAddress = " * address is not correct.";
		}
		if (isPresent(ownerAddress)) {
			terrors.ownerAddress = " * address already exists.";
		}
		if (_.isEmpty(terrors)) {
			addMember(_ownerName, _ownerAddress);
		} else {
			setErrors(terrors);
		}
	};
	return (
		<>
			<div id="AddNewMemberComponent">
				<div onClick={props.toggleModal} id="AddNewMemberOverlay"></div>
				<div id="AddNewMember">
					<div>
						<div className="inputTitle">Add member :</div>
					</div>
					<div className="inputArea">
						<div>
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
						<div>
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
									handleClick(ownerName, ownerAddress);
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AddMember;
