import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { MainDemoApp } from './MainDemoApp.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainDemoApp />
  </React.StrictMode>
);
