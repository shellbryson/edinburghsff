import React from 'react';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Customer UI
import PlacesOfInterest from './panels/PlacesOfInterest';
import UpComingEvents from './panels/UpComingEvents';
import SearchPanel from './panels/SearchPanel';
import Logo from './Logo';
import Background from './Background';
import Footer from './Footer';

export default function Home({onSearchMap}) {

  const theme = useTheme();

  const HomeBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    height: "100%",
    overflow: "auto",
    padding: "0 1rem 1rem",
    maxWidth: "calc(300px - 2rem)",
    color: theme.palette.brand.main,
  }));

  const MastheadBox = styled(Box)(({ theme }) => ({
    display: "block",
    position: "relative",
    width: "100%",
    height: "240px",
    minHeight: "240px",
    marginBottom: "1rem",
    clipPath: "polygon(5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%, 0% 5%)"
  }));

  const SplashBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    inset: "0",
    zIndex: 2,
  }));

  const HeadingBox = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "2rem",
    left: "0",
    right: "0",
    zIndex: 3,
  }));

  return (
    <HomeBox className="sff-home">
      <MastheadBox className="sff-masthead">
        <Background />
        <SplashBox elevation={1}>
          <Box style={{ display: "flex", justifyContent: "center"}}>
            <Logo size={5}/>
          </Box>
        </SplashBox>
        <HeadingBox>
          <Typography component="h1">
            Edinburgh SFF
          </Typography>
          <Typography component="p">
            Writing Community
          </Typography>
        </HeadingBox>
      </MastheadBox>
      <Typography component="p" variant="h_small" sx={{textAlign: "center"}}>
        Hub
      </Typography>
      <Typography component="p">
        Explore the map to discover places to write, events and resources.
      </Typography>
      <PlacesOfInterest />
      <UpComingEvents />
      <SearchPanel onSearchMap={onSearchMap}/>
      <Footer />
    </HomeBox>
  );
}
