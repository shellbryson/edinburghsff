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
import Home from './components/Home';
import Map from './components/Map';
import Spinner from './components/Spinner';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Signin = lazy(() => import('./pages/Signin'));

// Dynamic Pages
const Page = lazy(() => import('./pages/Page'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ListContent = lazy(() => import('./pages/admin/ListContent'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
const AdminLocations = lazy(() => import('./pages/admin/AdminLocations'));
const AdminPages = lazy(() => import('./pages/admin/AdminPages'));

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
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Map />}>
                <Route index element={<Home />} />
                <Route path="signin" element={<Signin />} />
                <Route path="events/:eventID/:eventTitle" element={<EventDetails />} />
                <Route path="events" element={<Events />} />
                <Route path="pages/:pageSlug" element={<Page />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path='locations/update/:updateId' element={<AdminLocations />} />
                  <Route path='locations/add' element={<AdminLocations />} />
                  <Route path='events/update/:updateId' element={<AdminEvents />} />
                  <Route path='events/add' element={<AdminEvents />} />
                  <Route path='pages/update/:updateId' element={<AdminPages />} />
                  <Route path='pages/add' element={<AdminPages />} />
                  <Route path='settings/' element={<AdminSettings />} />
                  <Route path=':type/' element={<ListContent />} />
                </Route>
              </Route>
              {/* <Route path="places/:id/:place" element={<Map />} /> */}
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
            </Routes>
          </Suspense>
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
