import React from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';

// Icons
import 'css.gg/icons/scss/chevron-left.scss'

// MUI Icons
import IconButton from '@mui/material/IconButton';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

export default function Filter({onFilterMap}) {

  const { isExpanded } = useApp();

  const styleIcon = {
    display: "block",
    width: "1.5rem",
    height: "1.5rem",
    fontSize: "1.5rem",
  }

  const styleFilter = {
    display: "flex",
    position: "absolute",
    bottom: "1rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    zIndex: 1000,
    marginLeft: isExpanded ? "300px" : "0",
    backgroundColor: "rgb(0, 0, 0)",
    transition: "margin-left 200ms",
  }

  return (
    <Box style={styleFilter} className="sff-filters">
      <IconButton aria-label="Venues" onClick={() => onFilterMap('Venue')}>
        <StarOutlinedIcon style={ styleIcon } color="brand" />
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
    </Box>
  );
}
