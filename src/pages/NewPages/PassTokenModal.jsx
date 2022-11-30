import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import PT from "../../assets/images/drawer-icons/PT.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useState } from "react";
import CreateMorePassTokenModal from "./CreateMorePassTokenModal";

const PassTokenModal = ({ toggleModal, togglePassToken }) => {
  const [openCreatePassToken, setOpenCreatePassToken] = useState(false);

  let toggleCreatePassTokenModal = () => {
    setOpenCreatePassToken(!openCreatePassToken);
  };

  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            togglePassToken();
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
                toggleModal();
                togglePassToken();
              }}
            />
          </div>

          <div className="MainComponent">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Image
                src={PT}
                alt="Pass Token icon"
                style={{ width: "94.48px", height: "50px" }}
              />
              <div id="title-type">Pass Tokens</div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
              }}
            >
              {/* logo container  */}
              <div id="pass-tokens-logo-container">
                <p>hk</p>
              </div>
              <div
                style={{
                  marginTop: "7px",
                  marginLeft: "15px",
                  width: "290px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <div id="token-title">Token name</div>
                <div id="#number-100">x100</div>
              </div>
            </div>
            <div id="create-more-section">
              <Button
                id="button-create-more"
                onClick={toggleCreatePassTokenModal}
              >
                <AddIcon id="add-icon" />
                CREATE MORE
              </Button>
              <div id="hr" />
            </div>
            <div
              id="membership-policy-section"
              // style={{
              //   display: "flex",
              //   flexDirection: "column",
              //   justifyContent: "start",
              // }}
            >
              <div id="text-type">Membership policy:</div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider round"></span>
                </label>
                <div id="switch-title">WHITELISTED</div>
              </div>
            </div>
            <div id="contact-details-section">
              <div id="text-type">Contact details</div>
              <p id="paragraph-type-1">
                Get certain member details could be useful for the smooth
                functioning of your organisation
              </p>
              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">Email</div>
              </div>
              <p id="paragraph-type">
                Please select if you intend to use services such as Notion,
                Google Workspace and GitHub.
              </p>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">Discord user-id</div>
              </div>
              <p id="paragraph-type">
                Please select if you intend to use access-controlled channels in
                Discord.
              </p>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">Telegram user-id</div>
              </div>
              <p id="paragraph-type">
                Please select if you intend to use access-controlled Telegram
                groups.
              </p>
            </div>
            {/* //! FOOTER */}
            <div className="button-section">
              <br />
              <br />
              <br />
              <Button
                id="button-cancel"
                onClick={() => {
                  toggleModal();
                  togglePassToken();
                }}
              >
                CANCEL
              </Button>
              <Button id="button-save">SAVE CHANGES</Button>
            </div>
          </div>
        </div>
      </div>

      {openCreatePassToken && (
        <CreateMorePassTokenModal
          toggleCreatePassTokenModal={toggleCreatePassTokenModal}
        />
      )}
    </>
  );
};

export default PassTokenModal;
