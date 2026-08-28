import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

// React 18 root API. ReactDOM.render is the React 17 call and logs a
// deprecation warning while opting the whole tree out of concurrent rendering.
const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
