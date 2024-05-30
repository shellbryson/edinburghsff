import React, { useState, useEffect } from 'react';

// MUI Components
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// Custom UI
import UploadImage from './UploadImage';

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: "0.5rem",
  gridTemplateColumns: "1fr 1fr 1fr",
  margin: "1rem 0",
}));

const ImageBox = styled(Box)(({ theme }) => ({
  border: "1px solid #ccc",
  '& img': {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }
}));

export default function GalleryEditor({galleryImages, onUpdate, onClickImage}) {

  const [images, setImages] = useState([...galleryImages]);

  useEffect(() => {
    setImages(galleryImages);
  }, [galleryImages]);

  const handleFileUpload = (url) => {
    const image = {
      url: url,
      alt: '',
      title: ''
    }
    const newImages = [...images, image];
    onUpdate(newImages);
    setImages(newImages);
  }

  const handleOnClick = (image) => () => {
    onClickImage(image);
  }

  return (
    <Box>
      <Typography variant="h_medium">Gallery Editor</Typography>
      <UploadImage imageUploadedCallback={handleFileUpload} />
      <GalleryGrid>
        {images.map((image, index) => (
          <ImageBox key={index} onClick={handleOnClick(image)}>
            <img src={image.url} alt={image.alt} title={image.title} />
          </ImageBox>
        ))}
      </GalleryGrid>
    </Box>
  );
};