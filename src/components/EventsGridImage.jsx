import React from 'react';

import Box from '@mui/material/Box';

const eventImageContainerStyle = {
  display: "block",
  aspect: "1/1",
  border: "1px solid #ccc",
  padding: "1px",
  width: "100%",
  height: "100%",
  zIndex: 1
}

const eventImageStyle = {
  display: "block",
  aspect: "1/1",
  width: "100%",
  height: "100%",
  objectFit: "cover",
  opacity: 0.3,
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