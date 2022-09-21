import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import LoginPage from "./LoginPage";
import StartDAO from "./StartDAO";
import SidebarPage from "./SidebarPage";
import Header from "components/Header";
import DashBoardSidebarPage from "./Dashboard/DashBoardSideBarPage";
import DAOsuccess from "./NewPages/DAOsuccess";
import NameDAO from "./NewPages/NameDAO";
import StartSafe from "./NewPages/StartSafe";
import InviteGang from "./NewPages/InviteGang";
import AddExistingSafe from "./NewPages/AddExistingSafe";
import AddNewSafe from "./NewPages/AddNewSafe";

export default function App() {
  const landingPage = useMatch("/");
  return (
    <div style={{ margin: 0 }}>
      {!landingPage && <Header />}
      <Routes>
        <Route path="/" element={[<LoginPage />]} />
        <Route path="/namedao" element={<NameDAO />} />
        <Route path="/invitegang" element={<InviteGang />} />
        <Route path="/startsafe" element={<StartSafe />} />
        <Route path="/addsafe" element={<AddExistingSafe />} />
        <Route path="/newsafe" element={<AddNewSafe />} />
        <Route path="/success" element={<DAOsuccess />} />

        {/* <Route path="/createdao" element={[<StartDAO />]} />
        <Route path="/basics" element={<SidebarPage page="Basics" />} />
        <Route path="/safe" element={<SidebarPage page="Safe" />} />
        <Route path="/token" element={<SidebarPage page="Token" />} />
        <Route path="/golive" element={<SidebarPage page="Go Live" />} />
        <Route
          path="/dao/:deployedAddress"
          element={<DashBoardSidebarPage page="Treasury" />}
        />
        <Route path="/sidepage" element={<SidebarPage page="Basics" />} /> */}
      </Routes>
    </div>
  );
}
