import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

import { AuthContextProvider } from './context/AuthContext.jsx';
import { AppContextProvider } from './context/AppContext';

import ScrollToTop from './helpers/ScrollToTop.jsx';

import * as Sentry from "@sentry/react";

if (import.meta.env.VITE_VERCEL_ENV === "production") {
  Sentry.init({
    dsn: "https://185898a833a620092430bdaaa3cb7eb9@o4507245141557248.ingest.de.sentry.io/4507245445775440",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: [
      "https://.*\.edinburghsff.com/.*"
    ],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

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
