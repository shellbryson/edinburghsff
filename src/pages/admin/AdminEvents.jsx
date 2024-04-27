import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';

// Date Picker
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

// MUI
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';

// Custom UI
import UploadImage from '../../components/admin/UploadImage';
import PageHeading from '../../components/PageHeading';

import {
  fetchDocument,
} from '../../utils/utils';

export default function AdminEvents() {

  const { user } = useAuth();
  const { setIsLoading } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

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
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Theme
  const theme = useTheme();

  const SplitBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    gap: "1rem",
  }));

  const style = {
    container: {
      padding: "1rem",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      gap: "0.5rem",
    },
    dirty: {
      textTransform: 'uppercase',
      color: "red",
      marginRight: "1rem"
    }
  }

  useEffect(() => {
    if (!params.updateId) return;
    fetchDocument("events", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    setUpdateId(params.updateId);

    setTitle(data.title);
    setDescription(data.description);
    setURL(data.url);
    setImgUrl(data.image);
    setShow(data.show);

    if (data.eventStart) {
      setEventStart(dayjs(data.eventStart.toDate()));
    } else {
      setEventStart(dayjs(new Date()));
    }
    if (data.eventEnd) {
      setEventEnd(dayjs(data.eventEnd.toDate()));
    } else {
      setEventEnd(dayjs(new Date()));
    }
    setEventIsAllDay(data.eventIsAllDay || false);
    setEventLocation(data.eventLocation);

    setIsUpdate(true);
  };

  // ### ADD

  const handleAdd = async (e) => {
    setError('');
    if (!title) {
      setError('Please give this event a title');
      return;
    }
    setIsLoading(true);
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
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
    }
    try {
      const doc = await addDoc(collection(db, "events"), payload);
      console.log("Saved Event", doc.id);
      setIsLoading(false);
      navigate(`/admin/events/update/${doc.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    if (!title) {
      setError('Please give this event a title');
      return;
    }
    setIsLoading(true);
    setError('');
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
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
    console.log("updateId", updateId);
    try {
      const l = doc(db, "events", updateId);
      await updateDoc(l, payload);
      setIsDirty(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "events", id));
      navigate(`/admin/events`);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error deleting document: ", e);
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

  // ### FORM INPUTS

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
  }

  const handleChangeDescription = (text) => {
    if (text !== description) setIsDirty(true);
    setDescription(text);
  };

  const handleChangeUrl = (text) => {
    if (text !== url) setIsDirty(true);
    setURL(text);
  }

  const handleFileUpload = (url) => {
    if (url !== imgUrl) setIsDirty(true);
    setImgUrl(url)
  }

  const handleChangeEventStart = (d) => {
    if (d !== eventStart) setIsDirty(true);
    setEventStart(d);
  }

  const handleChangeEventEnd = (d) => {
    if (d !== eventEnd) setIsDirty(true);
    setEventEnd(d);
  }

  const handleChangeLocation = (d) => {
    if (d !== eventLocation) setIsDirty(true);
    setEventLocation(d);
  }

  const handleBack = () => {
    navigate(`/admin/events`);
  }

  return (
    <Container style={{marginBottom: "1rem"}}>
      <PageHeading heading={isUpdate ? "Update Event" : "Add Event"} />
      <Paper>
        <Box style={style.container}>
          <Box>
            <Stack spacing={2} sx={{ mt: 2}}>
              <TextField sx={{ width: '100%' }} required value={title} label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />
              <TextField sx={{ width: '100%' }} value={url} label="URL" onChange={(e) => handleChangeUrl(e.target.value)} type='url' />
              <TextField sx={{ width: '100%' }} required value={description} multiline rows={8} label="Description" onChange={(e) => handleChangeDescription(e.target.value)} />
              <TextField sx={{ width: '100%' }} required value={eventLocation} label="Location"  onChange={(e) => handleChangeLocation(e.target.value)} type='text' />
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <MobileDateTimePicker label="Event start" value={eventStart} onChange={(newValue) => handleChangeEventStart(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
                <MobileDateTimePicker label="Event end" value={eventEnd} onChange={(newValue) => handleChangeEventEnd(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} />
                  )}
                />
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
          </Box>
          <Box style={style.actions}>
            <Box>
              { isUpdate && <Button onClick={() => handleDelete(updateId)} variant="outlined" color="warning" startIcon={<DeleteIcon />}>Delete</Button> }
            </Box>
            <Box style={{ display: "flex", gap: "0.5rem" }}>
              { isDirty && <Typography sx={style.dirty} variant='p_small'>Unsaved changes</Typography> }
              <Button onClick={handleBack} variant='outlined'>Back</Button>
              { isUpdate && <Button onClick={handleUpdate} variant='contained'>Save Event</Button> }
              { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add Event</Button> }
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

