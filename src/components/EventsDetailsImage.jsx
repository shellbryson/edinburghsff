import React from 'react';

import Box from '@mui/material/Box';

const EventsDetailsImage = ({ image, alt }) => {

  const style = {
    container: {
      display: "block",
      aspectRatio: "1/1",
      padding: 0,
      maxWidth: "300px",
      marginBottom: "1rem",
      marginLeft: "auto",
      marginRight: "auto",
    },
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  }

  return (
    <Box style={style.container}>
      {image &&
        <img style={style.image} src={image} alt={alt} />
      }
    </Box>
  );
};

export default EventsDetailsImage;