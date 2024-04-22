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
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100%",
      height: "200px",
      marginBottom: "1rem",
    },
    splash: {
      position: "absolute",
      top: "5%",
      width: "100%",
      zIndex: 2,
    },
  }

  return (
    <Box style={styles.home} className="sff-home">
      <Box style={styles.masthead} className="sff-masthead">
        <Background />
        <Box elevation={1} style={styles.splash}>
          <Box style={{ display: "flex", justifyContent: "center"}}>
            <Logo />
          </Box>
          <Typography component="p" variant="p_small" sx={{textAlign: "center"}}>
            Edinburgh SFF
          </Typography>
          <Typography component="p" variant="p_small" sx={{textAlign: "center"}}>
            The Writers Hub
          </Typography>
        </Box>
      </Box>
      <Typography component="p">
        Explore the map to discover places to write, events and resources.
      </Typography>
      <PlacesOfInterest />
      <UpComingEvents />
      <SearchPanel onSearchMap={onSearchMap}/>
      <Footer />
    </Box>
  );
}
