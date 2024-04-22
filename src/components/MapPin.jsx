import React, { useEffect, useState } from 'react';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

import { useTheme } from '@mui/material/styles';

export default function MapPin({data, onClickPin}) {

  const theme = useTheme();
  const [icon, setIcon] = useState("");

  const style = {
    pin: {
      display: "flex",
      position: "relative",
      width: "2rem",
      height: "3rem",
      marginTop: "-3rem",
      left: "-1rem"
    },
    icon: {
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
    },
    label: {
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
  }

  useEffect(() => {
    if (!data.tags) return;
    let icon;
    const tagArray = data.tags.split(",");
    if (tagArray.includes("Venue")) {
      icon = <FestivalIcon color="primary" />;
    } else if (tagArray.includes("Bookshop")) {
      icon = <MenuBookOutlinedIcon color="primary" />;
    } else if (tagArray.includes("Cafe")) {
      icon = <LocalCafeOutlinedIcon color="primary" />;
    } else if (tagArray.includes("Library")) {
      icon = <LocalLibraryOutlinedIcon color="primary" />;
    } else {
      icon = <PushPinOutlinedIcon color="primary" />;
    }
    setIcon(icon);
  }, [data.id]);

  return (
    <Box className="sff-map-pin" style={style.pin} onClick={() => onClickPin(data)}>
      <Box className="sff-map-icon" style={style.icon}>{icon}</Box>
      { data.showLabel &&
        <Box className="sff-map-label" style={style.label} >
          <Typography component="p">{data.title}</Typography>
        </Box>
      }
    </Box>
  );
}
