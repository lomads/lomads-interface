import CreateDaoSidebar from "../components/CreateDaoSidebar";
import BasicsPage from "./BasicsPage";
import SettingsPage from "./SettingsPage";
import TokenPage from "./TokenPage";
import GoLivePage from "./GoLivePage";
import { sidebarPropType } from "types";
import GnosisPage from "./gnosisPage";
import React from 'react'

const SidebarPage = (props: sidebarPropType) => {
  const renderPage = () => {
    if (props.page === "Basics") {
      return (
        <div>
          <BasicsPage />
        </div>
      );
    } else if (props.page === "Token") {
      return (
        <div>
          <TokenPage />
        </div>
      );
    } else if (props.page === "Safe") {
      return (
        <div>
          <GnosisPage />
        </div>
      );
    } else if (props.page === "Go Live") {
      return (
        <div>
          <GoLivePage />
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <div style={{ display: "flex" }}>
      <CreateDaoSidebar />
      <div className="combine">{renderPage()}</div>
    </div>
  );
};

export default SidebarPage;
