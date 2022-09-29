import React from "react";
import { get as _get } from 'lodash';
import { useAppSelector } from "state/hooks";
import membersIcon from "../../../assets/svg/membersIcon.svg";
import SafeButton from "UIpack/SafeButton";
import daoMember2 from "../../../assets/svg/daoMember2.svg";

const MemberCard = (props: any) => {

  const { DAO, DAOLoading } = useAppSelector((state) => state.dashboard);

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
                {_get(DAO, 'members', []).length} members
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
          </div>
        </div>
        <div className="membersList">
          <div className="memberheaders">
            <div className="dashboardText">Name</div>
            <div className="dashboardText">Joined</div>
          </div>
          {_get(DAO, 'members', []).map((result: any, index: any) => {
            return (
              <NameAndAvatar name={_get(result, 'member.name', '')} address={_get(result, 'member.wallet', '')} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MemberCard;
