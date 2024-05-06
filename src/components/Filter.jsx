import React, { useState, useEffect } from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import PlaceIcon from '@mui/icons-material/Place';
import PushPinIcon from '@mui/icons-material/PushPin';
import FestivalIcon from '@mui/icons-material/Festival';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

export default function Filter({onFilterMap}) {

  const theme = useTheme();
  const { isExpanded } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');
  const [screenSize, setScreenSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  const FilterBox = styled(Box)(({ theme }) => ({
    display: isExpanded && screenSize <= 380 ? "none" : "block",
    position: "absolute",
    top: screenSize >= 700 ? "unset" : "5rem",
    bottom: screenSize >= 700 ? "1rem" : "unset",
    right: isExpanded && screenSize < 700 ? "0.5rem" : (!isExpanded && screenSize < 700) ? "0.5rem" : "auto",
    marginLeft: isExpanded && screenSize >= 700 ? "300px" : "auto",
    zIndex: 1000,
    backgroundColor: theme.palette.brand.faint,
    padding: "2px",
    border: `1px solid ${theme.palette.brand.main}`,
  }));

  const LabelTypography = styled(Typography)(({ theme }) => ({
    display: screenSize >= 700 ? "block" : "none",
    position: "relative",
    textAlign: "center",
    color: theme.palette.brand.main,
    marginBottom: "4px"
  }));

  const IconsBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: screenSize < 700 ? "column" : "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "2px",
  }));

  const ToggleIconButton = styled(IconButton)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    borderRadius: "0",
    padding: "0.5rem",
    border: `2px solid #000`
  }));

  const style = {
    iconVenueInactive: {
      color: theme.palette.pinVenue.main,
    },
    iconVenueActive: {
      color: theme.palette.pinVenue.main,
      border: `2px solid ${theme.palette.pinVenue.main}`
    },
    iconBookshopInactive: {
      color: theme.palette.pinBookshop.main,
    },
    iconBookshopActive: {
      color: theme.palette.pinBookshop.main,
      border: `2px solid ${theme.palette.pinBookshop.main}`
    },
    iconCafeInactive: {
      color: theme.palette.pinCafe.main,
    },
    iconCafeActive: {
      color: theme.palette.pinCafe.main,
      border: `2px solid ${theme.palette.pinCafe.main}`
    },
    iconLibraryInactive: {
      color: theme.palette.pinLibrary.main,
    },
    iconLibraryActive: {
      color: theme.palette.pinLibrary.main,
      border: `2px solid ${theme.palette.pinLibrary.main}`
    },
    iconInterestingInactive: {
      color: theme.palette.pinInteresting.main,
    },
    iconInterestingActive: {
      color: theme.palette.pinInteresting.main,
      border: `2px solid ${theme.palette.pinInteresting.main}`
    },
    iconDefaultInactive: {
      color: theme.palette.brand.main,
    },
    iconDefaultActive: {
      color: theme.palette.brand.main,
      border: `2px solid ${theme.palette.brand.main}`
    },
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
        <ToggleIconButton className="sff-filters__button" aria-label="Venues for writing events" onClick={() => handleFilterMap('Venue')} style={ activeFilter === "Venue" ? style.iconVenueActive : style.iconVenueInactive }>
          <FestivalIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Bookshops" onClick={() => handleFilterMap('Bookshop')} style={ activeFilter === "Bookshop" ? style.iconBookshopActive : style.iconBookshopInactive }>
          <BookIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Cafes to write in" onClick={() => handleFilterMap('Cafe')} style={ activeFilter === "Cafe" ? style.iconCafeActive : style.iconCafeInactive }>
          <CreateIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Libraries" onClick={() => handleFilterMap('Library')} style={ activeFilter === "Library" ? style.iconLibraryActive : style.iconLibraryInactive }>
          <LocalLibraryIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="Interesting locations" onClick={() => handleFilterMap('Interesting')} style={ activeFilter === "Interesting" ? style.iconInterestingActive : style.iconInterestingInactive }>
          <PushPinIcon />
        </ToggleIconButton>
        <ToggleIconButton className="sff-filters__button" aria-label="All locations" onClick={() => handleFilterMap()} style={ activeFilter === "All" ? style.iconDefaultActive : style.iconDefaultInactive }>
          <PlaceIcon />
        </ToggleIconButton>
      </IconsBox>
    </FilterBox>
  );
}
