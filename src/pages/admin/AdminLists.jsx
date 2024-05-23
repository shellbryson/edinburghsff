import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import arrayMove from 'array-move'

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
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SettingsIcon from '@mui/icons-material/Settings';

// Icons: Tags
import OpenInNewIcon from '@mui/icons-material/OpenInNew';  // Link
import DescriptionIcon from '@mui/icons-material/Description'; // Page
import PodcastsIcon from '@mui/icons-material/Podcasts'; // Podcast
import PlaceIcon from '@mui/icons-material/Place'; // Location
import EventIcon from '@mui/icons-material/Event'; // Event

// Custom UI
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocument,
  slugify
} from '../../utils/utils';

const SelectionItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const Item = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: 'rgb(84, 84, 241)',
  color: 'white',
  margin: '8px',
  height: '60px',
  padding: '0.5rem',
  transition: 'scale 0.2s',
  // userSelect: "none",
  // pointerEvents: "none"
}));

const Handle = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '0.25rem',
  color: theme.palette.brand.main,
  border: `1px solid ${theme.palette.brand.main}`,
  cursor: 'grab',
}));

const SplitBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: "1rem",
}));

const tags = [
  { id: "link", title: "Link" },
  { id: "event", title: "Event" },
  { id: "page", title: "Page" },
  { id: "podcast", title: "Podcast" },
  { id: "location", title: "Location" }
]

