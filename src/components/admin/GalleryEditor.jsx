import React, { useState, useEffect } from 'react';
import { fetchDocuments } from '../../utils/utils'; // Import the function
// import { fetchImagesWithPagination } from '../../utils/utils'; // Import the function

// MUI Components
import { useTheme, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

// Icons
import PreviewIcon from '@mui/icons-material/Preview';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import CloseIcon from '@mui/icons-material/Close';

// Custom UI
import UploadImage from './UploadImage';
import AdminLayout from '../../layouts/AdminLayout';


// Helpers
import ProtectedRoute from '../../helpers/ProtectedRoute';
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapAdminDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    backgroundColor: '#fff',
    color: '#000',
    height: "100%",
    padding: "0",
  },
  '& .MuiContainer-root': {
    scrollBehavior: "smooth"
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
  gridTemplateColumns: "repeat(5, 1fr)",
  margin: "1rem 0",
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: "repeat(3, 1fr)",
  },
}));

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  border: "1px solid #ccc",
  aspectRatio: "1/1",
  '& img': {
    width: "100%",
    height: "100%",
    objectFit: "contain",
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

export default function GalleryEditor({
  galleryImages,
  showGallery,
  onUpdate,
  onClickImage,
  onClose
}) {
  const theme = useTheme();
  const [images, setImages] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isOpen, setIsOpen] = useState(false);

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isDashboard = location.pathname.includes("dashboard");

  const style={
    page: {
      display: "flex",
      flexDirection: "column",
      overflow: "auto",
      height: "100%",
      width: "100%",
      padding: "0",
      margin: "0",
    },
    navigation: {
      display: fullScreen || isDashboard ? "none" : "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0.5rem",
      borderTop: "1px solid #ccc",
      paddingTop: "1rem",
      marginTop: "1rem",
    }
  }

  useEffect(() => {
    setIsOpen(showGallery);
    if (showGallery) {
      loadImages();
    }
  }, [showGallery]);

  const loadImages = () => {
    setLoading(true);
    fetchDocuments('content_images', 10, lastVisible, ({ images: newImages, nextPageToken }) => {
      setImages((prevImages) => [...prevImages, ...newImages]);
      setLastVisible(nextPageToken);
      setLoading(false);
    });
  };
  // const loadImages = () => {
  //   setLoading(true);
  //   fetchImagesWithPagination('content_images', 10, lastVisible, ({ images: newImages, nextPageToken }) => {
  //     setImages((prevImages) => [...prevImages, ...newImages]);
  //     setLastVisible(nextPageToken);
  //     setLoading(false);
  //   });
  // };

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


  const handleOnClickInsert = (image) => {
    console.log("Insert Image: ", image);
    onClickImage(image);
    setIsOpen(false);
  }

  const handleOnClickView = (image) => () => {
    setShowImage(true);
    setSelectedImage(image);
  }

  const handleClose = () => {
    onClose(false);
  };

  return (
    <BootstrapAdminDialog
      fullWidth
      maxWidth="sm"
      open={isOpen} fullScreen={fullScreen}
      onClose={handleClose}>

      <DialogTitle>
        <Box style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem"}}>
          <Typography variant="h_medium" style={{ paddingBottom: "0"}}>
            Gallery
          </Typography>
          <Box>
          <IconButton aria-label="Close" size="small" color="primary" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent dividers style={{ overflow: "hidden" }}>
        <ProtectedRoute>
          <AdminLayout>
            <Box style={style.page} className="sff-admin-layout">
              <GalleryGrid>
                {images.map((image, index) => (
                  <ImageBox key={index}>
                    {/* <IconInsertButton onClick={() => handleOnClickInsert(image)}>
                      <PreviewIcon />
                    </IconInsertButton> */}
                    <IconViewButton onClick={() => handleOnClickInsert(image)}>
                      <FileOpenIcon />
                    </IconViewButton>
                    <img src={image.thumb} alt={image.name} />
                  </ImageBox>
                ))}
              </GalleryGrid>

              {/* Load More Button */}
              {lastVisible && !loading && (
                <Box style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Button variant="contained" onClick={loadImages}>
                    Load More
                  </Button>
                </Box>
              )}

              {/* Loading Indicator */}
              {loading && (
                <Box style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <Typography>Loading...</Typography>
                </Box>
              )}
            </Box>
          </AdminLayout>
        </ProtectedRoute>
      </DialogContent>
    </BootstrapAdminDialog>

  );
};