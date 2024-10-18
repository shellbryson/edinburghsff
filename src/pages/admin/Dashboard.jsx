import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Conte
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import DescriptionIcon from '@mui/icons-material/Description';
import ListIcon from '@mui/icons-material/List';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SettingsIcon from '@mui/icons-material/Settings';

const NavigationMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "2rem",
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  minWidth: "100%",
  justifyContent: "space-between",
}));

const NavigationList = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  margin: "1rem",
  minWidth: "300px"
}));

const UserBox = styled(Box)(({ theme }) => ({
  padding: "1rem",
  backgroundColor: "rgba(0,0,0,0.1)",
  margin: "1rem",
}));

const Dashboard = () => {
  const { user, userDocuments, logout } = useAuth();
  const navigate = useNavigate();

  const { setAdminDialogTitle } = useApp();

  useEffect(() => {
    setAdminDialogTitle('Dashboard');
    console.log("User documents", userDocuments);
  }, []);

  useEffect(() => {
    setAdminDialogTitle('Dashboard');
    console.log("User documents", userDocuments);
  }, [userDocuments?.role]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <NavigationMenu>
      <NavigationList>
        <NavigationButton variant="contained" color="primary" endIcon={<PlaceIcon />} component={Link} to="/admin/locations">
          Locations
        </NavigationButton>
        <NavigationButton variant="contained" color="primary" endIcon={<EventIcon />} component={Link} to="/admin/events">
          Events
        </NavigationButton>
        <NavigationButton variant="contained" color="primary" endIcon={<DescriptionIcon />} component={Link} to="/admin/pages">
          Pages
        </NavigationButton>
        <NavigationButton variant="contained" color="primary" endIcon={<ListIcon />} component={Link} to="/admin/lists">
          Lists
        </NavigationButton>
        <NavigationButton variant="contained" color="primary" endIcon={<ManageAccountsIcon />} component={Link} to="/admin/accounts">
          Accounts
        </NavigationButton>
        <NavigationButton variant="contained" color="primary" endIcon={<SettingsIcon />} component={Link} to="/admin/settings">
          Settings
        </NavigationButton>
        <Button variant='outlined' onClick={handleLogout}>
          Sign out
        </Button>
        <Button variant='outlined' component={Link} to="/">
          Home
        </Button>
        <UserBox>
          <Typography component="p" variant='p'>Signed in as:</Typography>
          <Typography component="p" variant='p'>{user && user.email}</Typography>
        </UserBox>
      </NavigationList>
    </NavigationMenu>
  );
};

export default Dashboard;