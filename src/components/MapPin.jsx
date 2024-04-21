import React from 'react';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

import { useTheme } from '@mui/material/styles';

export default function MapPin({tags, title, data, onClickPin}) {

  const theme = useTheme();

  const stylePin = {
    display: "flex",
    position: "relative",
    width: "2rem",
    height: "3rem",
    marginTop: "-3rem",
    left: "-1rem"
  }

  const stylePinIcon = {
    display: "flex",
    position: "absolute",
    width: "2rem",
    height: "2rem",
    fontSize: "1rem",
    color: data.focus ? theme.palette.warning.main : "currentColor",
    backgroundColor: data.focus ? theme.palette.warning.main : "currentColor",
    top: "0",
    alignItems: "center",
    justifyContent: "center"
  }

  const stylePinLabel = {
    display: "flex",
    position: "absolute",
    fontSize: "0.5rem",
    color: theme.palette.brand.main,
    backgroundColor: theme.palette.warning.main,
    top: "0",
    left: "2rem",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    padding: "4px 1rem 4px 0",
    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)"
  }

  let pinIcon;
  let tagArray;

  if (tags) {
    tagArray = tags.split(",");
    if (tagArray.includes("Venue")) {
      pinIcon = <FestivalIcon color="primary" />;
    } else if (tagArray.includes("Bookshop")) {
      pinIcon = <MenuBookOutlinedIcon color="primary" />;
    } else if (tagArray.includes("Cafe")) {
      pinIcon = <LocalCafeOutlinedIcon color="primary" />;
    } else if (tagArray.includes("Library")) {
      pinIcon = <LocalLibraryOutlinedIcon color="primary" />;
    } else {
      pinIcon = <PushPinOutlinedIcon color="primary" />;
    }
  }

  return (
    <Box className="sff-map-pin" style={stylePin} onClick={() => onClickPin(data)}>
      <Box className="sff-map-icon" style={stylePinIcon}>{pinIcon}</Box>
      { data.showLabel &&
        <Box className="sff-map-label" style={stylePinLabel} >
          <Typography component="p">{title}</Typography>
        </Box>
      }
    </Box>
  );
}
