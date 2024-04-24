import React, { useEffect, useState } from 'react';

// Context
import { useApp } from '../../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Icons
import PinDropIcon from '@mui/icons-material/PinDrop';

export default function PlacesOfInterest() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    setFocusMapPin,
  } = useApp();

  const theme = useTheme();
  const [featured, setFeatured] = useState([]);

  const stylePointsOfInterest={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "1rem",
    marginBottom: "2rem",
  }

  const stylePlace={
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  }

  const styleLink={
    whiteSpace: "nowrap",
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }

  useEffect(() => {
    setFeatured(mapLocations.filter(location => location.featured));
  }, [mapLocations]);

  const handleClickPointOfInterest = (id) => {
    const locations = mapLocations.map(location => {
      if (location.id === id) {
        location.focus = !location.focus;
        location.showLabel = !location.showLabel;
      } else {
        location.focus = false;
        location.showLabel = false;
      }
      return location;
    });
    setMapLocations(locations);
    setFocusMapPin(id);
  }

  return (
    <Box style={stylePointsOfInterest} className="sff-panel-interesting">
      <Typeography component="h2" variant="h_small_lined">Places of Interest</Typeography>
      {featured.map((place, index) => (
        <Box key={index} style={stylePlace} className="sff-interesting__place">
          <Typeography style={styleLink} component="a" variant="a_white" key={index} onClick={() => handleClickPointOfInterest(place.id)}>{place.name}</Typeography>
          <PinDropIcon />
        </Box>
      ))}
    </Box>
  );
}
