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
    width: "100%",
  }

  const styleInput={
    display: 'flex',
    alignItems: 'center',
    borderRadius: "0",
    border: `1px solid ${theme.palette.brand.main}`,
    backgroundColor: theme.palette.brand.faint,
    color: "#fff",
    width: "100%",
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleSearchChange = (e) => {
    setMapSearchText(e.target.value);
  }

  return (
    <Box style={stylePanel} className="sff-search">
      <Paper
        component="form"
        sx={ styleInput }
      >
        <InputBase
          sx={{ width: "100%", ml: 1, flex: 1, color: "#fff"}}
          placeholder=""
          inputProps={{ 'aria-label': 'Search map' }}
          value={mapSearchText}
          onKeyDown={handleKeyDown}
          onChange={(e) => handleSearchChange(e)}
        />
        <IconButton type="button" sx={{ p: '10px', color: theme.palette.brand.main }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>
    </Box>
  );
}
