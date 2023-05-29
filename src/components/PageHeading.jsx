import React from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const headingStyle = {
  textAlign: "center",
}

const PageHeading = ({ heading }) => {

  return (
    <Box>
      <Typography component="h1" variant="h1" style={headingStyle}>
        {heading}
      </Typography>
    </Box>
  );
};

export default PageHeading;