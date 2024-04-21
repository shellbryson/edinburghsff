import React from 'react';
import { useSearchParams } from "react-router-dom";

// Context
import { useApp } from '../../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import PinDropIcon from '@mui/icons-material/PinDrop';

export default function PlacesOfInterest() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    setFocusMapPin,
  } = useApp();

  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const places = [
    {
      id: "vjXUjeOoA0hBIFq4Bvfk",
      title: "Cymera Festival"
    }
  ]

  const stylePointsOfInterest={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    border: `1px solid ${theme.palette.primary.dark}`,
    padding: "0.5rem"
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
    setSearchParams({});
    setMapLocations(locations);
    setFocusMapPin(id);
  }

  return (
    <Box style={stylePointsOfInterest} className="sff-panel-interesting">
      <Typeography component="h2" variant="h_small">Places of Interest</Typeography>
      {places.map((place, index) => (
        <Box key={index} style={stylePlace} className="sff-interesting__place">
          <Typeography style={styleLink} component="a" variant="a_white" key={index} onClick={() => handleClickPointOfInterest(place.id)}>{place.title}</Typeography>
          <PinDropIcon />
        </Box>
      ))}
    </Box>
  );
}
