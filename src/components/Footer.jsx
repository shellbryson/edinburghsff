import React from 'react';
import { Link } from "react-router-dom";

// Context
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';

export default function Footer() {

  const { user } = useAuth();
  const style={
    footer: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      gap: "1rem",
      padding: "0.5rem 0"
    }
  }

  return (
    <Box style={style.footer} className="sff-footer">
      <Link to='/pages/about'>About</Link>
      {!user?.uid &&
        <Link to='/signin'>Sign in</Link>
      }
      {user?.uid && <>
        <Link to='/admin'>Admin</Link>
      </>
      }
    </Box>
  );
}
