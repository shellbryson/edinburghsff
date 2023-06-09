import React from 'react';
import { Link } from "react-router-dom";

// Helpers
import { useAuth } from '../context/AuthContext';

// Custom Components
import MastheadImage from '../assets/masthead.png';
import Masthead from '../components/Masthead.jsx';

// MUI Components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

const styles = {
  paper: {
    maxWidth: 500,
    margin: '0 auto',
    paddingTop: "3rem",
    paddingRight: "2rem",
    paddingBottom: "3rem",
    paddingLeft: "2rem",
    marginBottom: '2rem',
    backgroundColor: 'primary.main'
  },
};

export default function Welcome() {

  const { user } = useAuth();

  return (

    <>
      <Masthead />
      <Container disableGutters>


        {/* <Box sx={{ mb: "2rem" }}>
          <img src={MastheadImage} className="sff-masthead-img" alt="Edinburgh SFF banner image containing a space scene and mysterious forest" />
        </Box> */}

        <Container maxWidth="md">

          <Box sx={{ mb: "2rem", textAlign: "center" }}>
            <Typography component="h1" variant='h1'>Edinburgh SFF</Typography>
            <Typography component="p" variant='h2'>The Science Fiction &amp; Fantasy Writing community</Typography>
            <Typography component="p">New writers, critique and events.</Typography>
          </Box>

          <Box sx={{ mb: "2rem", textAlign: "center" }}>
            <Typography component="p">For the latest information and events, find us on Mastodon <a rel="me" href="https://writing.exchange/@EdinburghSFF">@EdinburghSFF@writing.exchange</a>, Twitter <a href="https://twitter.com/edinburghsff">@edinburghsff</a> or drop into our <a href="https://discord.gg/5EaXDTwrEY">Discord</a> for a chat.</Typography>
          </Box>

          <Paper elevation={3} style={styles.paper}>
            <Typography component="p" variant='h2'>Join our community</Typography>
            <Typography component="p">A friendly community for writers of all levels, whether just starting out or published.</Typography>
            <Typography component="p"><a href="https://discord.gg/fBYCKjz8dz">Discord</a></Typography>
            <Typography component="p"><a rel="me" href="https://writing.exchange/@EdinburghSFF">Mastodon</a></Typography>
          </Paper>

        </Container>

      </Container>

    </>

  )
}
