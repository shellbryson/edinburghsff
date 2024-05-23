import React from 'react';

// MUI
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

export default function EventsDetailsImage({ image, alt }) {

  const theme = useTheme();

  const ImageContainerBox = styled(Box)(({ theme }) => ({
    display: "block",
    padding: 0,
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
  }));

  const style = {
    image: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  }

  return (
    <ImageContainerBox style={style.container}>
      {image && <img style={style.image} src={image} alt={alt} />}
    </ImageContainerBox>
  );
};