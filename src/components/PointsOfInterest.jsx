import React, { useEffect } from 'react';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

export default function PointsOfInterest({onFocusPin}) {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    setFocusMapPin,
  } = useApp();

  const theme = useTheme();

  const stylePointsOfInterest={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    border: `1px solid ${theme.palette.primary.main}`,
  }

  useEffect(() => {
    console.log(mapLocations);
  }, [mapLocations]);

  const handleClickClear = () => {
    const locations = mapLocations.map(location => {
      location.focus = false;
      return location;
    });
    setMapLocations(locations);
    setFocusMapPin("");
  }

  const handleClickPointOfInterest = (id) => {
    const locations = mapLocations.map(location => {
      if (location.id === id) {
        location.focus = true;
      }
      return location;
    });
    setMapLocations(locations);
    setFocusMapPin(id);
  }

  return (
    <Box style={stylePointsOfInterest} className="sff-panel__interesting">
      <Typeography component="h2">Points of Interest</Typeography>
      <p onClick={() => handleClickPointOfInterest("vjXUjeOoA0hBIFq4Bvfk")}>Cymera Festival</p>
      <p onClick={() => handleClickClear()}>Clear</p>
    </Box>
  );
}
