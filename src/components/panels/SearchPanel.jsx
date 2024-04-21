import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Custom UI
import MapSearch from '../MapSearch';

export default function SearchPanel() {

  const theme = useTheme();

  const styleBox={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    border: `1px solid ${theme.palette.brand.main}`,
    padding: "0.5rem"
  }

  return (
    <Box style={styleBox} className="sff-panel-search">
      <Typeography component="h2" variant="h_small">Search</Typeography>
      <MapSearch />
    </Box>
  );
}
