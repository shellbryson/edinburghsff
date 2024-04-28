import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// MUI Components
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Custom Components
import PageHeading from '../../components/PageHeading';

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
    <Container>
      <Paper sx={{padding: "1rem"}}>
        <Typography component="h1" variant="h1" style={{textAlign: "center", textTransform: "capitalize",}}>
          Dashboard
        </Typography>
        <Stack spacing={2}>
          <Typography  sx={{ mt: 6, mb: 2, textAlign: "center"}} component="p" variant='p'>Signed in as {user && user.email}</Typography>
          <Button variant='outlined' onClick={handleLogout}>
            Sign out
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Dashboard;