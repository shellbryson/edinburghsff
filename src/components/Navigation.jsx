import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useApp } from '../context/AppContext';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LinearProgress from '@mui/material/LinearProgress';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import useTheme from '@mui/material/styles/useTheme';

// Custom Components
import Menu from './Menu';

// Assets
import Logo from '../assets/logo.svg';
import { Box } from '@mui/material';

const appBarStyle = {
  backgroundColor: "rgb(0, 0, 0)",
  position: "relative",
}

const Navigation = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { isLoading } = useApp();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <AppBar color="secondary" elevation={0} style={appBarStyle}>
      <Box sx={{ width: '100%', height: "4px"  }}>
        { isLoading &&
          <LinearProgress />
        }
      </Box>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        { isMobile &&
          <>
            <div style={{ display:"flex", alignItems:"middle"}}>
              <IconButton
                id="basicButton"
                aria-controls="basicMenu"
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleDrawerOpen}
                color="brand">
                <MenuIcon />
              </IconButton>
              <Link to="/">
                <img style={{ height: 30 }} height="30" width="30" src={Logo} alt="Edinburgh SFF Logo" />
              </Link>
            </div>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Link to="/events" className="sff-navigation-link">Events</Link>
              <Link to="/links" className="sff-navigation-link">Links</Link>
            </Box>
          </>
        }
      </Toolbar>
      <Menu
        handleDrawerClose={handleDrawerClose}
        open={open}
      />
    </AppBar>
  );
};

export default Navigation;