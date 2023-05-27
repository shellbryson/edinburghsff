import React, { useState } from 'react';
import { Link } from "react-router-dom";

// MUI
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// Extras
import packageJson from '../../package.json';

// Context
import { useAuth } from '../context/AuthContext';

export default function Menu() {

  const { user } = useAuth();
  const [open, setOpen] = useState(false);

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

          <ListItem>
            <ListItemText>
              <Typography component="p">
                <Link to="/" onClick={handleDrawerClose}>Home</Link>
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography component="p">
                <Link to="/events" onClick={handleDrawerClose}>Events</Link>
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography component="p">
                <Link to="/links" onClick={handleDrawerClose}>Links</Link>
              </Typography>
            </ListItemText>
          </ListItem>

          <Divider />

          {!user &&
          <ListItem>
            <ListItemText>
              <Typography component="p">
                <Link to="/signin" onClick={handleDrawerClose}>Sign in</Link>
              </Typography>
            </ListItemText>
          </ListItem>
          }

          {user &&
            <>
              <ListItem>
                <ListItemText>
                  <Typography component="p">
                    <Link to="/dashboard" onClick={handleDrawerClose}>Dashboard</Link>
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Typography component="p">
                    <Link to="/dashboard/events" onClick={handleDrawerClose}>Edit events</Link>
                  </Typography>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Typography component="p">
                    <Link to="/dashboard/links" onClick={handleDrawerClose}>Edit links</Link>
                  </Typography>
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
