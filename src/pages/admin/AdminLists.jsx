import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from "../../firebase";
import { useConfirm } from "material-ui-confirm";

import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import arrayMove from 'array-move';

// Contexts
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

// MUI
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import SettingsIcon from '@mui/icons-material/Settings';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';

// Icons: Tags
import OpenInNewIcon from '@mui/icons-material/OpenInNew';  // Link
import DescriptionIcon from '@mui/icons-material/Description'; // Page
import PodcastsIcon from '@mui/icons-material/Podcasts'; // Podcast
import PlaceIcon from '@mui/icons-material/Place'; // Location
import EventIcon from '@mui/icons-material/Event'; // Event
import HorizontalRule from '@mui/icons-material/HorizontalRule';

// Custom UI
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/Loader';

import {
  fetchDocument,
} from '../../utils/utils';

const SelectionItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const ListEntryForm = styled(Box)(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.05)",
  padding: "1rem",
}));

const Dirty = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textTransform: 'uppercase',
  color: "red",
  marginRight: "1rem"
}));

const Item = styled(Box)(({ theme }) => ({
  flexShrink: 0,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.highlight.main,
  color: 'white',
  margin: '4px',
  padding: '4px 4px 4px 0.5rem',
  transition: 'scale 0.2s',
  // userSelect: "none",
  // pointerEvents: "none"
}));

const EntryMoveButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '0.25rem',
  color: theme.palette.brand.main,
  border: `1px solid ${theme.palette.brand.main}`,
  cursor: 'grab',
}));

const EntryTitle = styled(Box)(({ theme }) => ({
  marginLeft: "0.5rem", width: "100%"
}));

const EntryContent = styled(Box)(({ theme }) => ({
  display: "flex", gap: "4px", alignItems: "center"
}));

const EntryEditButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: '0.25rem',
  color: theme.palette.brand.main,
  border: `1px solid ${theme.palette.brand.main}`,
  cursor: 'pointer',
}));

const tags = [
  { id: "link", title: "Link" },
  { id: "event", title: "Event" },
  { id: "page", title: "Page" },
  { id: "podcast", title: "Podcast" },
  { id: "location", title: "Location" }
]

const itemTypes = [
  { id: "item", title: "Item" },
  { id: "section", title: "Section" },
]

