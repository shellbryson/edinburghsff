import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

// Contexts
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
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';

// Custom UI
import UploadImage from '../../components/admin/UploadImage';
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocument,
} from '../../utils/utils';

const SplitBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: "1rem",
  gridTemplateColumns: '1fr 1fr',
}));

const SelectionItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

export default function AdminEvents() {

  const { user } = useAuth();
  const { mapLocations, setAdminDialogTitle } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [summary, setSummary] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to events
  const [eventStart, setEventStart] = useState(dayjs(new Date()));
  const [eventEnd, setEventEnd] = useState(dayjs(new Date()));
  const [eventIsAllDay, setEventIsAllDay] = useState(false);
  const [eventIsFeatured, setEventIsFeatured] = useState(false);
  const [eventLocation, setEventLocation] = useState('');
  const [eventIsDigital, setEventIsDigital] = useState(false);
  const [eventPin, setEventPin] = useState('');
  const [eventHighlights, setEventHighlights] = useState('');
  const [eventFacilities, setEventFacilities] = useState('');
  const [eventTips, setEventTips] = useState('');
  const [eventTrivia, setEventTrivia] = useState('');

  // Update
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Theme
  const theme = useTheme();

  const style = {
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
    if (!params.updateId) {
      setAdminDialogTitle("Event: Add");
      return;
    } else {
      setAdminDialogTitle("Event: Update");
    }
    fetchDocument("events", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    setUpdateId(params.updateId);

    setTitle(data.title);
    setDescription(data.description);
    setSummary(data.summary || "");
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
    setEventIsFeatured(data.eventIsFeatured || false);
    setEventLocation(data.eventLocation || "");
    setEventIsDigital(data.eventIsDigital || false);
    setEventPin(data.eventPin || "");

    setEventHighlights(data.eventHighlights || "");
    setEventFacilities(data.eventFacilities || "");
    setEventTips(data.eventTips || "");
    setEventTrivia(data.eventTrivia || "");

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
      summary: summary,
      url: url,
      show: show,
      image: strippedImageUrl,
      eventStart: eventStart.$d,
      eventEnd: eventEnd.$d,
      eventIsAllDay: eventIsAllDay,
      eventIsFeatured: eventIsFeatured,
      eventLocation: eventLocation,
      eventIsDigital: eventIsDigital,
      eventPin: eventPin,
      eventHighlights: eventHighlights,
      eventFacilities: eventFacilities,
      eventTips: eventTips,
      eventTrivia: eventTrivia,
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
      console.log("Saved Event", doc.id, payload);
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
      summary: summary,
      url: url,
      show: show,
      image: strippedImageUrl,
      eventStart: eventStart.$d,
      eventEnd: eventEnd.$d,
      eventIsAllDay: eventIsAllDay,
      eventIsFeatured: eventIsFeatured,
      eventLocation: eventLocation,
      eventIsDigital: eventIsDigital,
      eventPin: eventPin,
      eventHighlights: eventHighlights,
      eventFacilities: eventFacilities,
      eventTips: eventTips,
      eventTrivia: eventTrivia,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    try {
      const l = doc(db, "events", updateId);
      await updateDoc(l, payload);
      setIsDirty(false);
      setIsLoading(false);
      console.log("Updated Event", payload);
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

  const handleChangeSummary = (text) => {
    if (text !== summary) setIsDirty(true);
    setSummary(text);
  }

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
    setEventEnd(d);
  }

  const handleChangeEventEnd = (d) => {
    if (d !== eventEnd) setIsDirty(true);
    if (d.isBefore(eventStart)) {
      d = eventStart;
    } else {
      setEventEnd(d);
    }
  }

  const handleChangeLocation = (d) => {
    if (d !== eventLocation) setIsDirty(true);
    setEventLocation(d);
  }

  const handleChangeHighlights = (text) => {
    if (text !== eventHighlights) setIsDirty(true);
    setEventHighlights(text);
  }

  const handleChangeFacilities = (text) => {
    if (text !== eventFacilities) setIsDirty(true);
    setEventFacilities(text);
  }

  const handleChangeTips = (text) => {
    if (text !== eventTips) setIsDirty(true);
    setEventTips(text);
  }

  const handleChangeTrivia = (text) => {
    if (text !== eventTrivia) setIsDirty(true);
    setEventTrivia(text);
  }

  const handlePinSectionChange = (p) => {
    if (p !== eventPin) setIsDirty(true);
    setEventPin(p);
  }

  const handleBack = () => {
    navigate(`/admin/events`);
  }

  return (
    <AdminLayout>
      <Box>

        <Stack spacing={2} sx={{ mt: 2}}>
          <TextField required value={title} label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />

          <SplitBox>
            <FormGroup>
              <FormControlLabel onChange={(e) => setEventIsFeatured(e.target.checked)} control={<Checkbox checked={eventIsFeatured} />} label="Featured" />
            </FormGroup>
            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked={show} />} label="Visible" />
            </FormGroup>
          </SplitBox>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <SplitBox>
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
            </SplitBox>
          </LocalizationProvider>

          <SplitBox>
            <FormGroup>
              <FormControlLabel onChange={(e) => setEventIsAllDay(e.target.checked)} control={<Checkbox checked={eventIsAllDay} />} label="All day" />
            </FormGroup>
          </SplitBox>

          <TextField required value={eventLocation} label="Location label"  onChange={(e) => handleChangeLocation(e.target.value)} type='text' />

          <SplitBox>
            <FormGroup>
              <FormControlLabel onChange={(e) => setEventIsDigital(e.target.checked)} control={<Checkbox checked={eventIsDigital} />} label="Digital" />
            </FormGroup>
          </SplitBox>

          <FormControl fullWidth>
            <InputLabel>Map Pin</InputLabel>
            <Select
              value={eventPin}
              label="Map Pin"
              onChange={(e) => handlePinSectionChange(e.target.value)}
            >
              { mapLocations.map((location, index) => (
                <MenuItem key={index} value={location.id}>
                  <SelectionItemBox>
                    <ListItemIcon>
                      <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText primary={location.name} />
                  </SelectionItemBox>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField required value={description} multiline rows={8} label="Description" onChange={(e) => handleChangeDescription(e.target.value)} />
          <TextField required value={summary} multiline rows={2} label="Summary" onChange={(e) => handleChangeSummary(e.target.value)} />
          <TextField required value={eventHighlights} multiline rows={8} label="Highlights" onChange={(e) => handleChangeHighlights(e.target.value)} />
          <TextField required value={eventFacilities} multiline rows={4} label="Facilities" onChange={(e) => handleChangeFacilities(e.target.value)} />
          <TextField required value={eventTips} multiline rows={4} label="Tips" onChange={(e) => handleChangeTips(e.target.value)} />
          <TextField required value={eventTrivia} multiline rows={4} label="Trivia" onChange={(e) => handleChangeTrivia(e.target.value)} />

          <TextField value={url} label="URL" onChange={(e) => handleChangeUrl(e.target.value)} type='url' />

          <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

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
    </AdminLayout>
  )
}

