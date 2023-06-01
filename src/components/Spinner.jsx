import React from 'react';

// MUI Components
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

const spinnerContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: "100%",
  minHeight: "300px"
}

const Spinner = () => {
  return (
    <Box style={spinnerContainerStyle}>
      <CircularProgress />
    </Box>
  );
};

export default Spinner;