import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Contexts
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

// Custom UI
import AdminLayout from '../../layouts/AdminLayout';

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
    <AdminLayout>
      <NavigationMenu>
        <NavigationList sx={{ display: 'grid', width: "calc(100% - 2rem)", gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/locations"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <PlaceIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Locations</Typography>
          </NavigationButton>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/events"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <EventIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Events</Typography>
          </NavigationButton>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/pages"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <DescriptionIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Pages</Typography>
          </NavigationButton>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/lists"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <ListIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Lists</Typography>
          </NavigationButton>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/accounts"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <ManageAccountsIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Accounts</Typography>
          </NavigationButton>
          <NavigationButton
            variant="contained"
            color="primary"
            component={Link}
            to="/admin/settings"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <SettingsIcon sx={{ fontSize: '5rem' }} />
            <Typography variant="button">Settings</Typography>
          </NavigationButton>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <Typography variant="button">Sign out</Typography>
          </Button>
          <Button
            variant="outlined"
            component={Link}
            to="/"
            sx={{ flexDirection: 'column', alignItems: 'center', padding: '1rem', height: '150px' }}
          >
            <Typography variant="button">Home</Typography>
          </Button>
        </NavigationList>
        <UserBox>
          <Typography component="p" variant="p" align="center">
            Signed in as:
          </Typography>
          <Typography component="p" variant="p" align="center">
            {user && user.email}
          </Typography>
        </UserBox>
      </NavigationMenu>
    </AdminLayout>
  );
};

export default Dashboard;