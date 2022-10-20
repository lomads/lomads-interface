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

const InviteGang = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [uploadLoading, setUploadLoading] = useState<boolean>(false);
	const [ownerName, setOwnerName] = useState<string>("");
	const [ownerAddress, setOwnerAddress] = useState<string>("");
	const [errors, setErrors] = useState<any>({});
	const invitedMembers = useAppSelector((state) => state.flow.invitedGang);
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
				{ name: "", address: account as string },
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

	const addMember = useCallback((_ownerName: string, _ownerAddress: string) => {
		return new Promise(async (resolve, reject) => {
			const member: InviteGangType = { name: _ownerName, address: _ownerAddress };
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
				const ENSname = await provider?.lookupAddress(_ownerAddress);
				console.log("88 ensName : ", ENSname);
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
				if(isAddressValid(member.address) && !isPresent(member.address)) {
					if (member.address.slice(-4) === ".eth") {
						const resolver = await provider?.getResolver(member.address);
						const EnsAddress = await resolver?.getAddress();
						if (EnsAddress){
							member.name = member.name ? member.name : member.address;
							member.address = EnsAddress as string;
						}	
					} else {
						const ENSname = await provider?.lookupAddress(member.address);
						if(ENSname)
							member.name = member.name ? member.name : ENSname
					}
					if(!_.find(validMembers, m => m.address.toLowerCase() === member.address.toLowerCase()) &&
					   !_.find(invitedMembers, m => m.address.toLowerCase() === member.address.toLowerCase())
					) { 
						validMembers.push(member);
					}
				}
			}
			dispatch(appendInviteMembers(validMembers))
			setUploadLoading(false)
		} catch (e){
			setUploadLoading(false)
		}
	}, [invitedMembers])

	return (
		<>
			<div className="InviteGang">
				<div className="headerText">2/3 Original Gang</div>
				<div className="centerInputCard">
					<div style={{ width: '100%', marginBottom: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<div className="inputTitle">Add member :</div>
						{ uploadLoading ? <LeapFrog size={24} color="#C94B32" /> : <Uploader onComplete={handleInsertWallets} /> }
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
						<div>
							<IconButton
								className="addButton"
								Icon={<AiOutlinePlus style={{ height: 30, width: 30 }} />}
								height={50}
								width={50}
								onClick={(e) => {
									handleClick(ownerName, ownerAddress);
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
										{result.address !== undefined &&
											result.address !== account ? (
											<p className="text">
												{result.address &&
													result.address.slice(0, 6) +
													"..." +
													result.address.slice(-4)}
											</p>
										) : (
											<p className="creatorText">
												{result.address &&
													result.address.slice(0, 6) +
													"..." +
													result.address.slice(-4)}
											</p>
										)}
										{result.address !== account && (
											<div
												className="deleteButton"
												onClick={() => {
													deleteMember(result.address);
												}}
											>
												<AiOutlineClose style={{ height: 15, width: 15 }} />
											</div>
										)}
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
			</div>
		</>
	);
};

export default InviteGang;
