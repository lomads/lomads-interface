import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "pages/App";
import Web3Provider from "components/Web3Provider";
import store from "./state";
import reportWebVitals from "./reportWebVitals";
import { BlockNumberProvider } from "hooks/useBlockNumber";
import { MulticallUpdater } from "state/multicall";
import TransactionUpdater from "state/transactions/updater";
import ThemeProvider, { ThemedGlobalStyle } from "./theme";
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { LanguageProvider } from "./i18n";
import { ChakraProvider } from "@chakra-ui/react";
import { MoralisProvider } from "react-moralis";
import { Toaster } from 'react-hot-toast';
import muiTheme from './muiTheme';
import "./polyfill";
import 'react-toastify/dist/ReactToastify.css';

if (process.env.NODE_ENV !== "development")
    console.log = () => {};

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL as string;
const appId = process.env.REACT_APP_MORALIS_APP_ID as string;

root.render(
    <Provider store={store}>
      <LanguageProvider>
        <Web3Provider>
          <BlockNumberProvider>
            <MulticallUpdater />
            <TransactionUpdater />
            <ThemeProvider>
              <ThemedGlobalStyle />
                <BrowserRouter>
                  <ChakraProvider>
                    <MoralisProvider serverUrl={serverUrl} appId={appId}>
                      <MuiThemeProvider theme={muiTheme}>
                        <App />
                      </MuiThemeProvider>
                      <Toaster position="bottom-right" />
                    </MoralisProvider>
                  </ChakraProvider>
                </BrowserRouter>
            </ThemeProvider>
          </BlockNumberProvider>
        </Web3Provider>
      </LanguageProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
