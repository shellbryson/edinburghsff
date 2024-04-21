import React, { useState } from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// MUI Icons
import IconButton from '@mui/material/IconButton';
import PlaceIcon from '@mui/icons-material/Place';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import SearchIcon from '@mui/icons-material/Search';

// Custom UI
import MapSearch from './MapSearch';

export default function Filter({onFilterMap}) {

  const theme = useTheme();

  const { isExpanded, isShowingSearch, setIsShowingSearch } = useApp();

  const [activeFilter, setActiveFilter] = useState('All');

  const styleFilter = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    bottom: "1rem",
    justifyContent: "center",
    gap: "4px",
    zIndex: 1000,
    marginLeft: isExpanded ? "300px" : "0",
    backgroundColor: "rgb(0, 0, 0)",
    padding: "0.5rem",
  }

  const styleFilterSearch = {
    display: "block",
    width: "100%",
  }

  const styleFilterIcons = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
    gap: "4px",
  }

  const styleIconInactive = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "rgb(0, 0, 0)",
    color: theme.palette.primary.main,
    borderRadius: "0",
    padding: "0.5rem",
  }

  const styleIconActive = {
    display: "flex",
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    color: "#000",
    borderRadius: "0",
    padding: "0.5rem",
  }

  const handleToggleSearch = () => {
    setActiveFilter("All");
    setIsShowingSearch(!isShowingSearch);
  }

  const handleFilterMap = (type) => {
    const filter = type ? type : 'All';
    setActiveFilter(filter);
    onFilterMap(type);
  }

  return (
    <Box style={styleFilter} className="sff-filters">
      { isShowingSearch && <Box style={styleFilterSearch} className="sff-filters__search">
        <MapSearch />
      </Box>}
      <Box>
        <Typography variant='h_small' sx={{ color: theme.palette.primary.main, textAlign: "left" }}>{activeFilter}</Typography>
      </Box>
      <Box style={styleFilterIcons} className="sff-filters__icons">
        <IconButton className="sff-filters__button" aria-label="Venues" onClick={() => handleFilterMap('Venue')} style={ activeFilter === "Venue" ? styleIconActive : styleIconInactive }>
          <FestivalIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Bookshops" onClick={() => handleFilterMap('Bookshop')} style={ activeFilter === "Bookshop" ? styleIconActive : styleIconInactive }>
          <MenuBookOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Cafes" onClick={() => handleFilterMap('Cafe')} style={ activeFilter === "Cafe" ? styleIconActive : styleIconInactive }>
          <LocalCafeOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Libraries" onClick={() => handleFilterMap('Library')} style={ activeFilter === "Library" ? styleIconActive : styleIconInactive }>
          <LocalLibraryOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="All" onClick={() => handleFilterMap()} style={ activeFilter === "All" ? styleIconActive : styleIconInactive }>
          <PlaceIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Show search" onClick={() => handleToggleSearch()} style={ isShowingSearch ? styleIconActive : styleIconInactive } >
          <SearchIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
