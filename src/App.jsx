import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

import { useApp } from './context/AppContext';

// MUI Components
import Box from '@mui/material/Box';

// Custom UI
//import Map from './components/Map';
// import Spinner from './components/Spinner';

// Layouts
import AdminLayout from './layouts/AdminLayout';

import Map from './components/Map';

// Regular Pages
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Signin from './pages/Signin';

// Dynamic Pages
import Page from './pages/Page';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ListContent from './pages/admin/ListContent';
import AdminSettings from './pages/admin/AdminSettings';
import AdminEvents from './pages/admin/AdminEvents';
import AdminLocations from './pages/admin/AdminLocations';
import AdminPages from './pages/admin/AdminPages';

import {
  fetchDocument
} from './utils/utils';

// Assets
import './App.scss';

const styleLayout = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  height: "100vh",
  width: "100vw",
  backgroundColor: "rgb(0, 0, 0)",
}

export default function App() {
  const { config, setConfig } = useApp();

  useEffect(() => {
    fetchDocument("settings", "config", (data) => {
      setConfig(data);
    });
  }, []);

  return (
    <ThemeProvider theme={customTheme}>
      <Box style={styleLayout} className="sff">
        <ConfirmProvider>
          {/* <Suspense fallback={<Spinner />}> */}
            <Routes>
              <Route path="places/:id/:place" element={<Map />} />
              <Route path="*" element={<Map />}>
                <Route path="signin" element={<Signin />} />
                <Route path="events/:eventID/:eventTitle" element={<EventDetails />} />
                <Route path="events" element={<Events />} />
                <Route path="pages/:pageSlug" element={<Page />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path='admin/locations/update/:updateId' element={<AdminLocations />} />
                  <Route path='admin/locations/add' element={<AdminLocations />} />
                  <Route path='admin/events/update/:updateId' element={<AdminEvents />} />
                  <Route path='admin/events/add' element={<AdminEvents />} />
                  <Route path='admin/pages/update/:updateId' element={<AdminPages />} />
                  <Route path='admin/pages/add' element={<AdminPages />} />
                  <Route path='admin/settings/' element={<AdminSettings />} />
                  <Route path='admin/:type/' element={<ListContent />} />
                </Route>
              </Route>
              {/* <Route path="places/:id/:place" element={<Map />} /> */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          {/* </Suspense> */}
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
