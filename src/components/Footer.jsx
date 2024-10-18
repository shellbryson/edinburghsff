import React from 'react';
import { Link } from "react-router-dom";

// Context
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Logo from './Logo';

export default function Footer() {
  const theme = useTheme();
  const { user, userDocuments, logout } = useAuth();
  const style={
    footer: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      gap: "1rem",
      padding: "0.5rem 0"
    }
  }

  const handleLogout = async () => {
    try {
      await logout();
      console.log('You are logged out')
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <>
      <Box style={style.footer} className="sff-footer">
        <Link to='/pages/about'>About</Link>
        <Link to='/pages/faq'>FAQ</Link>
        {!user?.uid &&
          <>
            <Link to='/join'>Join</Link>
            <Link to='/signin'>Login</Link>
          </>
        }
        {user?.uid && userDocuments.role !== "admin" && <>
          <Link to='/' onClick={handleLogout}>Logout</Link>
        </>
        }
        {user?.uid && userDocuments.role === "admin" && <>
          <Link to='/dashboard'>Dashboard</Link>
        </>
        }
      </Box>
      <Box style={{ textAlign: "center", marginTop: "1rem" }}>
        <Logo />
      </Box>
    </>
  );
}
