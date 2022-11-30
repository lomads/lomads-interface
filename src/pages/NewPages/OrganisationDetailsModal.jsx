import { AiOutlineClose } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import OD from "../../assets/images/drawer-icons/OD.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const OrganisationDetails = ({
  toggleModal,
  toggleOrganisationDetailsModal,
}) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleOrganisationDetailsModal();
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
              <div id="title-type">Organisation Details</div>
            </div>
            {/* //! BODY */}
            <div
              style={{
                padding: "0 50px",
              }}
            >
              <div id="text-type-od">Name</div>
              <Input variant="filled" placeholder="Fashion Fusion" />
              <div id="text-type-od">Organisation’s URL</div>
              <Input
                variant="filled"
                placeholder="https://app.lomads.xyz/Name"
              />

              <hr
                style={{
                  height: "1px",
                  width: 288,
                  background: "#C94B32",
                  margin: "35px auto 35px",
                }}
              />
              <div id="text-type">Member visibility</div>
              <p id="paragraph-type">
                If unlocked, everyone in the organisation will be able to see
                who is part of which project. Otherwise, only members part of a
                project sees the members they are working with.
              </p>
              <label class="switch" style={{ marginTop: "10px" }}>
                <input type="checkbox" />
                <span class="slider round"></span>
              </label>

              <hr
                style={{
                  height: "1px",
                  width: 288,
                  background: "#C94B32",
                  margin: "36px auto 35px",
                }}
              />
              <div id="text-type">Links</div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "9px",
                  justifyContent: "space-between",
                }}
              >
                <Input
                  placeholder="Ex Portfolio"
                  variant="filled"
                  width="35%"
                />
                <Input placeholder="link" variant="filled" width="50%" />
                <IconButton icon={<AddIcon />} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "9px",
                  padding: "20px",
                  backgroundColor: "#edf2f7",
                  color: "#718096",
                  borderRadius: "5px",
                }}
              >
                <p width="50%">Link 1</p>
                <p width="50%">https://discord/kkibhh</p>
              </div>
            </div>

            {/* //! FOOTER */}
            <div className="button-section">
              <Button
                id="button-cancel"
                onClick={() => {
                  toggleModal();
                  toggleOrganisationDetailsModal();
                }}
              >
                CANCEL
              </Button>
              <Button id="button-save">SAVE CHANGES</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrganisationDetails;
