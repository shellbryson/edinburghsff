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

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    marginTop: "1rem",
    borderRadius: "0",
    '&::before': {
      position: "absolute",
      content: '""',
      display: 'block',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      top: "0",
      right: "0",
    },
    '&::after': {
      position: "absolute",
      content: '""',
      display: 'block',
      width: '4px',
      height: '4px',
      backgroundColor: theme.palette.brand.main,
      bottom: "0",
      left: "0",
    }
  },
  '& .MuiPaper-root': {
    backgroundColor: theme.palette.brand.faint,
    color: theme.palette.text.main,
    borderRadius: "0",
    borderTop: `1px solid ${theme.palette.highlight.main}`,
    borderBottom: `1px solid ${theme.palette.highlight.main}`,
    borderLeft: `1px solid ${theme.palette.highlight.main}`,
    borderRight: `1px solid ${theme.palette.highlight.main}`,
  },
}));

export default function ContentModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

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
