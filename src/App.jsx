import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";

import { Analytics } from '@vercel/analytics/react';

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
import CircularProgress from '@mui/material/CircularProgress';

// Custom Components
import Navigation from './components/Navigation';

// Layouts
import PageLayout from './layouts/PageLayout';
import AdminLayout from './layouts/AdminLayout';

// Regular Pages
const Welcome = lazy(() => import('./pages/Welcome'));
const Map = lazy(() => import('./pages/Map'));
const Links = lazy(() => import('./pages/Links'));
const Events = lazy(() => import('./pages/Events'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Signin = lazy(() => import('./pages/Signin'));

// Admin Pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminLinks = lazy(() => import('./pages/AdminLinks'));
const AdminEvents = lazy(() => import('./pages/AdminEvents'));
const AdminMap = lazy(() => import('./pages/AdminMap'));

// Assets
import './App.scss';
import Logo from './assets/logo.svg';

const logoStyle = {
  filter: "grayscale() opacity(0.3)",
}

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

  const renderLoader = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", minHeight: "300px" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ThemeProvider theme={customTheme}>

      <Navigation />

      <Box sx={{ marginTop: "4rem"}}>
        <ConfirmProvider>
          <Suspense fallback={renderLoader()}>
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
                <Route path="links/:classification" element={<Links />} />
                <Route path="links" element={<Links />} />
                <Route path="map" element={<Map />} />
                <Route path="about" element={<About />} />
                <Route path="events/:eventID/:eventTitle" element={<Events />} />
                <Route path="events" element={<Events />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </ConfirmProvider>
        <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center", margin: "4rem"}}>
          <img src={Logo} style={logoStyle} alt="Edinburgh SFF Logo" width="64" height="64" />
        </Box>
      </Box>

      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation showLabels>
          <BottomNavigationAction onClick={handleClickMap} label="Map" icon={<MapOutlinedIcon />} />
          <BottomNavigationAction onClick={handleClickEvents} label="Events" icon={<CalendarMonthOutlinedIcon />} />
          <BottomNavigationAction onClick={handleClickLinks} label="Links" icon={<AutoStoriesOutlinedIcon />} />
        </BottomNavigation>
      </Paper>

      <Analytics />

    </ThemeProvider>
  )
}

export default App;
