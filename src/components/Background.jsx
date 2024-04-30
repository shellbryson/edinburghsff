import React from 'react';

// MUI Components
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Assets
import MastheadImage1 from '../assets/masthead_nebula.jpg';
import MastheadImage2 from '../assets/masthead_forest.jpg';

const BackgroundBox = styled(Box)(({ theme }) => ({
  display: 'block',
  position: "relative",
  width: "100%",
  height: "100%",
  top: "0",
  left: "0",
  overflow: "hidden",
}));

const Image1Box = styled(Box)(({ theme }) => ({
  display: 'flex',
  position: "relative",
  clipPath: 'polygon(0 0, 0 100%, 100% 0)',
  width: "100%",
  height: "100%",
  top: "0",
  left: "0",
  alignItems: "center",
  justifyContent: "center",
}));

const Image2Box = styled(Box)(({ theme }) => ({
  display: 'block',
  position: "absolute",
  clipPath: 'polygon(100% 100%, 0 100%, 100% 0)',
  height: "100%",
  width: "100%",
  right: "0",
  top: "0",
  bottom: "0",
  left: "0",
}));

const styles = {
  image1: {
    display: 'block',
    width: "400px",
    height: "400px",
    animation: 'sff-background-drift-1 240s linear infinite',
    transformOrigin: "50% 50%"
  },
  image2: {
    display: 'block',
    width: "auto",
    height: "100%",
    transform: "translateX(-25%)",
    animation: "sff-background-drift-2 240s linear infinite",
  }
}

const Background = () => {
  return (
    <BackgroundBox className="sff-background">
      <Image1Box>
        <img src={MastheadImage1} alt="*" style={styles.image1} />
      </Image1Box>
      <Image2Box>
        <img src={MastheadImage2} alt="*" style={styles.image2} />
      </Image2Box>
    </BackgroundBox>
  );
};

export default Background;