import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';

// Context
import { useAuth } from '../context/AuthContext';

// Resources
import 'css.gg/icons/scss/chevron-left.scss'

export default function Navigation({isExploded}) {

  const styleNavigation={
    display: "flex",
    position: "relative",
    justifyContent: "center",
    gap: "1rem"
  }

  const styleIcon={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "0.5rem",
    left: "0.5rem",
    color: "rgb(255, 255, 255)",
    zIndex: 10000,
  }

  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate("/");
  }

  return (
    <>
      {isExploded &&
        <Box style={styleIcon} onClick={() => handleClickBack()}>
          <i className="gg-chevron-left"></i>
        </Box>
      }
      <Box style={styleNavigation} className="sff-navigation">
        {/* <Link to='/'>Home</Link> */}
        <Link to='/events'>Events</Link>
        <Link to='/links'>Resources</Link>
        {/* <Link to='/pages'>Pages</Link>
        <Link to='/about'>About</Link>
        {!user &&
        <Link to='/signin'>Sign in</Link>
        }
        {user && <>
          <Link to='/admin'>Admin</Link>
          <Link to='/signout'>Sign out</Link>
        </>
        } */}
      </Box>
    </>
  );
}
