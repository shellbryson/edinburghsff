import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';

// Custom UI
import EventsDetailsImage from './EventsDetailsImage';

// Theme helpers
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const styleEventTitle={
  textAlign: "center"
}

const styleEventDate={
  marginBottom: "1rem"
}

const styleEventMeta={
  textAlign: "center"
}

const styleEventDecsription={
  backgroundColor: "#f5f5f5",
  padding: "1rem",
  marginBottom: "1rem",
  marginTop: "1rem"
}

const EventDetails = ({ selectedEvent, isOpen, onCloseCallback }) => {

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({});

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    console.log("ESFF EventDetails:", selectedEvent);
    setCurrentEvent(selectedEvent);
    setIsOpenDialog(isOpen);
  }, [selectedEvent, isOpen]);

  const eventDate = () => {
    if (!currentEvent.eventStart) return;

    let displayDate = "";

    if (currentEvent.eventIsAllDay) {
      const _startDate = dayjs(currentEvent.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY');
      const _endDate = dayjs(currentEvent.eventEnd.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY');

      displayDate = _startDate === _endDate ? _startDate : `${_startDate} to ${_endDate}`;

    } else {

      const _startDate = dayjs(currentEvent.eventStart.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YYYY, HH:mm');
      const _endDate = dayjs(currentEvent.eventEnd.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('HH:mm');

      displayDate = `${_startDate} to ${_endDate}`;
    }

    return <>
      <EventAvailableOutlinedIcon /><Typography component="p" style={styleEventDate}>
        When: {displayDate}
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

  const handleCloseDetails = () => {
    onCloseCallback();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      open={isOpenDialog}
      onClose={handleCloseDetails}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" sx={styleEventTitle}>
        <Typography variant="h2" component="span">{currentEvent.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <EventsDetailsImage image={currentEvent?.image} alt={currentEvent?.title} />
        <Box style={styleEventMeta}>
          {eventDate()}
          <LocationOnOutlinedIcon />
          <Typography component="p" variant='p'> {currentEvent.eventLocation}</Typography>
        </Box>
        <Box style={styleEventDecsription}>
          <Typography component="p" variant='p'>{currentEvent.description}</Typography>
          <Typography component="p" variant='p' sx={{ mt: 2 }}>More at: <Link to={currentEvent.url}>{cleanUrl(currentEvent.url)}</Link></Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleView} variant='outlined' endIcon={<LaunchOutlinedIcon />}>Go to Event site</Button>
        <Button onClick={handleCloseDetails} variant='contained'>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetails;