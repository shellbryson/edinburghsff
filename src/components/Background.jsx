import React from 'react';

// MUI Components
import Box from '@mui/material/Box';

// Assets
import MastheadImage1 from '../assets/masthead_forest.jpg';
import MastheadImage2 from '../assets/masthead_nebula.jpg';

const styles = {
  container: {
    display: 'block',
    position: "relative",
    width: "100vw",
    height: "100%",
    top: "0",
    left: "0",
    backgroundColor: "#023b46"
  },
  image1Wrapper: {
    display: 'block',
    position: "relative",
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    width: "100vw",
    height: "50%",
    top: "0",
    left: "0",
  },
  image2Wrapper: {
    display: 'block',
    position: "absolute",
    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
    height: "50%",
    right: "0",
    top: "50%",
    bottom: "0",
    left: "0",
  },
  image1: {
    display: 'block',
    width: "100%",
    height: "100%",
    objectFit: "cover",
    animation: 'sff-background-drift-1 30s ease infinite'
  },
  image2: {
    display: 'block',
    width: "100%",
    height: "100%",
    objectFit: "cover",
    animation: "sff-background-drift-2 30s ease infinite"
  }
}

const Background = () => {
  return (
    <Box className="sff-background" style={styles.container}>
      <Box sx={styles.image1Wrapper}>
        <img src={MastheadImage1} alt="*" style={styles.image1} />
      </Box>
      <Box sx={styles.image2Wrapper}>
        <img src={MastheadImage2} alt="*" style={styles.image2} />
      </Box>
    </Box>
  );
};

export default Background;