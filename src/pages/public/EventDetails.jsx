import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import ReactMarkdown from 'react-markdown';

// Contexts
import { useApp } from '../../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

// Custom UI
import EventsDetailsImage from '../../components/EventsDetailsImage';
import LinkInterceptor from '../../components/LinkInterceptor';
import PageHeading from '../../components/PageHeading';

// Icons
import PlaceIcon from '@mui/icons-material/Place';

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
    marginBottom: "1rem",
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
  }));

  const Meta = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    padding: "0.25rem 0.5rem",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "center",
  }));

  const MetaBox = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: "0.25rem",
    gap: "1rem",
    alignItems: "center",
    border: `1px solid ${theme.palette.brand.main}`,
    justifyContent: "center",
    color: theme.palette.brand.main
  }));

  const DateBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.25rem 0.5rem",
    gap: "0.5rem",
    backgroundColor: theme.palette.brand.main,
    color: theme.palette.text.contrastText,
  }));

  const LocationBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: "0.25rem 0.5rem",
    gap: "0.5rem",
    marginTop: "4px",
  }));

  const style = {
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      color: theme.palette.text.main
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
      padding: "0 0.5rem",
      overflow: "auto",
    },
    title: {
      textAlign: "center"
    },
    description: {
      margin: "1rem 0",
      padding: "1rem",
    },
  }

  useEffect(() => {
    fetchDocument("events", params.eventID, (eventData) => {
      setCurrentEvent(eventData);
    });
  }, [params.eventID]);

  const eventDate = () => {
    if (!currentEvent.eventStart) return;

    let displayDate = "";

    if (currentEvent.eventIsAllDay) {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('DD/MM/YYYY');
      displayDate = _startDate === _endDate ? _startDate : (
        <>
          <DateBox><EventAvailableOutlinedIcon /><span>{_startDate}</span></DateBox> to <DateBox><EventAvailableOutlinedIcon /><span>{_endDate}</span></DateBox>
        </>
      );
    } else {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY, HH:mm');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('HH:mm');
      displayDate =
        <>
          <DateBox><span>{_startDate}</span></DateBox> to <DateBox><span>{_endDate}</span></DateBox>
        </>;
    }

    return <MetaBox>
      {displayDate}
    </MetaBox>;
  }

  const eventLocation = () => {
    if (!currentEvent.eventLocation) return;
    return (
      <LocationBox>
        <LocationOnOutlinedIcon />
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

  return (
    <Box style={style.page} className="sff-page">
      <Box style={style.paper}>
        <Box style={style.content} className="scroll">
          { !isLoadingEvent && <>
            <PageHeading heading={currentEvent.title} />
            { currentEvent?.image && (
              <MastheadImageBox className="sff-event-masthead">
                <img src={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} style={{ width: "4rem", height: "auto" }}/>
              </MastheadImageBox>
            )}
            <Meta>
              {eventDate()}
              {eventLocation()}
            </Meta>
            <Box style={style.description} className="sff-event-description">
              <LinkInterceptor>
                <ReactMarkdown children={currentEvent.description} />
              </LinkInterceptor>
              <Box style={{ display: "flex", justifyContent: "space-between "}}>
                <Button onClick={() => handleView()} color='brand' variant="outlined" endIcon={<LaunchOutlinedIcon />}>Event site</Button>
                <Button onClick={() => handleViewOnMap()} color='brand' variant="outlined" endIcon={<PlaceIcon />}>View on map</Button>
              </Box>
            </Box>
            { currentEvent?.image && (
              <FooterImageBox className="sff-event-footer">
                <EventsDetailsImage image={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} />
              </FooterImageBox>
            )}
          </>}
        </Box>
      </Box>
    </Box>
  );
};

export default EventDetails;