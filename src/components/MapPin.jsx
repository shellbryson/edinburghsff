import React from 'react';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

export default function MapPin({tags, title, data, onClickPin}) {

  const stylePin = {
    display: "flex",
    position: "relative",
    width: "2rem",
    height: "3rem",
    overflow: "hidden",
    marginTop: "-3rem",
    left: "-1rem",
    border: data.focus ? "2px solid #ff0000" : "none",
  }

  let pinIcon;
  let tagArray;

  if (tags) {
    tagArray = tags.split(",");
    if (tagArray.includes("Venue")) {
      pinIcon = <StarOutlinedIcon color="brand" />;
    } else if (tagArray.includes("Bookshop")) {
      pinIcon = <MenuBookOutlinedIcon color="brand" />;
    } else if (tagArray.includes("Cafe")) {
      pinIcon = <LocalCafeOutlinedIcon color="brand" />;
    } else if (tagArray.includes("Library")) {
      pinIcon = <LocalLibraryOutlinedIcon color="brand" />;
    } else {
      pinIcon = <PushPinOutlinedIcon color="brand" />;
    }
  }

  return (
    <Box className="sff-map-pin" style={stylePin} onClick={() => onClickPin(data)}>
      <Box className="sff-map-icon">{pinIcon}</Box>
      <Typography component="p" className="sff-map-pin__label">{title}</Typography>
    </Box>
  );
}
