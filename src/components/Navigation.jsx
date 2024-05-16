import React from 'react';
import { Link } from "react-router-dom";

// MUI
import Box from '@mui/material/Box';

// Icons
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DateRangeIcon from '@mui/icons-material/DateRange';

export default function Navigation() {

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

  return (
    <Box style={style.navigation} className="sff-navigation">
      <Link to='/events' style={style.link}><DateRangeIcon /> <div>Events</div></Link>
      <Link to='/pages/writing' style={style.link}><HistoryEduIcon /> <div>Writing</div></Link>
    </Box>
  );
}
