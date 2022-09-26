import React from "react";
import membersIcon from "../../../assets/svg/membersIcon.svg";
import SafeButton from "UIpack/SafeButton";
import daoMember2 from "../../../assets/svg/daoMember2.svg";

const MemberCard = (props: any) => {
  const NameAndAvatar = (props: any) => {
    return (
      <>
        <div className="NameAndAvatar">
          <div className="memberRow">
            <div className="avatarAndName">
              <img src={daoMember2} alt="avatar" />
              <div className="dashboardText">{props.name}</div>
            </div>
            <div className="dashboardText">
              {props.address.slice(0, 18) + "..." + props.address.slice(-6)}
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
          </div>
        </div>
        <div className="membersList">
          <div className="memberheaders">
            <div className="dashboardText">Name</div>
            <div className="dashboardText">Joined</div>
          </div>
          {props.totalMembers.map((result: any, index: any) => {
            return (
              <NameAndAvatar name={result.name} address={result.address} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MemberCard;