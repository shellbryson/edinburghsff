import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import { AuthContextProvider } from './context/AuthContext.jsx';

import ScrollToTop from './helpers/ScrollToTop.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ScrollToTop>
    </BrowserRouter>
  </React.StrictMode>,
)
