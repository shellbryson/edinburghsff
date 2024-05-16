import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// MUI
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

const NavigationMenu = styled(Box)(({ theme }) => ({
  display: "flex",
  height: "100%",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center"
}));

const NavigationButton = styled(Button)(({ theme }) => ({
  minWidth: "100%"
}));

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
      <Typography component="h1" variant="h1" style={{textAlign: "center", textTransform: "capitalize",}}>
        Dashboard
      </Typography>
      <Stack spacing={2} maxWidth="sm" style={{ margin: "0 auto"}}>
        <NavigationButton variant="outlined" component={Link} to="/">
          Home
        </NavigationButton>
        <NavigationButton variant="outlined" color="primary" component={Link} to="/admin/settings">
          Settings
        </NavigationButton>
        <NavigationButton variant="outlined" color="primary" component={Link} to="/admin/locations">
          Locations
        </NavigationButton>
        <NavigationButton variant="outlined" color="primary" component={Link} to="/admin/events">
          Events
        </NavigationButton>
        <NavigationButton variant="outlined" color="primary" component={Link} to="/admin/pages">
          Pages
        </NavigationButton>
        <NavigationButton variant='outlined' onClick={handleLogout}>
          Sign out
        </NavigationButton>
        <Typography  sx={{ mt: 6, mb: 2, textAlign: "center"}} component="p" variant='p'>Signed in as {user && user.email}</Typography>
      </Stack>
    </NavigationMenu>
  );
};

export default Dashboard;