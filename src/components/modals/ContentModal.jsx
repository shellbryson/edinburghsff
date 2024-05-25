import React from 'react';
import { useNavigate } from "react-router-dom";

// MUI
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme, styled } from '@mui/material/styles';

// ICONS
import ChevronLeft from '@mui/icons-material/ChevronLeft';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    marginTop: "1rem",
    marginBottom: "0",
    borderRadius: "0",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingBottom: "1rem",
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
    minHeight: "calc(100dvh - 2rem)",
  },
}));

export default function ContentModal({ children }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

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
      <DialogActions style={{ display: "flex", justifyContent: "space-between", borderTop: `2px solid ${theme.palette.highlight.main}`}}>
        <Button onClick={handleBack} size="small" color="brand" variant="contained" startIcon={<ChevronLeft />}>Back</Button>
        <Button onClick={handleClose} size="small" color="brand" variant="outlined">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
