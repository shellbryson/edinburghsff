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

const ContentBox = styled(Box)(({ theme }) => ({
  color: theme.palette.brand.main,
  textAlign: "center",
  margin: "2rem 0",
  '& p + p' :{
    padding: "0",
  }
}));

const MastheadBox = styled(Box)(({ theme }) => ({
  display: "block",
  position: "relative",
  width: "100%",
  height: "180px",
  marginTop: "1rem",
  marginBottom: "1rem",
}));

const SplashBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  inset: "0",
}));

export default function Home({hideSidebar}) {

  const { config } = useApp();
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
  }

  return (
    <Box style={styles.home} className="sff-home scroll">
      <Navigation />
      <MastheadBox className="sff-masthead">
        <Background />
        <SplashBox elevation={1}>
          <Box style={{ display: "flex", justifyContent: "center"}}>
            <Logo size={5}/>
          </Box>
        </SplashBox>
      </MastheadBox>
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
