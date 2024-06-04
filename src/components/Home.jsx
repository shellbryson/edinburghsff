import React from 'react';
import ReactMarkdown from 'react-markdown';

// Context
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

// Customer UI
import InterestPanel from './panels/InterestPanel';
import EventsPanel from './panels/EventsPanel';
import SearchPanel from './panels/SearchPanel';
import Logo from './Logo';
import Background from './Background';
import Footer from './Footer';
import LinkInterceptor from './LinkInterceptor';
import Kofi from './Kofi';
import Discord from './Discord';
import Navigation from './Navigation';

export default function Home({hideSidebar}) {

  const { config } = useApp();
  const theme = useTheme();

  const ContentBox = styled(Box)(({ theme }) => ({
    color: theme.palette.brand.main,
    textAlign: "center",
    margin: "2rem 0",
    '& p + p' :{
      padding: "0",
    }
  }));

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
      height: "180px",
      marginTop: "1rem",
      marginBottom: "1rem",
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
      bottom: "1.5rem",
      textShadow: "1px 1px 1px rgba(0, 0, 0, 0.9)",
    },
  }

  return (
    <Box style={styles.home} className="sff-home scroll">
      <Navigation />
      <Box style={styles.masthead} className="sff-masthead">
        <Background />
        <Box elevation={1} style={styles.splash}>
          <Box style={{ display: "flex", justifyContent: "center"}}>
            <Logo size={5}/>
          </Box>
        </Box>
      </Box>
      <ContentBox>
        <LinkInterceptor>
          <ReactMarkdown children={config.textPanelIntro} />
        </LinkInterceptor>
      </ContentBox>
      <EventsPanel />
      <Discord />
      <InterestPanel hideSidebar={hideSidebar} />
      <SearchPanel />
      <Kofi />
      <Footer />
    </Box>
  );
}
