import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';

// Context
import { useAuth } from '../context/AuthContext';

export default function Navigation() {

  const stylePanel={
    backgroundColor: "rgb(0, 0, 0)",
    height: "100%",
  }

  const { user } = useAuth();
  const navigate = useNavigate();
  const handleOnClick = (url) => {
    navigate(url);
    //handleDrawerClose();
  }

  return (
    <Box style={ stylePanel }>
      <List>
        <ListItem onClick={()=>handleOnClick("/")}>
          <ListItemIcon>
            <HomeOutlinedIcon color="brand" />
          </ListItemIcon>
          <ListItemText>
            Home
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
    </Box>
  );
}
