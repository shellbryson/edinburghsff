import React, { useEffect, useState } from 'react';

// Context
import { useApp } from '../../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typeography from '@mui/material/Typography';

// Icons
import PlaceIcon from '@mui/icons-material/Place';

export default function InterestPanel() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    setFocusMapPin,
  } = useApp();

  const theme = useTheme();
  const [featured, setFeatured] = useState([]);

  const InterestBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "relative",
    gap: "0.5rem",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.palette.brand.faint,
    padding: "0.5rem",
  }));

  const stylePointsOfInterest={
    display: "flex",
    position: "relative",
    flexDirection: "column",
    gap: "0.5rem",
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
      <Typeography component="h2" variant="h_small_lined">Map highlights</Typeography>
      {featured.map((place, index) => (
        <InterestBox key={index} className="sff-interesting__place">
          <Typeography style={styleLink} component="a" variant="a_white" key={index} onClick={() => handleClickPointOfInterest(place.id)}>{place.name}</Typeography>
          <PlaceIcon />
        </InterestBox>
      ))}
    </Box>
  );
}
