import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

// MUI
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

// Extras
import packageJson from '../../package.json';

// Context
import { useAuth } from '../context/AuthContext';

export default function Menu() {

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOnClick = (url) => {
    navigate(url);
    setOpen(false);
  }

  return (
    <>
      <IconButton
        id="basicButton"
        aria-controls="basicMenu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleDrawerOpen}
        sx={{ ...(open && { display: 'none' }) }}
        color="primary">
        <MenuIcon />
      </IconButton>
      <Drawer
        sx={{
          width: '320',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
          },
        }}
        anchor="right"
        open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <List>
          <ListItem onClick={()=>handleOnClick("/")}>
            <ListItemIcon>
              <HomeOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              Home
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/events")}>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              Events
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/links")}>
            <ListItemIcon>
              <AutoStoriesOutlinedIcon />
            </ListItemIcon>
            <ListItemText>
              Links
            </ListItemText>
          </ListItem>

          <Divider />

          {!user &&
          <ListItem>
            <ListItemText>
              <Link to="/signin" onClick={handleDrawerClose}>Sign in</Link>
            </ListItemText>
          </ListItem>
          }

          {user &&
            <>
              <ListItem onClick={()=>handleOnClick("/dashboard")}>
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  Dashboard
                </ListItemText>
              </ListItem>
              <ListItem onClick={()=>handleOnClick("/dashboard/events")}>
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  Edit events
                </ListItemText>
              </ListItem>
              <ListItem onClick={()=>handleOnClick("/dashboard/links")}>
                <ListItemIcon>
                  <SettingsOutlinedIcon />
                </ListItemIcon>
                <ListItemText>
                  Edit links
                </ListItemText>
              </ListItem>
            </>
          }

          <Divider />

          <ListItem>
            <ListItemText>
              <Box sx={{ mt: 4 }}>
                <Typography component="p" variant='p_small'>Version { packageJson.version }</Typography>
              </Box>
            </ListItemText>
          </ListItem>

        </List>
      </Drawer>
    </>
  );
}
