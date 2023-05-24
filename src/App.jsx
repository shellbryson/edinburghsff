import React from 'react';
import { Routes, Route, } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './components/Welcome.jsx'
import Signin from './components/Signin.jsx'
import Dashboard from './components/Dashboard.jsx'

import './App.css';

function App() {

  return (
    <div className="sff">
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="signin" element={<Signin />} />
        <Route
          path='/dashboard'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Welcome />} />
      </Routes>
    </div>
  )
}

export default App;
