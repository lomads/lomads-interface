import { AiOutlineClose } from "react-icons/ai";
import { get as _get } from 'lodash'
import IconButton from "UIpack/IconButton";
import "./Settings.css";
import PT from "../../assets/images/drawer-icons/PT.svg";
import { Button, Image, Input } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";

const CreateMorePassTokenModal = ({ navFromSetting, toggleCreatePassTokenModal }) => {
	const { DAO } = useAppSelector(store => store.dashboard)
  const navigate = useNavigate();
  return (
    <>
      <div className="sidebarModal">
        <div
          onClick={() => {
            //navFromSetting();
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
                //navFromSetting();
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
              }}
            >
              <Image src={PT} alt="configure pass token icon" />
              <div id="pass-token-title">Pass Tokens</div>

              <div id="create-token-type">
                The organisation doesn’t have token yet
              </div>
              <div>
                <Button onClick={() => navigate(`/${_get(DAO, 'url', '')}/create-pass-token`)} id="button-configure-token">
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
