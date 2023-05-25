import React from 'react';
import { Routes, Route, } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

// Layouts
import PageLayout from './layouts/PageLayout';
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
import Welcome from './pages/Welcome';
import NotFound from './pages/NotFound';
import Signin from './pages/Signin';

// Admin Pages
import Dashboard from './pages/Dashboard';
import AdminLinks from './pages/AdminLinks';
import AdminEvents from './pages/AdminEvents';

import './App.css';

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <Routes>
        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='links' element={<AdminLinks />} />
          <Route path='events' element={<AdminEvents />} />
        </Route>

        <Route path="/" element={<PageLayout />}>
          <Route index element={<Welcome />} />
          <Route path="signin" element={<Signin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default App;
