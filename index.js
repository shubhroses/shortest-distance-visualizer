import React from 'react';
import { createRoot } from 'react-dom/client'; // Importing from the correct package
import './index.css';
import App from './App';

const root = document.getElementById('root');
const app = createRoot(root); // Using createRoot instead of ReactDOM.render

app.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
