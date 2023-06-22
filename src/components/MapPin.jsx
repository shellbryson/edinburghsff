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
  let pinIcon;
  let tagArray;

  if (tags) {
    tagArray = tags.split(",");
    if (tagArray.includes("Venue")) {
      pinIcon = <StarOutlinedIcon />;
    } else if (tagArray.includes("Bookshop")) {
      pinIcon = <MenuBookOutlinedIcon />;
    } else if (tagArray.includes("Cafe")) {
      pinIcon = <LocalCafeOutlinedIcon />;
    } else if (tagArray.includes("Library")) {
      pinIcon = <LocalLibraryOutlinedIcon />;
    } else {
      pinIcon = <PushPinOutlinedIcon />;
    }
  }

  return (
    <Box className="sff-map-pin" onClick={() => onClickPin(data)}>
      <Box className="sff-map-icon">{pinIcon}</Box>
      <Typography component="p" className="sff-map-pin__label">{title}</Typography>
    </Box>
  );
}
