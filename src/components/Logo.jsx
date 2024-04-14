import React from 'react';

// MUI Components
import Box from '@mui/material/Box';

// Custom UI
import LogoAsset from '../assets/logo.svg';

const logoStyle = {
  borderRadius: "50%",
  width: "calc(3rem - 8px)",
  height: "calc(3rem - 8px)",
  margin: "1rem",
  padding: "4px",
  backgroundColor: "black",
}

const Logo = () => {
  return (
    <Box>
      <img src={LogoAsset} alt="Logo" style={logoStyle} />
    </Box>
  );
};

export default Logo;