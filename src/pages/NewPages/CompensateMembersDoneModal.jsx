import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { ReactComponent as CompensateIcon } from "../../assets/images/settings-page/8-compensate-member.svg";
import eventEmitter from "utils/eventEmmiter";


const CompensateMembersDoneModal = ({ toggleModal, toggleXp }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            eventEmitter.emit('close-xp-modal')
            // toggleCompensate();
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
              justifyContent:'center',
              alignItems: "center",height:"80%"
            }}
          >
            <CompensateIcon style={{marginTop: "100px",marginBottom:'20px', width: "94.48px", height: "50px",color: "#C94B32" }} />
            <div id="title-type">Done!</div>
          <div id="cm-info" style={{marginTop:20}}
          >
            Batch Transaction initiated. <br /> You will be redirected in a few seconds.
          </div>
          </div>

          {/* //! BODY */}
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
    </>
  );
};

export default CompensateMembersDoneModal;
