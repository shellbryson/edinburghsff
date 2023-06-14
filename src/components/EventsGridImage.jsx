import React from 'react';

import Box from '@mui/material/Box';

const eventImageContainerStyle = {
  display: "block",
  aspectRatio: "1/1",
  padding: 0,
  width: "100%",
  height: "100%",
}

const eventImageStyle = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "grayscale(1) opacity(0.1)"
}

const EventsGridImage = ({ image, alt }) => {

  return (
    <Box style={eventImageContainerStyle}>
      {image &&
        <img style={eventImageStyle} src={image} alt={alt} loading="lazy" />
      }
    </Box>
  );
};

export default EventsGridImage;