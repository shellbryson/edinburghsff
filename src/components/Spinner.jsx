import React from 'react';

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const spinnerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: "100%",
  minHeight: "100%"
}

export default function Spinner() {
  return (
    <Box style={spinnerContainerStyle}>
      <CircularProgress />
    </Box>
  );
};