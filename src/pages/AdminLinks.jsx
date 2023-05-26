import React, { useEffect, useState } from 'react';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
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

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// Custom Components
import LinkList from '../components/LinkList';

export default function AdminLinks() {

  const { user } = useAuth();

  const [links, setLinks] = useState([])

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');
  const [show, setShow] = useState(true);

  const [updateTitle, setUpdateTitle] = useState('');
  const [updateDescription, setUpdateDescription] = useState('');
  const [updateUrl, setUpdateURL] = useState('');
  const [updateShow, setUpdateShow] = useState(true);
  const [updateId, setUpdateId] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [error, setError] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    getLinks();
    console.log("currentUser", user);
  }, [])

  const getLinks = async () => {
    const querySnapshot = await getDocs(collection(db, "links"));
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id
      });
    });
    setLinks(l);
  }

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleOpenUpdate = (data) => {
    setUpdateTitle(data.title);
    setUpdateDescription(data.description);
    setUpdateURL(data.url);
    setUpdateShow(data.show);
    setUpdateId(data.id);
    setOpenUpdate(true);

    console.log("currentUser", user)
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleAdd = async (e) => {
    setError('');

    if (!title || !description || !url) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url,
        show: show,
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
      handleCloseAdd();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "links", id));
      getLinks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    setError('');

    if (!updateTitle || !updateDescription || !updateUrl) {
      setError('Please fill out all fields');
      return;
    }

    try {
      const l = doc(db, "links", updateId);

      await updateDoc(l, {
        title: updateTitle,
        description: updateDescription,
        show: updateShow,
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getLinks();
      handleCloseUpdate();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Container>
      <Dialog
        fullWidth
        maxWidth="sm"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseAdd}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          <Typography variant="h2" component="span">Add New Link</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            <FormGroup>
              <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked />} label="Display on site" />
            </FormGroup>
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined'>Cancel</Button>
          <Button onClick={handleAdd} variant='contained'>Add Link</Button>
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
          <Typography variant="h2" component="span">Update Link</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} required label="Title" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} required label="URL" value={updateUrl} onChange={(e) => setUpdateURL(e.target.value)} type='url' />
            <TextField sx={{ width: '100%' }} required multiline rows={8} value={updateDescription} label="Description" onChange={(e) => setUpdateDescription(e.target.value)}  />
            <FormGroup>
              <FormControlLabel onChange={(e) => setUpdateShow(e.target.checked)} control={<Checkbox />} checked={updateShow} label="Display on site" />
            </FormGroup>
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Cancel</Button>
          <Button onClick={handleUpdate} variant='contained'>Save Link</Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <Typography component="h1" variant='h1'>Links</Typography>
        <Button onClick={() => handleOpenAdd()} variant='outlined'>Add</Button>
      </Container>

      <LinkList data={links} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

