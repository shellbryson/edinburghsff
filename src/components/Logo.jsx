import React from 'react';

// MUI Components
import Box from '@mui/material/Box';

// Custom UI
import LogoAsset from '../assets/logo.svg';

export default function Logo({size}) {
  if (size === undefined) size = 3;
  const border = "4";

  const logoStyle = {
    borderRadius: "50%",
    width: `calc(${size}rem - (${border}px * 2))`,
    height: `calc(${size}rem - (${border}px * 2))`,
    padding: "4px",
    backgroundColor: "black",
  }

  return (
    <Box>
      <img src={LogoAsset} alt="Logo" style={logoStyle} />
    </Box>
  );
};