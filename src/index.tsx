import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import App from 'pages/App';
import Web3Provider from 'components/Web3Provider';
import store from './state';
import reportWebVitals from './reportWebVitals';
import { BlockNumberProvider } from 'hooks/useBlockNumber'
import { MulticallUpdater } from "state/multicall";
import TransactionUpdater from 'state/transactions/updater';
import ThemeProvider, { ThemedGlobalStyle } from './theme';
import { LanguageProvider } from './i18n'
import { ChakraProvider } from '@chakra-ui/react'
import { MoralisProvider } from "react-moralis";
import './polyfill'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL as string
const appId = process.env.REACT_APP_MORALIS_APP_ID as string
console.log("Midas severurl", serverUrl)
console.log("Midas appId", appId);
root.render(
  <React.StrictMode>
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
                    <App />
                  </MoralisProvider>
                </ChakraProvider>
              </BrowserRouter>
            </ThemeProvider>
          </BlockNumberProvider>
        </Web3Provider>
      </LanguageProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
