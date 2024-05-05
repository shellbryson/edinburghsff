import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

// Contexts
import { useApp } from './context/AppContext';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

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

import AdminModal from './components/modals/AdminModal';
import ContentModal from './components/modals/ContentModal';

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

  const [locationDetailsOpen, setLocationDetailsOpen] = useState(true);

  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <Box style={style.sff} className="sff">
        <ConfirmProvider>
          <Map />
          <Routes>
            <Route path="signin" element={<ContentModal><Signin /></ContentModal>} />
            <Route path="events/:eventID/:eventTitle" element={<ContentModal><EventDetails handleClose={handleClose} showEventDetails={setLocationDetailsOpen}/></ContentModal>} />
            <Route path="events" element={<ContentModal><Events /></ContentModal>} />
            <Route path="pages/:pageSlug" element={<ContentModal><Page /></ContentModal>} />
            <Route path="/admin" element={<AdminModal><Dashboard /></AdminModal>} />
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
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
