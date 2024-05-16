import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


// Helpers
import ProtectedRoute from '../../helpers/ProtectedRoute';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapAdminDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%",
    padding: "0"
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%"
  },
}));

export default function AdminModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname.includes("dashboard");

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      height: "100%",
      width: "100%",
      padding: "0",
      margin: "0",
    },
    navigation: {
      display: fullScreen || isDashboard ? "none" : "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.5rem"
    },
    dashboardButton: {
      display: !fullScreen || isDashboard ? "none" : "block"
    }
  }
  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <BootstrapAdminDialog
      fullWidth
      maxWidth="md"
      open={true} fullScreen={fullScreen}
      onClose={handleClose}>
      <DialogTitle>
        <Box style={style.dashboardButton}>
          <IconButton aria-label="Admin menu" variant="outlined" size="small" color="primary" component={Link} to="/dashboard">
            <MenuIcon />
          </IconButton>
        </Box>
        <Box style={style.navigation} className="sff-navigation">
          <Button variant="outlined" size="small" color="primary" component={Link} to="/">
            <ChevronLeftIcon />
          </Button>
          <Button variant="outlined" size="small" color="primary" component={Link} to="/dashboard">
            Dashboard
          </Button>
          <Button variant="outlined" size="small" color="primary" component={Link} to="/admin/settings">
            Settings
          </Button>
          <Button variant="outlined" size="small" color="primary" component={Link} to="/admin/locations">
            Locations
          </Button>
          <Button variant="outlined" size="small" color="primary" component={Link} to="/admin/events">
            Events
          </Button>
          <Button variant="outlined" size="small" color="primary" component={Link} to="/admin/pages">
            Pages
          </Button>
        </Box>
      </DialogTitle>
      <DialogContent dividers style={{ overflow: "hidden" }}>
        <ProtectedRoute>
          <Box style={style.page} className="sff-admin-layout">
            <Box style={{ height: "100%", overflow: "hidden"}}>
              {children}
            </Box>
          </Box>
        </ProtectedRoute>
      </DialogContent>
    </BootstrapAdminDialog>
  );
}
