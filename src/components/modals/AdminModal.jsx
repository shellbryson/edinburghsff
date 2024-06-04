import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

// Contexts
import { useApp } from '../../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import SettingsIcon from '@mui/icons-material/Settings';

// Helpers
import ProtectedRoute from '../../helpers/ProtectedRoute';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapAdminDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%",
    padding: "0",
  },
  '& .MuiContainer-root': {
    scrollBehavior: "smooth"
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

  const { adminDialogTitle } = useApp();

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
      gap: "0.5rem",
      borderTop: "1px solid #ccc",
      paddingTop: "1rem",
      marginTop: "1rem",
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
        <Box style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem"}}>
          <Typography variant="h_medium" style={{ paddingBottom: "0"}}>
            {adminDialogTitle}
          </Typography>
          <IconButton aria-label="Admin menu" variant="outlined" size="small" color="primary" component={Link} to="/dashboard">
            <MenuIcon />
          </IconButton>
        </Box>
        <Box style={style.navigation} className="sff-navigation">
          <Button variant="outlined" size="small" color="primary" component={Link} to="/dashboard">
            <HomeIcon />
          </Button>
          <Button variant="contained" size="small" startIcon={<PlaceIcon />} component={Link} to="/admin/locations" color={location.pathname.includes("/admin/locations") ? "secondary" : "primary"}>
            Locations
          </Button>
          <Button variant="contained" size="small" startIcon={<EventIcon />} component={Link} to="/admin/events" color={location.pathname.includes("/admin/events") ? "secondary" : "primary"}>
            Events
          </Button>
          <Button variant="contained" size="small" startIcon={<DescriptionIcon />} component={Link} to="/admin/pages" color={location.pathname.includes("/admin/pages") ? "secondary" : "primary"}>
           Pages
          </Button>
          <Button variant="contained" size="small" startIcon={<ListIcon />} component={Link} to="/admin/lists" color={location.pathname.includes("/admin/lists") ? "secondary" : "primary"}>
            Lists
          </Button>
          <Button variant="contained" size="small" component={Link} to="/admin/settings" color={location.pathname.includes("/admin/settings") ? "secondary" : "primary"}>
            <SettingsIcon />
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
