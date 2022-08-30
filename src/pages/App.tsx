import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import StartDAO from "./StartDAO";
import SidebarPage from "./SidebarPage";
import { Context } from "../constants/context";
import CreateDashBoardSidebar from "./Dashboard/CreateDashBoardSidebar";
import { useWeb3React } from "@web3-react/core";
import { isChainAllowed } from "utils/switchChain";
import Header from "components/Header";
import DashBoardSidebarPage from "./Dashboard/DashBoardSideBarPage";

export default function App() {
  const { chainId, connector, account } = useWeb3React();

  const chainAllowed = chainId && isChainAllowed(connector, chainId);

  const landingPage = useMatch("/");
  return (
    <Context.Provider value={{ title: "" }}>
      {/* <Header /> */}
      <div style={{ margin: 0 }}>
        {!landingPage && <Header />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={[<LoginPage />]} />
          <Route path="/createdao" element={[<StartDAO />]} />
          <Route
            path="/basics"
            element={
              <SidebarPage
                page="Basics"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SidebarPage
                page="Settings"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
          <Route
            path="/token"
            element={
              <SidebarPage
                page="Token"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
          <Route
            path="/golive"
            element={
              <SidebarPage
                page="Go Live"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
          <Route
            path="/dao/:deployedAddress"
            element={
              <DashBoardSidebarPage
                page="Treasury"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
          <Route
            path="/sidepage"
            element={
              <SidebarPage
                page="Basics"
                chainAllowed={chainAllowed}
                account={account}
              />
            }
          />
        </Routes>
      </div>
    </Context.Provider>
  );
}
