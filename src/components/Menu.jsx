import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// MUI
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import CloseIcon from '@mui/icons-material/Close';

import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

// Context
import { useAuth } from '../context/AuthContext';

export default function Menu({
  handleDrawerClose,
  open
}) {

  const { user } = useAuth();
  const navigate = useNavigate();

  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

  const handleOnClick = (url) => {
    navigate(url);
    handleDrawerClose();
  }

  return (
    <>
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
          <IconButton onClick={handleDrawerClose} color="brand">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <List>
          <ListItem onClick={()=>handleOnClick("/")}>
            <ListItemIcon>
              <HomeOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              Home
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/map")}>
            <ListItemIcon>
              <MapOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              Map for writers
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/events")}>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              Events
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/links")}>
            <ListItemIcon>
              <AutoStoriesOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              Links
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/pages")}>
            <ListItemIcon>
              <DescriptionOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              Pages
            </ListItemText>
          </ListItem>
          <ListItem onClick={()=>handleOnClick("/about")}>
            <ListItemIcon>
              <InfoOutlinedIcon color="brand" />
            </ListItemIcon>
            <ListItemText>
              About
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
                  <SettingsOutlinedIcon color="brand" />
                </ListItemIcon>
                <ListItemText>
                  Admin Dashboard
                </ListItemText>
              </ListItem>
            </>
          }

        </List>
      </Drawer>
    </>
  );
}
