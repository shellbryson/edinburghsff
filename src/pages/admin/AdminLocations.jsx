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
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
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
import AdminLayout from '../../layouts/AdminLayout';

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
  'Interesting'
];

const facilitiesTagsLookup = [
  'Alcohol',
  'Coffee',
  'Food',
  'Meal',
  'Power',
  'Wifi',
  "Pet",
];

const SplitBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: "1rem",
}));

const HelpText = styled(Typography)(({ theme }) => ({
  fontSize: "0.75rem",
  color: theme.palette.text.secondary,
  margin: "2px 0 8px"
}));

export default function AdminMap() {

  const { user } = useAuth();
  const { setIsLoading, mapLocations } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  // Common
  const [title, setTitle] = useState('');
  const [titleLong, setTitleLong] = useState('');
  const [description, setDescription] = useState('');
  const [tips, setTips] = useState('');
  const [url, setURL] = useState('');
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Locations
  const [featured, setFeatured] = useState(false);
  const [locationLat, setLocationLat] = useState(0);
  const [locationLng, setLocationLng] = useState(0);
  const [locationTags, setLocationTags] = useState([]);
  const [locationFacilities, setLocationFacilities] = useState([]);

  const [locationNoiseLevel, setNoiseLevel] = useState(0);
  const [locationPriceLevel, setPriceLevel] = useState(0);
  const [hours, setHours] = useState('');

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
    if (!params.updateId) return;
    fetchDocument("locations", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    setUpdateId(params.updateId);

    setTitle(data.title);
    setTitleLong(data.title_long || "");
    setDescription(data.description);
    setTips(data.tips || "");
    setURL(data.url);
    setImgUrl(data.image);
    setFeatured(data.featured || false);
    setLocationLat(data.lat);
    setLocationLng(data.lng);

    setNoiseLevel(data.noise || 0);
    setPriceLevel(data.price || 0);
    setHours(data.hours || "");

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
      title_long: titleLong,
      description: description,
      tips: tips,
      url: url,
      featured: featured,
      image: strippedImageUrl,
      lat: locationLat,
      lng: locationLng,
      tags: locationTags.toString(),
      facilities: locationFacilities.toString(),
      price: locationPriceLevel,
      noise: locationNoiseLevel,
      hours: hours,
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
      title_long: titleLong,
      description: description,
      tips: tips,
      url: url,
      featured: featured,
      image: strippedImageUrl,
      lat: locationLat,
      lng: locationLng,
      tags: locationTags.toString(),
      facilities: locationFacilities.toString(),
      price: locationPriceLevel,
      noise: locationNoiseLevel,
      hours: hours,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
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
    fetchDocuments("locations", {field:'title', mode:'asc'}, (data) => {
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
        setIsLoading(false);
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

  const handleChangeTips = (text) => {
    if (text !== tips) setIsDirty(true);
    setTips(text);
  };

  const handleChangeHours = (text) => {
    if (text !== hours) setIsDirty(true);
    setHours(text);
  };

  const handleFileUpload = (url) => {
    if (url !== imgUrl) setIsDirty(true);
    setImgUrl(url);
  }

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
  }

  const handleChangeTitleLong = (text) => {
    if (text !== titleLong) setIsDirty(true);
    setTitleLong(text);
  }

  const handleChangeUrl = (text) => {
    if (text !== url) setIsDirty(true);
    setURL(text);
  }

  const handleFeaturedChange = (val) => {
    if (val !== featured) setIsDirty(true);
    setFeatured(val);
  }

  const handleBack = () => {
    navigate(`/admin/locations`);
  }

  return (
    <AdminLayout>
      <Box>
        <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
          {isUpdate ? "Update Location" : "Add Location"}
        </Typography>
        <Stack spacing={2} sx={{ mt: 2}}>

          <TextField value={title} required label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text'/>
          <TextField value={titleLong} label="Long Title" onChange={(e) => handleChangeTitleLong(e.target.value)} type='text'/>
          <TextField value={url} label="URL" onChange={(e) => handleChangeUrl(e.target.value)} type='url' />

          <SplitBox>
            <FormGroup>
              <FormControlLabel onChange={(e) => handleFeaturedChange(e.target.checked)} control={<Checkbox checked={featured} />} label="Featured" />
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
          <TextField sx={{ width: '100%' }} value={hours} multiline rows={1} label="Opening hours" onChange={(e) => handleChangeHours(e.target.value)}  />
          <HelpText>Comma seperated values</HelpText>
          <TextField sx={{ width: '100%' }} value={tips} multiline rows={4} label="Tips" onChange={(e) => handleChangeTips(e.target.value)}  />
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
    </AdminLayout>
  )
}

