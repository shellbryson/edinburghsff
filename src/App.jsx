import React from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './theme/theme';

import { ConfirmProvider } from "material-ui-confirm";

// MUI Components
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

// Layouts
import PageLayout from './layouts/PageLayout';
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
import Welcome from './pages/Welcome';
import Map from './pages/Map';
import Links from './pages/Links';
import Events from './pages/Events';
import NotFound from './pages/NotFound';
import Signin from './pages/Signin';

// Admin Pages
import Dashboard from './pages/Dashboard';
import AdminLinks from './pages/AdminLinks';
import AdminEvents from './pages/AdminEvents';
import AdminMap from './pages/AdminMap';

// Assets
import './App.scss';
import Logo from './assets/logo.svg';

function App() {

  const navigate = useNavigate();

  const handleClickMap = () => {
    navigate("/map");
  }

  const handleClickEvents = () => {
    navigate("/events");
  }

  const handleClickLinks = () => {
    navigate("/links");
  }

  return (
    <ThemeProvider theme={customTheme}>

      <ConfirmProvider>
        <Routes>
          <Route path="/dashboard" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path='links' element={<AdminLinks />} />
            <Route path='events' element={<AdminEvents />} />
            <Route path='map' element={<AdminMap />} />
          </Route>

          <Route path="/" element={<PageLayout />}>
            <Route index element={<Welcome />} />
            <Route path="signin" element={<Signin />} />
            <Route path="links" element={<Links />} />
            <Route path="map" element={<Map />} />
            <Route path="events/:eventID/:eventTitle" element={<Events />} />
            <Route path="events" element={<Events />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ConfirmProvider>

      <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", margin: "4rem"}}>
        <img src={Logo} alt="Edinburgh SFF Logo" width="50" height="50" />
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction onClick={handleClickMap} label="Map" icon={<MapOutlinedIcon />} />
          <BottomNavigationAction onClick={handleClickEvents} label="Events" icon={<CalendarMonthOutlinedIcon />} />
          <BottomNavigationAction onClick={handleClickLinks} label="Links" icon={<AutoStoriesOutlinedIcon />} />
        </BottomNavigation>
      </Paper>

    </ThemeProvider>
  )
}

export default App;
