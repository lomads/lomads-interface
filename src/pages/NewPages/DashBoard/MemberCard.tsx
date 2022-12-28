import React, { useEffect, useMemo, useState } from "react";
import moment from 'moment';
import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
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
import useTerminology from 'hooks/useTerminology';

const MemberCard = (props: any) => {
	const dispatch = useAppDispatch();
	const { provider, account } = useWeb3React();
	const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);
	const { transformRole } = useTerminology(_get(DAO, 'terminologies'))
	const { myRole, can } = useRole(DAO, account);

	const [membersArray, setMembersArray] = useState<any>([]);

	useEffect(() => {
		if (DAO) {
			setMembersArray(_get(DAO, 'members', []));
		}
	}, [DAO]);

	const amIAdmin = useMemo(() => {
		if (DAO) {
			let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'role1')
			if (user)
				return true
			return false
		}
		return false;
	}, [account, DAO])

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
							<div className="dashboardText">{props.name}</div>
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
								props.role === 'role1' ? props.creator ? `${transformRole(props.role).label} (Creator)` : transformRole(props.role).label : transformRole(props.role).label
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
						{can(myRole, 'members.edit') && <button
							// onClick={handleActivateEditMode} 
							onClick={() => props.toggleShowEditMember()}
						>
							<img src={editIcon} alt="edit-icon" />
						</button>}
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
				<div className="membersList">
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
					{_uniqBy(membersArray, (m: any) => m.member.wallet.toLowerCase()).map((result: any, index: any) => {
						return (
							<NameAndAvatar
								name={_get(result, 'member.name', '')}
								position={index}
								joined={_get(result, 'joined')}
								creator={_get(result, 'creator', false)}
								role={_get(result, 'role', 'role4')}
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
