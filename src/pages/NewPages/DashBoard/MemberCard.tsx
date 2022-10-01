import React, { useMemo, useState } from "react";
import { get as _get, find as _find } from 'lodash';
import { useWeb3React } from "@web3-react/core";
import { useAppSelector } from "state/hooks";
import membersIcon from "../../../assets/svg/membersIcon.svg";
import editIcon from '../../../assets/svg/editButton.svg';
import SafeButton from "UIpack/SafeButton";
import daoMember2 from "../../../assets/svg/daoMember2.svg";

const MemberCard = (props: any) => {

  const { provider, account } = useWeb3React();
  const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);

  const array = props.totalMembers.slice();
  const [membersArray, setMembersArray] = useState(JSON.parse(JSON.stringify(array)));
  let temp = JSON.parse(JSON.stringify(membersArray));
  const [editMode, setEditMode] = useState(false);

  const handleChangeName = (e: any, pos: any) => {
	  temp[pos].name = e.target.value;
  }

  const amIAdmin = useMemo(() => {
    if(DAO) {
      let user = _find(_get(DAO, 'members', []), m => _get(m, 'member.wallet', '').toLowerCase() === account?.toLowerCase() && m.role === 'ADMIN')
      if(user)
        return true
      return false
    }
    return false;
  }, [account, DAO])
  

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
            <div className="memberdivider">
              <hr />
            </div>
            <div className="dashboardText">{ 
              props.role === 'ADMIN' ? props.creator ?  'Admin (Creator)' : 'Admin' : 'Member' 
            }</div>
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
                {_get(DAO, 'members', []).length} members
              </div>
            </div>
            { amIAdmin && <SafeButton
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
            /> }
          </div>
        </div>
        <div className="membersList">
          <div className="NameAndAvatar">
            <div className="memberRow">
              <div className="avatarAndName">
                
                <div className="dashboardText">Name</div>
              </div>
              <div id="memberAddressText"></div>
              <div className="dashboardText" style={{ marginLeft: 60 }}>Joined</div>
              <div className="dashboardText"></div>
            </div>
          </div>
          {_get(DAO, 'members', []).map((result: any, index: any) => {
            return (
              <NameAndAvatar name={_get(result, 'member.name', '')} position={index} role={_get(result, 'role', 'MEMBER')} address={_get(result, 'member.wallet', '')} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MemberCard;
