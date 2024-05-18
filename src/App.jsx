import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Analytics } from '@vercel/analytics/react';

// Providers
import { ThemeProvider } from '@mui/material/styles';
import { ConfirmProvider } from "material-ui-confirm";

import packageJson from '../package.json';

// Contexts
import { useApp } from './context/AppContext';

// Theme
import { customTheme } from './theme/theme';

// MUI
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';

// Custom UI
import Map from './components/Map';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Community from './pages/Community';
import Suggestions from './pages/Suggestions';
import Page from './pages/Page';

// Modals
import AdminModal from './components/modals/AdminModal';
import ContentModal from './components/modals/ContentModal';

// Suspended components
import Signin from './pages/Signin';
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

const EdinburghSFF = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  height: "100dvh",
  width: "100vw",
  backgroundColor: "rgb(0, 0, 0)",
}));

export default function App() {
  const { config, setConfig } = useApp();
  const theme = useTheme();
  const navigate = useNavigate();

  const version = packageJson.version;

  const splashMessage = () => {
    console.log(`%c \n Edinburgh SFF`, "color: #fded07; font-size: 2em;");
    console.log(`%c Made in Scotland with love`, "color: #fded07; font-size: 2em;");
    console.log(`%c Version ${version}`, "color: #fded07; font-size: 2em;");
    console.log(`%c ## Designed and developed by Shell Bryson`, "color: #fded07; font-size: 1em;");
    console.log(`%c ## Web: https://shellbryson.com\n`, "color: #fded07; font-size: 1em;");
  }

  useEffect(() => {
    splashMessage();

    fetchDocument("settings", "config", (data) => {
      setConfig(data);
    });
  }, []);

  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <ThemeProvider theme={customTheme}>
      <EdinburghSFF className="sff">
        <ConfirmProvider>
          <Map />
          <Routes>
            <Route path="signin" element={<ContentModal><Signin /></ContentModal>} />
            <Route path="events/:eventID/:eventTitle" element={<ContentModal><EventDetails handleClose={handleClose}/></ContentModal>} />
            <Route path="events" element={<ContentModal><Events /></ContentModal>} />
            <Route path="community" element={<ContentModal><Community /></ContentModal>} />
            <Route path="feedback" element={<ContentModal><Suggestions /></ContentModal>} />
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
      </EdinburghSFF>
      <Analytics />
    </ThemeProvider>
  )
}
