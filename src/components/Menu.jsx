import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';

// Custom UI
import MainPanelContent from './MainPanelContent';

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
        anchor="left"
        open={open}>
        <DrawerHeader style={{ backgroundColor: "black"}}>
          <IconButton onClick={handleDrawerClose} color="brand">
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <MainPanelContent onHandleClick={handleOnClick} />

      </Drawer>
    </>
  );
}
