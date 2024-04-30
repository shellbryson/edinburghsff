import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";

// Context
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

// MUI
import Box from '@mui/material/Box';

// Icons
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function Navigation() {

  const { isExploded } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  const style = {
    navigation: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      padding: "0.5rem 0"
    },
    link: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      gap: "0.5rem",
    },
    icon: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      top: "0.5rem",
      left: "0.5rem",
      color: "rgb(255, 255, 255)",
      zIndex: 10000,
    }
  }

  const handleClickBack = () => {
    navigate("/");
  }

  useEffect(() => {
    location.pathname.includes("/admin") ? setIsAdmin(true) : setIsAdmin(false);
  }, [location]);

  return (
    <>
      {isExploded &&
        <Box style={style.icon} onClick={() => handleClickBack()}>
          <ChevronLeftIcon />
        </Box>
      }
      {isAdmin && <Box style={style.navigation} className="sff-navigation">
        <Link to='/admin'>Dashboard</Link>
        <Link to='/admin/settings'>Settings</Link>
        <Link to='/admin/locations'>Locations</Link>
        <Link to='/admin/events'>Events</Link>
        <Link to='/admin/pages'>Pages</Link>
      </Box>}
      {!isAdmin && <>
      <Box style={style.navigation} className="sff-navigation">
        <Link to='/events' style={style.link}><DateRangeIcon /> <div>Events</div></Link>
        <Link to='/pages/writing' style={style.link}><HistoryEduIcon /> <div>Writing</div></Link>
      </Box>
      </>}
    </>
  );
}
