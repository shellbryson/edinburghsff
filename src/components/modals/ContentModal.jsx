import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme, styled } from '@mui/material/styles';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

export default function ContentModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      marginTop: "0.5rem"
    },
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.brand.faint,
      color: theme.palette.text.main,
    },
  }));

  const handleClose = () => {
    navigate(`/`);
  };

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="sm"
      open={true} fullScreen={fullScreen}
      onClose={handleClose}>
      <DialogContent className="scroll-dialog">
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="brand">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
