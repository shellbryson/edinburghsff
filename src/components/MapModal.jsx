import React from 'react';
import ReactMarkdown from 'react-markdown';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Custom UI
import EventsDetailsImage from './EventsDetailsImage';

// Theme helpers
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MapModal(
  { pinTitle, pinDescription, pinFacilities, pinImage, isOpenDialog, handleCloseDetails }
) {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const styleEventTitle={
    textAlign: "center"
  }

  const styleFacilities={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  }

  const styleEventDecsription={
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    marginBottom: "1rem",
    marginTop: "1rem"
  }

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      open={isOpenDialog}
      onClose={handleCloseDetails}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" sx={styleEventTitle}>
        <Typography variant="h2" component="span">{pinTitle}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box style={styleEventDecsription}>
          <ReactMarkdown children={pinDescription} />
        </Box>
        <Box style={styleFacilities}>
          { pinFacilities.map((facility, index) => (
            <Chip key={index} label={facility} />
          ))}
        </Box>
        { pinImage &&
          <EventsDetailsImage image={imageURL(pinImage?.image, 'medium')} alt={pinTitle} />
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} variant='contained'>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
