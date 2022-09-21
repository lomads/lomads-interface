import React, { useState } from "react";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import useStepRouter from "hooks/useStepRouter";
import CreateNewToken from "components/CreateNewToken";
import UseExistingToken from "components/UseExistingToken";

const TokenPage = () => {
  useStepRouter(4);
  const [newToken, setNewToken] = useState<boolean>(true);

  return (
    <>
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
