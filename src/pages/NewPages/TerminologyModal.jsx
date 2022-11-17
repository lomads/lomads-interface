import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";

const TerminologyModal = ({ toggleModal, toggleTerminology }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleTerminology();
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
                toggleTerminology();
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
            <Image
              src={OD}
              alt="Terminology icon"
              style={{ marginTop: "100px", width: "94.48px", height: "50px" }}
            />
            <div id="title-type">Terminology</div>
          </div>

          {/* //! BODY */}
          <div
            style={{
              marginTop: "30px",
              padding: "0 50px",
            }}
          >
            Content
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleTerminology();
              }}
            >
              Cancel
            </Button>
            <Button id="button-save">SAVE CHANGES</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TerminologyModal;
