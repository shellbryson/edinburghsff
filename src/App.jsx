import React, { lazy, Suspense, useEffect, Outlet } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

import { useApp } from './context/AppContext';

// import { Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

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

export default function App() {
  const { config, setConfig } = useApp();
  const theme = useTheme();
  const navigate = useNavigate();

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      backgroundColor: '#383838',
      color: '#fff',
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
      backgroundColor: '#383838',
      color: '#fff',
    },
  }));

  const styleLayout = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "absolute",
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgb(0, 0, 0)",
  }

  useEffect(() => {
    fetchDocument("settings", "config", (data) => {
      setConfig(data);
    });
  }, []);

  function DialogOutlet({ children }) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
      navigate(`/`);
      setOpen(false);
    };

    return (
      <BootstrapDialog open={open} onClose={handleClose}>
        <DialogContent>
          {children}
        </DialogContent>
      </BootstrapDialog>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box style={styleLayout} className="sff">
        <ConfirmProvider>
          <Map />
          <Routes>
            {/* <Route path="places/:id/:place" element={<Map />} /> */}
            <Route path="signin" element={<DialogOutlet><Signin /></DialogOutlet>} />
            <Route path="events/:eventID/:eventTitle" element={<DialogOutlet><EventDetails /></DialogOutlet>} />
            <Route path="events" element={<DialogOutlet><Events /></DialogOutlet>} />
            <Route path="pages/:pageSlug" element={<DialogOutlet><Page /></DialogOutlet>} />
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
          </Routes>
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
