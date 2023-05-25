import React from 'react';
import { Outlet } from "react-router-dom";

// Helpers
import ProtectedRoute from '../helpers/ProtectedRoute';

// Custom Components
import Navigation from '../components/Navigation';

export default function AdminLayout() {

  return (
    <>
      <Navigation home="/dashboard" title="Admin" />
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </>
  )
}