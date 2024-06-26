import React, { useMemo, useEffect, useState } from 'react';

// Contexts
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';

// Custom UI
import Home from './Home';

const Mask = styled(Box)(({ theme }) => ({
  display: "block",
  position: "absolute",
  inset: "0",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  zIndex: "999",
  backdropFilter: "blur(3px)",
  cursor: "crosshair"
}));

const showBackdropBreakpoint = 600;

export default function MapPanel() {

  const theme = useTheme();
  const {
    isExpanded,
    setIsExpanded
  } = useApp();

  const [showMask, setShowMask] = useState(false);

  const styles = useMemo(() => ({
    panel: {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      left: "0",
      top: "0",
      height: "100dvh",
      backgroundColor: "rgb(0, 0, 0)",
      zIndex: 1000,
      borderRight: `1px solid ${theme.palette.brand.main}`
    },
    interior: {
      transition: "width 200ms, max-width 200ms",
      minWidth: "10px",
      maxWidth: "700px",
      width: isExpanded ? "300px" : "10px",
      overflow: "hidden",
      height: "100vh",
    },
    content: {
      display: isExpanded ? "flex" : "none",
      flexDirection: "column",
      transition: "width 200ms",
      width: "300px",
      height: "100%",
      overflow: "hidden"
    },
    expander: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "14px",
      right: isExpanded ? "calc(-2rem - 1px)" : "calc(-3rem - 1px)",
      width: isExpanded ? "2rem" : "3rem",
      height: "3rem",
      backgroundColor: "rgb(0, 0, 0)",
      color: "rgb(255, 255, 255)",
      cursor: "pointer",
      borderTop: `1px solid ${theme.palette.brand.main}`,
      borderRight: `1px solid ${theme.palette.brand.main}`,
      borderBottom: `1px solid ${theme.palette.brand.main}`
    }
  }), [theme, isExpanded]);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [isExpanded]);

  const handleResize = () => {
    if (isExpanded) {
      if (window.innerWidth < showBackdropBreakpoint) {
        setShowMask(true);
      } else {
        setShowMask(false);
      }
    } else {
      setShowMask(false);
    }
  }

  const handleExpanderClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
      setShowMask(false);
    } else {
      setIsExpanded(true);
      if (window.innerWidth < showBackdropBreakpoint) {
        setShowMask(true);
      } else {
        setShowMask(false);
      }
    }
  }

  const hideSidebar = () => {
    setIsExpanded(false);
    setShowMask(false);
  }

  const handleMaskClick = () => {
    setShowMask(false);
    setIsExpanded(false);
  }

  return (
    <>
      { showMask && <Mask className="sff-map__mask" onClick={() => handleMaskClick()} /> }
      <Box style={styles.panel} className="sff-panel">
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
        <Box style={styles.interior} className="sff-panel__interior">
          <Box style={styles.content} className="sff-panel__content">
            <Home hideSidebar={hideSidebar} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
