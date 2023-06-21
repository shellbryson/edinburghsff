import React from 'react';
import { Link } from "react-router-dom";

// Helpers
import { useAuth } from '../context/AuthContext';

// Custom Components
import Masthead from '../components/Masthead.jsx';

// MUI Components
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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

const styleCommunity = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
}

export default function Welcome() {

  const { user } = useAuth();

  return (

    <>
      <Masthead />
      <Container disableGutters>

        <Container maxWidth="md">

          <Box sx={{ mb: "2rem", textAlign: "center" }}>
            <Typography component="h1" variant='h1'>Edinburgh SFF</Typography>
            <Typography component="p" variant='h2'>The Science Fiction &amp; Fantasy Writing community</Typography>
            <Typography component="p">New writers, critique and events.</Typography>
          </Box>

          <Box sx={{ mb: "2rem", textAlign: "center" }}>
            <Typography component="p">For the latest information and events, find us on Mastodon <a rel="me" href="https://writing.exchange/@EdinburghSFF">@EdinburghSFF@writing.exchange</a>, Twitter <a href="https://twitter.com/edinburghsff">@edinburghsff</a> or drop into our <a href="https://discord.gg/5EaXDTwrEY">Discord</a> for a chat.</Typography>
          </Box>

          <Paper elevation={1} style={styles.paper}>
            <Box style={ styleCommunity }>
              <Stack spacing={2}>
                <Typography component="p" variant='h2'>Join our community</Typography>
                <Typography component="p">A friendly community for writers of all levels, whether just starting out or published.</Typography>
                <Typography component="p"><Link to='/pages/edinburgh-sff-discord'>Learn more about our Discord</Link></Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem', textAlign: "center"}}>
                  <Button href="https://discord.gg/fBYCKjz8dz" size='large' variant='outlined'>Discord</Button>
                </Box>
              </Stack>
            </Box>
          </Paper>

        </Container>

      </Container>

    </>

  )
}
