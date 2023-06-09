import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';
import { useConfirm } from "material-ui-confirm";

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsList from '../components/EventsList';
import UploadImage from '../components/UploadImage';

export default function AdminEvents() {

  const { user } = useAuth();
  const confirm = useConfirm();

  // Data
  const [events, setEvents] = useState([])

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to events
  const [eventStart, setEventStart] = useState(dayjs(new Date()));
  const [eventEnd, setEventEnd] = useState(dayjs(new Date()));
  const [eventIsAllDay, setEventIsAllDay] = useState(false);
  const [eventLocation, setEventLocation] = useState('');

  // Update
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  // UI state
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState('');

  // Theme
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getEvents();
  }, []);

  const q = query(collection(db, "events"), orderBy("eventStart", "desc"));

  const getEvents = async () => {
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setEvents(l);
  }

  const handleOpenForm = () => {
    setOpenAdd(true);
  };

  const handleCloseForm = () => {
    // Close the dialog
    setOpenAdd(false);

    // Reset common fields
    setTitle('');
    setDescription('');
    setURL('');
    setImgUrl('');
    setShow(true);

    // Reset Events fields
    setEventStart(dayjs(new Date()));
    setEventEnd(dayjs(new Date()));
    setEventIsAllDay(false);
    setEventLocation('');

    // Reset to Add mode
    setIsUpdate(false);
  };

  const handleOpenUpdate = (data) => {

    const start = new Date(data.eventStart.seconds * 1000 + data.eventStart.nanoseconds / 1000000);
    const end = new Date(data.eventEnd.seconds * 1000 + data.eventEnd.nanoseconds / 1000000);

    setTitle(data.title);
    setDescription(data.description);
    setURL(data.url);
    setImgUrl(data.image);
    setShow(data.show);
    setUpdateId(data.id);
    setEventStart(dayjs(start));
    setEventEnd(dayjs(end));
    setEventIsAllDay(data.eventIsAllDay || false);
    setEventLocation(data.eventLocation);

    setIsUpdate(true);
    setOpenAdd(true);
  };

  const handleAdd = async (e) => {
    setError('');

    if (
      !title ||
      !description ||
      !url ||
      !eventStart ||
      !eventEnd ||
      !eventLocation
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const docRef = await addDoc(collection(db, "events"), {
        title: title,
        description: description,
        url: url,
        show: show,
        image: strippedImageUrl,
        eventStart: eventStart.$d,
        eventEnd: eventEnd.$d,
        eventIsAllDay: eventIsAllDay,
        eventLocation: eventLocation,
        created: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        },
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getEvents();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
      handleCloseForm();
      getEvents();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {

    const settings = {
      description: "This action will permanently delete the selected Event",
      confirmationText: "Delete Event",
      confirmationButtonProps: {
        variant: "contained"
      },
      cancellationButtonProps: {
        variant: "outlined"
      }
    }

    confirm(settings)
    .then(() => {
      performDelete(id)
    })
    .catch(() => {
      /* ... */
    });
  };

  const handleUpdate = async () => {
    setError('');

    if (
      !title ||
      !description ||
      !url ||
      !eventStart ||
      !eventEnd ||
      !eventLocation
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "events", updateId);
      const data = {
        title: title,
        description: description,
        show: show,
        image: strippedImageUrl,
        eventStart: eventStart.$d,
        eventEnd: eventEnd.$d,
        eventIsAllDay: eventIsAllDay,
        eventLocation: eventLocation,
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      }

      console.log("SFF update event with:", data)

      await updateDoc(l, data);

      getEvents();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleFileUpload = (url) => {
    setImgUrl(url)
  }

  return (
    <Container disableGutters maxWidth="md">
      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseForm}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          { isUpdate ?
            <Typography variant="h2" component="span">Update Event</Typography>
          :
            <Typography variant="h2" component="span">Add Event</Typography>
          }
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required value={title} label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required value={url} label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required value={description} multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            <TextField sx={{ width: '100%' }} required value={eventLocation} label="Location" onChange={(e) => setEventLocation(e.target.value)} type='text' />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
              <DateTimePicker label="Event start" value={eventStart} onChange={(newValue) => setEventStart(newValue)} />
              <DateTimePicker label="Event end" value={eventEnd} onChange={(newValue) => setEventEnd(newValue)}/>
              <FormGroup>
                <FormControlLabel onChange={(e) => setEventIsAllDay(e.target.checked)} control={<Checkbox checked={eventIsAllDay} />} label="All day" />
              </FormGroup>
            </LocalizationProvider>

            <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox />} label="Show in Event Grid" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} variant='outlined'>Cancel</Button>
          { isUpdate ?
            <>
              <Button onClick={() => handleDelete(updateId)} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
              <Button onClick={handleUpdate} variant='contained'>Update Event</Button>
            </>
            :
            <Button onClick={handleAdd} variant='contained'>Add Event</Button>
          }
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Events" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenForm()} variant='outlined'>Add Event</Button>
        </Box>
      </Container>

      <EventsList enableAdminActions={true} data={events} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

