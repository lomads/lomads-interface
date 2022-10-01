import React, { useMemo, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import membersIcon from "../../../assets/svg/membersIcon.svg";
import editIcon from '../../../assets/svg/editButton.svg';
import SafeButton from "UIpack/SafeButton";
import daoMember2 from "../../../assets/svg/daoMember2.svg";

const MemberCard = (props: any) => {
	const array = props.totalMembers.slice();
	const [membersArray, setMembersArray] = useState(JSON.parse(JSON.stringify(array)));
	let temp = JSON.parse(JSON.stringify(membersArray));
	const [editMode, setEditMode] = useState(false);

	const handleChangeName = (e: any, pos: any) => {
		temp[pos].name = e.target.value;
	}

	const NameAndAvatar = (props: any) => {
		return (
			<>
				<div className="NameAndAvatar">
					<div className="memberRow">
						<div className="avatarAndName">
							<img src={daoMember2} alt="avatar" />
							{
								editMode
									?
									<input
										// value={temp[props.position].name}
										placeholder={props.name}
										onChange={(e) => handleChangeName(e, props.position)}
									/>
									:
									<div className="dashboardText">{props.name}</div>
							}
						</div>
						<div id="memberAddressText">
							{props.address.slice(0, 6) + "..." + props.address.slice(-4)}
						</div>
						<div className="memberdivider">
							<hr />
						</div>
						<div className="dashboardText">10/20/23</div>
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
								{props.totalMembers.length} members
							</div>
						</div>
						<SafeButton
							height={40}
							width={150}
							titleColor="#B12F15"
							title="ADD MEMBER"
							bgColor="#FFFFFF"
							opacity="1"
							disabled={false}
							fontweight={400}
							fontsize={16}
							onClick={props.toggleShowMember}
						/>
						<button onClick={() => setEditMode(true)}>
							<img src={editIcon} alt="edit-icon" />
						</button>
						<SafeButton
							height={40}
							width={150}
							titleColor="#B12F15"
							title="DONE"
							bgColor="#FFFFFF"
							opacity="1"
							disabled={false}
							fontweight={400}
							fontsize={16}
							onClick={() => {
								setEditMode(false);
								setMembersArray(temp);
								console.log(temp);
							}}
						/>
					</div>
				</div>
				<div className="membersList">
					<div className="memberheaders">
						<div className="dashboardText">Name</div>
						<div className="dashboardText">Joined</div>
					</div>
					{
						membersArray.map((result: any, index: any) => {
							return (
								<NameAndAvatar name={result.name} address={result.address} position={index} />
							);
						})
					}
				</div>
			</div>
		</>
	);
};

export default MemberCard;
