import React from 'react';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FestivalIcon from '@mui/icons-material/Festival';
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
    left: "-1rem"
  }

  const stylePinIcon = {
    display: "flex",
    position: "absolute",
    width: "2rem",
    height: "2rem",
    fontSize: "1rem",
    color: data.focus ? "#ff0000" : "currentColor",
    backgroundColor: data.focus ? "#ff0000" : "currentColor",
    top: "0",
    alignItems: "center",
    justifyContent: "center"
  }

  let pinIcon;
  let tagArray;

  if (tags) {
    tagArray = tags.split(",");
    if (tagArray.includes("Venue")) {
      pinIcon = <FestivalIcon color="brand" />;
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
      <Box className="sff-map-icon" style={stylePinIcon}>{pinIcon}</Box>
      <Typography component="p" className="sff-map-pin__label">{title}</Typography>
    </Box>
  );
}
