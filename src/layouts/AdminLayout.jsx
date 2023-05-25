import React from 'react';
import { Outlet } from "react-router-dom";

// MUI Components
import Container from '@mui/material/Container';

// Helpers
import ProtectedRoute from '../helpers/ProtectedRoute';

// Custom Components
import Navigation from '../components/Navigation';
import AdminNavigation from '../components/AdminNavigation';

export default function AdminLayout() {

  return (
    <>
      <Navigation home="/dashboard" title="Admin" />
      <AdminNavigation />
      <ProtectedRoute>
        <Container maxWidth={false}>
          <Outlet />
        </Container>
      </ProtectedRoute>
    </>
  )
}