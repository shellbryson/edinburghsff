import React from 'react';
import { Outlet } from "react-router-dom";

// MUI Components
import Container from '@mui/material/Container';

// Custom UI
import AdminNavigation from '../components/admin/AdminNavigation';

// Helpers
import ProtectedRoute from '../helpers/ProtectedRoute';

export default function AdminLayout() {

  return (
    <ProtectedRoute>
      <Container maxWidth={false}>
        <AdminNavigation />
        <Outlet />
      </Container>
    </ProtectedRoute>
  )
}