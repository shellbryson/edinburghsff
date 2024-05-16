import React, { useEffect, useState } from 'react';

// MUI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Icons
import PushPinIcon from '@mui/icons-material/PushPin';
import FestivalIcon from '@mui/icons-material/Festival';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

const PinBox = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  width: "2rem",
  height: "3rem",
  marginTop: "-3rem",
  left: "-1rem",
  filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.5))"
}));

export default function MapPin({data, onClickPin}) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("pinDefault");
  const [isDragging, setIsDragging] = useState(false);

  const IconBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "absolute",
    width: "calc(2rem - 4px)",
    height: "calc(2rem - 4px)",
    fontSize: "1rem",
    color: data.focus ? theme.palette[color].main : "currentColor",
    backgroundColor: data.focus ? "#000" : "currentColor",
    borderTop: `2px solid ${theme.palette[color].main}`,
    borderLeft: `2px solid ${theme.palette[color].main}`,
    borderRight: `2px solid ${theme.palette[color].main}`,
    borderBottom: `2px solid ${theme.palette[color].main}`,
    top: "0",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    '&::after': {
      content: "''",
      position: "absolute",
      top: "20px",
      width: "calc(1rem)",
      height: "calc(1rem)",
      clear: "both",
      transform: "rotate(45deg)",
      backgroundColor: theme.palette[color].main,
      zIndex: "-1"
    },
    '> svg': {
      display: "block",
      width: "22px",
      height: "22px",
    }
  }));

  const LabelBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "absolute",
    fontFamily: '"Chakra Petch", sans-serif',
    fontWeight: "400",
    fontSize: "0.5rem",
    textTransform: "uppercase",
    color: theme.palette.brand.contrastText,
    backgroundColor: theme.palette[color].main,
    top: "0",
    left: "2rem",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    padding: "4px 1rem"
  }));

  useEffect(() => {
    if (!data.tags) return;
    const tagIconMap = {
      Venue: { color: 'pinVenue', Icon: FestivalIcon },
      Bookshop: { color: 'pinBookshop', Icon: BookIcon },
      Cafe: { color: 'pinCafe', Icon: CreateIcon },
      Library: { color: 'pinLibrary', Icon: LocalLibraryIcon },
      Interesting: { color: 'pinInteresting', Icon: PushPinIcon },
    };
    const tagArray = data.tags.split(",");
    const tag = tagArray.find(tag => tagIconMap.hasOwnProperty(tag));
    const { color: iconColor, Icon } = tag ? tagIconMap[tag] : { color: 'pinDefault', Icon: PushPinIcon };
    const icon = <Icon color={iconColor === 'pinDefault' ? 'brand' : iconColor} />;
    setColor(iconColor);
    setIcon(icon);
  }, [data.id]);

  // We perform this set of event handling to avoid triggering the popups
  // when the user is dragging the map to pan around.

  // Mobile only

  const handleMouseDown = () => {
    isMobile && setIsDragging(false);
  };

  const handleMouseMove = () => {
    isMobile && setIsDragging(true);
  };

  const handleMouseUp = () => {
    if (!isDragging && isMobile) {
      onClickPin(data);
    }
    setIsDragging(false);
  };

  // Desktop only

  const handleClick = () => {
    !isMobile && onClickPin(data);
  }

  return (
    <PinBox
      className="sff-map-pin"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      <IconBox className="sff-map-icon">{icon}</IconBox>
      {data.showLabel && (
        <LabelBox className="sff-map-label">
          <Typography component="p">{data.name}</Typography>
        </LabelBox>
      )}
    </PinBox>
  );
}
