import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { ReactComponent as XpPoints } from "../../assets/images/settings-page/5-xp-points-color.svg";
import DisableXpPointDailog from "./DisableXpPointDailog";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import CompensateMembersModal from "./CompensateMembersModal";



const XpPointsModal = ({ toggleModal, toggleXp }) => {
  const [showDisableDailog , setShowDisableDailog] = useState(false)
  const [isXpPointEnable , setIsXpPointEnable] = useState(false)
  const [isXpPointSetByDailog , setIsXpPointSetByDailog] = useState(false)
  const [showCompensateMembersModals , setShowCompensateMembersModals] = useState(false)
  const [firstUpdate , setFirstUpdate] = useState(false)


  useEffect(() => {
    if (!firstUpdate) {
      setFirstUpdate(true)
    } else {
      if(!isXpPointEnable && !isXpPointSetByDailog) {
        setShowDisableDailog(true)
        setIsXpPointSetByDailog(false)
      }
    }
  },[isXpPointEnable]);
  
  return (
    <>
      <div className="sidebarModal">
        {showDisableDailog && <DisableXpPointDailog setShowDisableDailog={setShowDisableDailog} setIsXpPointEnable={setIsXpPointEnable} isXpPointSetByDailog={isXpPointSetByDailog} />}
        <div
          onClick={() => {
            toggleModal();
            toggleXp();
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
                toggleModal();
                toggleXp();
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
            <XpPoints style={{marginTop: "100px", marginBottom:'10px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            {/* <Image
              src={XpPoints}
              alt="SWEAT Points icon"
              style={{ marginTop: "100px", width: "94.48px", height: "50px" }}
            /> */}
            <div id="title-type">SWEAT Points</div>
          </div>

          {/* //! BODY */}
          <div id="xp-text" >
            This feature is super useful during the bootstrapping phase of your organisation. You
            can assign SWEAT points to members for their contributions. Over time, this serves as a
            measure of the relative contribution of different members of the organisation. When your
            organisation has its own token or it has funds to pay, you can compensate members in
            proportion to the SWEAT points they have.
          </div>
          {isXpPointEnable && <Button onClick={()=>setShowCompensateMembersModals(true)} id="button-save">{'Convert to tokens & Compensate members'}</Button>}
          <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label class="switch">
                  <input checked={isXpPointEnable} onChange={(e, d) => setIsXpPointEnable(!isXpPointEnable)} type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">{isXpPointEnable ? "ENABLED" : "DISABLED"}</div>
              </div>
          {/* //! FOOTER */}
          {/* <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleXp();
              }}
            >
              Cancel
            </Button>
            <Button id="button-save">SAVE CHANGES</Button>
          </div> */}
        </div>
      </div>
      {showCompensateMembersModals && (
        <CompensateMembersModal toggleCompensate={()=>setShowCompensateMembersModals(false)} />
      )}
    </>
  );
};

export default XpPointsModal;
