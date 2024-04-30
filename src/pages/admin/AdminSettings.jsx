import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../firebase";

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
import { useTheme } from '@mui/material/styles';

import {
  fetchDocument
} from '../../utils/utils';

export default function AdminSettings() {

  const { user } = useAuth();
  const { setIsLoading } = useApp();

  const navigate = useNavigate();

  // Common
  const [settingsPanelIntro, setSettingsPanelIntro] = useState('');
  const [settingsEventIntro, setSettingsEventIntro] = useState('');

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
    page: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      marginBottom: "1rem",
    },
    paper: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
    },
    content: {
      textAlign: "left",
      minHeight: "calc(100vh -2rem)",
      padding: "1rem",
      margin: "0.5rem",
      overflow: "auto",
    },
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
    fetchDocument("settings", "config", (data) => {
      handleOpenUpdate(data);
    });
  }, []);

  const handleOpenUpdate = (data) => {
    setSettingsPanelIntro(data.textPanelIntro);
    setSettingsEventIntro(data.textEventIntro);
  };

  // ### UPDATE

  const handleUpdate = async () => {
    setError('');
    setIsLoading(true);
    setError('');
    const payload = {
      textPanelIntro: settingsPanelIntro,
      textEventIntro: settingsEventIntro,
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

  const handleChangePanelIntro = (text) => {
    if (text !== settingsPanelIntro) setIsDirty(true);
    setSettingsPanelIntro(text);
  }

  const handleChangeEventIntro = (text) => {
    if (text !== settingsEventIntro) setIsDirty(true);
    setSettingsEventIntro(text);
  }

  const handleBack = () => {
    navigate(`/admin/`);
  }

  return (
    <Box style={style.page} className="sff-page">
      <Paper style={style.paper}>
        <Box style={style.content}>
          <Box>
            <Typography component="h1" variant="h1" style={{textAlign: "center"}}>
              Settings
            </Typography>
            <Stack spacing={2} sx={{ mt: 2}}>
              <TextField value={settingsPanelIntro} required multiline rows={8} label="Panel Introduction" onChange={(e) => handleChangePanelIntro(e.target.value)}  />
              <TextField value={settingsEventIntro} required multiline rows={8} label="Events Introduction" onChange={(e) => handleChangeEventIntro(e.target.value)}  />

              { error && <Alert severity="warning">{error}</Alert> }

            </Stack>
          </Box>
          <Box style={style.actions}>
            <div></div>
            <Box style={{ display: "flex", gap: "0.5rem" }}>
              { isDirty && <Typography sx={style.dirty} variant='p_small'>Unsaved changes</Typography> }
              <Button onClick={handleBack} variant='outlined'>Back</Button>
              <Button onClick={handleUpdate} variant='contained'>Save Settings</Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

