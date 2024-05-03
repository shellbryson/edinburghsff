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
import Map from './components/Map';
// import Spinner from './components/Spinner';
import Home from './components/Home';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
import Events from'./pages/public/Events';
import EventDetails from'./pages/public/EventDetails';
import Signin from'./pages/public/Signin';
// const Events = lazy(() => import('./pages/public/Events'));
// const EventDetails = lazy(() => import('./pages/public/EventDetails'));
// const Signin = lazy(() => import('./pages/public/Signin'));

// Dynamic Pages
import Pages from'./pages/public/Pages';
// const Pages = lazy(() => import('./pages/public/Pages'));

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import ListContent from './pages/admin/ListContent';
import AdminSettings from'./pages/admin/AdminSettings';
import AdminEvents from './pages/admin/AdminEvents';
import AdminLocations from './pages/admin/AdminLocations';
import AdminPages from './pages/admin/AdminPages';
// const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
// const ListContent = lazy(() => import('./pages/admin/ListContent'));
// const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
// const AdminEvents = lazy(() => import('./pages/admin/AdminEvents'));
// const AdminLocations = lazy(() => import('./pages/admin/AdminLocations'));
// const AdminPages = lazy(() => import('./pages/admin/AdminPages'));

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
              <Route path="/" element={<Map />}>
                <Route path="signin" element={<Signin />} />
                <Route path="events/:eventID/:eventTitle" element={<EventDetails />} />
                <Route path="events" element={<Events />} />
                <Route path="pages/:pageSlug" element={<Pages />} />
                <Route path="pages" element={<Pages />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path=':type/' element={<ListContent />} />
                  <Route path='locations/add' element={<AdminLocations />} />
                  <Route path='locations/update/:updateId' element={<AdminLocations />} />
                  <Route path='events/add' element={<AdminEvents />} />
                  <Route path='events/update/:updateId' element={<AdminEvents />} />
                  <Route path='pages/add' element={<AdminPages />} />
                  <Route path='pages/update/:updateId' element={<AdminPages />} />
                  <Route path='settings/' element={<AdminSettings />} />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
              <Route path="/places/:id/:place" element={<Map />} />
            </Routes>
          {/* </Suspense> */}
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
