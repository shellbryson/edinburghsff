import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// MUI Components
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// Custom Components
import PageHeading from '../components/PageHeading';

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
      <PageHeading heading="Dashboard" />
      <Container maxWidth="sm">
        <Paper sx={{ padding: 2, mb: 2 }} elevation={3}>
          <Stack spacing={2}>
            <Typography component="h2">Tools</Typography>
            <Link to='/dashboard/events'>Edit events</Link>
            <Link to='/dashboard/map'>Edit map</Link>
            <Link to='/dashboard/links'>Edit links</Link>
          </Stack>
        </Paper>
        <Stack spacing={2}>
          <Typography  sx={{ mt: 6, mb: 2}} component="p" variant='p'>Signed in as {user && user.email}</Typography>
          <Button variant='outlined' onClick={handleLogout}>
            Sign out
          </Button>
        </Stack>
      </Container>
    </Container>
  );
};

export default Dashboard;