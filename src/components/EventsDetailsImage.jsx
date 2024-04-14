import React from 'react';

import Box from '@mui/material/Box';

const eventImageContainerStyle = {
  display: "block",
  aspectRatio: "1/1",
  padding: 0,
  maxWidth: "300px",
  marginBottom: "1rem",
  marginLeft: "auto",
  marginRight: "auto",
}

const eventImageStyle = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}

const EventsDetailsImage = ({ image, alt }) => {

  console.log("EventsDetailsImage", image, alt);

  return (
    <Box style={eventImageContainerStyle}>
      {image &&
        <img style={eventImageStyle} src={image} alt={alt} />
      }
    </Box>
  );
};

export default EventsDetailsImage;