import React, { useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Custom UI
import MainPanelContent from './MainPanelContent';
import Logo from './Logo';

// Icons
import 'css.gg/icons/scss/chevron-left.scss'
import 'css.gg/icons/scss/chevron-right.scss'
import 'css.gg/icons/scss/menu.scss'

export default function MainPanel() {

  const [isExploded, setIsExploded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Theme
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));

  const stylePanel={
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    left: "0",
    top: "0",
    bottom: "0",
    backgroundColor: "rgb(0, 0, 0)",
    zIndex: 10000,
  }

  const stylePanelInterior={
    transition: "width 200ms",
    width: isExpanded ? "300px" : "10px",
    overflow: "hidden"
  }

  const stylePanelInteriorContent={
    display: isExpanded ? "block" : "none",
    width: "300px",
  }

  const styleExpander={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "1rem",
    right: isExpanded ? "-2rem" : "-3rem",
    width: isExpanded ? "2rem" : "3rem",
    height: "3rem",
    backgroundColor: "rgb(0, 0, 0)",
    color: "rgb(255, 255, 255)",
  }

  const handleExpanderClick = () => {
    setIsExpanded(!isExpanded);
  }

  const handlePageOpen = () => {
    setIsExploded(true);
  }

  const handlePageClose = () => {
    setIsExploded(false);
  }

  return (
    <Box style={stylePanel}>
      <Box style={styleExpander} onClick={() => handleExpanderClick()}>
        {isExpanded ?
          <i className="gg-chevron-left"></i>
        :
          <>
            <i className="gg-menu"></i>
            <i className="gg-chevron-right"></i>
          </>
        }
      </Box>
      <Box style={stylePanelInterior}>
        <Box style={stylePanelInteriorContent}>
          <Logo />
          <Typography variant="p" color="primary">
            Edinburgh SFF
          </Typography>
          <Typography variant="p" color="primary">
            The writing community
          </Typography>
          <MainPanelContent />
        </Box>
      </Box>
    </Box>
  );
}
