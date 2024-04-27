import React from 'react';
import { Outlet } from "react-router-dom";

// MUI Components
import Box from '@mui/material/Box';

const PageLayout = () => {

  const stylePage={
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    height: "100%"
  }

  return (
    <Box style={stylePage} className="sff-page-layout">
      <Outlet />
    </Box>
  );
};

export default PageLayout;