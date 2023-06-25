import React from 'react';
import { Link } from 'react-router-dom';

import { useApp } from '../context/AppContext';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LinearProgress from '@mui/material/LinearProgress';

// Custom Components
import Menu from './Menu';

// Assets
import Logo from '../assets/logo.svg';
import { Box } from '@mui/material';

const appBarStyle = {
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
}

const Navigation = () => {

  const { isLoading } = useApp();

  return (
    <AppBar color="secondary" elevation={0} style={appBarStyle}>
        <Box sx={{ width: '100%', height: "4px" }}>
          { isLoading &&
            <LinearProgress />
          }
        </Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Link to="/">
          <img style={{ height: 30 }} height="30" width="30" src={Logo} alt="Edinburgh SFF Logo" />
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link to="/events">Events</Link>
          <Link to="/links">Links</Link>
          <Link to="/map">Map</Link>
        </Box>
        <Menu />
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;