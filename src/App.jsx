import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

// Contexts
import { useApp } from './context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

// Icons
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

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

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const styleEventTitle={
    textAlign: "center"
  }

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

  const [locationDetailsOpen, setLocationDetailsOpen] = useState(true);

  const handleClose = () => {
    navigate(`/`);
  };

  const DialogOutlet = ({children}) => {

    return (
      <BootstrapDialog
        fullWidth
        maxWidth="sm"
        open={true} fullScreen={fullScreen}
        onClose={handleClose}>
        <DialogTitle id="add-dialog-title" sx={styleEventTitle}>
          <Typography component="span" variant="h_large"></Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent className="scroll" style={{ borderBottom: "1px solid rgba(0,0,0, 0.1" }}>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="brand">Close</Button>
        </DialogActions>
      </BootstrapDialog>
    );
  }

  return (
    <ThemeProvider theme={customTheme}>
      <Box style={styleLayout} className="sff">
        <ConfirmProvider>
          <Map />
          <Routes>
            <Route path="signin" element={<DialogOutlet><Signin /></DialogOutlet>} />
            <Route path="events/:eventID/:eventTitle" element={<DialogOutlet><EventDetails handleClose={handleClose} showEventDetails={setLocationDetailsOpen}/></DialogOutlet>} />
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
            {/* <Route path="admin" element={<DialogOutlet><AdminLayout /></DialogOutlet>}>
              <Route index element={<DialogOutlet><Dashboard /></DialogOutlet>} />
              <Route path='locations/update/:updateId' element={<DialogOutlet><AdminLocations /></DialogOutlet>} />
              <Route path='locations/add' element={<DialogOutlet><AdminLocations /></DialogOutlet>} />
              <Route path='events/update/:updateId' element={<DialogOutlet><AdminEvents /></DialogOutlet>} />
              <Route path='events/add' element={<DialogOutlet><AdminEvents /></DialogOutlet>} />
              <Route path='pages/update/:updateId' element={<DialogOutlet><AdminPages /></DialogOutlet>} />
              <Route path='pages/add' element={<DialogOutlet><AdminPages /></DialogOutlet>} />
              <Route path='settings/' element={<DialogOutlet><AdminSettings /></DialogOutlet>} />
              <Route path=':type/' element={<DialogOutlet><ListContent /></DialogOutlet>} />
            </Route> */}
          </Routes>
        </ConfirmProvider>
      </Box>
      <Analytics />
    </ThemeProvider>
  )
}
