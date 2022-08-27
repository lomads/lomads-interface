import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import { useAppSelector } from "state/hooks";
import Header from "components/Header";
import { fileUpload } from "../utils/ipfs";
import useStepRouter from "hooks/useStepRouter";
import CreateNewToken from "components/CreateNewToken";
import UseExistingToken from "components/UseExistingToken";
import { sidebarPropType } from "types";

const TokenPage = (props: sidebarPropType) => {
  const navigate = useNavigate();
  useStepRouter(4);
  const web3authAddress = useAppSelector(
    (state) => state.proposal.Web3AuthAddress
  );
  const [newToken, setNewToken] = useState<boolean>(true);

  useEffect(() => {
    if (!props.chainAllowed) {
      navigate("/login");
    }
    if (!props.account) {
      navigate("/login");
    }
  }, [props.chainAllowed, props.account, navigate]);

  const showHeader = <Header />;

  return (
    <>
      <div className="absolute top-0 right-0">{showHeader}</div>
      <div
        className={"something"}
        style={{
          paddingLeft: 480,
          paddingTop: 100,
          paddingBottom: 100,
          height: 1600,
        }}
      >
        <div className={"pageTitle"}>Token</div>
        <div className="flex flex-row text-lg justify-start items-center mb-5">
          <button
            className={`text-text_color mr-3 ${
              !newToken
                ? "border-b-2 border-button_color text-button_color"
                : null
            }`}
            onClick={() => {
              setNewToken(false);
            }}
          >
            USE AN EXISTING TOKEN
          </button>
          <button
            className={`text-text_color ${
              newToken
                ? "border-b-2 border-button_color text-button_color"
                : null
            }`}
            onClick={() => {
              setNewToken(true);
            }}
          >
            CREATE NEW TOKEN
          </button>
        </div>
        {newToken ? <CreateNewToken /> : <UseExistingToken />}
      </div>
    </>
  );
};

export default TokenPage;
