import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/edinburghsff.com/,  /^https:\/\/dev.edinburghsff.com/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});


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
