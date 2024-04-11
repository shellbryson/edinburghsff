import React, { useState, useEffect, useRef } from 'react';

import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";

import GoogleMapReact from 'google-maps-react-markers';

import ReactMarkdown from 'react-markdown';

import {imageURL} from '../utils/utils';

// MUI
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Custom UI
import MapPin from './MapPin';
import Spinner from './Spinner';
import EventsDetailsImage from './EventsDetailsImage';

// Theme helpers
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



export default function MapView() {

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

  const styleMap={
    display: "block",
    position: "relative",
    top: "0",
    left: "0",
    width: "100vw",
    height: isMobile ? "calc(100vh - 56px)" : "100vh",
    overflow: "hidden",
  }

  const iconStyle = {
    display: "block",
    width: "1.5rem",
    height: "1.5rem",
    fontSize: "1.5rem",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.75)"
  }

  const styleFilter = {
    display: "flex",
    position: "absolute",
    bottom: "1rem",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "2rem",
    zIndex: 1000,
    backgroundColor: "rgb(0, 0, 0)",
  }

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  const [pinTitle, setPinTitle] = useState('');
  const [pinFacilities, setPinFacilities] = useState([]);
  const [pinDescription, setPinDescription] = useState('');
  const [pinImage, setPinImage] = useState('');

  const getLocations = async () => {
    const q = query(collection(db, "locations"));
    const querySnapshot = await getDocs(q);
    const l = [];
    querySnapshot.forEach((doc) => {
      l.push({
        ...doc.data(),
        id: doc.id,
        hidden: false
      });
    });
    setLocations(l);
    setFilteredLocations(l);
    setIsLoaded(true)
  }

  const onGoogleApiLoaded = ({ map }) => {
    mapRef.current = map
    setMapReady(true)
  }

  useEffect(() => {
    getLocations();
  }, [])

  const onClickPin = (data) => {
    setPinTitle(data.title);
    setPinDescription(data.description);
    setPinImage(data.image);
    if (data.facilities) {
      setPinFacilities(data.facilities.split(','));
    }
    setIsOpenDialog(true);
  }

  const handleCloseDetails = () => {
    setPinTitle('');
    setPinDescription('');
    setPinImage('');
    setPinFacilities([]);
    setIsOpenDialog(false);
  };

  const defaultLocation = {
    center: {
      lat: 55.9579741,
      lng: -3.1966372,
    },
    zoom: 13
  }

  const filterMap = (tag) => {
    const filtered = tag ? locations.filter(entry => entry.tags.includes(tag)) : locations;
    setFilteredLocations(filtered);
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
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

      { isLoaded &&
        <>
          <Box sx={styleFilter}>
            <IconButton aria-label="Venues" onClick={() => filterMap('Venue')}>
              <StarOutlinedIcon style={ iconStyle } color="brand" />
            </IconButton>
            <IconButton aria-label="Bookshops" onClick={() => filterMap('Bookshop')}>
              <MenuBookOutlinedIcon style={ iconStyle } color="brand" />
            </IconButton>
            <IconButton aria-label="Cafes" onClick={() => filterMap('Cafe')}>
              <LocalCafeOutlinedIcon style={ iconStyle } color="brand" />
            </IconButton>
            <IconButton aria-label="Libraries" onClick={() => filterMap('Library')}>
              <LocalLibraryOutlinedIcon style={ iconStyle } color="brand" />
            </IconButton>
            <IconButton aria-label="All" onClick={() => filterMap()}>
              <PushPinOutlinedIcon style={ iconStyle } color="brand" />
            </IconButton>
          </Box>
          <Box style={styleMap}>
            <GoogleMapReact
              apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
              onGoogleApiLoaded={onGoogleApiLoaded}
              options={{
                mapTypeControl: false,
                mapId: import.meta.env.VITE_GOOGLEMAPS_MAP_ID
              }}
              loadingContent={<Spinner />}
              defaultCenter={defaultLocation.center}
              defaultZoom={defaultLocation.zoom}>

              {filteredLocations.map((place) => (
                <MapPin
                  onClickPin={onClickPin}
                  key={place.id}
                  tags={place.tags}
                  title={place.title}
                  data={place}
                  lat={parseFloat(place.lat)}
                  lng={parseFloat(place.lng)}
                />
              ))}
            </GoogleMapReact>
          </Box>
        </>
      }
      { !isLoaded && <Spinner />}
    </Box>
  )
}

