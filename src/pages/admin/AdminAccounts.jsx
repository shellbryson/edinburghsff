import React, { useEffect, useState, useRef } from 'react';
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
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// Custom UI
import UploadImage from '../../components/admin/UploadImage';
import GalleryEditor from '../../components/admin/GalleryEditor';
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocuments,
  fetchDocument,
  slugify
} from '../../utils/utils';

const roles = [
  "admin",
  "editor",
  "author"
]

const SelectionItemBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
}));

const style = {
  actions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "0.5rem",
    bottom: "0",
    marginTop: "1rem",
  },
  dirty: {
    textTransform: 'uppercase',
    color: "red",
    marginRight: "1rem"
  }
}

export default function AdminAccounts() {

  const { user } = useAuth();
  const { setAdminDialogTitle } = useApp();
  const params = useParams();

  const confirm = useConfirm();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // Common
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  // Update
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateId, setUpdateId] = useState('');

  // UI state
  const [error, setError] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Theme
  const theme = useTheme();

  useEffect(() => {
    if (!params.updateId) {
      setAdminDialogTitle("Account: Add");
      return;
    } else {
      setAdminDialogTitle("Account: Update");
    }
    fetchDocument("users", params.updateId, (data) => {
      handleOpenUpdate(data);
    });
  }, [params.updateId]);

  const handleOpenUpdate = (data) => {
    console.log("OPEN UPDATE", data);

    setUpdateId(params.updateId);
    setName(data.name);
    setRole(data.role);
    setIsUpdate(true);
  };

  // ### ADD

  const handleAdd = async (e) => {
    setError('');
    if (!name) {
      setError('Account name is required');
      return;
    }
    setIsLoading(true);
    const payload = {
      title: name,
      role: role,
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
      const doc = await addDoc(collection(db, "users"), payload);
      console.log("Saved Account", doc.id);
      setIsLoading(false);
      navigate(`/admin/account/update/${doc.id}`, { replace: true });
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    if (!title || !description) {
      setError('Please fill out all fields');
      return;
    }
    setIsLoading(true);
    setError('');
    const payload = {
      name: name,
      role: role,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    console.log("updateId", updateId);
    try {
      const l = doc(db, "users", updateId);
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
      await deleteDoc(doc(db, "users", id));
      navigate(`/admin/accounts`);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error deleting document: ", e);
    }
  };

  const handleDelete = async (id) => {
    const settings = {
      description: "This action will permanently delete the selected Account",
      confirmationText: "Delete Account",
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

  const handleChangeName = (text) => {
    if (text !== name) setIsDirty(true);
    setName(text);
  }

  const handleChangeRole = (text) => {
    if (text !== role) setIsDirty(true);
    setRole(text);
  };

  const handleBack = () => {
    navigate(`/admin/accounts`);
  }

  return (
    <AdminLayout>
      <Box>
        <Stack spacing={2} sx={{ mt: 2}}>
          <TextField value={name} required label="Name" onChange={(e) => handleChangeName(e.target.value)} type='text' />

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Display a Roles"
              onChange={(e) => handleChangeRole(e.target.value)}
            >
              { roles.map((r, index) => (
                <MenuItem key={index} value={r}>
                  <SelectionItemBox>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary={r} />
                  </SelectionItemBox>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
          { isUpdate && <Button onClick={handleUpdate} variant='contained'>Update Account</Button> }
          { !isUpdate && <Button onClick={handleAdd} variant='contained'>Add Account</Button> }
        </Box>
      </Box>
    </AdminLayout>
  )
}

