import React from 'react';

import Box from '@mui/material/Box';

const listImageContainerStyle = {
  display: "block",
  aspect: "1/1",
  border: "1px solid #ccc",
  padding: "1px",
  width: "2rem",
  height: "2rem",
}

const listImageStyle = {
  display: "block",
  aspect: "1/1",
  width: "100%",
  height: "100%",
  objectFit: "cover"
}

const ListListImage = ({ image, alt }) => {

  return (
    <Box style={listImageContainerStyle}>
      {image &&
        <img style={listImageStyle} src={image} alt={alt} loading="lazy" />
      }
    </Box>
  );
};

export default ListListImage;