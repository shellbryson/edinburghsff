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

// Facility Icons
import LocalCafeFacilityIcon from '@mui/icons-material/LocalCafe';
import SportsBarFacilityIcon from '@mui/icons-material/SportsBar';
import LunchDiningFacilityIcon from '@mui/icons-material/LunchDining';  // snacks, lunch
import RestaurantIcon from '@mui/icons-material/Restaurant'; // Larger meals
import WifiFacilityIcon from '@mui/icons-material/Wifi';
import PowerFacilityIcon from '@mui/icons-material/Power';
import PetsFacilityIcon from '@mui/icons-material/Pets';

// Location Tag Icons
import PushPinIcon from '@mui/icons-material/PushPin';
import FestivalIcon from '@mui/icons-material/Festival';
import BookIcon from '@mui/icons-material/Book';
import CreateIcon from '@mui/icons-material/Create';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';

// Custom UI
import LinkInterceptor from '../LinkInterceptor';
import StyledContent from '../StyledContent';
import Loader from '../Loader';

// Helpers
import { imageURL } from '../../utils/utils';

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
  },
}));

const MastheadImageBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: "1rem",
  marginBottom: "2rem",
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
  backgroundColor: theme.palette.highlight.main,
  marginBottom: "2rem",
  padding: "1rem"
}));

const TagIcon = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "1rem",
  width: "2.5rem",
  height: "2.5rem",
}));

const Heading = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  maxWidth: "40ch",
  margin: "0 auto",
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

const FooterMeta = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
  backgroundColor: theme.palette.highlight.main,
  alignContent: "center",
  padding: "1rem",
  '& > div' : {
    backgroundColor: theme.palette.brand.faint,
    width: "50%",
  },
  '& p' : {
    padding: "0.5rem 1rem",
    margin: "0",
    textAlign: "center",
  }
}));

export default function LocationModal({
  pinData,
  isOpenDialog,
  isLoadingLocation,
  handleCloseDetails
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const styleDescription={
    marginTop: "1rem"
  }

  const pickTagIcon = (tag, i) => {
    let el;
    let color;
    switch (tag) {
      case "Venue":
        color = "pinVenue";
        el = <FestivalIcon color="pinVenue" />;
        break;
      case "Bookshop":
        color = "pinBookshop";
        el =  <BookIcon color="pinBookshop" />;
        break;
      case "Cafe":
        color = "pinCafe";
        el =  <CreateIcon color="pinCafe" />;
        break;
      case "Library":
        color = "pinLibrary";
        el =  <LocalLibraryIcon color="pinLibrary" />;
        break;
      case "Interesting":
        color = "pinInteresting";
        el =  <PushPinIcon color="pinInteresting" />;
        break;
      default:
        el =  null;
    }
    if (!el) return;
    return <TagIcon color={color} key={i} style={{ borderRadius: "50%", border: `1px solid ${theme.palette[color].main}`}}>{el}</TagIcon>
  }

  const pickFacilityIcon = (facility, i) => {
    let el;
    switch (facility) {
      case "Coffee":
        el = <LocalCafeFacilityIcon color="brand" />;
        break;
      case "Alcohol":
        el = <SportsBarFacilityIcon color="brand" />;
        break;
      case "Meal":
        el = <RestaurantIcon color="brand" />;
        break;
      case "Food":
        el = <LunchDiningFacilityIcon color="brand" />;
        break;
      case "Wifi":
        el = <WifiFacilityIcon color="brand" />;
        break;
      case "Power":
        el = <PowerFacilityIcon color="brand" />;
        break;
      case "Pet":
        el = <PetsFacilityIcon color="brand" />;
        break;
      default:
        el = null;
    }
    if (!el) return;
    return <TagIcon color="brand" key={i} style={{ borderRadius: "50%", border: `1px solid ${theme.palette.brand.main}`}}>{el}</TagIcon>
  }

  const renderFacilities = () => {
    if (!pinData) return;
    if (!pinData.facilities && !pinData.tags) return;
    const facilities = pinData?.facilities && pinData.facilities.split(",");
    const tags = pinData?.tags && pinData.tags.split(",");
    return <Facilities>
      {tags && tags.map((tag, index) => (
        pickTagIcon(tag, index)
      ))}
      {facilities && facilities.map((facility, index) => (
        pickFacilityIcon(facility, index)
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

  const renderFooter = () => {
    if (!pinData?.price > 0 && !pinData?.noise > 0) return;
    return <FooterMeta>
      { pinData?.price > 0 &&
        <Box>
          <Typography>Price: {pinData.price} / 10</Typography>
        </Box>
      }
      { pinData?.noise > 0 &&
        <Box>
          <Typography>Noise: {pinData.noise} / 10</Typography>
        </Box>
      }
    </FooterMeta>
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
      <DialogContent className="scroll-dialog">
        { isLoadingLocation && <Loader />}
        { !isLoadingLocation && pinData && (
          <StyledContent elevation={0}>
            { pinData?.image && (
              <MastheadImageBox className="sff-event-masthead">
                <img src={imageURL(pinData?.image, 'medium')} alt={pinData?.title} style={{ width: "4rem", height: "auto" }}/>
              </MastheadImageBox>
            )}
            <Heading>
              <Typography component="span" variant="h_large">
                {pinData?.title_long ? pinData.title_long : pinData.title}
              </Typography>
            </Heading>
            { renderHours() }
            { renderFacilities() }
            <Box style={styleDescription}>
              <LinkInterceptor>
                <ReactMarkdown children={pinData.description} />
              </LinkInterceptor>
            </Box>
            {renderTips()}
            {renderFooter()}
          </StyledContent>
        )}
        { pinData?.image && (
          <FooterImageBox className="sff-location-footer">
            <img loading="lazy" src={pinData.image} alt={pinData.title} />
          </FooterImageBox>
        )}
      </DialogContent>
      <DialogActions style={{ borderTop: `2px solid ${theme.palette.highlight.main}`}}>
        <Button onClick={handleCloseDetails} size="small" color="brand" variant="outlined">Close</Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
