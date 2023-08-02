import React from 'react';
import { Link } from "react-router-dom";

// Custom Components
import Background from '../components/Background.jsx';

// MUI Components
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Logo from '../assets/logo.svg';

export default function Welcome() {

  // Theme
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  // Breakpoint adjustments
  const contentSpacing = mobile ? "5%" : "10%";

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      width: "100vw",
      height: "100vh",
      maxHeight: "1400px",
      maxWidth: "100%",
    },
    logo: {
      position: "relative",
      width: "4rem",
      height: "auto"
    },
    splash: {
      position: "absolute",
      top: contentSpacing,
      left: contentSpacing,
      maxWidth: 500,
      zIndex: 2,
    },
    sections: {
      position: "relative",
      marginTop: "1rem",
      marginRight: "1rem",
      paddingTop: "2rem",
      paddingRight: "1rem",
      paddingBottom: "2rem",
      paddingLeft: "1rem",
      backgroundColor: 'primary.main',
      zIndex: 2,
    },
    section: {
      marginBottom: "2rem",
      borderBottom: "1px solid rgba(0,0,0,0.1)",
      paddingBottom: "2rem",
    },
    titleText: {
      fontSize: "clamp(1rem, 10vw, 4rem)",
      lineHeight: "clamp(1rem, 10vw, 4rem)",
    },
    subtitleText: {
      marginTop: "1rem",
      marginRight: "1rem",
      fontSize: "clamp(0.75rem, 5vw, 1.5rem)",
      lineHeight: "clamp(0.9rem, 10vw, 2rem)",
    }
  };

  return (
    <>
      <Container style={styles.container} disableGutters>
        <Background />
        <Box elevation={1} style={styles.splash}>
          <Typography component="h1" color="white" style={styles.titleText}>Edinburgh</Typography>
          <Typography component="h1" color="white" style={styles.titleText}>SFF</Typography>
          <Typography component="p" variant='h2' color="white" style={styles.subtitleText}>The Science Fiction &amp; Fantasy Writing community</Typography>

          <img style={styles.logo} src={Logo} alt="Edinburgh SFF Logo" />

          <Paper elevation={1} style={styles.sections}>
            <Box style={ styles.section }>
              <Stack spacing={2}>
                <Typography component="h2" variant='h2'>Community</Typography>
                <Typography component="p">An established and growing community of Science Fiction and Fantasy writers, packed full of resource, writing chat and day to day help. A friendly community for writers of all levels, whether just starting out or published.</Typography>
                <Link to='/pages/discord'>Learn more about our Discord</Link>
                <Box sx={{ display: 'flex', paddingTop: '1rem'}}>
                  <Button href="https://discord.gg/fBYCKjz8dz" size='large' variant='outlined'>Visit Discord</Button>
                </Box>
              </Stack>
            </Box>
            <Box style={ styles.section }>
              <Stack spacing={2}>
                <Typography component="h2" variant='h2'>Events</Typography>
                <Typography component="p">Events for writers and readers, check out <Link to='/events'>Events page</Link>.</Typography>
              </Stack>
            </Box>
            <Box style={ styles.section }>
              <Stack spacing={2}>
                <Typography component="h2" variant='h2'>Writing</Typography>
                <Typography component="p">Resources and helpful  <Link to='/links'>links for writers</Link></Typography>
              </Stack>
            </Box>
            <Box style={ styles.section }>
              <Typography component="h2" variant='h2'>Find us</Typography>
              <Typography component="p">Chat on <a href="https://discord.gg/5EaXDTwrEY">Discord</a></Typography>
              <Typography component="p">BlueSky - <a href="https://bsky.app/profile/EdinburghSFF.bsky.social"> @edinburghsff.bsky.social</a></Typography>
              <Typography component="p">Mastondon - <a rel="me" href="https://writing.exchange/@EdinburghSFF"> @EdinburghSFF@writing.exchange</a></Typography>
              <Typography component="p">Twitter/X - <a href="https://twitter.com/edinburghsff">@edinburghsff</a></Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </>
  )
}
