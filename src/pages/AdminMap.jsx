import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';
import { useConfirm } from "material-ui-confirm";

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import DeleteIcon from '@mui/icons-material/Delete';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import MapList from '../components/MapList';
import UploadImage from '../components/UploadImage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const locationTagsLookup = [
  'Venue',
  'Cafe',
  'Bookshop',
  'Library',
  'Place of interest'
];

export default function AdminMap() {

  const { user } = useAuth();
  const confirm = useConfirm();

  // Data
  const [places, setPlaces] = useState([]);

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Maps
  const [locationLat, setLocationLat] = useState(0);
  const [locationLng, setLocationLng] = useState(0);
  const [locationTags, setLocationTags] = useState([]);

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
    getLocations();
  }, []);

  const getLocations = async () => {
    const q = query(collection(db, "locations"), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setPlaces(l);
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

    // Reset Locations fields
    setLocationLat('');
    setLocationLng('');

    // Reset to Add mode
    setIsUpdate(false);
  };

  const handleOpenUpdate = (data) => {
    setTitle(data.title);
    setDescription(data.description);
    setURL(data.url);
    setImgUrl(data.image);
    setShow(data.show);
    setUpdateId(data.id);
    setLocationLat(data.lat);
    setLocationLng(data.lng);

    if (data.tags) {
      setLocationTags(data.tags.split(','));
    } else {
      setLocationTags([]);
    }

    setIsUpdate(true);
    setOpenAdd(true);
  };

  const handleAdd = async (e) => {
    setError('');

    if (
      !title ||
      !url ||
      !locationLat ||
      !locationLng
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const docRef = await addDoc(collection(db, "locations"), {
        title: title,
        description: description,
        url: url,
        show: show,
        image: strippedImageUrl,
        lat: locationLat,
        lng: locationLng,
        tags: locationTags.toString(),
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

      getLocations();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    setError('');

    if (
      !title ||
      !url ||
      !locationLat ||
      !locationLng
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "locations", updateId);

      await updateDoc(l, {
        title: title,
        description: description,
        show: show || false,
        image: strippedImageUrl,
        lat: locationLat,
        lng: locationLng,
        tags: locationTags.toString(),
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getLocations();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "locations", id));
      getLocations();
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleDelete = async (id) => {

    const settings = {
      description: "This action will permanently delete the selected Location",
      confirmationText: "Delete Location",
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

  const handleLocationTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocationTags(value);
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
            <Typography variant="h2" component="span">Update Location</Typography>
          :
            <Typography variant="h2" component="span">Add Location</Typography>
          }
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} value={title} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} value={url} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />

            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-multiple-chip-label">Location tags</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={locationTags}
                onChange={handleLocationTagsChange}
                input={<OutlinedInput id="select-multiple-chip" label="Location tag" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {locationTagsLookup.map((loc) => (
                  <MenuItem key={loc} value={loc}>
                    {loc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField sx={{ width: '100%' }} value={description} multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            <TextField sx={{ width: '100%' }} value={locationLat} required label="Lat" onChange={(e) => setLocationLat(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} value={locationLng} required label="Lng" onChange={(e) => setLocationLng(e.target.value)} type='text' />

            <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox />} label="Show on Map" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} variant='outlined'>Cancel</Button>
          { isUpdate ?
            <>
              <Button onClick={() => handleDelete(updateId)} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
              <Button onClick={handleUpdate} variant='contained'>Update Location</Button>
            </>
            :
            <Button onClick={handleAdd} variant='contained'>Add Location</Button>
          }
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Map" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenForm()} variant='outlined'>Add Location</Button>
        </Box>
      </Container>

      <MapList data={places} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

