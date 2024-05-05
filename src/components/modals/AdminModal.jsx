import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

// Helpers
import ProtectedRoute from '../../helpers/ProtectedRoute';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';


export default function AdminModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const BootstrapAdminDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      backgroundColor: '#fff',
      color: '#000',
      height: "100%"
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
      display: "inline-block",
      color: theme.palette.primary.main,
      margin: "0 0.5rem",
    },
    navigation: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.5rem"
    },
  }

  const styleEventTitle={
    textAlign: "center"
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
        <ProtectedRoute>
          <Paper style={style.page} className="sff-admin-layout">
            <Box style={style.navigation} className="sff-navigation">
              <Button variant="outlined" size="small" color="primary" component={Link} to="/">
                Home
              </Button>
              <Button variant="outlined" size="small" color="primary" component={Link} to="/admin">
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
            {children}
          </Paper>
        </ProtectedRoute>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="brand">Close</Button>
      </DialogActions>
    </BootstrapAdminDialog>
  );
}
