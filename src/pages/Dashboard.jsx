import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// MUI Components
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

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
    <>
      <Typography component="h1" variant='h1'>Dashboard</Typography>
      <Typography component="p" variant='p' sx={{mb: 2}}>User Email: {user && user.email}</Typography>

      <Button variant='outlined' onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Dashboard;