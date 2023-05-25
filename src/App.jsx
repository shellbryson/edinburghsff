import React from 'react';
import { Routes, Route, } from "react-router-dom";

// Layouts
import PageLayout from './layouts/PageLayout';
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
import Welcome from './pages/Welcome';
import NotFound from './pages/NotFound';

// Admin Pages
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import AdminLinks from './pages/AdminLinks';

import './App.css';

function App() {

  return (
    <div className="sff">
      <Routes>

        <Route path="/dashboard" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='addlink' element={<AdminLinks />} />
        </Route>

        <Route path="/" element={<PageLayout />}>
          <Route index element={<Welcome />} />
          <Route path="signin" element={<Signin />} />
          <Route path="*" element={<NotFound />} />
        </Route>

      </Routes>
    </div>
  )
}

export default App;
