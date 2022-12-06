//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import routes from 'routes'
import PrivateRoute from 'components/PrivateRoute';
import Landing from 'layouts/Landing';
import PageNotFound from 'views/PageNotFound';
import Web3Provider from 'components/Web3Provider';
import { Toaster } from 'react-hot-toast';
export const { store, persistor } = configureStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

const App = () => {
	return (
		<Web3Provider>
			<ThemeProvider theme={theme}>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						<Router basename={''}>
							<Routes>
								{routes.map((route, index) => {
									return (
										<Route
											element={
													<PrivateRoute
														orRender={
															<route.layout>
																<route.component />
															</route.layout>
														}
														private={route.private}
													/>
											}
											path={route.path}
										/>
									);
								})}
								<Route
									element={
											<PrivateRoute orRender= {
											<Landing>
												<PageNotFound />
											</Landing>
										} 
									private={false}
									/>}
									key={'notfound'}
									path={'*'}
								/>
							</Routes>
						</Router>
						<Toaster position="bottom-right" />
					</PersistGate>
				</Provider>
			</ThemeProvider>
		</Web3Provider>
	);
};

export default App;
