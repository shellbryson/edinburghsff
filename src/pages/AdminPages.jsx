import React, { useEffect, useState } from 'react';

import { slugify } from '../utils/utils';

import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../firebase";

import { useAuth } from '../context/AuthContext';
import { useConfirm } from "material-ui-confirm";

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

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
import PageList from '../components/PageList';
import UploadImage from '../components/UploadImage';

export default function AdminPages() {

  const { user } = useAuth();
  const confirm = useConfirm();

  // Data
  const [links, setLinks] = useState([])

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Links
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');

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
    getPages();
  }, [slug])

  const getPages = async () => {
    const q = query(collection(db, "pages"), orderBy("title", "asc"));
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

  const handleTitleChange = (title) => {
    setTitle(title);
    setSlug(slugify(title));
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
    setContent('');
    setImgUrl('');
    setShow(true);

    // Reset to Add mode
    setIsUpdate(false);
  };

  const handleOpenUpdate = (data) => {
    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setImgUrl(data.image);
    setShow(data.show);
    setUpdateId(data.id);
    setSlug(data.slug);

    setIsUpdate(true);
    setOpenAdd(true);
  };

  const handleAdd = async (e) => {
    setError('');

    if (!title || !description || !content) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      await addDoc(collection(db, "pages"), {
        title: title,
        description: description,
        content: content,
        show: show,
        image: strippedImageUrl,
        slug: slug,
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

      getPages();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleUpdate = async () => {
    setError('');

    if (!title || !description || !content) {
      setError('Please fill out all fields');
      return;
    }

    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';

    try {
      const l = doc(db, "pages", updateId);

      await updateDoc(l, {
        title: title,
        description: description,
        content: content,
        show: show,
        image: strippedImageUrl,
        slug: slug,
        updated: {
          email: user.email,
          uid: user.uid,
          timestamp: new Date()
        }
      });

      getPages();
      handleCloseForm();

    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "pages", id));
      handleCloseForm();
      getPages();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDelete = async (id) => {
    const settings = {
      description: "This action will permanently delete the selected Page",
      confirmationText: "Delete Page",
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

  const handleFileUpload = (url) => {
    setImgUrl(url)
  }

  return (
    <Container>
      <Dialog
        fullWidth
        maxWidth="md"
        fullScreen={fullScreen}
        open={openAdd}
        onClose={handleCloseForm}
        scroll="paper"
        aria-labelledby="add-dialog-title">
        <DialogTitle id="add-dialog-title">
          { isUpdate ?
            <Typography variant="h2" component="span">Update Page</Typography>
          :
            <Typography variant="h2" component="span">Add New Page</Typography>
          }
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField sx={{ width: '100%' }} value={title} required label="Title" onChange={(e) => handleTitleChange(e.target.value)} type='text' />
            <TextField sx={{ width: '100%' }} value={slug} readOnly disabled label="Slug" type='text' />
            <TextField sx={{ width: '100%' }} value={description} required multiline rows={2} label="Description" onChange={(e) => setDescription(e.target.value)}  />
            <TextField sx={{ width: '100%' }} value={content} required multiline rows={16} label="Content" onChange={(e) => setContent(e.target.value)}  />

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
              <Button onClick={handleUpdate} variant='contained'>Update Page</Button>
            </>
            :
            <Button onClick={handleAdd} variant='contained'>Add Page</Button>
          }
        </DialogActions>
      </Dialog>

      <Container maxWidth="md">
        <PageHeading heading="Pages" />
        <Box sx={{ textAlign: "center"}}>
          <Button onClick={() => handleOpenForm()} variant='outlined'>Add Page</Button>
        </Box>
      </Container>

      <PageList data={links} onDelete={handleDelete} onUpdate={handleOpenUpdate} />

    </Container>
  )
}

