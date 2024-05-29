import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
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
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';

// Custom UI
import UploadImage from '../../components/admin/UploadImage';
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocuments,
  fetchDocument,
  slugify
} from '../../utils/utils';

const SelectionItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

export default function AdminPages() {

  const { user } = useAuth();
  const { setAdminDialogTitle } = useApp();
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
  const [content, setContent] = useState('');

  const [lists, setLists] = useState([]);
  const [list, setList] = useState('');

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
    if (!params.updateId) {
      setAdminDialogTitle("Page: Add");
      return;
    } else {
      setAdminDialogTitle("Page: Update");
    }
    fetchDocument("pages", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  useEffect(() => {
    fetchDocuments("lists", {field:'title', mode:'asc'}, (data) => {
      setLists(data);
    });
  }, []);

  const handleOpenUpdate = (data) => {

    setUpdateId(params.updateId);

    setTitle(data.title);
    setDescription(data.description);
    setContent(data.content);
    setList(data.list || '');
    setImgUrl(data.image);
    setShow(data.show);
    setSlug(data.slug);

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
      list: list,
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
      list: list,
      show: show,
      image: strippedImageUrl,
      slug: slug,
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

  const handleChangeListSelection = (l) => {
    // if (text !== slug) setIsDirty(true);
    // setSlug(text);
    setList(l);
    console.log(l);
  }

  const handleBack = () => {
    navigate(`/admin/pages`);
  }

  return (
    <AdminLayout>
      <Box>
        <Stack spacing={2} sx={{ mt: 2}}>
          <TextField value={title} required label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />
          <TextField value={slug} required label="Slug" onChange={(e) => handleChangeSlug(e.target.value)} type='text' />

          <FormGroup>
            <FormControlLabel onChange={(e) => setShow(e.target.checked)} control={<Checkbox checked />} label="Display on site" />
          </FormGroup>

          <TextField value={description} required multiline rows={2} label="Description" onChange={(e) => handleChangeDescription(e.target.value)} />
          <TextField value={content} required multiline rows={16} label="Content" onChange={(e) => handleChangeContent(e.target.value)}  />

          <FormControl fullWidth>
            <InputLabel>Display a List</InputLabel>
            <Select
              value={list}
              label="Display a List"
              onChange={(e) => handleChangeListSelection(e.target.value)}
            >
              { lists.map((list, index) => (
                <MenuItem key={index} value={list.id}>
                  <SelectionItemBox>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={list.title} />
                  </SelectionItemBox>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <UploadImage imageUploadedCallback={handleFileUpload} imgUrl={imgUrl} />

          { error && <Alert severity="warning">{error}</Alert> }

        </Stack>
      </Box>
      <Box style={style.actions}>
        <Box>
          { isUpdate && <Button onClick={() => handleDelete(updateId)} variant="outlined" color="warning" startIcon={<DeleteIcon />}>Delete</Button> }
        </Box>
        <Box style={{ display: "flex", gap: "0.5rem" }}>
          { isDirty && <Typography sx={style.dirty} variant='p_small'>Unsaved</Typography> }
          <Button onClick={handleBack} variant='outlined'>Back</Button>
          { isUpdate && <Button onClick={handleUpdate} variant='contained'>Save</Button> }
          { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add</Button> }
        </Box>
      </Box>
    </AdminLayout>
  )
}

