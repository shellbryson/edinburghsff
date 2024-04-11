import React from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

// Custom UI
import MainPanelContent from './MainPanelContent';
import Logo from './Logo';

export default function MainPanel() {

  // Theme
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.up('sm'));
  const position = mobile ? "absolute" : "relative";

  const stylePanel={
    display: "flex",
    flexDirection: "column",
    position: position,
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    left: "0.5rem",
    top: "0.5rem",
    bottom: "0.5rem",
    backgroundColor: "rgb(0, 0, 0)",
    minWidth: "300px",
    overflow: "hidden",
    zIndex: 10000,
  }

  return (
    <Box style={stylePanel}>
      <Typography><Logo /></Typography>

      <MainPanelContent />
    </Box>
  );
}
