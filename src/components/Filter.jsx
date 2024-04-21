import React, { useState } from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';

// Icons
import 'css.gg/icons/scss/chevron-left.scss'

// MUI Icons
import IconButton from '@mui/material/IconButton';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import SearchIcon from '@mui/icons-material/Search';

// Custom UI
import MapSearch from './MapSearch';

export default function Filter({onFilterMap}) {

  const { isExpanded, isShowingSearch, setIsShowingSearch } = useApp();

  const styleFilter = {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    bottom: "1rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    zIndex: 1000,
    marginLeft: isExpanded ? "300px" : "0",
    backgroundColor: "rgb(0, 0, 0)",
    transition: "margin-left 200ms",
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
    gap: "1rem",
    backgroundColor: "rgb(0, 0, 0)",
  }

  const styleIcon = {
    display: "block",
    width: "1.5rem",
    height: "1.5rem",
    fontSize: "1.5rem",
  }

  const handleToggleSearch = () => {
    setIsShowingSearch(!isShowingSearch);
  }

  return (
    <Box style={styleFilter} className="sff-filters">
      { isShowingSearch && <Box style={styleFilterSearch} className="sff-filters__search">
        <MapSearch />
      </Box>}
      <Box style={styleFilterIcons} className="sff-filters__icons">
        <IconButton aria-label="Venues" onClick={() => onFilterMap('Venue')}>
          <FestivalIcon style={ styleIcon } color="brand" />
        </IconButton>
        <IconButton aria-label="Bookshops" onClick={() => onFilterMap('Bookshop')}>
          <MenuBookOutlinedIcon style={ styleIcon } color="brand" />
        </IconButton>
        <IconButton aria-label="Cafes" onClick={() => onFilterMap('Cafe')}>
          <LocalCafeOutlinedIcon style={ styleIcon } color="brand" />
        </IconButton>
        <IconButton aria-label="Libraries" onClick={() => onFilterMap('Library')}>
          <LocalLibraryOutlinedIcon style={ styleIcon } color="brand" />
        </IconButton>
        <IconButton aria-label="All" onClick={() => onFilterMap()}>
          <PushPinOutlinedIcon style={ styleIcon } color="brand" />
        </IconButton>
        <IconButton aria-label="All" onClick={() => handleToggleSearch()}>
          <SearchIcon style={ styleIcon } color="brand" />
        </IconButton>
      </Box>
    </Box>
  );
}
