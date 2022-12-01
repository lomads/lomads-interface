//import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import theme from './theme';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore, { persistor } from 'store';
import { PersistGate } from 'redux-persist/lib/integration/react';
import routes from 'routes'
import PrivateRoute from 'components/PrivateRoute';
import Landing from 'layouts/Landing';
import PageNotFound from 'views/PageNotFound';
export const getStore = configureStore();

export type AppState = ReturnType<typeof getStore.getState>;
export type AppDispatch = typeof getStore.dispatch;

const App = () => {
	return (
		<ThemeProvider theme={theme}>
			<Provider store={getStore}>
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
				</PersistGate>
			</Provider>
		</ThemeProvider>
	);
};

export default App;
