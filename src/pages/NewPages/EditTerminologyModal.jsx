import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import DiscordIcon from "../../assets/images/drawer-icons/edit.svg";
import { Button, Image } from "@chakra-ui/react";
import SimpleInputField from "UIpack/SimpleInputField";
import { useState } from "react";

const EditTerminologyModal = ({ toggleEditModal }) => {
  const projects = [
    {
      id: 1,
      name: "Pods",
    },
    {
      id: 2,
      name: "Departments",
    },
    {
      id: 3,
      name: "Functions",
    },
    {
      id: 4,
      name: "Guilds",
    },
  ];

  let [inputProject, setInputProject] = useState(false);
  let [inputTask, setInputTask] = useState(false);

  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleEditModal();
          }}
          className="overlay"
        ></div>
        <div className="SideModalTerminology">
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
                toggleEditModal();
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
              style={{ marginTop: "30px", width: "94.48px", height: "50px" }}
            />
            <div id="title-type">Terminology</div>
          </div>

          {/* //! BODY */}
          <div>
            <div className="terminology-edit">
              <div className="terminology-edit-content">
                <div id="text-type">Projects:</div>
                {/* //! dropdown */}
                {inputProject === false ? (
                  <div class="dropdown-terminology">
                    <button>Select</button>
                    <div class="dropdown-content">
                      <button onClick={() => setInputProject(true)}>
                        Custom
                      </button>
                      {projects.map((e) => {
                        return <a onClick={() => console.log(e)}>{e.name}</a>;
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <SimpleInputField
                      className="inputField"
                      height={50}
                      width={217}
                      placeholder="Custom"
                    />
                  </div>
                )}
              </div>
              <div className="terminology-edit-content">
                <div id="text-type">Tasks:</div>
                {/* //! dropdown */}
                {inputTask === false ? (
                  <div class="dropdown-terminology">
                    <button>Select</button>
                    <div class="dropdown-content">
                      <button onClick={() => setInputTask(true)}>Custom</button>
                      {projects.map((e) => {
                        return <a onClick={() => console.log(e)}>{e.name}</a>;
                      })}
                    </div>
                  </div>
                ) : (
                  <div>
                    <SimpleInputField
                      className="inputField"
                      height={50}
                      width={217}
                      placeholder="Custom"
                    />
                  </div>
                )}
              </div>

              <div
                style={{
                  height: "1px",
                  width: 208,
                  background: "#C94B32",
                  margin: "33px auto 35px auto",
                }}
              />

              <div className="terminology-edit-content">
                <div id="text-type">Admin:</div>
                <div>
                  <SimpleInputField
                    className="inputField"
                    height={50}
                    width={217}
                    placeholder="Admin"
                    // value={daoName}
                    // onchange={(event) => {
                    //   checkAvailabilityAsync(event);
                    //   handleDaoName(event);
                    // }}
                    // isInvalid={errors.daoName}
                  />
                </div>
              </div>
              <div className="terminology-edit-content">
                <div id="text-type">Core Contributor:</div>
                <div>
                  <SimpleInputField
                    className="inputField"
                    height={50}
                    width={217}
                    placeholder="Admin"
                  />
                </div>
              </div>
              <div className="terminology-edit-content">
                <div id="text-type">Active Contributor:</div>
                <div>
                  <SimpleInputField
                    className="inputField"
                    height={50}
                    width={217}
                    placeholder="Admin"
                  />
                </div>
              </div>
              <div className="terminology-edit-content">
                <div id="text-type">Contributor:</div>
                <div>
                  <SimpleInputField
                    className="inputField"
                    height={50}
                    width={217}
                    placeholder="Admin"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              style={{ marginRight: 6 }}
              variant="outline"
              id="button-cancel"
              onClick={() => {
                toggleEditModal();
              }}
            >
              CANCEL
            </Button>
            <Button id="button-save">SAVE CHANGES</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTerminologyModal;
