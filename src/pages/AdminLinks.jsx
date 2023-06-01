import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import LinkList from '../components/LinksList';
import UploadImage from '../components/UploadImage';

export default function AdminLinks() {

  const { user } = useAuth();

  const [links, setLinks] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [linkClassification, setLinkClassification] = useState('general');
  const [isUpdate, setIsUpdate] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [updateId, setUpdateId] = useState('');
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getLinks();
  }, [])

  const getLinks = async () => {
    const q = query(collection(db, "links"), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setLinks(l);
  }

  const handleOpenForm = () => {
    setOpenAdd(true);
  };

  const handleCloseForm = () => {

    // Reset all fields
    setTitle('');
    setDescription('');
    setURL('');
    setShow(true);
    setLinkClassification('');
    setImgUrl('');

    // Reset to Add mode
    setIsUpdate(false);

    // Close the dialog
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {
    setTitle(data.title);
    setDescription(data.description);
    setURL(data.url);
    setImgUrl(data.image);
    setShow(data.show);
    setUpdateId(data.id);
    setLinkClassification(data.type || 'general');

    setIsUpdate(true);
    setOpenAdd(true);
  };

  const handleAdd = async (e) => {
    setError('');

    if (!title || !description || !url) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url,
        show: show,
        image: strippedImageUrl,
        type: linkClassification,
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

      getLinks();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    setError('');

    if (!title || !description || !url) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "links", updateId);

      await updateDoc(l, {
        title: title,
        description: description,
        url: url,
        show: show,
        image: strippedImageUrl,
        type: linkClassification || 'general',
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getLinks();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleLinkTypeChange = (event) => {
    setLinkClassification(event.target.value);
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "links", id));
      getLinks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleFileUpload = (url) => {
    setImgUrl(url)
  }

  return (
    <Container>
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
            <Typography variant="h2" component="span">Update Link</Typography>
          :
            <Typography variant="h2" component="span">Add New Link</Typography>
          }
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} value={title} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} value={url} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} value={description} required multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />

            <FormControl fullWidth>
              <InputLabel id="link-type">Link type</InputLabel>
              <Select
                labelId="link-type"
                id="link-type-select"
                value={linkClassification || "general"}
                label="Link type"
                onChange={handleLinkTypeChange}
              >
                <MenuItem value={"authors"}>Author sites</MenuItem>
                <MenuItem value={"conventions"}>Conventions</MenuItem>
                <MenuItem value={"events"}>Events</MenuItem>
                <MenuItem value={"general"}>General</MenuItem>
                <MenuItem value={"publishers"}>Publishers</MenuItem>
                <MenuItem value={"magazine"}>Magazines</MenuItem>
                <MenuItem value={"agents"}>Agents</MenuItem>
                <MenuItem value={"editors"}>Editors</MenuItem>
                <MenuItem value={"resources"}>Writing resources</MenuItem>
              </Select>
            </FormControl>

            <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked />} label="Display on site" />
            </FormGroup>

            { error && <Alert severity="warning">{error}</Alert> }

          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} variant='outlined'>Cancel</Button>
          { isUpdate ?
            <Button onClick={handleUpdate} variant='contained'>Update Link</Button>
            :
            <Button onClick={handleAdd} variant='contained'>Add Link</Button>
          }
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Links" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenForm()} variant='outlined'>Add Link</Button>
        </Box>
      </Container>

      <LinkList data={links} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

