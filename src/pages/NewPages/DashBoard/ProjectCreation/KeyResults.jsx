import { AiOutlineClose } from "react-icons/ai";
import { IsideModalNew } from "types/DashBoardType";
import IconButton from "UIpack/IconButton";
import "../../Settings.css";
import "./ProjectResources.css";
import OD from "../../../../assets/images/drawer-icons-project/keyResults.svg";

import { Button, Image, Input } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

const KeyResults = ({ toggleModal, toggleKeyResults }) => {
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            toggleModal();
            toggleKeyResults();
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
              <div className="title">Key Results</div>
              <div className="label">Set objective for your team</div>
            </div>
            {/* //! BODY */}
            <div
              style={{
                padding: "0 50px 0 50px",
              }}
            >
              <div style={{ paddingLeft: "50px" }}>
                <div id="text-type">Review Frequency</div>
                <select className="select">
                  <option key="1" value="daily">
                    Daily
                  </option>
                  <option key="2" value="weekly">
                    Weekly
                  </option>
                  <option key="3" value="monthly">
                    Monthly
                  </option>
                </select>

                <div id="text-type" style={{ marginTop: "35px" }}>
                  N° of key results
                </div>
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
              </div>

              <div className="line" />

              <div className="box">
                <div className="box-title">Key result</div>
                <div className="box-name">Name</div>
                <input
                  type="text"
                  className="box-input"
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
                  toggleKeyResults();
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

export default KeyResults;
