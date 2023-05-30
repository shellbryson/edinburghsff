import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// Custom Components
import Menu from './Menu';

// Assets
import Logo from '../assets/logo.svg';

const appBarStyle = {
  backdropFilter: "blur(10px)",
  backgroundColor: "rgba(255, 255, 255, 0.9)",
}

function HideOnScroll( {children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navigation = () => {

  const { user } = useAuth();

  return (
    <HideOnScroll>
      <AppBar color="secondary" elevation={0} style={appBarStyle}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Link to="/">
            <img style={{ height: 30 }} height="30" width="30" src={Logo} alt="Edinburgh SFF Logo" />
          </Link>
          <Menu />
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navigation;