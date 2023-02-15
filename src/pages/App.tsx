import React, { useState } from "react";
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
import Settings from "./NewPages/Settings";
import DCAuth from './NewPages/DCAuth';

// New page added
import CreatePassToken from "./NewPages/CreatePassToken";
import MintPassToken from "./NewPages/MintPassToken";
import CreatePassSucess from "./NewPages/CreatePassSucess";
import CreateProject from "./NewPages/CreateProject";
import ProjectDetails from "./NewPages/ProjectDetails";

import { ProjectContext } from "context/ProjectContext";

import routes from '../routes';

export default function App() {
	const landingPage = useMatch("/login");
	const previewPage = window.location.pathname.indexOf('preview') > -1
	const [projects, setProjects] = useState([]);

	return (
		<div className="body">
			{!landingPage && !previewPage && <Header />}
			<ProjectContext.Provider value={{ projects, setProjects }}>
				<Routes>
					{
						routes.map(route => <Route path={route.path} element={<route.component/>} />)
					}
				</Routes>
			</ProjectContext.Provider>
		</div>
	);
}