export default function AdminLists() {

  const [items, setItems] = useState([])

  const { user } = useAuth();
  const { setAdminDialogTitle } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Common
  const [title, setTitle] = useState('');

  // Per item
  const [itemEditID, setItemEditID] = useState("");

  const [itemType, setItemType] = useState("item");
  const [itemUrl, setItemUrl] = useState('');
  const [itemContent, setItemContent] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const [itemTag, setItemTag] = useState("");
  const [itemHighlight, setItemHighlight] = useState(false);

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
    }
  }

  useEffect(() => {
    if (!params.updateId) {
      setAdminDialogTitle("List: Add");
      return;
    } else {
      setAdminDialogTitle("List: Update");
    }
    setIsLoading(true);
    fetchDocument("lists", params.updateId, (data) => {
      handleOpenUpdate(data);
      setIsLoading(false);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {

    setUpdateId(params.updateId);

    setTitle(data.title);
    setItems(data.items || []);

    setItemTitle('');
    setItemContent('');
    setItemUrl('');
    setItemTag('');
    setItemHighlight(false);

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
    const payload = {
      title: title,
      items: items,
      tag: itemTag,
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
      setIsDirty(false);
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
    setItems((array) => arrayMove(array, oldIndex, newIndex));
    setIsDirty(true);
    setShowItemForm(false);
    setItemEditID("");
  }

  // ### FORM INPUTS: LIST

  const handleChangeTitle = (text) => {
    if (text !== title) setIsDirty(true);
    setTitle(text);
  }

  // ### FORM INPUTS: ITEMS CREATE

  const handleItemChangeUrl = (text) => {
    if (text !== itemUrl) setIsDirty(true);
    setItemUrl(text);
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

  const handleItemChangeHighlight = (val) => {
    setItemHighlight(val);
  }

  const handleTypeChange = (itemType) => {
    if (itemType === "section") {
      setItemTag("section");
    }
    setItemType(itemType);
  }

  // OTHER EVENTS

  const handleBack = () => {
    navigate(`/admin/lists`);
  }

  const handleAddItem = () => {
    const newItem = {
      id: items.length + 1,
      type: itemType,
      title: itemTitle,
      content: itemContent,
      highlight: itemHighlight,
      url: itemUrl,
      tag: itemType === "section" ? "section" : itemTag,
    }
    setItems([newItem, ...items]);
    setShowItemForm(false);

    // Trigger saving of the list
    isUpdate ? handleUpdate() : handleAdd();
  }

  const handleUpdateItem = () => {
    const currentItems = items;
    const newItem = {
      title: itemTitle,
      type: itemType || "item",
      content: itemContent,
      highlight: itemHighlight || false,
      url: itemUrl,
      tag: itemType === "section" ? "section" : itemTag,
    }
    currentItems[itemEditID] = newItem;
    setItems(currentItems);
    setShowItemForm(false);

    // Trigger saving of the list
    handleUpdate();
  }

  const handleRemoveItem = () => {
    const currentItems = items;
    currentItems.splice(itemEditID, 1);
    setItemEditID(null);
    setItems(currentItems);
    setShowItemForm(false);
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
      case "section":
        return <HorizontalRule />
      default:
        return <OpenInNewIcon />
    }
  }

  const editItem = (i) => {
    setItemEditID(i)
    setItemTitle(items[i].title);
    setItemType(items[i].type || "item");
    setItemContent(items[i].content);
    setItemUrl(items[i].url);
    setItemTag(items[i]?.tag || "");
    setItemHighlight(items[i]?.highlight || false);
    setShowItemForm(true);
    window.location.href = "#top";
  }

  const addItem = () => {
    setItemEditID("");
    setItemTitle("");
    setItemType("item");
    setItemContent("");
    setItemUrl("");
    setItemTag("");
    setItemHighlight(false);
    setShowItemForm(true);
    window.location.href = "#top";
  }

  const renderItemForm = () => {
    if (showItemForm) {
      return (
        <ListEntryForm>
          <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
            {itemEditID !== "" ? "Update List Entry" : "Add List Entry"}
          </Typography>
          <Stack spacing={2} sx={{ mt: 2}}>
            <FormControl fullWidth>
              <InputLabel>Entry Type</InputLabel>
              <Select
                value={itemType}
                label="Entry Type"
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                { itemTypes.map((t, index) => (
                  <MenuItem key={index} value={t.id}>
                    <ListItemText primary={t.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField value={itemTitle || ''} required label="Title" onChange={(e) => handleItemChangeTitle(e.target.value)}  />

            { itemType !== "section" && (
              <>
                <TextField value={itemContent || ''} required multiline rows={3} label="Content" onChange={(e) => handleItemChangeContent(e.target.value)}  />
                <TextField value={itemUrl || ''} required label="URL" onChange={(e) => handleItemChangeUrl(e.target.value)} type='text' />
                <FormGroup>
                  <FormControlLabel onChange={(e) => handleItemChangeHighlight(e.target.checked)} control={<Checkbox checked={itemHighlight} />} label="Highlight" />
                </FormGroup>
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
              </>
            )}

            <Box style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem"}}>
              <Button onClick={(e) => handleRemoveItem()} variant='outlined' size="small">Remove</Button>
              <Box style={{ display: "flex", gap: "0.5rem"}}>
                <Button onClick={(e) => setShowItemForm(false)} variant='outlined'>Close</Button>
                { itemEditID !== "" && <Button onClick={(e) => handleUpdateItem()} variant='outlined' size="small">Update entry</Button> }
                { itemEditID === "" && <Button onClick={(e) => handleAddItem()} variant='outlined' size="small">Add entry</Button> }
              </Box>
            </Box>
          </Stack>
        </ListEntryForm>
      )
    }
  }

  return (
    <AdminLayout>
      { isLoading && <Loader />}
      { !isLoading && <>
        <span id="top" />
        { renderItemForm() }
        { !showItemForm && (<>
        <Box>
          <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
            {isUpdate ? "Update List" : "Add List"}
          </Typography>
          <Stack spacing={2} sx={{ mt: 2}}>
            <TextField value={title} required label="List Title" onChange={(e) => handleChangeTitle(e.target.value)} type='text' />
            { error && <Alert severity="warning">{error}</Alert> }
          </Stack>
          <Box style={{ border: "1px solid black", padding: "0.5rem", margin: "1rem 0"}}>
            <Stack spacing={2} sx={{ mt: 2}}>
              <Box style={{ display: "flex", justifyContent: "space-between", margin: "0 0.5rem"}}>
                <Typography variant="h_small">List content</Typography>
                { isUpdate && <Button onClick={() => addItem()} size="small" variant='outlined'><PlaylistAddIcon /></Button> }
                { !isUpdate && <Button disabled size="small" variant='outlined'><PlaylistAddIcon /></Button> }
              </Box>
              <SortableList
                onSortEnd={onSortEnd}
                draggedItemClassName="dragged">
                {items.map((item, i) => (
                  <SortableItem key={i}>
                    <Item>
                      {<IconComponent tagName={item.tag} />}
                      <EntryTitle>
                        {item.title}
                      </EntryTitle>
                      <EntryContent>
                        <EntryEditButton onClick={(e)=>editItem(i)}>
                          <SettingsIcon />
                        </EntryEditButton>
                        <SortableKnob>
                          <EntryMoveButton>
                            <DragHandleIcon />
                          </EntryMoveButton>
                        </SortableKnob>
                      </EntryContent>
                    </Item>
                  </SortableItem>
                ))}
              </SortableList>
            </Stack>
          </Box>
        </Box>
        <Box style={style.actions}>
          <Box>
            { isUpdate && <Button onClick={() => handleDelete(updateId)} variant="outlined" color="warning" startIcon={<DeleteIcon />}>Delete</Button> }
          </Box>
          <Box style={{ display: "flex", gap: "0.5rem" }}>
            { isDirty && <Dirty><Typography variant='p_small'>Unsaved</Typography></Dirty>}
            <Button onClick={handleBack} variant='outlined'>Back</Button>
            { isUpdate && <Button onClick={handleUpdate} variant='contained'>Update</Button> }
            { !isUpdate && <Button onClick={handleAdd} variant='contained'>Save</Button> }
          </Box>
        </Box>
        </>)}
      </>}
    </AdminLayout>
  )
}

