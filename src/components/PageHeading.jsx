import React from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const headingStyle = {
  textAlign: "center",
  color: "#fff",
  marginTop: "1rem",
  textTransform: "capitalize",
}

const PageHeading = ({ heading, ...props }) => {

  return (
    <Box className="sff-page-heading">
      <Typography component="h1" variant="h1" style={headingStyle} {...props}>
        {heading}
      </Typography>
    </Box>
  );
};

export default PageHeading;