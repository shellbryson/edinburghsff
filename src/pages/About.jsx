import React from 'react';

// MUI Components
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

// Custom Components
import PageHeading from '../components/PageHeading';

// Extras
import packageJson from '../../package.json';

// Assets
import Badger from '../assets/Badger.png';

const styleBadgerBox = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '2rem',
}

const styleBadger = {
  display: 'block',
  width: '100%',
  maxWidth: '400px',
  height: 'auto'
}

const boxStyle={
  marginBottom: '2rem',
}

export default function About() {

  const currentYear = new Date().getFullYear();

  return (
    <>
      <Container>
        <PageHeading heading="About" />
        <Box sx={boxStyle}>
          <Typography variant="p" component="p" gutterBottom align='center'>
            Edinburgh SFF is an open group of writers of science fiction and fantasy. There are no membership fees or requirements, and everyone is welcome, whatever stage your writing is at.
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="p" component="p" gutterBottom align='center'>
            This site contains resources for SFF writers, primarily in Edinburgh, Scotland. We're a small group of writers, with an active Discord server where we share resources and chat about writing. We have regular meetups, and we're always looking for new members.
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="p" component="p" gutterBottom align='center'>
            If you'd like to contribute, please get in touch via Twitter <a href="https://twitter.com/edinburghsff">@edinburghsff</a> or <a href="https://discord.gg/5EaXDTwrEY">Discord</a>.
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography variant="p" component="p" gutterBottom align='center'>
            This web app was hand-crafted in ReactJS, FireBase and Material UI.
          </Typography>
        </Box>
        <Box sx={boxStyle}>
          <Typography component="p" align='center'>Copyright &copy; ESFF { currentYear }</Typography>
          <Typography component="p" align='center'>Version { packageJson.version }</Typography>
        </Box>
        <Box sx={styleBadgerBox}>
          <img src={Badger} alt="Edinburgh SFF mascot, a badger" style={styleBadger} />
        </Box>
      </Container>
    </>
  )
}
