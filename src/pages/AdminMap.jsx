import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy, arrayUnion } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";

import { useAuth } from '../context/AuthContext';

import { useConfirm } from "material-ui-confirm";

import { v4 as uuid } from 'uuid';

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

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import MapList from '../components/MapList';
import EventsListImage from '../components/EventsListImage';

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
  'Writer friendly',
  'Place of interest'
];

export default function AdminMap() {

  const { user } = useAuth();

  const [places, setPlaces] = useState([]);

  const confirm = useConfirm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [locationLat, setLocationLat] = useState(0);
  const [locationLng, setLocationLng] = useState(0);
  const [locationTags, setLocationTags] = useState([]);

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateUrl, setUpdateURL] = useState('');
  const [updateShow, setUpdateShow] = useState(true);
  const [updateLocationLat, setUpdateLocationLat] = useState("");
  const [updateLocationLng, setUpdateLocationLng] = useState("");
  const [updateLocationTags, setUpdateLocationTags] = useState([]);

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

  const q = query(collection(db, "locations"), orderBy("title", "desc"));

  const getEvents = async () => {
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

  const handleOpenAdd = () => {
    setError('');
    setImgUrl('');
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {

    setUpdateTitle(data.title);
    setUpdateDescription(data.description);
    setUpdateURL(data.url);
    setImgUrl(data.image);
    setUpdateShow(data.show);
    setUpdateId(data.id);
    setUpdateLocationLat(data.lat);
    setUpdateLocationLng(data.lng);

    const tags = data.tags.split(',');

    setUpdateLocationTags(tags || []);

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

      getEvents();
      handleCloseAdd();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "locations", id));
      getEvents();
    } catch (e) {
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

  const handleUpdate = async () => {
    setError('');
    setImgUrl('');

    if (
      !updateTitle ||
      !updateDescription ||
      !updateUrl ||
      !updateLocationLat ||
      !updateLocationLng
    ) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "locations", updateId);

      const data = {
        title: updateTitle,
        description: updateDescription,
        show: updateShow || false,
        image: strippedImageUrl,
        lat: updateLocationLat,
        lng: updateLocationLng,
        tags: updateLocationTags.toString(),
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      }

      console.log("SFF update location with:", data)

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
    const storageRef = ref(storage, `locations/${uuid()}___${filename}`);
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

  const handleLocationTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setLocationTags(value);
  };

  const handleUpdateLocationTagsChange = (event) => {
    const {
      target: { value },
    } = event;
    setUpdateLocationTags(value);
  };

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
          <Typography variant="h2" component="span">Add Location</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />

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

            <TextField sx={{ width: '100%' }} required multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            <TextField sx={{ width: '100%' }} required label="Lat" onChange={(e) => setLocationLat(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="Lng" onChange={(e) => setLocationLng(e.target.value)} type='text' />

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
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox />} label="Show on Map" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained'>Add Location</Button>
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
          <Typography variant="h2" component="span">Update Location</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" value={updateUrl} onChange={(e) => setUpdateURL(e.target.value)} type='url' />

            <FormControl sx={{ m: 1 }}>
              <InputLabel id="demo-multiple-chip-label">Location type</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={updateLocationTags}
                onChange={handleUpdateLocationTagsChange}
                input={<OutlinedInput id="select-multiple-chip" label="Location type" />}
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

            <TextField sx={{ width: '100%' }} required multiline rows={8} value={updateDescription} label="Description" onChange={(e) => setUpdateDescription(e.target.value)}  />
            <TextField sx={{ width: '100%' }} required label="Lat" value={updateLocationLat} onChange={(e) => setUpdateLocationLat(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="Lng" value={updateLocationLng} onChange={(e) => setUpdateLocationLng(e.target.value)} type='text' />

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
              <FormControlLabel onChange={(e) => setUpdateShow(e.target.checked)} control={<Checkbox />} checked={updateShow} label="Show on Map" />
            </FormGroup>
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained'>Save Location</Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Map" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenAdd()} variant='outlined'>Add Location</Button>
        </Box>
      </Container>

      <MapList data={places} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

