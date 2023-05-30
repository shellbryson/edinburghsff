import React from 'react';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';

const pinStyle = {
  display: "flex",
  alignItems: "center",
}

const iconStyle = {
  display: "block",
  width: "2rem",
  height: "2rem",
  fontSize: "2rem",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.75)"
}

const pinLabelStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.75)",
  padding: "0.5rem",
}

export default function MapPin({tags, title, onMarkerClick}) {
  let pinIcon;
  let tagArray;

  if (tags) {
    tagArray = tags.split(",");
    if (tagArray.includes("Venue")) {
      pinIcon = <StarOutlinedIcon style={ iconStyle } />;
    } else if (tagArray.includes("Bookshop")) {
      pinIcon = <MenuBookOutlinedIcon style={ iconStyle }/>;
    } else if (tagArray.includes("Cafe")) {
      pinIcon = <LocalCafeOutlinedIcon style={ iconStyle } />;
    } else {
      pinIcon = <PushPinOutlinedIcon style={ iconStyle }/>;
    }
  }

  return (
    <Box style={ pinStyle } onClick={onMarkerClick}>
      <Box style={ iconStyle }>{pinIcon}</Box>
      <Typography component="p" style={ pinLabelStyle }>{title}</Typography>
    </Box>
  );
}
