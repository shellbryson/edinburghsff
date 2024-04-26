import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

// Contexts
import { useApp } from '../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';

// Custom UI
import PageLayout from '../layouts/PageLayout';
import Navigation from './Navigation';
import Home from './Home';

export default function MapPanel() {

  const location = useLocation();
  const {
    isExploded,
    setIsExploded,
    isExpanded,
    setIsExpanded
  } = useApp();

  useEffect(() => {
    location.pathname === '/' || location.pathname.includes("/places") ? setIsExploded(false) : setIsExploded(true);
  }, [location]);

  const styles = {
    panel: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      transition: "clip-path 200ms",
      left: "0",
      top: "0",
      bottom: "0",
      backgroundColor: "rgb(0, 0, 0)",
      zIndex: 1000,
      clipPath: isExploded ? "polygon(0% 0%, 97% 0%, 100% 3%, 100% 100%, 100% 100%, 0% 100%)" : "none"
    },
    interior: {
      transition: "width 200ms, max-width 200ms",
      minWidth: "10px",
      maxWidth: "700px",
      width: isExploded ? "calc(100vw - 1rem)" : (isExpanded ? "300px" : "10px"),
      overflow: "hidden",
      height: "100vh",
    },
    content: {
      display: isExpanded ? "flex" : "none",
      flexDirection: "column",
      transition: "width 200ms",
      width: isExploded ? "100%" : "300px",
      height: "100%",
      overflow: "hidden"
    },
    expander: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "1rem",
      right: isExpanded ? "calc(-2rem + 1px)" : "calc(-3rem + 1px)",
      width: isExpanded ? "2rem" : "3rem",
      height: "3rem",
      backgroundColor: "rgb(0, 0, 0)",
      color: "rgb(255, 255, 255)",
      cursor: "pointer",
      clipPath: "polygon(0% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 0% 100%)"
    }
  }

  const handleExpanderClick = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <Box style={styles.panel} className="sff-panel">
      {!isExploded &&
        <Box style={styles.expander} onClick={() => handleExpanderClick()}  className="sff-panel__expander">
          {isExpanded ?
            <ChevronLeftIcon />
          :
            <>
              <MenuIcon />
              <ChevronRightIcon />
            </>
          }
        </Box>
      }
      <Box style={styles.interior} className="sff-panel__interior">
        <Box style={styles.content} className="sff-panel__content">
          <Navigation />
          { isExploded ? <PageLayout /> : <Home /> }
        </Box>
      </Box>
    </Box>
  );
}
