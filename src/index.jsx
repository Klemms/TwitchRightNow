import React from 'react';
import ReactDOM from 'react-dom/client';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import './index.sass';
import App from './App/App';
import {initREST} from './App/rest/API';

gsap.registerPlugin(useGSAP);
initREST();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
