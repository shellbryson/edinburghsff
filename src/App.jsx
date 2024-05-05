import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

// Providers
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from "material-ui-confirm";

// Contexts
import { useApp } from './context/AppContext';

// Theme
import { customTheme } from './theme/theme';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Custom UI
import Map from './components/Map';
import Spinner from './components/Spinner';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Page from './pages/Page';

// Modals
import AdminModal from './components/modals/AdminModal';
import ContentModal from './components/modals/ContentModal';

// Suspended components
const Signin = lazy(() => import('./pages/Signin'));
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

export default function App() {
  const { config, setConfig } = useApp();
  const theme = useTheme();
  const navigate = useNavigate();

  const style={
    sff: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "absolute",
      height: "100vh",
      width: "100vw",
      backgroundColor: "rgb(0, 0, 0)",
    }
  }

  useEffect(() => {
    fetchDocument("settings", "config", (data) => {
      setConfig(data);
    });
  }, []);

  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box style={style.sff} className="sff">
        <Suspense fallback={<Spinner>Loading...</Spinner>}>
          <ConfirmProvider>
            <Map />
            <Routes>
              <Route path="signin" element={<ContentModal><Signin /></ContentModal>} />
              <Route path="events/:eventID/:eventTitle" element={<ContentModal><EventDetails handleClose={handleClose}/></ContentModal>} />
              <Route path="events" element={<ContentModal><Events /></ContentModal>} />
              <Route path="pages/:pageSlug" element={<ContentModal><Page /></ContentModal>} />
              <Route path="/dashboard" element={<AdminModal><Dashboard /></AdminModal>} />
              <Route path='/admin/locations/update/:updateId' element={<AdminModal><AdminLocations /></AdminModal>} />
              <Route path='/admin/locations/add' element={<AdminModal><AdminLocations /></AdminModal>} />
              <Route path='/admin/events/update/:updateId' element={<AdminModal><AdminEvents /></AdminModal>} />
              <Route path='/admin/events/add' element={<AdminModal><AdminEvents /></AdminModal>} />
              <Route path='/admin/pages/update/:updateId' element={<AdminModal><AdminPages /></AdminModal>} />
              <Route path='/admin/pages/add' element={<AdminModal><AdminPages /></AdminModal>} />
              <Route path='/admin/settings/' element={<AdminModal><AdminSettings /></AdminModal>} />
              <Route path='/admin/:type/' element={<AdminModal><ListContent /></AdminModal>} />
            </Routes>
          </ConfirmProvider>
        </Suspense>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
