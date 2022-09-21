import React, { useState } from "react";
import "../styles/App.css";
import "../styles/CreateDao.css";
import "../styles/Dashboard.css";
import "../styles/Modal.css";
import "../styles/Sidebar.css";
import useStepRouter from "hooks/useStepRouter";
import CreateNewSafe from "components/CreateNewSafe";
import UseExistingSafe from "components/UseExistingSafe";

const GnosisPage = () => {
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
        <div className={"pageTitle"}>Create Safe</div>
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
            IMPORT EXISTING SAFE
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
            CREATE NEW SAFE
          </button>
        </div>
        {newToken ? <CreateNewSafe /> : <UseExistingSafe />}
      </div>
    </>
  );
};

export default GnosisPage;
