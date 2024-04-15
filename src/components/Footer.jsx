import React from 'react';
import { Link } from "react-router-dom";

// Context
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';

// Resources
import 'css.gg/icons/scss/chevron-left.scss'

export default function Footer() {

  const { isExploded } = useApp();
  const { user } = useAuth();

  const styleFooter={
    display: "flex",
    position: "relative",
    justifyContent: "center",
    gap: "1rem",
    padding: "0.5rem 0"
  }

  return (
    <Box style={styleFooter} className="sff-footer">
      <Link to='/about'>About</Link>
      {!user &&
        <Link to='/signin'>Sign in</Link>
      }
      {user && <>
        <Link to='/admin'>Admin</Link>
        <Link to='/signout'>Sign out</Link>
      </>
      }
    </Box>
  );
}