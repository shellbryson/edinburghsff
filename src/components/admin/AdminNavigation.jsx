import React from 'react';
import { Link } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';

export default function AdminNavigation() {

  const styleNavigation={
    display: "flex",
    position: "relative",
    justifyContent: "center",
    gap: "1rem",
    padding: "0.5rem 0",
  }

  return (
    <Box style={styleNavigation} className="sff-admin-navigation">
      <Link to='/admin'>Dashboard</Link>
      <Link to='/admin/events'>Events</Link>
      <Link to='/admin/locations'>Locations</Link>
      <Link to='/admin/links'>Links</Link>
      <Link to='/admin/pages'>Pages</Link>
    </Box>
  );
}
