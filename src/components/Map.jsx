import React, { useState, useEffect, useRef } from 'react';
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";
import GoogleMapReact from 'google-maps-react-markers';
import { useHead } from 'hoofd';

// MUI
import Box from '@mui/material/Box';

// Custom UI
import MapPin from './MapPin';
import MapModal from './MapModal';
import Spinner from './Spinner';
import Filter from './Filter';
import Logo from './Logo';
import { Opacity } from '@mui/icons-material';

export default function Map() {

  const mapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLEMAPS_MAP_ID
  }

  useHead({
    title: "Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Writer-friendly cafes, bookshops and venues" }],
  });

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

  const styleMap={
    display: "block",
    position: "relative",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    opacity: mapReady ? 1 : 0,
    transition: "opacity 2000ms",
  }

  const styleLogo = {
    display: "flex",
    position: "absolute",
    top: "0",
    right: "0",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  }

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

  useEffect(() => {
    getLocations();
  }, [])

  const onGoogleApiLoaded = ({ map }) => {
    mapRef.current = map
    setMapReady(true)
  }

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

  const handleFilterMap = (tag) => {
    const filtered = tag ? locations.filter(entry => entry.tags.includes(tag)) : locations;
    setFilteredLocations(filtered);
  }

  return (
    isLoaded ?
      <>
        <Box style={styleMap} className="sff-map">
          <GoogleMapReact
            apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
            onGoogleApiLoaded={onGoogleApiLoaded}
            options={mapOptions}
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
        <Box style={styleLogo} className="sff-logo">
          <Logo />
        </Box>
        <Filter onFilterMap={handleFilterMap} />
        <MapModal
          isOpenDialog={isOpenDialog}
          handleCloseDetails={handleCloseDetails}
          pinTitle={pinTitle}
          pinDescription={pinDescription}
          pinFacilities={pinFacilities}
          pinImage={pinImage}
        />
      </>
    : <Spinner />
  )
}

