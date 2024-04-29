import React from 'react';

import {imageURL} from '../utils/utils';

// MUI
import Box from '@mui/material/Box';

const eventImageContainerStyle = {
  display: "block",
  aspectRatio: "1/1",
  padding: 0,
  width: "4rem",
  height: "4rem",
  border: "0.25rem solid #000"
}

const eventImageStyle = {
  display: "block",
  width: "100%",
  height: "100%",
  objectFit: "cover",
}

const EventsGridImage = ({ image, alt }) => {

  return (
    <Box style={eventImageContainerStyle}>
      {image &&
        <img style={eventImageStyle} src={imageURL(image, 'medium')} alt={alt} loading="lazy" />
      }
    </Box>
  );
};

export default EventsGridImage;