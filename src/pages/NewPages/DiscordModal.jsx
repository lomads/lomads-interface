import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import DiscordIcon from "../../assets/images/drawer-icons/DiscordIcon.svg";
import { Button, Image } from "@chakra-ui/react";

const DiscordModal = ({ toggleModal, toggleDiscord }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleDiscord();
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
                toggleDiscord();
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
              src={DiscordIcon}
              alt="Organisation details icon"
              style={{ marginTop: "100px", width: "94.48px", height: "50px" }}
            />
            <div id="title-type">Discord</div>
          </div>

          {/* //! BODY */}
          <div
            style={{
              marginTop: "30px",
              padding: "0 50px",
            }}
          >
            <div id="membership-policy-section">
              <div id="text-type">Project Notifications</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">When a new member is added</div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "35px",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">
                  When a project is marked as complete
                </div>
              </div>

              <div id="text-type">Task Notifications</div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">When a task is created</div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">When someone is assigned a task</div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <label class="switch">
                  <input type="checkbox" />
                  <span class="slider check round"></span>
                </label>
                <div id="switch-title">When a submission is accepted</div>
              </div>
            </div>
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              variant="outline"
              mr={3}
              onClick={() => {
                toggleModal();
                toggleDiscord();
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

export default DiscordModal;