export default function AdminLists() {

  const [items, setItems] = useState([])

  const { user } = useAuth();
  const { setIsLoading } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  // Common
  const [title, setTitle] = useState('');

  // Per item
  const [itemEditID, setItemEditID] = useState("");

  const [itemImgUrl, setItemImgUrl] = useState(null);
  const [itemUrl, setItemUrl] = useState('');
  const [itemContent, setItemContent] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemTag, setItemTag] = useState("");

  // Update
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);

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
    fetchDocument("lists", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    setUpdateId(params.updateId);

    setTitle(data.title);
    setItems(data.items || []);

    setItemTitle('');
    setItemContent('');
    setItemUrl('');
    setItemImgUrl('');

    setIsUpdate(true);
  };

  // ### ADD

  const handleAdd = async (e) => {
    setError('');
    if (!title) {
      setError('Please give this list a title');
      return;
    }
    setIsLoading(true);
    //const strippedImageUrl = imgUrl ? imgUrl.split('&')[0] : '';
    const payload = {
      title: title,
      items: items,
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
      const doc = await addDoc(collection(db, "lists"), payload);
      console.log("Saved List", doc.id, payload);
      setIsLoading(false);
      navigate(`/admin/lists/update/${doc.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    if (!title) {
      setError('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    const payload = {
      title: title,
      items: items,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    console.log("updateId", updateId);
    try {
      const l = doc(db, "lists", updateId);
      await updateDoc(l, payload);
      console.log("Updated List", updateId, payload);
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
      await deleteDoc(doc(db, "lists", id));
      navigate(`/admin/lists`);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error deleting document: ", e);
    }
  };

  const handleDelete = async (id) => {
    const settings = {
      description: "This action will permanently delete the selected List",
      confirmationText: "Delete List",
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

  const onSortEnd = (oldIndex, newIndex) => {
    setItems((array) => arrayMove(array, oldIndex, newIndex))
  }

  // ### FORM INPUTS: LIST

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
    setSlug(slugify(title));
  }

  // ### FORM INPUTS: ITEMS CREATE

  const handleItemChangeUrl = (text) => {
    if (text !== itemUrl) setIsDirty(true);
    setItemUrl(text);
  }

  const handleItemFileUpload = (url) => {
    setItemImgUrl(url)
  }

  const handleItemChangeTitle = (text) => {
    if (text !== itemTitle) setIsDirty(true);
    setItemTitle(text);
  }

  const handleItemChangeContent = (text) => {
    if (text !== itemContent) setIsDirty(true);
    setItemContent(text);
  }

  const handleTagChange = (tag) => {
    setItemTag(tag);
  }

  // OTHER EVENTS

  const handleBack = () => {
    navigate(`/admin/lists`);
  }

  const handleAddItem = () => {
    const newItem = {
      title: itemTitle,
      content: itemContent,
      url: itemUrl,
      tag: itemTag,
    }
    setItems([newItem, ...items]);
    setShowItemForm(false);
  }

  const handleUpdateItem = () => {
    const currentItems = items;
    const newItem = {
      title: itemTitle,
      content: itemContent,
      url: itemUrl,
      tag: itemTag,
    }
    currentItems[itemEditID] = newItem;
    setItems(currentItems);
    setShowItemForm(false);
  }

  const handleRemoveItem = () => {
    const currentItems = items;
    currentItems.splice(itemEditID, 1);
    setItemEditID(null);
    setItems(currentItems);
    setShowEditItemForm(false);
  }

  const IconComponent = ({tagName}) => {
    switch(tagName) {
      case "link":
        return <OpenInNewIcon />
      case "event":
        return <EventIcon />
      case "page":
        return <DescriptionIcon />
      case "podcast":
        return <PodcastsIcon />
      case "location":
        return <PlaceIcon />
      default:
        return <OpenInNewIcon />
    }
  }

  const renderItemForm = () => {
    if (showItemForm) {
      return (
        <Box style={{backgroundColor: "rgba(0,0,0,0.05", padding: "1rem", marginTop: "1rem"}}>
          { itemEditID !== "" && <Typography variant="h2">Update entry</Typography> }
          { itemEditID === ""&& <Typography variant="h2">Add entry</Typography> }
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField value={itemTitle || ''} required label="Title" onChange={(e) => handleItemChangeTitle(e.target.value)}  />
            <TextField value={itemContent || ''} required multiline rows={3} label="Content" onChange={(e) => handleItemChangeContent(e.target.value)}  />
            <TextField value={itemUrl || ''} required label="URL" onChange={(e) => handleItemChangeUrl(e.target.value)} type='text' />
            <FormControl fullWidth>
              <InputLabel>Tag</InputLabel>
              <Select
                value={itemTag}
                label="Tag"
                onChange={(e) => handleTagChange(e.target.value)}
              >
                { tags.map((tag, index) => (
                  <MenuItem key={index} value={tag.id}>
                    <SelectionItemBox>
                      <ListItemIcon>
                        <IconComponent tagName={tag.id} />
                      </ListItemIcon>
                      <ListItemText primary={tag.title} />
                    </SelectionItemBox>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            { itemEditID && <Button onClick={(e) => handleUpdateItem()} variant='outlined'>Update</Button> }
            { !itemEditID && <Button onClick={(e) => handleAddItem()} variant='outlined'>Save</Button> }
            <Button onClick={(e) => handleRemoveItem()} variant='outlined'>Remove</Button>
            <Button onClick={(e) => setShowItemForm(false)} variant='outlined'>Close</Button>
          </Stack>
        </Box>
      )
    }
  }

  const editItem = (i) => {
    setItemEditID(i)
    setItemTitle(items[i].title);
    setItemContent(items[i].content);
    setItemUrl(items[i].url);
    setItemImgUrl(items[i].img);
    setItemTag(items[i].tag);
    setShowItemForm(true);
  }

  const addItem = () => {
    setItemEditID("");
    setItemTitle("");
    setItemContent("");
    setItemUrl("");
    setItemImgUrl("");
    setItemTag("");
    setShowItemForm(true);
  }

  return (
    <AdminLayout>
      <Box>
        <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
          {isUpdate ? "Update List" : "Add List"}
        </Typography>

        <Stack spacing={2} sx={{ mt: 2}}>
          <TextField value={title} required label="Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />
          { error && <Alert severity="warning">{error}</Alert> }
        </Stack>

        <Button onClick={() => addItem()} variant='outlined'>Add Item</Button>

        { renderItemForm() }

        <Stack spacing={2} sx={{ mt: 2}}>
          <Typography variant="h2">List</Typography>
          <SortableList
            onSortEnd={onSortEnd}
            draggedItemClassName="dragged">
            {items.map((item, i) => (
              <SortableItem key={i}>
                <Item>
                  <SortableKnob>
                    <Handle>
                      <DragHandleIcon />
                    </Handle>
                  </SortableKnob>
                  <Box onClick={(e)=>editItem(i)}>
                    <SettingsIcon />
                  </Box>
                  {item.title}
                </Item>
              </SortableItem>
            ))}
          </SortableList>

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
          { isUpdate && <Button onClick={handleUpdate} variant='contained'>Save</Button> }
          { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add List</Button> }
        </Box>
      </Box>
    </AdminLayout>
  )
}

