import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from "react-router-dom";
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


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
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
                     <App />
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
