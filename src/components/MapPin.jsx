import React, { useEffect, useState } from 'react';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

// Icons
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import FestivalIcon from '@mui/icons-material/Festival';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

export default function MapPin({data, onClickPin}) {

  const theme = useTheme();
  const [icon, setIcon] = useState("");

  const PinBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "relative",
    width: "2rem",
    height: "3rem",
    marginTop: "-3rem",
    left: "-1rem"
  }));

  const IconBox = styled(Box)(({ theme }) => ({
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
  }));

  const LabelBox = styled(Box)(({ theme }) => ({
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
  }));

  useEffect(() => {
    if (!data.tags) return;
    let icon;
    const tagArray = data.tags.split(",");
    if (tagArray.includes("Venue")) {
      icon = <FestivalIcon color="brand" />;
    } else if (tagArray.includes("Bookshop")) {
      icon = <MenuBookOutlinedIcon color="brand" />;
    } else if (tagArray.includes("Cafe")) {
      icon = <LocalCafeOutlinedIcon color="brand" />;
    } else if (tagArray.includes("Library")) {
      icon = <LocalLibraryOutlinedIcon color="brand" />;
    } else {
      icon = <PushPinOutlinedIcon color="brand" />;
    }
    setIcon(icon);
  }, [data.id]);

  return (
    <PinBox className="sff-map-pin" onClick={() => onClickPin(data)}>
      <IconBox className="sff-map-icon">{icon}</IconBox>
      { data.showLabel &&
        <LabelBox className="sff-map-label">
          <Typography component="p">{data.name}</Typography>
        </LabelBox>
      }
    </PinBox>
  );
}
