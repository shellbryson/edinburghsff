import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import { AuthContextProvider } from './context/AuthContext.jsx';
import { AppContextProvider } from './context/AppContext';

import ScrollToTop from './helpers/ScrollToTop.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop>
        <AppContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </AppContextProvider>
      </ScrollToTop>
    </BrowserRouter>
  </React.StrictMode>,
)
