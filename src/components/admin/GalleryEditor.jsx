import React, { useState, useEffect } from 'react';

// MUI Components
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

// Icons
import PreviewIcon from '@mui/icons-material/Preview';
import FileOpenIcon from '@mui/icons-material/FileOpen';

// Custom UI
import UploadImage from './UploadImage';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

const ImageDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%",
    padding: "0",
    overflow: "scroll",
  },
  '& .MuiContainer-root': {
    scrollBehavior: "smooth",
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%"
  },
}));

const GalleryGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gap: "0.5rem",
  gridTemplateColumns: "1fr 1fr 1fr",
  margin: "1rem 0",
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  border: "1px solid #ccc",
  '& img': {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  }
}));

const IconViewButton = styled(Box)(({ theme }) => ({
  display: "block",
  position: "absolute",
  top: "2px",
  left: "2px",
  zIndex: "2",
  backgroundColor: "rgba(0, 0, 0, 1)",
  padding: "2px",
  color: theme.palette.brand.main,
  '& svg': {
    display: "block",
  }
}));

const IconInsertButton = styled(Box)(({ theme }) => ({
  display: "block",
  position: "absolute",
  bottom: "2px",
  right: "2px",
  zIndex: "2",
  backgroundColor: "rgba(0, 0, 0, 1)",
  padding: "2px",
  color: theme.palette.brand.main,
  '& svg': {
    display: "block",
  }
}));

export default function GalleryEditor({galleryImages, onUpdate, onClickImage}) {

  const theme = useTheme();
  const [images, setImages] = useState([...galleryImages]);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleOnClickInsert = (image) => () => {
    onClickImage(image);
  }

  const handleOnClickView = (image) => () => {
    setShowImage(true);
    setSelectedImage(image);
  }

  const handleClose = () => {
    setShowImage(false);
  };

  return (
    <Box>
      <Typography variant="h_medium">Gallery</Typography>
      <UploadImage imageUploadedCallback={handleFileUpload} />
      <GalleryGrid>
        {images.map((image, index) => (
          <ImageBox key={index}>
            <IconInsertButton onClick={handleOnClickView(image)}><PreviewIcon /></IconInsertButton>
            <IconViewButton onClick={handleOnClickInsert(image)}><FileOpenIcon /></IconViewButton>
            <img src={image.url} alt={image.alt} title={image.title} />
          </ImageBox>
        ))}
      </GalleryGrid>
      { selectedImage?.url &&
        <ImageDialog
          fullWidth
          maxWidth="md"
          open={showImage} fullScreen={fullScreen}
          onClose={handleClose}>
          <DialogContent className="scroll">
            <img src={selectedImage.url} alt={selectedImage.alt} title={selectedImage.title} />
          </DialogContent>
        </ImageDialog>
      }
    </Box>
  );
};