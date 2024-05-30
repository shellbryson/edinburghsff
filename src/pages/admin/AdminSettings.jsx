import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase";

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
import { useTheme } from '@mui/material/styles';

// Custom UI
import AdminLayout from '../../layouts/AdminLayout';

import {
  fetchDocument
} from '../../utils/utils';

export default function AdminSettings() {

  const { user } = useAuth();
  const { setAdminDialogTitle } = useApp();

  const navigate = useNavigate();

  // Community
  const [settingsDiscordLink, setSettingsDiscordLink] = useState('');
  const [settingsCommunityText, setSettingsCommunityText] = useState('');

  // Suggestions
  const [settingsSuggestContentText, setSettingsSuggestContentText] = useState('');
  const [settingsSuggestGoogleForm, setSettingsSuggestGoogleForm] = useState('');

  // General
  const [settingsPanelIntro, setSettingsPanelIntro] = useState('');
  const [settingsEventIntro, setSettingsEventIntro] = useState('');

  // Kofi
  const [settingsKofiKey, setSettingsKofiKey] = useState('');

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
      marginTop: "1rem"
    },
    dirty: {
      textTransform: 'uppercase',
      color: "red",
      marginRight: "1rem"
    }
  }

  useEffect(() => {
    setAdminDialogTitle("Settings");
    fetchDocument("settings", "config", (data) => {
      handleOpenUpdate(data);
    });
  }, []);

  const handleOpenUpdate = (data) => {
    setSettingsCommunityText(data.textCommunity || "");
    setSettingsSuggestContentText(data.textSuggestContent || "");
    setSettingsSuggestGoogleForm(data.suggestGoogleForm || "");
    setSettingsDiscordLink(data.discordLink || "");
    setSettingsPanelIntro(data.textPanelIntro || "");
    setSettingsEventIntro(data.textEventIntro || "");
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    setIsLoading(true);
    setError('');
    const payload = {
      suggestGoogleForm: settingsSuggestGoogleForm,
      discordLink: settingsDiscordLink,
      textCommunity: settingsCommunityText,
      textSuggestContent: settingsSuggestContentText,
      textPanelIntro: settingsPanelIntro,
      textEventIntro: settingsEventIntro,
      kofi_key: settingsKofiKey,
      updated: {
        email: user.email,
        uid: user.uid,
        timestamp: new Date()
      }
    }
    try {
      const l = doc(db, "settings", "config");
      await updateDoc(l, payload);
      setIsDirty(false);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.error("Error adding document: ", e);
    }
  };

  // ### FORM INPUTS

  const handleChangeDiscordLink = (text) => {
    if (text !== settingsDiscordLink) setIsDirty(true);
    setSettingsDiscordLink(text);
  }

  const handleChangeCommunityText = (text) => {
    if (text !== settingsCommunityText) setIsDirty(true);
    setSettingsCommunityText(text);
  }

  const handleChangePanelIntro = (text) => {
    if (text !== settingsPanelIntro) setIsDirty(true);
    setSettingsPanelIntro(text);
  }

  const handleChangeEventIntro = (text) => {
    if (text !== settingsEventIntro) setIsDirty(true);
    setSettingsEventIntro(text);
  }

  const handleChangeSuggestContent = (text) => {
    if (text !== settingsSuggestContentText) setIsDirty(true);
    setSettingsSuggestContentText(text);
  }

  const handleChangeSuggestGoogleForm = (text) => {
    if (text !== settingsSuggestGoogleForm) setIsDirty(true);
    setSettingsSuggestGoogleForm(text);
  }

  const handleChangeKofiKey = (text) => {
    if (text !== settingsKofiKey) setIsDirty(true);
    setSettingsKofiKey(text);
  }

  const handleBack = () => {
    navigate(`/dashboard/`);
  }

  return (
    <AdminLayout>
      <Box>
        <Stack spacing={2}>
          <Typography component="h2" variant="h2">Community</Typography>
          <TextField value={settingsDiscordLink} required rows={8} label="Discord Link" onChange={(e) => handleChangeDiscordLink(e.target.value)}  />
          <TextField value={settingsCommunityText} required multiline rows={8} label="Community Text" onChange={(e) => handleChangeCommunityText(e.target.value)}  />
        </Stack>
      </Box>
      <Box style={{ marginTop: "2rem", marginBottom: "2rem"}}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h2">Content</Typography>
          <TextField value={settingsPanelIntro} required multiline rows={8} label="Panel Introduction" onChange={(e) => handleChangePanelIntro(e.target.value)}  />
          <TextField value={settingsEventIntro} required multiline rows={8} label="Events Introduction" onChange={(e) => handleChangeEventIntro(e.target.value)}  />
        </Stack>
        { error && <Alert severity="warning">{error}</Alert> }
      </Box>
      <Box style={{ marginTop: "2rem", marginBottom: "2rem"}}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h2">Suggestions</Typography>
          <TextField value={settingsSuggestGoogleForm} required label="Feedback form" onChange={(e) => handleChangeSuggestGoogleForm(e.target.value)}  />
          <TextField value={settingsSuggestContentText} required multiline rows={8} label="Suggest Content" onChange={(e) => handleChangeSuggestContent(e.target.value)}  />
        </Stack>
        { error && <Alert severity="warning">{error}</Alert> }
      </Box>
      <Box style={{ marginTop: "2rem", marginBottom: "2rem"}}>
        <Stack spacing={2}>
          <Typography component="h2" variant="h2">Ko-fi</Typography>
          <TextField value={settingsKofiKey} required label="Ko-fi key" onChange={(e) => handleChangeKofiKey(e.target.value)}  />
        </Stack>
        { error && <Alert severity="warning">{error}</Alert> }
      </Box>
      <Box style={style.actions}>
        <div></div>
        <Box style={{ display: "flex", gap: "0.5rem" }}>
          { isDirty && <Typography sx={style.dirty} variant='p_small'>Unsaved changes</Typography> }
          <Button onClick={handleBack} variant='outlined'>Back</Button>
          <Button onClick={handleUpdate} variant='contained'>Save Settings</Button>
        </Box>
      </Box>
    </AdminLayout>
  )
}

