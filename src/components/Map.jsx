import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from "react-router-dom";
import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";
import GoogleMapReact from 'google-maps-react-markers';
import { useHead } from 'hoofd';

// Context
import { useApp } from '../context/AppContext';

// MUI
import Box from '@mui/material/Box';

// Custom UI
import MapPanel from './MapPanel';
import MapPin from './MapPin';
import MapModal from './MapModal';
import Spinner from './Spinner';
import Filter from './Filter';
import Logo from './Logo';

import { slugify } from '../utils/utils';

export default function Map() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    isExpanded,
    setIsExpanded,
    isExploded,
    setIsExploded
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();

  useHead({
    title: "Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Writer-friendly cafes, bookshops and venues" }],
  });

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false);
  const [pinData, setPinData] = useState({});

  const mapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLEMAPS_MAP_ID
  }

  const defaultLocation = {
    center: {
      lat: 55.9579741,
      lng: -3.1966372,
    },
    zoom: 13
  }

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
        hidden: false,
        focus: false
      });
    });
    setMapLocations(l);
    setFilteredLocations(l);
    setIsLoaded(true);
  }

  const centerMapOnPin = (pin) => {
    if (pin) {
      mapRef.current.panTo({
        lat: parseFloat(pin.lat), lng: parseFloat(pin.lng)
      });
      mapRef.current.setZoom(18);
    }
  }

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (searchParams.get('placeID')) {
      const place = mapLocations.find(l => l.id === searchParams.get('placeID'));
      if (place) {
        setPinData(place);
        setIsOpenDialog(true);
      }
    }
  }, [mapLocations]);

  const thisPin = mapLocations.find(location => location.id === focusMapPin);
  if (thisPin) {
    centerMapOnPin(thisPin);
  }

  const onGoogleApiLoaded = ({ map }) => {
    mapRef.current = map
    setMapReady(true)
  }

  const onClickPin = (data) => {
    setPinData(data);
    setIsOpenDialog(true)
    setSearchParams({ placeID: data.id, placeSlug: slugify(data.title) });
  }

  const handleCloseDetails = () => {
    setSearchParams({});
    setPinData({});
    setIsOpenDialog(false);
  };

  const handleFilterMap = (tag) => {
    const filtered = tag ? mapLocations.filter(entry => entry.tags.includes(tag)) : mapLocations;
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
            defaultZoom={defaultLocation.zoom}
            >
            {filteredLocations.map((place) => (
              <MapPin
                onClickPin={onClickPin}
                key={place.id}
                tags={place.tags}
                title={place.title}
                data={place}
                lat={parseFloat(place.lat)}
                lng={parseFloat(place.lng)}
                focus={place.focus}
              />
            ))}
          </GoogleMapReact>
        </Box>
        <Box style={styleLogo} className="sff-logo">
          <Logo />
        </Box>
        {!isExploded && <Filter onFilterMap={handleFilterMap} />}
        <MapModal
          pinData={pinData}
          isOpenDialog={isOpenDialog}
          handleCloseDetails={handleCloseDetails}
        />
        <MapPanel />
      </>
    : <Spinner />
  )
}

