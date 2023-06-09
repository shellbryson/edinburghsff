import React from 'react';

// MUI Components
import Box from '@mui/material/Box';

// Assets
import Blob from '../assets/logo_smoking.png';
import MastheadImage1 from '../assets/masthead_forest.jpg';
import MastheadImage2 from '../assets/masthead_nebula.jpg';

const mastheadContainerStyle = {
  display: 'block',
  position: "relative",
  width: "100vw",
  backgroundColor: "#023b46",
  maxHeight: "400px",
  overflow: "hidden",
  marginBottom: "2rem",
}

const image0Style = {
  display: 'block',
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  height: "60%",
  width: "auto",
}

const image1Style = {
  display: 'block',
  width: "65%",
  height: "auto",
  animation: 'sff-masthead-drift-1 30s ease infinite'
}

const image2Style = {
  display: 'block',
  width: "100%",
  height: "auto",
  objectFit: "cover",
  animation: "sff-masthead-drift-2 30s ease infinite"
}

const image2WrapperStyle = {
  display: 'block',
  position: "absolute",
  clipPath: 'polygon(35% 0, 100% 0, 100% 100%, 0 100%)',
  height: "auto",
  right: "0",
  top: "0",
  bottom: "0",
  left: "38%",
}

const Masthead = () => {

  return (
    <Box className="sff-masthead" style={ mastheadContainerStyle }>
      <img src={MastheadImage1} alt="Masthead" style={image1Style} />
      <Box sx={image2WrapperStyle}>
        <img src={MastheadImage2} alt="Masthead" style={image2Style} />
      </Box>
      <Box className="sff-masthead__logo">
        <img src={Blob} alt="Masthead" style={image0Style} />
      </Box>
    </Box>
  );
};

export default Masthead;