import React from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// MUI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';

const Navigation = () => {

  const { user } = useAuth();

  return (
    <Box sx={{ mb: "0.5rem", mt: "0.5rem" }}>
      <List component={Stack} direction="row" justifyContent="center" gap={1}>

        <Typography component="p">
          <Link to="/">Home</Link>
        </Typography>

        <Typography component="p">
          <Link to="/links">Links</Link>
        </Typography>

        {user &&
          <Typography component="p">
            <Link to="/dashboard">Dashboard</Link>
          </Typography>
        }
      </List>
    </Box>
  );
};

export default Navigation;