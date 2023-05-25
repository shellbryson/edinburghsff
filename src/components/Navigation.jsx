import React from 'react';
import { Link } from 'react-router-dom';

// MUI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Navigation = ({ title, home }) => {
  return (
    <Box sx={{ mb: "0.5rem", mt: "0.5rem" }}>
      <Typography component="p"><Link to={home}>{title}</Link></Typography>
    </Box>
  );
};

export default Navigation;