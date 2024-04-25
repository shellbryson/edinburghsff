import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Customer UI
import PlacesOfInterest from './panels/PlacesOfInterest';
import UpComingEvents from './panels/UpComingEvents';
import SearchPanel from './panels/SearchPanel';
import Logo from './Logo';
import Background from './Background';
import Footer from './Footer';

export default function Home({onSearchMap}) {

  const theme = useTheme();

  // We inline these styles to avoid weird rendering refresh
  // that happens when using styled();

  const styles = {
    home: {
      display: "block",
      height: "100%",
      overflow: "auto",
      padding: "0 1rem 1rem",
      maxWidth: "calc(300px - 2rem)",
      color: theme.palette.brand.main,
    },
    masthead: {
      display: "block",
      position: "relative",
      width: "100%",
      height: "270px",
      marginBottom: "1rem",
      clipPath: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)"
    },
    splash: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      inset: "0",
    },
    splashText: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      position: "absolute",
      left: "0",
      right: "0",
      bottom: "1rem",
      textShadow: "1px 1px 1px rgba(0, 0, 0, 0.9)",
    },
  }

  return (
    <Box style={styles.home} className="sff-home">
      <Box style={styles.masthead} className="sff-masthead">
        <Background />
        <Box elevation={1} style={styles.splash}>
          <Box style={{ display: "flex", justifyContent: "center"}}>
            <Logo size={5}/>
          </Box>
        </Box>
        <Box style={styles.splashText}>
          <Typography>
            Edinburgh SFF
          </Typography>
          <Typography variant="p_tiny">
            Science Fiction & Fantasy Writing Community
          </Typography>
        </Box>
      </Box>
      <Typography component="p" variant="h_small" sx={{textAlign: "center"}}>
        Hub
      </Typography>
      <Typography component="p" sx={{marginBottom: "2rem"}}>
        Explore the map to discover places to write, events and resources.
      </Typography>
      <PlacesOfInterest />
      <UpComingEvents />
      <SearchPanel onSearchMap={onSearchMap}/>
      <Footer />
    </Box>
  );
}
