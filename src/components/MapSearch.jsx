import React from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

// Custom UI
export default function MapSearch() {

  const theme = useTheme();

  const {
    mapSearchText,
    setMapSearchText
  } = useApp();

  const stylePanel={
    display: "flex",
    backgroundColor: "rgb(0, 0, 0)",
    width: "100%",
  }

  const styleInput={
    display: 'flex',
    alignItems: 'center',
    borderRadius: "0",
    border: `1px solid ${theme.palette.brand.main}`,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    width: "100%",
  }

  const handleSearchChange = (text) => {
    setMapSearchText(text);
  }

  return (
    <Box style={stylePanel} className="sff-search">
      <Paper
        component="form"
        sx={ styleInput }
      >
        <InputBase
          sx={{ width: "100%", ml: 1, flex: 1, color: "#fff"}}
          placeholder="Search Map"
          inputProps={{ 'aria-label': 'Search map' }}
          value={mapSearchText} onChange={(e) => handleSearchChange(e.target.value)}
        />
        <IconButton type="button" sx={{ p: '10px', color: theme.palette.primary.main }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
