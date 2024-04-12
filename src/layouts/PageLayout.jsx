import React from 'react';
import { Outlet,  useLocation } from "react-router-dom";

// MUI Components
import Box from '@mui/material/Box';

const stylePage={
  display: "block",
  maxWidth: "calc(100vw - 10px)",
  overflow: "auto",
}

const PageLayout = () => {
  return (
    <Box style={stylePage}>
      <Outlet />
    </Box>
  );
};

export default PageLayout;