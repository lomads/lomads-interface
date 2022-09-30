import React from "react";
// import { Routes, Route, useMatch } from "react-router-dom";
import {Routes,Route} from 'react-router-dom'
import LoginPage from "./LoginPage";
import Header from "components/Header";
import DAOsuccess from "./NewPages/DAOsuccess";
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
//   const landingPage = useMatch("/");

  return (
    // <div className="body">
    //   {!landingPage && <Header />}
    //   <Routes>
    //     <Route path="/" element={[<LoginPage />]} />
    //     <Route path="/namedao" element={<NameDAO />} />
    //     <Route path="/invitegang" element={<InviteGang />} />
    //     <Route path="/startsafe" element={<StartSafe />} />
    //     <Route path="/addsafe" element={<AddExistingSafe />} />
    //     <Route path="/newsafe" element={<AddNewSafe />} />
    //     <Route path="/success" element={<DAOsuccess />} />
    //     <Route path="/dashboard" element={<Dashboard />} />
    //   </Routes>
    // </div>
	<div className="body">
    <Header />
		<Routes>
			<Route path="/create" element={<CreatePassToken />}/>
			<Route path="/mint/:contractAddr" element={<MintPassToken />}/>
      <Route path="/success/:contractAddr" element={<CreatePassSucess />} />
		</Routes>
	</div>
  );
}
