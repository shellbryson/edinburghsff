import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Link } from "react-router-dom";

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

  const style={
    page: {
      display: "flex",
      position: "absolute",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: "9999",
      inset: "0.5rem",
    },
    link: {
      color: "red",
    },
    navigation: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      padding: "0.5rem 0",
      color: "red"
    },
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

  const PageDialog = ({children}) => {
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
            <Route path="signin" element={<PageDialog><Signin /></PageDialog>} />
            <Route path="events/:eventID/:eventTitle" element={<PageDialog><EventDetails handleClose={handleClose} showEventDetails={setLocationDetailsOpen}/></PageDialog>} />
            <Route path="events" element={<PageDialog><Events /></PageDialog>} />
            <Route path="pages/:pageSlug" element={<PageDialog><Page /></PageDialog>} />
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
