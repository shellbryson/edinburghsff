import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

// Contexts
import { useApp } from '../../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Custom UI
import EventsDetailsImage from '../../components/EventsDetailsImage';
import LinkInterceptor from '../../components/LinkInterceptor';
import DateBox from '../../components/DateBox';

// Icons
import PlaceIcon from '@mui/icons-material/Place';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

// Helpers
import {
  fetchDocument,
  imageURL
} from '../../utils/utils';

const EventDetails = ({ isLoadingEvent }) => {

  const [currentEvent, setCurrentEvent] = useState({});
  const params = useParams();

  const theme = useTheme();

  const {
    setFocusMapPin,
    focusMapPin,
    setIsExpanded,
    isExpanded,
    setIsExploded,
    isExploded,
    setMapLocations,
    mapLocations
  } = useApp();

  const MastheadImageBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: "1rem",
    marginBottom: "1rem",
    "& img": {
      width: "3rem",
      height: "auto"
    }
  }));

  const Page = styled(Paper)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    overflow: "hidden",
    background: theme.palette.brand.faint,
    color: theme.palette.text.main,
    borderRadius: "0",
    '& p' : {
      marginBottom: "1rem",
      padding: 0,
    },
    '& a' : {
      color: theme.palette.brand.main,
      textDecoration: "underline",
    },
    '& h1' : {
      textAlign: "center",
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    '& h2, h3' : {
      display: "inline-block",
      textTransform: 'uppercase',
      padding: '6px 1rem',
      fontFamily: '"Chakra Petch", sans-serif',
      fontWeight: "400",
      backgroundColor: "rgba(255,255,255,.05)",
      marginTop: "2rem",
      marginBottom: "1rem",
    },
    '& h2::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      right: "0",
      top: "0",
    },
    '& code': {
      display: "inline-block",
      border: "1px solid rgba(255,255,255,.05)",
      padding: "4px 8px",
      marginBottom: "2px",
      color: theme.palette.brand.dark,
      fontWeight: "var(--font-body-bold-weight)"
    },
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

  const LocationBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.25rem 0.5rem",
    gap: "0.5rem",
    marginTop: "4px",
  }));

  const Summary = styled(Box)(({ theme }) => ({
    backgroundColor: "#000",
    padding: "1rem 1rem",
    margin: "2rem 4rem 3rem 4rem",
    "& p" : {
      margin: 0,
    }
  }));

  const Description = styled(Box)(({ theme }) => ({
    // padding: "0 1rem",
    // margin: "1rem 0.5rem 2rem 0.5rem",
  }));

  const Section = styled(Box)(({ theme }) => ({
    //padding: "0 1.5rem",
  }));

  const SectionHeading = styled(Typography)(({ theme }) => ({
    display: "inline-block",
    color: theme.palette.brand.main,
  }));

  const ActionsBox = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    margin: "1rem 2rem",
    gap: "1rem",
  }));

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      margin: "0 1rem 1rem 1rem",
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
      margin: "0.5rem",
      overflow: "auto",
    },
    title: {
      textAlign: "center"
    }
  }

  useEffect(() => {
    if (params.eventID) {
      fetchDocument("events", params.eventID, (eventData) => {
        setCurrentEvent(eventData);
      });
    }
  }, [params.eventID]);

  const eventLocation = () => {
    if (!currentEvent.eventLocation) return;
    return (
      <LocationBox>
        <Typography component="p" variant='p'>{currentEvent.eventLocation}</Typography>
      </LocationBox>
    );
  }

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
    setIsExploded(false);
    setFocusMapPin(currentEvent.eventPin);
  }

  const renderSummary = () => {
    if (!currentEvent.summary) return null;
    return (
      <Summary>
        <LinkInterceptor>
          <ReactMarkdown children={currentEvent.summary} />
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
      <Page>
        <Box style={style.content} className="scroll">
          { !isLoadingEvent && <>
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
            <ActionsBox>
              <Button onClick={() => handleView()} color='brand' variant="outlined" endIcon={<LaunchOutlinedIcon />}>Event site</Button>
              <Button onClick={() => handleViewOnMap()} color='brand' variant="outlined" endIcon={<PlaceIcon />}>View on map</Button>
            </ActionsBox>
            <Box style={style.description} className="sff-event-description">
              { renderSummary() }
              { renderDescription() }
              { renderSection('eventHighlights', "Highlights") }
              { renderSection('eventFacilities', "Facilities") }
              { renderSection('eventTips', "Tips") }
              { renderSection('eventTrivia', "Trivia") }
            </Box>
            { currentEvent?.image && (
              <FooterImageBox className="sff-event-footer">
                <EventsDetailsImage image={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} />
              </FooterImageBox>
            )}
          </>}
        </Box>
      </Page>
    </Box>
  );
};

export default EventDetails;