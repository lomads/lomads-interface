import CreateDashBoardSidebar from "./CreateDashBoardSidebar";
import React from 'react';
import { sidebarPropType } from "types";
import TreasuryPage from "./TreasuryPage";

const DashBoardSidebarPage = (props: sidebarPropType) => {
  const renderPage = () => {
    if (props.page === "Treasury") {
      return (
        <div>
          <TreasuryPage />
        </div>
      );
    }
    return <div></div>;
  };

  return (
    <div style={{ display: "flex" }}>
      <CreateDashBoardSidebar />
      <div className="combine">{renderPage()}</div>
    </div>
  );
};

export default DashBoardSidebarPage;
