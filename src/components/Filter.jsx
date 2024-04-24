import React, { useState } from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
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

  const FilterBox = styled(Box)(({ theme }) => ({
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
  }));

  const LabelTypography = styled(Typography)(({ theme }) => ({
    display: "flex",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    color: theme.palette.brand.main,
  }));

  const IconsBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(0, 0, 0)",
    gap: "2px",
  }));

  const ToggleIconButton = styled(IconButton)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    borderRadius: "0",
    padding: "0.5rem",
  }));

  const SearchBox = styled(Box)(({ theme }) => ({
    display: "block",
    width: "100%",
  }));

  const style = {
    iconInactive: {
      backgroundColor: "rgb(0, 0, 0)",
      color: theme.palette.brand.main,
    },
    iconActive: {
      backgroundColor: theme.palette.brand.main,
      color: "#000",
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
    <FilterBox className="sff-filters">
      <LabelTypography style={style.label} className="sff-filters__label" variant='h_small_lined'>Filter by: {activeFilter}</LabelTypography>
      <IconsBox className="sff-filters__icons">
        <ToggleIconButton className="sff-filters__button" aria-label="Venues" onClick={() => handleFilterMap('Venue')} style={ activeFilter === "Venue" ? style.iconActive : style.iconInactive }>
          <FestivalIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Bookshops" onClick={() => handleFilterMap('Bookshop')} style={ activeFilter === "Bookshop" ? style.iconActive : style.iconInactive }>
          <MenuBookOutlinedIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Cafes" onClick={() => handleFilterMap('Cafe')} style={ activeFilter === "Cafe" ? style.iconActive : style.iconInactive }>
          <LocalCafeOutlinedIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Libraries" onClick={() => handleFilterMap('Library')} style={ activeFilter === "Library" ? style.iconActive : style.iconInactive }>
          <LocalLibraryOutlinedIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="All" onClick={() => handleFilterMap()} style={ activeFilter === "All" ? style.iconActive : style.iconInactive }>
          <PlaceIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Show search" onClick={() => handleToggleSearch()} style={ isShowingSearch ? style.iconActive : style.iconInactive } >
          <SearchIcon />
        </ToggleIconButton>
      </IconsBox>
      { isShowingSearch && <SearchBox style={style.search} className="sff-filters__search">
        <MapSearch />
      </SearchBox>}
    </FilterBox>
  );
}
