import React from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import LoginPage from "./LoginPage";
import Header from "components/Header";
import DAOsuccess from "./NewPages/DAOsuccess";
import DAONoAccess from "./NewPages/DAONoAccess";
import NameDAO from "./NewPages/NameDAO";
import StartSafe from "./NewPages/StartSafe";
import InviteGang from "./NewPages/InviteGang";
import AddExistingSafe from "./NewPages/AddExistingSafe";
import AddNewSafe from "./NewPages/AddNewSafe";
import Dashboard from "./NewPages/DashBoard/Dashboard";

// New page added
import CreatePassToken from "./NewPages/CreatePassToken";
import MintPassToken from "./NewPages/MintPassToken";
import CreatePassSucess from "./NewPages/CreatePassSucess";

export default function App() {
  const landingPage = useMatch("/");

  return (
    <div className="body">
      {!landingPage && <Header />}
      <Routes>
        <Route path="/" element={[<LoginPage />]} />
        <Route path="/namedao" element={<NameDAO />} />
        <Route path="/createdao" element={<NameDAO />} />
        <Route path="/invitegang" element={<InviteGang />} />
        <Route path="/startsafe" element={<StartSafe />} />
        <Route path="/addsafe" element={<AddExistingSafe />} />
        <Route path="/newsafe" element={<AddNewSafe />} />
        <Route path="/success" element={<DAOsuccess />} />
        <Route path="/noaccess" element={<DAONoAccess />} />
        <Route path="/sbt/create" element={<CreatePassToken />}/>
			  <Route path="/sbt/mint/:contractAddr" element={<MintPassToken />}/>
        <Route path="/sbt/success/:contractAddr" element={<CreatePassSucess />} />
        <Route path="/:daoURL" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
