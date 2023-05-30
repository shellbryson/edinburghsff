import React from 'react';

// MUI
import Box from '@mui/material/Box';

const boxStyle = {
  display: "block",
  width: "100%",
  maxWidth: "4rem",
  marginTop: "1rem"
}

const imageStyle = {
  display: "block",
  width: "100%",
  height: "auto",
}

const LinkTileImage = ({ image, alt }) => {

  return (
    <Box style={boxStyle}>
      {image &&
        <img style={imageStyle} src={image} alt={alt} />
      }
    </Box>
  );
};

export default LinkTileImage;