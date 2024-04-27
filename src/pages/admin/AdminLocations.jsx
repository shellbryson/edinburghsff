import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection} from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

// Contexts
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
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
  updateMapLocationsIndex,
  fetchDocument,
  fetchDocuments,
} from '../../utils/utils';

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

const facilitiesTagsLookup = [
  'Alcohol',
  'Coffee',
  'Food',
  'Power',
  'Wifi',
  "Pet",
  "Writers"
];

export default function AdminMap() {

  const { user } = useAuth();
  const { setIsLoading, mapLocations } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Maps
  const [featured, setFeatured] = useState(false);
  const [locationLat, setLocationLat] = useState(0);
  const [locationLng, setLocationLng] = useState(0);
  const [locationTags, setLocationTags] = useState([]);
  const [locationFacilities, setLocationFacilities] = useState([]);

  const [locationNoiseLevel, setNoiseLevel] = useState(5);
  const [locationPriceLevel, setPriceLevel] = useState(5);

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
    fetchDocument("locations", params.updateId, (data) => {
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
    setFeatured(data.featured);
    setLocationLat(data.lat);
    setLocationLng(data.lng);

    setNoiseLevel(data.noise || 0);
    setPriceLevel(data.price || 0);

    if (data.tags) {
      setLocationTags(data.tags.split(','));
    } else {
      setLocationTags([]);
    }

    if (data.facilities) {
      setLocationFacilities(data.facilities.split(','));
    } else {
      setLocationFacilities([]);
    }

    setIsUpdate(true);
  };

  // ### ADD

  const handleAdd = async (e) => {
    setError('');
    if (!title) {
      setError('Please give this location a title');
      return;
    }
    setIsLoading(true);
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
      title: title,
      description: description,
      url: url,
      featured: featured,
      show: show,
      image: strippedImageUrl,
      lat: locationLat,
      lng: locationLng,
      tags: locationTags.toString(),
      facilities: locationFacilities.toString(),
      price: locationPriceLevel,
      noise: locationNoiseLevel,
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
      const doc = await addDoc(collection(db, "locations"), payload);
      console.log("Saved Location", doc.id);
      setIsLoading(false);
      reIndexLocations();
      navigate(`/admin/locations/update/${doc.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document:", e);
    }
  };

  // ### UPDATE

  const handleUpdate = async () => {
    if (!title) {
      setError('Please give this location a title');
      return;
    }
    setIsLoading(true);
    setError('');
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
      title: title,
      description: description,
      url: url,
      show: show,
      featured: featured,
      image: strippedImageUrl,
      lat: locationLat,
      lng: locationLng,
      tags: locationTags.toString(),
      facilities: locationFacilities.toString(),
      price: locationPriceLevel,
      noise: locationNoiseLevel,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    console.log("updateId", updateId);
    try {
      const l = doc(db, "locations", updateId);
      await updateDoc(l, payload);
      reIndexLocations();
      setIsDirty(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  const reIndexLocations = (cb) => {
    fetchDocuments("locations", (data) => {
      updateMapLocationsIndex(data, user, (pins) => {
        console.log("Saved Location Index", pins);
        if (cb) cb();
      })
    });
  }

  const performDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "locations", id));
      reIndexLocations(() => {
        navigate(`/admin/locations`);
      });
    } catch (e) {
      setIsLoading(false);
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

  // ### FORM INPUTS

  const handleNoiseLevelChange = (val) => {
    if (val !== locationNoiseLevel) setIsDirty(true);
    if (val <= 1) val = 1;
    if (val >= 10) val = 10;
    setNoiseLevel(val);
  }

  const handlePriceLevelChange = (val) => {
    if (val !== locationPriceLevel) setIsDirty(true);
    if (val <= 1) val = 1;
    if (val >= 10) val = 10;
    setPriceLevel(val);
  }

  const handleLocationTagsChange = (event) => {
    const {target:{value}} = event;
    if (locationTags !== value) setIsDirty(true);
    setLocationTags(value);
  };

  const handleFacilitiesChange = (event) => {
    const {target:{value}} = event;
    if (locationFacilities !== value) setIsDirty(true);
    setLocationFacilities(value);
  };

  const handleChangeDescription = (text) => {
    if (text !== description) setIsDirty(true);
    setDescription(text);
  };

  const handleFileUpload = (url) => {
    if (url !== imgUrl) setIsDirty(true);
    setImgUrl(url);
  }

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
  }

  const handleChangeUrl = (text) => {
    if (text !== url) setIsDirty(true);
    setURL(text);
  }

  const handleFeaturedChange = (val) => {
    if (val !== featured) setIsDirty(true);
    setFeatured(val);
  }

  const handleShowChange = (val) => {
    if (val !== show) setIsDirty(true);
    setShow(val);
  }

  const handleBack = () => {
    navigate(`/admin/locations`);
  }

  return (
    <Container style={{marginBottom: "1rem"}}>
      { isUpdate ?
        <PageHeading heading="Update Location" />
      :
        <PageHeading heading="Add Location" />
      }
      <Paper>
        <Box style={style.container}>
          <Box>
            <Stack spacing={2} sx={{ mt: 2}}>

              <TextField sx={{ width: '100%' }}
                value={title} required label="Title"
                onChange={(e) => handleChangeTitle(e.target.value)} type='text'
              />

              <TextField sx={{ width: '100%' }}
                value={url} label="URL"
                onChange={(e) => handleChangeUrl(e.target.value)} type='url'
              />

              <SplitBox>
                <FormGroup>
                  <FormControlLabel onChange={(e) => handleFeaturedChange(e.target.checked)} control={<Checkbox checked={featured} />} label="Featured" />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel onChange={(e) => handleShowChange(e.target.checked)} control={<Checkbox checked={show} />} label="Show on Map" />
                </FormGroup>
              </SplitBox>

              <FormControl sx={{ m: 1 }}>
                <InputLabel  id="demo-multiple-chip-label">Location tags</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={locationTags}
                  onChange={handleLocationTagsChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Location tag"  />}
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

              <FormControl sx={{ m: 1 }}>
                <InputLabel  id="demo-multiple-chip-label">Facilities</InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={locationFacilities}
                  onChange={handleFacilitiesChange}
                  input={<OutlinedInput  id="select-multiple-chip" label="Location tag" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {facilitiesTagsLookup.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <SplitBox>

                <FormControl fullWidth>
                  <TextField
                    label="Noise level"
                    type="number"
                    value={locationNoiseLevel || 5}
                    onChange={(e) => handleNoiseLevelChange(e.target.value)}
                  />
                </FormControl>

                <FormControl fullWidth>
                  <TextField
                    label="Price level"
                    type="number"
                    value={locationPriceLevel || 5}
                    onChange={(e) => handlePriceLevelChange(e.target.value)}
                  />
                </FormControl>

              </SplitBox>

              <TextField sx={{ width: '100%' }} value={description} multiline rows={8} label="Description" onChange={(e) => handleChangeDescription(e.target.value)}  />
              <TextField sx={{ width: '100%' }} value={locationLat} required label="Lat" onChange={(e) => setLocationLat(e.target.value)} type='text' />
              <TextField sx={{ width: '100%' }} value={locationLng} required label="Lng" onChange={(e) => setLocationLng(e.target.value)} type='text' />

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
              { isUpdate && <Button onClick={handleUpdate} variant='contained'>Save Location</Button> }
              { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add Location</Button> }
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

