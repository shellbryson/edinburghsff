import React from 'react';
import { Link } from "react-router-dom";
import packageJson from '../../package.json';

// Context
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Logo from './Logo';

export default function Footer() {
  const theme = useTheme();

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
    <>
      <Box style={style.footer} className="sff-footer">
        <Link to='/pages/about'>About</Link>
        {!user?.uid &&
          <Link to='/signin'>Sign in</Link>
        }
        {user?.uid && <>
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
