import { AiOutlineClose } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "../../Settings.css";
import "./ProjectResources.css";
import OD from "../../../../assets/images/drawer-icons-project/projectResources.svg";
import AddButton from "../../../../assets/images/drawer-icons-project/ADD.svg";
import NotionLogo from "../../../../assets/images/drawer-icons-project/notion-logo.svg";

import { Button, Image, Input } from "@chakra-ui/react";

const ProjectResources = ({ toggleModal, toggleProjectResources }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleProjectResources();
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
              onClick={toggleModal}
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
                src={OD}
                alt="Organisation details icon"
                style={{ width: "94.48px", height: "50px" }}
              />
              <div className="title">Project Resources</div>
              <div className="label">Add links for online ressources</div>
            </div>
            {/* //! BODY */}
            <div
              style={{
                padding: "0 50px",
              }}
            >
              <div id="text-type">Add links</div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "9px",
                  justifyContent: "space-between",
                }}
              >
                <input
                  type="text"
                  className="input-type"
                  placeholder="Ex Portfolio"
                  style={{ width: "144px" }}
                />
                <input
                  type="text"
                  className="input-type"
                  placeholder="link"
                  style={{
                    width: "193px",
                    marginLeft: "12px",
                    marginRight: "12px",
                  }}
                />
                <button style={{ borderRadius: "5px" }}>
                  <img src={AddButton} alt="add-icon" />
                </button>
              </div>

              <div className="access-control">ACCESS CONTROL</div>
              <div className="comment">
                Currently available for Notion and Discord only
              </div>

              <div
                className="display-type"
                // style={{
                //   display: "flex",
                //   flexDirection: "row",
                //   marginTop: "9px",
                //   padding: "20px",
                //   backgroundColor: "#edf2f7",
                //   color: "#718096",
                //   borderRadius: "5px",
                // }}
              >
              <div className="row-type">
                <img src={NotionLogo} alt="add-icon" />
                <div
                  style={{
                    marginLeft: "12px",
                    width: "106px",
                    marginRight: "10px",
                  }}
                >
                  Name
                </div>
                <div>https//jhhdhdjsdshvghv</div>
              </div>
                <div className="row-type">
                  <img src={NotionLogo} alt="add-icon" />
                  <div
                    style={{
                      marginLeft: "12px",
                      width: "106px",
                      marginRight: "10px",
                    }}
                  >
                    Name
                  </div>
                  <div>https//jhhdhdjsdshvghv</div>
                </div>
                <div className="row-type">
                  <img src={NotionLogo} alt="add-icon" />
                  <div
                    style={{
                      marginLeft: "12px",
                      width: "106px",
                      marginRight: "10px",
                    }}
                  >
                    Name
                  </div>
                  <div>https//jhhdhdjsdshvghv</div>
                </div>
              </div>
            </div>

            {/* //! FOOTER */}
            <div className="button-section">
              <Button
                id="button-cancel"
                onClick={() => {
                  toggleModal();
                  toggleProjectResources();
                }}
              >
                CANCEL
              </Button>
              <Button id="button-save">ADD</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectResources;
