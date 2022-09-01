import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import LoginPage from "./LoginPage";
import StartDAO from "./StartDAO";
import SidebarPage from "./SidebarPage";
import Header from "components/Header";
import DashBoardSidebarPage from "./Dashboard/DashBoardSideBarPage";

export default function App() {
  const landingPage = useMatch("/");
  return (
    <div style={{ margin: 0 }}>
      {!landingPage && <Header />}
      <Routes>
        <Route path="/" element={[<LoginPage />]} />
        <Route path="/createdao" element={[<StartDAO />]} />
        <Route path="/basics" element={<SidebarPage page="Basics" />} />
        <Route path="/settings" element={<SidebarPage page="Settings" />} />
        <Route path="/token" element={<SidebarPage page="Token" />} />
        <Route path="/golive" element={<SidebarPage page="Go Live" />} />
        <Route
          path="/dao/:deployedAddress"
          element={<DashBoardSidebarPage page="Treasury" />}
        />
        <Route path="/sidepage" element={<SidebarPage page="Basics" />} />
      </Routes>
    </div>
  );
}
