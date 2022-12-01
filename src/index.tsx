import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

const documentFragment = document.getElementById('root')
if(documentFragment) {
  const root = ReactDOM.createRoot(documentFragment);
  root.render(<App />);
}
// if (true)
//     console.log = () => {};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
