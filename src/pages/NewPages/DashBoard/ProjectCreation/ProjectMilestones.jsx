import { AiOutlineClose } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "../../Settings.css";
import "./ProjectResources.css";
import OD from "../../../../assets/images/drawer-icons-project/projectMilestones.svg";
import AddButton from "../../../../assets/images/drawer-icons-project/ADD.svg";
import NotionLogo from "../../../../assets/images/drawer-icons-project/notion-logo.svg";

import { Button, Image, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const ProjectMilestones = ({ toggleModal, toggleProjectMilestones }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleProjectMilestones();
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
              <div className="title">Project Milestones</div>
              <div className="label">
                Organise and link payments to milestones
              </div>
            </div>
            {/* //! BODY */}
            <div
              style={{
                padding: "0 50px 0 50px",
              }}
            >
              <div id="text-type">Total Project Value</div>
              <div id="text-type">Milestones</div>

              <select className="select">
                <option key="1" value="">
                  1
                </option>
                <option key="1" value="">
                  2
                </option>
                <option key="1" value="">
                  3
                </option>
                <option key="1" value="">
                  4
                </option>
              </select>

              <div className="line" />

              <div className="box-milestones">
                <div className="box-title">Milestone 1</div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input type="text" className="box-input-milestone" />
                  <div className="text-milestone">% of Project value</div>
                </div>
                <div className="box-name">Due date</div>
                <div className="box-input-milestone" />
                <div className="box-name">Deliverables</div>
                <input
                  type="text"
                  className="box-input-text"
                  placeholder="Super project"
                />
              </div>
            </div>

            {/* //! FOOTER */}
            <div className="button-section">
              <Button
                id="button-cancel"
                onClick={() => {
                  toggleModal();
                  toggleProjectMilestones();
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

export default ProjectMilestones;
