import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { useHead } from 'hoofd';

// Contexts
import { useApp } from '../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Custom UI
import EventsDetailsImage from '../components/EventsDetailsImage';
import LinkInterceptor from '../components/LinkInterceptor';
import DateBox from '../components/DateBox';
import StyledContent from '../components/StyledContent';

// Icons
import PlaceIcon from '@mui/icons-material/Place';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

// Helpers
import {
  fetchDocument,
  imageURL
} from '../utils/utils';
import Spinner from '../components/Spinner';

const EventDetails = ({ handleClose }) => {

  const [currentEvent, setCurrentEvent] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    setFocusMapPin,
    setMapLocations,
    mapLocations
  } = useApp();

  const MastheadImageBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: "1rem",
    marginBottom: "2rem",
    "& img": {
      width: "3rem",
      height: "auto"
    }
  }));

  const FooterImageBox = styled(Box)(({ theme }) => ({
    width: '100%',
    height: "400px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: currentEvent?.image ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.8) 100%), url(${imageURL(currentEvent?.image, 'large')})` : "none",
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center',
    backgroundSize: 'cover, cover',
    marginTop: "2rem",
  }));

  const Meta = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "0.25rem 0.5rem",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
    '& p' : {
      margin: 0,
      padding: 0
    }
  }));

  const Summary = styled(Box)(({ theme }) => ({
    position: "relative",
    backgroundColor: theme.palette.highlight.main,
    padding: fullScreen ? "1rem" : "1rem 1rem",
    margin: fullScreen ? "2rem 0" : "2rem 0 2rem 0",
    fontFamily: '"Chakra Petch", sans-serif',
    color: theme.palette.brand.main,
    textTransform: "uppercase",
    "& p" : {
      margin: 0,
      padding: 0,
      lineHeight: "1",
      fontSize: "1.8rem",
      maxWidth: "20ch",
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      top: "0",
      left: "0",
      opacity: "1",
      animation: 'sff-pulse 1s linear infinite',
    },
    '&::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      bottom: "0",
      right: "0",
      opacity: "1",
      animation: 'sff-pulse 1s linear infinite',
    },
  }));

  const Description = styled(Box)(({ theme }) => ({}));
  const Section = styled(Box)(({ theme }) => ({
    marginTop: "2rem",
  }));

  const SectionHeading = styled(Typography)(({ theme }) => ({
    display: "inline-block",
    color: theme.palette.brand.main
  }));

  const ActionsBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    margin: "2rem 0",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: theme.palette.highlight.main,
  }));

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    content: {
      textAlign: "left",
      minHeight: "calc(100vh -2rem)",
      padding: "0.5rem 1rem 0.5rem 0.5rem",
      overflow: "auto",
    },
    title: {
      textAlign: "center"
    }
  }

  useEffect(() => {
    if (params.eventID) {
      setIsLoading(true);
      fetchDocument("events", params.eventID, (eventData) => {
        setCurrentEvent(eventData);
        setIsLoading(false);
      });
    }
  }, [params.eventID]);

  useHead({
    title: `${currentEvent.title} - Edinburgh SFF`,
    language: 'en',
    metas: [{ name: 'description', content: currentEvent?.summary?.substring(0, 100) || currentEvent?.description?.substring(0, 100) || ""}],
  });

  const handleView = () => {
    window.open(currentEvent.url, '_blank');
  };

  const handleViewOnMap = () => {
    const locations = mapLocations.map(location => {
      if (location.id === currentEvent.eventPin) {
        location.focus = !location.focus;
        location.showLabel = !location.showLabel;
      } else {
        location.focus = false;
        location.showLabel = false;
      }
      return location;
    });
    setMapLocations(locations);
    setFocusMapPin(currentEvent.eventPin);
    handleClose();
  }

  const renderSummary = () => {
    if (!currentEvent.summary) return null;
    return (
      <Summary>
        <LinkInterceptor>
          <Typography>{currentEvent.summary}</Typography>
        </LinkInterceptor>
      </Summary>
    );
  }

  const renderDescription = () => {
    if (!currentEvent.description) return null;
    return (
      <Description>
        <LinkInterceptor>
          <ReactMarkdown children={currentEvent.description} />
        </LinkInterceptor>
      </Description>
    );
  }

  const renderSection = (section, title) => {
    if (!currentEvent[section]) return null;
    return (
      <Section className="sff-event-details__section">
        <SectionHeading component="h2" variant="h_medium">{title}</SectionHeading>
        <LinkInterceptor>
          <ReactMarkdown children={currentEvent[section]} />
        </LinkInterceptor>
      </Section>
    );
  }

  return (
    <Box style={style.page} className="sff-page">
      { isLoading && <Spinner />}
      { !isLoading && <>
      <StyledContent>
        <Box style={style.content}>
          { currentEvent?.image && (
            <MastheadImageBox className="sff-event-masthead">
              <img src={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} style={{ width: "4rem", height: "auto" }}/>
            </MastheadImageBox>
          )}
          <Typography component="h1" variant="h_large" style={{textAlign: "center", marginBottom: "0", paddingBottom: "1rem" }}>
            {currentEvent.title}
          </Typography>
          <Meta>
            <DateBox event={currentEvent} />
          </Meta>
          <Box style={style.description} className="sff-event-description">
            { renderSummary() }
            { renderDescription() }
            { renderSection('eventHighlights', "Highlights") }
            { renderSection('eventFacilities', "Facilities") }
            { renderSection('eventTips', "Tips") }
            { renderSection('eventTrivia', "Trivia") }
          </Box>
          <ActionsBox>
            <Button onClick={() => handleView()} color='brand' variant="outlined" endIcon={<LaunchOutlinedIcon />}>Event site</Button>
            <Button onClick={() => handleViewOnMap()} color='brand' variant="outlined" endIcon={<PlaceIcon />}>View on map</Button>
          </ActionsBox>
          { currentEvent?.image && (
            <FooterImageBox className="sff-event-footer">
              <EventsDetailsImage image={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} />
            </FooterImageBox>
          )}
        </Box>
      </StyledContent>
      </>}
    </Box>
  );
};

export default EventDetails;