import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import PT from "../../assets/images/drawer-icons/PT.svg";
import { Button, Image, Input } from "@chakra-ui/react";

const CreateMorePassTokenModal = ({ toggleCreatePassTokenModal }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleCreatePassTokenModal();
          }}
          className="overlay"
        ></div>
        <div className="SideModalNew">
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
                toggleCreatePassTokenModal();
              }}
            />
          </div>

          <div className="MainComponent">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "35%",
              }}
            >
              <Image src={PT} alt="configure pass token icon" />
              <div id="pass-token-title">Pass Tokens</div>

              <div id="create-token-type">
                The organisation doesn’t have token yet
              </div>
              <div>
                <Button id="button-configure-token">
                  CONFIGURE PASS TOKEN
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateMorePassTokenModal;
