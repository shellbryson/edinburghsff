import React, { useState, useEffect } from 'react';
import { Outlet,  useLocation } from "react-router-dom";

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Custom UI
import PageLayout from '../layouts/PageLayout';
import Navigation from './Navigation';
import Footer from './Footer';
import Welcome from './Welcome';

// Icons
import 'css.gg/icons/scss/chevron-left.scss'
import 'css.gg/icons/scss/chevron-right.scss'
import 'css.gg/icons/scss/menu.scss'

export default function MainPanel() {

  const location = useLocation();
  const {
    isExploded,
    setIsExploded,
    isExpanded,
    setIsExpanded
  } = useApp();

  useEffect(() => {
    location.pathname === '/' ? setIsExploded(false) : setIsExploded(true);
  }, [location]);

  // Theme
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));

  const stylePanel={
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    left: "0",
    top: "0",
    bottom: "0",
    backgroundColor: "rgb(0, 0, 0)",
    zIndex: 1000,
  }

  const stylePanelInterior={
    transition: "width 200ms, max-width 200ms",
    minWidth: "10px",
    width: isExploded ? "100vw" : (isExpanded ? "300px" : "10px"),
    overflow: "hidden",
    height: "100vh",
  }

  const stylePanelContent={
    display: isExpanded ? "flex" : "none",
    flexDirection: "column",
    transition: "width 200ms",
    width: isExploded ? "100vw" : "300px",
    height: "100%",
  }

  const styleExpander={
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

  const handleExpanderClick = () => {
    setIsExpanded(!isExpanded);
  }

  return (
    <Box style={stylePanel} className="sff-panel">
      <Box style={styleExpander} onClick={() => handleExpanderClick()}  className="sff-panel__expander">
        {isExpanded ?
          <i className="gg-chevron-left"></i>
        :
          <>
            <i className="gg-menu"></i>
            <i className="gg-chevron-right"></i>
          </>
        }
      </Box>
      <Box style={stylePanelInterior} className="sff-panel__interior">
        <Box style={stylePanelContent} className="sff-panel__content">
          <Navigation />
          <PageLayout />
          {!isExploded && <Welcome />}
          <Footer />
        </Box>
      </Box>
    </Box>
  );
}
