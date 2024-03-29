import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

import { useConfirm } from "material-ui-confirm";

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

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

import DeleteIcon from '@mui/icons-material/Delete';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import PageHeading from '../components/PageHeading';
import List from '../components/admin/List';
import UploadImage from '../components/admin/UploadImage';

const tableStructure = {
  headings: [
    'Title',
    'Type',
    'Image',
  ],
  keys: [
    'title',
    'type',
    'image'
  ]
}

export default function AdminLinks() {

  const { user } = useAuth();
  const { setIsLoading } = useApp();

  const confirm = useConfirm();

  // Data
  const [links, setLinks] = useState([])

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Links
  const [linkClassification, setLinkClassification] = useState('general');

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
    getLinks();
  }, [])

  const getLinks = async () => {
    setIsLoading(true);
    const q = query(collection(db, "links"), orderBy("title", "asc"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id,
        display: true,
      });
    });
    setLinks(l);
    setIsLoading(false);
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

    // Reset Links fields
    setLinkClassification('');

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

    setIsLoading(true);

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      await addDoc(collection(db, "links"), {
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
      setIsLoading(false);
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
    setIsLoading(true);

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
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "links", id));
      handleCloseForm();
      getLinks();
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {

    const settings = {
      description: "This action will permanently delete the selected Link",
      confirmationText: "Delete Link",
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

  const handleLinkTypeChange = (event) => {
    setLinkClassification(event.target.value);
  }

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
        <DialogTitle id="add-dialog-title" align='center'>
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
                <MenuItem value={"magazines"}>Magazines</MenuItem>
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
            <>
              <Button onClick={() => handleDelete(updateId)} variant="outlined" startIcon={<DeleteIcon />}>Delete</Button>
              <Button onClick={handleUpdate} variant='contained'>Update</Button>
            </>
            :
            <Button onClick={handleAdd} variant='contained'>Add</Button>
          }
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Links" />
      </Container>

      <List
        tableStructure={tableStructure}
        data={links}
        onOpenForm={handleOpenForm}
        onUpdate={handleOpenUpdate} />

    </Container>
  )
}

