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
    marginBottom: "1rem",
  }

  return (
    <Box style={styleBox} className="sff-panel-search">
      <Typeography component="h2" variant="h_small_lined">Search</Typeography>
      <MapSearch />
    </Box>
  );
}
