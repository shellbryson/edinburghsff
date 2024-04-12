import React from 'react';
import { Link } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';

// Context
import { useAuth } from '../context/AuthContext';

export default function Navigation() {

  const stylePanel={
    backgroundColor: "rgb(0, 0, 0)",
    height: "100%",
  }

  const { user } = useAuth();

  return (
    <Box style={ stylePanel }>
      <Link to='/'>Home</Link>
      <Link to='/events'>Events</Link>
      <Link to='/links'>Links</Link>
      <Link to='/pages'>Pages</Link>
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
