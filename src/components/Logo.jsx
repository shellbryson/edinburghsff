import React from 'react';

// MUI Components
import Box from '@mui/material/Box';

// Custom UI
import LogoAsset from '../assets/logo.svg';

const logoStyle = {
  width: "3rem",
  height: "3rem",
  margin: "1rem"
}

const Logo = () => {
  return (
    <Box>
      <img src={LogoAsset} alt="Logo" style={logoStyle} />
    </Box>
  );
};

export default Logo;