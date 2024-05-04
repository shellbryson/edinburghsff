import React from 'react';
import { Outlet, Link } from "react-router-dom";

// MUI Components
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Container';
import Paper from '@mui/material/Paper';

// Helpers
import ProtectedRoute from '../helpers/ProtectedRoute';

export default function AdminLayout() {
  const theme = useTheme();

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
      color: theme.palette.text.contrastText,
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

  return (
    <ProtectedRoute>
      <Paper style={style.page} className="sff-admin-layout">
        <Box style={style.navigation} className="sff-navigation">
          <Link style={style.link} to='/'>Home</Link>
          <Link style={style.link} to='/admin'>Dashboard</Link>
          <Link style={style.link} to='/admin/settings'>Settings</Link>
          <Link style={style.link} to='/admin/locations'>Locations</Link>
          <Link style={style.link} to='/admin/events'>Events</Link>
          <Link style={style.link} to='/admin/pages'>Pages</Link>
        </Box>
        <Outlet />
      </Paper>
    </ProtectedRoute>
  )
}