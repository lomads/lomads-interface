import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { ReactComponent as CompensateIcon } from "../../assets/images/settings-page/8-compensate-member.svg";
import moment from 'moment';
import daoMember2 from "../../assets/svg/daoMember2.svg";
import { ReactComponent as PolygonIcon } from '../../assets/svg/polygon.svg';
import { ReactComponent as StarIcon } from '../../assets/svg/star.svg';


import { get as _get, find as _find, uniqBy as _uniqBy } from 'lodash';
import CompensateMembersDoneModal from "./CompensateMembersDoneModal";
import { useState } from "react";
import eventEmitter from "utils/eventEmmiter";



const CompensateMembersDescriptionModal = ({ toggleModal, toggleCompensate }) => {
  const [showCompensateMembersDoneModal , setShowCompensateMembersDoneModal] = useState(false)


  const capitalizeFirstLetter = (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}


  const NameAndAvatar = (props) => {
		return (
			<>
				<div style={{margin:'12px 0'}}>
					<div className="memberRow">
						<div className="avatarAndName">
							<img src={daoMember2} alt="avatar" />
							<div style={{marginRight:11, minWidth:92}} className="dashboardText">{"Nikhil"}</div>
						</div>
						{/* <div id="memberAddressText">
							{props.address.slice(0, 6) + "..." + props.address.slice(-4)}
						</div> */}
						{/* <div style={{ marginLeft: 12 }} className="memberdivider">
							<hr />
						</div> */}
            <div>
            <StarIcon style={{height:"18px", width:"18px", margin:'0 10px 0 12px'}}/>
            </div>
						<div style={{ minWidth:"65px"}} className="dashboardText">{"1 SWT ="}</div>
						{/* <div className="memberdivider">
							<hr />
						</div> */}
						<div style={{marginLeft:"20px", minWidth:"28px", alignItems:'center', justifyContent:'flex-end', display:'flex'}} className="roleText">
							{"5"}
						</div>
            <div>
            <PolygonIcon style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/>
            </div>
					</div>
				</div>
			</>
		);
	};
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            eventEmitter.emit('close-xp-modal')
          }}
          className="overlay"
        ></div>
        <div className="SideModal">
          <div className="closeButtonArea">
            <IconButton
              Icon={
                <AiOutlineClose
                  style={{
                    color: "#C94B32",
                    height: "16px",
                    width: "16px",
                  }}
                />
              }
              bgColor="linear-gradient(180deg, #FBF4F2 0%, #EEF1F5 100%)"
              height={37}
              width={37}
              className="sideModalCloseButton"
              onClick={() => {
                eventEmitter.emit('close-xp-modal')
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <CompensateIcon style={{marginTop: "100px",marginBottom:'20px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            <div id="title-type">Compensate Members</div>
          </div>

          {/* //! BODY */}
          <div style={{minWidth:'300px'}}>
          {
          //  _uniqBy([{},{}], (m) => m.member.wallet.toLowerCase())
          [{},{}].map((result, index) => {
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
          <div style={{display:'flex', flexDirection:'row', justifyContent:'flex-end', marginTop:'20px'}}>
            <div className="dashboardText">{"Total ="}</div>
              {/* <div className="memberdivider">
                <hr />
              </div> */}
              <div style={{marginLeft:"20px"}} className="roleText">
                {"250"}
              </div>
              <div>
              <PolygonIcon style={{height:"20px", width:"20px", margin:'0 0 0 8px'}}/>
              </div>
            </div>
          </div>
          <div id="cm-info"
          >
            All SWEAT counter will be reset to 0.
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleCompensate();
              }}
            >
              Cancel
            </Button>
            <Button onClick={()=>setShowCompensateMembersDoneModal(true)} id="button-save">SAVE CHANGES</Button>
          </div>
        </div>
      </div>
      {showCompensateMembersDoneModal && (
        <CompensateMembersDoneModal toggleCompensate={()=>setShowCompensateMembersDoneModal(false)} />
      )}
    </>
  );
};

export default CompensateMembersDescriptionModal;
