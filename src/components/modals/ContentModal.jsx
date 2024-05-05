import React, { useEffect, useState } from 'react';

// MUI
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, styled } from '@mui/material/styles';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ContentModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
      backgroundColor: '#383838',
      color: '#fff',
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
    '& .MuiPaper-root': {
      backgroundColor: '#383838',
      color: '#fff',
    },
  }));

  const style={
    page: {
      display: "flex",
      position: "absolute",
      flexDirection: "column",
      overflow: "hidden",
      zIndex: "9999",
      inset: "0.5rem",
    },
    link: {
      color: "red",
    },
    navigation: {
      display: "flex",
      position: "relative",
      justifyContent: "center",
      alignItems: "center",
      gap: "1rem",
      padding: "0.5rem 0",
      color: "red"
    },
  }

  const styleEventTitle={
    textAlign: "center"
  }

  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="sm"
      open={true} fullScreen={fullScreen}
      onClose={handleClose}>
      <DialogTitle id="add-dialog-title" sx={styleEventTitle}>
        <Typography component="span" variant="h_large"></Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent className="scroll" style={{ borderBottom: "1px solid rgba(0,0,0, 0.1" }}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="brand">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
