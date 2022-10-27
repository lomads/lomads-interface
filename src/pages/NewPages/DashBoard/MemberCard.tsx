import React, { useEffect, useMemo, useState } from "react";
import moment from 'moment';
import { get as _get, find as _find } from 'lodash';
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import membersIcon from "../../../assets/svg/membersIcon.svg";
import editIcon from '../../../assets/svg/editButton.svg';
import SafeButton from "UIpack/SafeButton";
import daoMember2 from "../../../assets/svg/daoMember2.svg";
import { useAppDispatch } from "state/hooks";
import { updateDaoMember } from 'state/dashboard/actions'
import SimpleInputField from "UIpack/SimpleInputField";
import useRole from "hooks/useRole";

const MemberCard = (props: any) => {
	const dispatch = useAppDispatch();
	const { provider, account } = useWeb3React();
	const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);

	const { myRole, can } = useRole(DAO, account);

	const [membersArray, setMembersArray] = useState<any>([]);
	const [editMode, setEditMode] = useState(false);
	const [editRoles, setEditRoles] = useState(false);
	const [editableName, setEditableName] = useState();

	useEffect(() => {
		if (DAO) {
			setMembersArray(_get(DAO, 'members', []));
		}
	}, [DAO]);

	const handleChangeName = (e: any) => {
		setEditableName(e.target.value);
	}

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

	const handleActivateEditMode = () => {
		let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase())
		setEditableName(user.member.name)
		setEditMode(true);
		if (amIAdmin) {
			setEditRoles(true);
		}
	}

	const _handleKeyDown = (e: any) => {
		if (e.key === 'Enter') {
			setEditMode(false);
			const member = { name: editableName };
			dispatch(updateDaoMember({ url: DAO?.url, payload: member }))
		}
	}

	const capitalizeFirstLetter = (string: string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	const NameAndAvatar = (props: any) => {
		return (
			<>
				<div className="NameAndAvatar">
					<div className="memberRow">
						<div className="avatarAndName">
							<img src={daoMember2} alt="avatar" />
							{
								editMode && props.address.toLowerCase() === account?.toLowerCase()
									?
									<input
										value={editableName}
										onClick={(e) => e.stopPropagation()}
										onChange={(e) => handleChangeName(e)}
										onKeyDown={(e) => _handleKeyDown(e)}
										autoFocus
									/>
									:
									<div className="dashboardText">{props.name}</div>
							}
						</div>
						<div id="memberAddressText">
							{props.address.slice(0, 6) + "..." + props.address.slice(-4)}
						</div>
						<div style={{ marginLeft: 12 }} className="memberdivider">
							<hr />
						</div>
						<div className="dashboardText">{moment.utc(props.joined).local().format('MM/DD/YYYY')}</div>
						<div className="memberdivider">
							<hr />
						</div>
						<div className="roleText">
							{
								editRoles
									?
									<select onClick={(e) => e.stopPropagation()} onChange={(e) => console.log("Selected Role : ", e.target.value)}>
										{
											props.role === 'ADMIN'
												?
												<option value="ADMIN" selected disabled>Admin</option>
												:
												<option value="ADMIN">Admin</option>
										}
										{
											props.role === 'CORE_CONTRIBUTOR' || props.role === 'MEMBER'
												?
												<option value="CORE_CONTRIBUTOR" selected disabled>Core Contributor</option>
												:
												<option value="CORE_CONTRIBUTOR">Core Contributor</option>
										}
									</select>
									:
									<>
										{
											props.role === 'ADMIN' ? props.creator ? 'Admin (Creator)' : 'Admin' : capitalizeFirstLetter((props.role).replace('_', ' ').toLowerCase())
										}
									</>
							}
						</div>
					</div>
				</div>
			</>
		);
	};
	return (
		<>
			<div className="memberCard">
				<div className="treasuryHeader">
					<div className="titleHeader">Members</div>
					<div className="memberHeaderDetails">
						<div className="copyArea">
							<div>
								<hr className="vl" />
							</div>
							<img
								src={membersIcon}
								alt="asset"
								style={{ height: 35, width: 35 }}
							/>
							<div className="dashboardText">
								{
									_get(DAO, 'members', []).length > 1
										?
										`${_get(DAO, 'members', []).length} members`
										:
										`${_get(DAO, 'members', []).length} member`
								}
							</div>
						</div>
						{ can(myRole, 'members.edit') && <button
							// onClick={handleActivateEditMode} 
							onClick={() => props.toggleShowEditMember()}
						>
							<img src={editIcon} alt="edit-icon" />
						</button> }
						{can(myRole, 'members.add') && <SafeButton
							height={40}
							width={150}
							titleColor="#B12F15"
							title="ADD MEMBER"
							bgColor="#FFFFFF"
							opacity="1"
							disabled={false}
							fontweight={400}
							fontsize={16}
							onClick={() => props.toggleShowMember()}
						/>}


					</div>
				</div>
				<div className="membersList" onClick={() => { setEditMode(false); setEditRoles(false) }}>
					<div className="NameAndAvatar">
						<div className="memberRow">
							<div className="avatarAndName">

								<div className="dashboardText">Name</div>
							</div>
							<div id="memberAddressText"></div>
							<div className="dashboardText" style={{ marginLeft: 90 }}>Joined</div>
							<div className="dashboardText"></div>
						</div>
					</div>
					{membersArray.map((result: any, index: any) => {
						return (
							<NameAndAvatar
								name={_get(result, 'member.name', '')}
								position={index}
								joined={_get(result, 'joined')}
								creator={_get(result, 'creator', false)}
								role={_get(result, 'role', 'CONTRIBUTOR')}
								address={_get(result, 'member.wallet', '')}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
};

export default MemberCard;
