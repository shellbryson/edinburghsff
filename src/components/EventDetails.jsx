import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Custom UI

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const styleEventDate={
  marginBottom: "1rem"
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

  const eventDate = (eventStartDate) => {
    if (!eventStartDate) return;
    const d = dayjs(eventStartDate.toDate().toLocaleString(), 'DD/MM/YYYY, HH:mm:ss').format('DD/MM/YY')
    return <Typography component="p" style={styleEventDate}>{d}</Typography>;
  }

  const handleView = () => {
    // go to event site...
    setOpenDetails(true);
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
      <DialogTitle id="add-dialog-title">
        <Typography variant="h2" component="span">{currentEvent.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2}}>
          {eventDate(currentEvent?.eventStart)}
          <Typography component="p" variant='p'>{currentEvent.description}</Typography>
          <Typography component="p" variant='p'><a href="{event.url}" target='_blank' rel='noreferrer'>{currentEvent.url}</a></Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleView} variant='outlined' endIcon={<LaunchOutlinedIcon />}>Go to Event site</Button>
        <Button onClick={handleCloseDetails} variant='contained'>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetails;