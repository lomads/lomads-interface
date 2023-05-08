import React, { useState } from "react";
import { Routes, Route, useMatch } from "react-router-dom";
import Header from "components/Header";
import { ProjectContext } from "context/ProjectContext";
import routes from '../routes';
import { SafeTokensProvider } from "hooks/useSafeTokens";

export default function App() {
	const landingPage = useMatch("/login");
	const previewPage = window.location.pathname.indexOf('preview') > -1
	const [projects, setProjects] = useState([]);

	return (
		<div className="body">
			<SafeTokensProvider>
				<ProjectContext.Provider value={{ projects, setProjects }}>
					<Routes>
						{
							routes.map((route: any) => <Route path={route.path} element={ route.layout ?
								<route.layout>
									<route.component/>
								</route.layout> : 
								<>
									{!landingPage && !previewPage && <Header />}
									<route.component/>
								</>
							} />)
						}
					</Routes>
				</ProjectContext.Provider>
			</SafeTokensProvider>
		</div>
	);
}
