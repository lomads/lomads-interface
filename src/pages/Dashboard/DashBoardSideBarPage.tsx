import CreateDashBoardSidebar from "./CreateDashBoardSidebar";

import { sidebarPropType } from "types";
import TreasuryPage from "./TreasuryPage";

const DashBoardSidebarPage = (props: sidebarPropType) => {
  const renderPage = () => {
    if (props.page === "Treasury") {
      return (
        <div>
          <TreasuryPage
            chainAllowed={props.chainAllowed}
            account={props.account}
          />
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