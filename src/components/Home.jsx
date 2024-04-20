import React from 'react';

// MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

// Customer UI
import PlacesOfInterest from './panels/PlacesOfInterest';
import UpComingEvents from './panels/UpComingEvents';

// Resources
import 'css.gg/icons/scss/chevron-left.scss'

export default function Home() {

  const theme = useTheme();

  const styleWelcome={
    display: "block",
    height: "100%",
    overflow: "auto",
    padding: "1rem",
    maxWidth: "calc(300px - 2rem)",
    color: theme.palette.brand.main,
  }

  return (
    <Box style={styleWelcome} className="sff-welcome">
      <Typography component="p">
        Edinburgh SFF
      </Typography>
      <Typography component="p">
        Hub
      </Typography>
      <Typography component="p">
        Edinburgh SFF is a vibrant community of Science Fiction and Fantasy writers in Scotland.
      </Typography>
      <PlacesOfInterest />
      <UpComingEvents />
    </Box>
  );
}
