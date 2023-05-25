import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { doc, getDocs, addDoc, deleteDoc, collection } from 'firebase/firestore';

import { db } from "../firebase";

// MUI
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function AdminLinks() {

  const [links, setLinks] = useState([])
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setURL] = useState('');

  const [openAdd, setOpenAdd] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    getLinks()
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

  const handleOpenUpdate = () => {
    console.log('update')
    setOpenUpdate(true);
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url
      });
      getLinks();
      handleCloseAdd();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {
    console.log('delete', id);
    try {
      await deleteDoc(doc(db, "links", id));
      getLinks();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async (id) => {
    e.preventDefault();
    setError('')
    try {
      const docRef = await addDoc(collection(db, "links"), {
        title: title,
        description: description,
        url: url
      });
      getLinks();
      handleCloseAdd();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  return (
    <Container>
      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          <Typography variant="h2" component="span">Add</Typography>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <Stack spacing={2}>
            <div>
              <TextField label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <TextField label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            </div>
            <div>
              <TextField multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd} variant='outlined' >Cancel</Button>
          <Button onClick={handleAdd} variant='outlined' type="submit">Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        scroll="paper"
        aria-labelledby="update-dialog-title">
        <DialogTitle id="update-dialog-title">Update</DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
        <Stack spacing={2}>
            <div>
              <TextField label="Title" onChange={(e) => setTitle(e.target.value)} type='text' />
            </div>
            <div>
              <TextField label="URL" onChange={(e) => setURL(e.target.value)} type='url' />
            </div>
            <div>
              <TextField multiline rows={8} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            </div>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdate} variant='outlined'>Cancel</Button>
          <Button onClick={handleUpdate} variant='outlined' type="submit">Update</Button>
        </DialogActions>
      </Dialog>

      <Stack>
        <Typography component="h1" variant='h1'>Links</Typography>
        <Button onClick={() => handleOpenAdd()} variant='outlined'>Add</Button>

        <div>
          {links.map((data, index) => (
            <div key={index}>
              <h3>{data.title}</h3>
              <p>{data.description}</p>
              <p>{data.id}</p>
              <a href={data.url} target='_blank' rel='noreferrer'>{data.url}</a>
              <Button size='small' onClick={() => handleDelete(data.id)}>Delete</Button>
              <Button size='small' onClick={() => handleOpenUpdate()}>Update</Button>
            </div>
          ))}
        </div>

      </Stack>
    </Container>
  )
}

