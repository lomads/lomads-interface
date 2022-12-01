import { AiOutlineClose } from "react-icons/ai";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/Frameterminology.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import EditTerminologyModal from "./EditTerminologyModal";
import { useState } from "react";
import editIcon from 'assets/svg/editButton.svg';

const TerminologyModal = ({ toggleModal, toggleTerminology }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  let toggleEditModal = () => {
    setShowEditModal(!showEditModal);
  };

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
        <div className="SideModalTerminology">
          <div className="closeButtonArea">
            <button
              style={{ marginRight: "22px" }}
              onClick={() => toggleEditModal()}
            >
              <img
                src={editIcon}
                alt="edit-icon"
              />
            </button>
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
              padding: "0 50px",
            }}
          >
            <p className="terminology-label">
              Labels used in all your organisation’s interface.
            </p>

            <div className="terminology-group1">
              <div style={{ display: "flex" }}>
                <div id="text-type">Projects:</div>
                <p className="description">Pods</p>
              </div>
              <div style={{ display: "flex" }}>
                <div id="text-type">Tasks:</div>
                <p className="description">Bounties</p>
              </div>

              <hr
                style={{
                  height: "1px",
                  width: 288,
                  background: "#C94B32",
                  margin: "33px auto 35px",
                }}
              />

              <div style={{ display: "flex" }}>
                <div id="text-type">Admin:</div>
                <p className="description">Admin</p>
              </div>
              <div style={{ display: "flex" }}>
                <div id="text-type">Core Contributor:</div>
                <p className="description">Core Contributor</p>
              </div>
              <div style={{ display: "flex" }}>
                <div id="text-type">Active Contributor:</div>
                <p className="description">Active Contributor</p>
              </div>
              <div style={{ display: "flex" }}>
                <div id="text-type">Contributor:</div>
                <p className="description">Contributor</p>
              </div>
            </div>
          </div>
          {/* //! FOOTER */}
          <div className="button-section">
            <Button
              id="button-cancel"
              onClick={() => {
                toggleModal();
                toggleTerminology();
              }}
            >
              CANCEL
            </Button>
            <Button id="button-save">SAVE CHANGES</Button>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditTerminologyModal toggleEditModal={toggleEditModal} />
      )}
    </>
  );
};

export default TerminologyModal;
