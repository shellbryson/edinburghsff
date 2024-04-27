import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

import ReactMarkdown from 'react-markdown';

import { imageURL } from '../../utils/utils';

// Contexts
import { useApp } from '../../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

// Custom UI
import EventsDetailsImage from '../EventsDetailsImage';
import LinkInterceptor from '../LinkInterceptor';

// Icons
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
}));

const EventDetails = ({ selectedEvent, isOpen, onCloseCallback, isLoadingEvent }) => {

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const StyledBox = styled(Box)(({ theme }) => ({
    width: '100%',
    height: "400px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: currentEvent?.image ? `linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.8) 100%), url(${imageURL(currentEvent?.image, 'large')})` : "none",
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'center, center',
    backgroundSize: 'cover, cover',
    marginBottom: "1rem"
  }));

  const style = {
    title: {
      textAlign: "center"
    },
    date: {
      marginBottom: "1rem"
    },
    meta: {
      textAlign: "center"
    },
    description: {
      padding: "1rem",
      marginBottom: "1rem",
      marginTop: "1rem"
    },
  }

  useEffect(() => {
    setCurrentEvent(selectedEvent);
    setIsOpenDialog(isOpen);
  }, [selectedEvent, isOpen, isLoadingEvent]);

  const eventDate = () => {
    if (!currentEvent.eventStart) return;

    let displayDate = "";

    if (currentEvent.eventIsAllDay) {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('DD/MM/YYYY');
      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;
    } else {
      const _startDate = dayjs(currentEvent.eventStart.toDate()).format('DD/MM/YYYY, HH:mm');
      const _endDate = dayjs(currentEvent.eventEnd.toDate()).format('HH:mm');
      displayDate = `${_startDate} to ${_endDate}`;
    }

    return <>
      <EventAvailableOutlinedIcon />
      <Typography component="p" style={style.date}>
        {displayDate}
      </Typography>
    </>;
  }

  const eventPin = () => {
    if (!currentEvent.eventPin) return;
    return <>
      <PlaceIcon />
      <Typography component="p" style={style.date} onClick={() => handleViewOnMap()}>
        View on map
      </Typography>
    </>;
  }

  const cleanUrl = (url) => {
    if (!url) return;
    return url.replace(/^(https?:\/\/)?(www\.)?|\/$/g, '');
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
    setIsOpenDialog(false);
    setFocusMapPin(currentEvent.eventPin);
  }

  const handleCloseDetails = () => {
    onCloseCallback();
  };

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      open={isOpenDialog}
      onClose={handleCloseDetails}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" sx={style.title}>
        <Typography variant="h2" component="span">{currentEvent.title}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseDetails}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        { isLoadingEvent &&
          <>
            <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", justifyContent: "center", height: "200px" }}>
              <CircularProgress />
            </Box>
          </>
        }
        { !isLoadingEvent && <>
          { currentEvent?.image && (
            <StyledBox className="sff-event-masthead">
              <EventsDetailsImage image={imageURL(currentEvent?.image, 'medium')} alt={currentEvent?.title} />
            </StyledBox>
          )}
          <Box style={style.meta}>
            {eventDate()}
            <LocationOnOutlinedIcon />
            <Typography component="p" variant='p'> {currentEvent.eventLocation}</Typography>
            {eventPin()}
          </Box>
          <Box style={style.description} className="sff-event-details__description">
            <LinkInterceptor>
              <ReactMarkdown children={currentEvent.description} />
            </LinkInterceptor>
            <Button onClick={handleView} color='brand' endIcon={<LaunchOutlinedIcon />}>Go to Event site</Button>
          </Box>
        </>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} color='brand'>Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
};

export default EventDetails;