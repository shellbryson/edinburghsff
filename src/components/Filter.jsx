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

  const style = {
    filter: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      bottom: "1rem",
      justifyContent: "center",
      gap: "2px",
      zIndex: 1000,
      marginLeft: isExpanded ? "300px" : "0",
      backgroundColor: "rgb(0, 0, 0)",
      padding: "2px",
      border: `1px solid ${theme.palette.brand.main}`
    },
    label: {
      display: "flex",
      width: "100%",
      position: "relative",
      justifyContent: "center",
      color: theme.palette.brand.main,
    },
    search: {
      display: "block",
      width: "100%",
    },
    icons: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgb(0, 0, 0)",
      gap: "2px",
    },
    iconInactive: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "rgb(0, 0, 0)",
      color: theme.palette.brand.main,
      borderRadius: "0",
      padding: "0.5rem",
    },
    iconActive: {
      display: "flex",
      alignItems: "center",
      backgroundColor: theme.palette.brand.main,
      color: "#000",
      borderRadius: "0",
      padding: "0.5rem",
    }
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
    <Box style={style.filter} className="sff-filters">
      <Typography style={style.label} className="sff-filters__label" variant='h_small'>Filter by: {activeFilter}</Typography>
      <Box style={style.icons} className="sff-filters__icons">
        <IconButton className="sff-filters__button" aria-label="Venues" onClick={() => handleFilterMap('Venue')} style={ activeFilter === "Venue" ? style.iconActive : style.iconInactive }>
          <FestivalIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Bookshops" onClick={() => handleFilterMap('Bookshop')} style={ activeFilter === "Bookshop" ? style.iconActive : style.iconInactive }>
          <MenuBookOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Cafes" onClick={() => handleFilterMap('Cafe')} style={ activeFilter === "Cafe" ? style.iconActive : style.iconInactive }>
          <LocalCafeOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Libraries" onClick={() => handleFilterMap('Library')} style={ activeFilter === "Library" ? style.iconActive : style.iconInactive }>
          <LocalLibraryOutlinedIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="All" onClick={() => handleFilterMap()} style={ activeFilter === "All" ? style.iconActive : style.iconInactive }>
          <PlaceIcon />
        </IconButton>
        <IconButton className="sff-filters__button" aria-label="Show search" onClick={() => handleToggleSearch()} style={ isShowingSearch ? style.iconActive : style.iconInactive } >
          <SearchIcon />
        </IconButton>
      </Box>
      { isShowingSearch && <Box style={style.search} className="sff-filters__search">
        <MapSearch />
      </Box>}
    </Box>
  );
}
