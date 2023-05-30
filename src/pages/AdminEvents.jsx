import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy, limit } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";

import { useAuth } from '../context/AuthContext';

import { useConfirm } from "material-ui-confirm";

import { v4 as uuid } from 'uuid';
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
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LinearProgress from '@mui/material/LinearProgress';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import EventsList from '../components/EventsList';
import EventsListImage from '../components/ListImage';

export default function AdminEvents() {

  const { user } = useAuth();

  const [events, setEvents] = useState([])

  const confirm = useConfirm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [eventStart, setEventStart] = useState(dayjs(new Date()));
  const [eventEnd, setEventEnd] = useState(dayjs(new Date()));
  const [eventIsAllDay, setEventIsAllDay] = useState(false);
  const [eventLocation, setEventLocation] = useState('');

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateUrl, setUpdateURL] = useState('');
  const [updateShow, setUpdateShow] = useState(true);
  const [updateEventStart, setUpdateEventStart] = useState(dayjs(new Date()));
  const [updateEventEnd, setUpdateEventEnd] = useState(dayjs(new Date()));
  const [updateEventIsAllDay, setUpdateEventIsAllDay] = useState(false);
  const [updateEventLocation, setUpdateEventLocation] = useState('');

  const [updateId, setUpdateId] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [error, setError] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);

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

  const handleOpenAdd = () => {
    setError('');
    setImgUrl('');
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {

    const start = new Date(data.eventStart.seconds * 1000 + data.eventStart.nanoseconds / 1000000);
    const end = new Date(data.eventEnd.seconds * 1000 + data.eventEnd.nanoseconds / 1000000);

    setUpdateTitle(data.title);
    setUpdateDescription(data.description);
    setUpdateURL(data.url);
    setImgUrl(data.image);
    setUpdateShow(data.show);
    setUpdateId(data.id);
    setUpdateEventStart(dayjs(start));
    setUpdateEventEnd(dayjs(end));
    setUpdateEventIsAllDay(data.eventIsAllDay || false);
    setUpdateEventLocation(data.eventLocation);

    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleAdd = async (e) => {
    setError('');
    setImgUrl('');

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
      handleCloseAdd();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "events", id));
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
    setImgUrl('');

    if (
      !updateTitle ||
      !updateDescription ||
      !updateUrl ||
      !updateEventStart ||
      !updateEventEnd ||
      !updateEventLocation
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "events", updateId);

      const data = {
        title: updateTitle,
        description: updateDescription,
        show: updateShow,
        image: strippedImageUrl,
        eventStart: updateEventStart.$d,
        eventEnd: updateEventEnd.$d,
        eventIsAllDay: updateEventIsAllDay,
        eventLocation: updateEventLocation,
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      }

      console.log("SFF update event with:", data)

      await updateDoc(l, data);

      getEvents();
      handleCloseUpdate();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleFileUpload = (e) => {
    e.preventDefault()
    const file = e.target[0]?.files[0]

    if (!file) return;

    const filename = encodeURI(file.name);
    const storageRef = ref(storage, `events/${uuid()}___${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress =
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrl(downloadURL)
        });
      }
    );
  }

  return (
    <Container disableGutters maxWidth="md">
      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseAdd}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          <Typography variant="h2" component="span">Add New Event</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
              <DateTimePicker label="Event start" value={eventStart} onChange={(newValue) => setEventStart(newValue)} />
              <DateTimePicker label="Event end" value={eventEnd} onChange={(newValue) => setEventEnd(newValue)}/>
              <FormGroup>
                <FormControlLabel onChange={(e) => setEventIsAllDay(e.target.checked)} control={<Checkbox />} label="All day" />
              </FormGroup>
            </LocalizationProvider>

            <TextField sx={{ width: '100%' }} required label="Location" onChange={(e) => setEventLocation(e.target.value)} type='text' />

            { progresspercent > 0 && progresspercent < 100 &&
              <LinearProgress variant="determinate" value={progresspercent} />
            }

            <form onSubmit={handleFileUpload} className='form'>
              <input type='file' accept=".png,.jpg,.svg,.gif" />
              <IconButton type='submit'>
                <AddPhotoAlternateOutlinedIcon />
              </IconButton>
            </form>

            {
              imgUrl &&
                <EventsListImage image={imgUrl} alt={title} />
            }

            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox />} label="Show in Event Grid" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained'>Add Event</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openUpdate}
        onClose={handleCloseUpdate}
        scroll="paper"
        aria-labelledby="update-dialog-title">
        <DialogTitle id="update-dialog-title">
          <Typography variant="h2" component="span">Update Event</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" value={updateUrl} onChange={(e) => setUpdateURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} value={updateDescription} label="Description" onChange={(e) => setUpdateDescription(e.target.value)}  />

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
              <DateTimePicker label="Event start" value={updateEventStart} onChange={(newValue) => setUpdateEventStart(newValue)} />
              <DateTimePicker label="Event end" value={updateEventEnd} onChange={(newValue) => setUpdateEventEnd(newValue)}/>
              <FormGroup>
                <FormControlLabel onChange={(e) => setUpdateEventIsAllDay(e.target.checked)} control={<Checkbox />} checked={updateEventIsAllDay} label="All day" />
              </FormGroup>
            </LocalizationProvider>

            <TextField sx={{ width: '100%' }} required label="Location" value={updateEventLocation} onChange={(e) => setUpdateEventLocation(e.target.value)} type='text' />

            { progresspercent > 0 && progresspercent < 100 &&
              <LinearProgress variant="determinate" value={progresspercent} />
            }

            <form onSubmit={handleFileUpload}>
              <input type='file' accept=".png,.jpg,.svg,.gif" />
              <IconButton type='submit'>
                <AddPhotoAlternateOutlinedIcon />
              </IconButton>
            </form>

            {
              imgUrl &&
                <EventsListImage image={imgUrl} alt={title} />
            }

            <FormGroup>
              <FormControlLabel onChange={(e) => setUpdateShow(e.target.checked)} control={<Checkbox />} checked={updateShow} label="Show in Event Grid" />
            </FormGroup>
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained'>Save Event</Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Events" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenAdd()} variant='outlined'>Add an event</Button>
        </Box>
      </Container>

      <EventsList enableAdminActions={true} data={events} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

