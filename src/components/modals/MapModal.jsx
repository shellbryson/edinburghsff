import React from 'react';
import ReactMarkdown from 'react-markdown';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import WifiIcon from '@mui/icons-material/Wifi';
import PowerIcon from '@mui/icons-material/Power';
import PetsIcon from '@mui/icons-material/Pets';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import IconButton from '@mui/material/IconButton';

// Custom UI
import EventsDetailsImage from '../EventsDetailsImage';

// Helpers
import { imageURL } from '../../utils/utils';

// Theme helpers
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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

export default function MapModal(
  { pinData, isOpenDialog, handleCloseDetails }
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
    marginBottom: "1rem"
  }

  const styleIcon={
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    border: "1px solid #fff",
  }

  const stylePrice={
    paddingLeft: "1rem",
    paddingRight: "1rem",
    marginTop: "1rem"
  }

  const styleNoise={
    paddingLeft: "1rem",
    paddingRight: "1rem",
    marginTop: "1rem"
  }

  const styleDescription={
    paddingLeft: "1rem",
    paddingRight: "1rem",
    marginTop: "1rem"
  }

  const pickIcon = (facility) => {
    switch (facility) {
      case "Coffee":
        return <LocalCafeIcon color="secondary" />;
      case "Alcohol":
        return <SportsBarIcon color="secondary" />;
      case "Food":
        return <LunchDiningIcon color="secondary" />;
      case "Wifi":
        return <WifiIcon color="secondary" />;
      case "Power":
        return <PowerIcon color="secondary" />;
      case "Pets":
        return <PetsIcon color="secondary" />;
      case "Writers":
        return <HistoryEduIcon color="secondary" />;
      default:
        return null;
    }
  }

  const renderFacilities = () => {
    if (!pinData) return;
    if (!pinData.facilities) return;
    const facilities = pinData.facilities.split(",");
    return <Box style={styleFacilities}>
      {facilities.map((facility, index) => (
        <Box key={index} style={styleIcon}>
          {pickIcon(facility)}
        </Box>
      ))
      }
    </Box>;
  }

  const renderPrice = () => {
    if (!pinData) return;
    if (!pinData.price) return;
    return <Box style={stylePrice}>
      <Typography>Price: {pinData.price}</Typography>
    </Box>;
  }

  const renderNoise = () => {
    if (!pinData) return;
    if (!pinData.price) return;
    return <Box style={styleNoise}>
      <Typography>Noise: {pinData.noise}</Typography>
    </Box>;
  }

  return (
    <BootstrapDialog
      fullWidth
      maxWidth="sm"
      fullScreen={isMobile}
      open={isOpenDialog}
      onClose={handleCloseDetails}
      scroll="paper"
      aria-labelledby="add-dialog-title">
      <DialogTitle id="add-dialog-title" sx={styleEventTitle}>
        <Typography variant="h2" component="span">{pinData.title}</Typography>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCloseDetails}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box style={styleDescription}>
          <ReactMarkdown children={pinData.description} />
        </Box>
        { renderFacilities() }
        { renderPrice() }
        { renderNoise() }
        { pinData.image &&
          <EventsDetailsImage image={imageURL(pinData?.image, 'medium')} alt={pinData.title} />
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} color="brand">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
