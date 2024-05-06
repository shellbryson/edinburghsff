import React from 'react';
import ReactMarkdown from 'react-markdown';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useTheme, styled } from '@mui/material/styles';

// FacilityIcons
import LocalCafeFacilityIcon from '@mui/icons-material/LocalCafe';
import SportsBarFacilityIcon from '@mui/icons-material/SportsBar';
import LunchDiningFacilityIcon from '@mui/icons-material/LunchDining';
import WifiFacilityIcon from '@mui/icons-material/Wifi';
import PowerFacilityIcon from '@mui/icons-material/Power';
import PetsFacilityIcon from '@mui/icons-material/Pets';
import CreateFacilityIcon from '@mui/icons-material/Create';

// Custom UI
import LinkInterceptor from '../LinkInterceptor';
import StyledContent from '../StyledContent';

// Helpers
import { imageURL } from '../../utils/utils';

// Theme helpers
import useMediaQuery from '@mui/material/useMediaQuery';

export default function LocationModal(
  { pinData, isOpenDialog, handleCloseDetails }
) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      marginTop: "0.5rem"
    },
    '& .MuiBackdrop-root': {
      backgroundColor: 'transparent'
    },
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.brand.faint,
      color: theme.palette.text.main,
    },
  }));

  const MastheadImageBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    marginTop: "1rem",
    marginBottom: "1rem",
    "& img": {
      width: "3rem",
      height: "auto"
    }
  }));

  const FooterImageBox = styled(Box)(({ theme }) => ({
    width: '100%',
    marginTop: "2rem",
    '& img': {
      width: "100%",
      height: "auto"
    }
  }));

  const Facilities = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    backgroundColor: "rgba(255,255,255,.05)",
    marginBottom: "2rem",
    padding: "1rem"
  }));

  const FacilityIcon = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    width: "2.5rem",
    height: "2.5rem",
    borderRadius: "50%",
    border: "1px solid #fff",
  }));

  const Heading = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }));

  const Section = styled(Box)(({ theme }) => ({
    marginTop: "2rem",
  }));

  const SectionHeading = styled(Typography)(({ theme }) => ({
    display: "inline-block",
    color: theme.palette.brand.main
  }));

  const Hours = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: "1px",
    gap: "0",
    marginBottom: "1rem",
    '& p': {
      padding: "0",
      margin: "0",
    }
  }));

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
    marginTop: "1rem"
  }

  const pickFacilityIcon = (facility) => {
    switch (facility) {
      case "Coffee":
        return <LocalCafeFacilityIcon color="brand" />;
      case "Alcohol":
        return <SportsBarFacilityIcon color="brand" />;
      case "Food":
        return <LunchDiningFacilityIcon color="brand" />;
      case "Wifi":
        return <WifiFacilityIcon color="brand" />;
      case "Power":
        return <PowerFacilityIcon color="brand" />;
      case "Pets":
        return <PetsFacilityIcon color="brand" />;
      case "Writers":
        return <CreateFacilityIcon color="brand" />;
      default:
        return null;
    }
  }

  const renderFacilities = () => {
    if (!pinData) return;
    if (!pinData.facilities) return;
    const facilities = pinData.facilities.split(",");
    return <Facilities>
      {facilities.map((facility, index) => (
        <FacilityIcon key={index}>
          {pickFacilityIcon(facility)}
        </FacilityIcon>
      ))
      }
    </Facilities>;
  }


  const renderHours = () => {
    if (!pinData) return;
    if (!pinData.hours) return;
    const openingHoursArray = pinData.hours.split(",");
    return <Hours>
      {openingHoursArray.map((entry, index) => (
        <div key={index}>
          <Typography>{entry}</Typography>
        </div>
      ))
      }
    </Hours>;
  }

  const renderTips = () => {
    if (!pinData) return;
    if (!pinData.tips) return;
    return <Section>
      <SectionHeading component="h2" variant="h_medium">Tips</SectionHeading>
      <LinkInterceptor>
        <ReactMarkdown children={pinData.tips} />
      </LinkInterceptor>
    </Section>;
  }

  const renderPrice = () => {
    if (!pinData) return;
    if (!pinData.price) return;
    return <Box style={stylePrice}>
      <Typography>Price: {pinData.price} / 10</Typography>
    </Box>;
  }

  const renderNoise = () => {
    if (!pinData) return;
    if (!pinData.price) return;
    return <Box style={styleNoise}>
      <Typography>Noise: {pinData.noise} / 10</Typography>
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
      <DialogContent dividers className="scroll-dialog">
        <StyledContent elevation={0}>
          { pinData?.image && (
            <MastheadImageBox className="sff-event-masthead">
              <img src={imageURL(pinData?.image, 'medium')} alt={pinData?.title} style={{ width: "4rem", height: "auto" }}/>
            </MastheadImageBox>
          )}
          <Heading>
            <Typography component="span" variant="h_large">{pinData.title}</Typography>
          </Heading>
          { renderHours() }
          { renderFacilities() }
          <Box style={styleDescription}>
            <LinkInterceptor>
              <ReactMarkdown children={pinData.description} />
            </LinkInterceptor>
          </Box>
          {renderTips()}
          <Box style={{ display: "flex", justifyContent: "space-between" }}>
            { renderPrice() }
            { renderNoise() }
          </Box>
        </StyledContent>
        { pinData?.image && (
          <FooterImageBox className="sff-location-footer">
            <img loading="lazy" src={pinData.image} alt={pinData.title} />
          </FooterImageBox>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDetails} color="brand">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
