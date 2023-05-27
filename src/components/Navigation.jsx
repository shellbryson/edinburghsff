import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

// Custom Components
import Menu from './Menu';

// Assets
import Logo from '../assets/logo.svg';

const Navigation = () => {

  const { user } = useAuth();

  return (
    <AppBar position="static" color="secondary" elevation={0} style={{ backgroundColor: "#fff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">
          <img style={{ height: 30 }} height="30" width="30" src={Logo} alt="Edinburgh SFF Logo" />
        </Link>
        <Menu />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;