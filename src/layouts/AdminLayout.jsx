import React from 'react';
import { Outlet } from "react-router-dom";

// MUI Components
import Box from '@mui/material/Container';

// Helpers
import ProtectedRoute from '../helpers/ProtectedRoute';

export default function AdminLayout() {

  const stylePage={
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%"
  }

  return (
    <ProtectedRoute>
      <Box style={stylePage} className="sff-admin-layout">
        <Outlet />
      </Box>
    </ProtectedRoute>
  )
}