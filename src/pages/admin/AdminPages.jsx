import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDocs, addDoc, updateDoc, deleteDoc, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

// MUI
import { styled } from '@mui/material/styles';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';

// Custom UI
import UploadImage from '../../components/admin/UploadImage';

import {
  fetchDocument,
  slugify
} from '../../utils/utils';

export default function AdminPages() {

  const { user } = useAuth();
  const { setIsLoading } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  // Common
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [show, setShow] = useState(true);
  const [imgUrl, setImgUrl] = useState(null);

  // Specific to Pages
  const [slug, setSlug] = useState('');
  const [url, setURL] = useState('');
  const [content, setContent] = useState('');

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
    content: {
      textAlign: "left",
      overflow: "auto",
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
    fetchDocument("pages", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    setUpdateId(params.updateId);

    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setImgUrl(data.image);
    setShow(data.show);
    setSlug(data.slug);
    setURL(data.url || '');

    setIsUpdate(true);
  };

  // ### ADD

  const handleAdd = async (e) => {
    setError('');
    if (!title) {
      setError('Please give this page a title');
      return;
    }
    setIsLoading(true);
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
      title: title,
      description: description,
      content: content,
      show: show,
      image: strippedImageUrl,
      slug: slug,
      url: url,
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
      const doc = await addDoc(collection(db, "pages"), payload);
      console.log("Saved Page", doc.id);
      setIsLoading(false);
      navigate(`/admin/pages/update/${doc.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    if (!title || !description || !content) {
      setError('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
      title: title,
      description: description,
      content: content,
      show: show,
      image: strippedImageUrl,
      slug: slug,
      url: url,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    console.log("updateId", updateId);
    try {
      const l = doc(db, "pages", updateId);
      await updateDoc(l, payload);
      setIsDirty(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  const performDelete = async (id) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "pages", id));
      navigate(`/admin/pages`);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error deleting document: ", e);
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

  // ### FORM INPUTS

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
    setSlug(slugify(title));
  }

  const handleChangeDescription = (text) => {
    if (text !== description) setIsDirty(true);
    setDescription(text);
  };

  const handleChangeUrl = (text) => {
    if (text !== url) setIsDirty(true);
    setURL(text);
  }

  const handleFileUpload = (url) => {
    setImgUrl(url)
  }

  const handleChangeContent = (text) => {
    if (text !== content) setIsDirty(true);
    setContent(text);
  }

  const handleChangeSlug = (text) => {
    if (text !== slug) setIsDirty(true);
    setSlug(text);
  }

  const handleBack = () => {
    navigate(`/admin/pages`);
  }

  return (
    <Box style={style.content}>
      <Box>
        <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
          {isUpdate ? "Update Page" : "Add Page"}
        </Typography>
        <Stack spacing={2} sx={{ mt: 2}}>
          <TextField value={title} required label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />
          <TextField value={url} required label="URL" onChange={(e) => handleChangeUrl(e.target.value)} type='text' />
          <TextField value={slug} required label="Slug" onChange={(e) => handleChangeSlug(e.target.value)} type='text' />
          <TextField value={description} required multiline rows={2} label="Description" onChange={(e) => handleChangeDescription(e.target.value)} />
          <TextField value={content} required multiline rows={16} label="Content" onChange={(e) => handleChangeContent(e.target.value)}  />

          <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

          <FormGroup>
            <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked />} label="Display on site" />
          </FormGroup>

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
          { isUpdate && <Button onClick={handleUpdate} variant='contained'>Save Page</Button> }
          { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add Page</Button> }
        </Box>
      </Box>
    </Box>
  )
}

