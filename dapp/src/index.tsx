import React from 'react';
import ReactDOM from 'react-dom/client';
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';
import Home from './pages/home';
import reportWebVitals from './reportWebVitals';

import './index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const getLibrary = (provider: any): Web3 => {
  return new Web3(provider);
};

root.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <Home />
    </Web3ReactProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
