import React, { useState, useEffect, useRef } from 'react';

import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";

import GoogleMapReact from 'google-maps-react-markers';

// MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import LocalCafeOutlinedIcon from '@mui/icons-material/LocalCafeOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';

// Custom UI
import MapPin from './MapPin';
import Spinner from './Spinner';

const styleMap={
  display: "block",
  position: "relative",
  marginTop: "2rem",
  width: "100%",
  height: "60vh",
  overflow: "hidden",
}

const iconStyle = {
  display: "block",
  width: "2rem",
  height: "2rem",
  fontSize: "2rem",
  borderRadius: "50%",
  backgroundColor: "rgba(255, 255, 255, 0.75)"
}

const styleFilter = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  marginTop: "2rem",
}

export default function MapView() {

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const mapRef = useRef(null)
  const [mapReady, setMapReady] = useState(false)

  const q = query(collection(db, "locations"));

  const getLocations = async () => {
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

  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current = map
    setMapReady(true)
  }

  useEffect(() => {
    getLocations();
  }, [])

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
    <>
      { isLoaded &&
        <>
          <Box sx={styleFilter}>
            <IconButton aria-label="Venues" onClick={() => filterMap('Venue')}>
              <StarOutlinedIcon style={ iconStyle } />
            </IconButton>
            <IconButton aria-label="Bookshops" onClick={() => filterMap('Bookshop')}>
              <MenuBookOutlinedIcon style={ iconStyle } />
            </IconButton>
            <IconButton aria-label="Cafes" onClick={() => filterMap('Cafe')}>
              <LocalCafeOutlinedIcon style={ iconStyle } />
            </IconButton>
            <IconButton aria-label="Libraries" onClick={() => filterMap('Library')}>
              <LocalLibraryOutlinedIcon style={ iconStyle } />
            </IconButton>
            <IconButton aria-label="All" onClick={() => filterMap()}>
              <PushPinOutlinedIcon style={ iconStyle } />
            </IconButton>
          </Box>
          <Box style={styleMap}>
            <GoogleMapReact
              apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
              bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLEMAPS_API_KEY }}
              onGoogleApiLoaded={onGoogleApiLoaded}
              loadingContent={<Spinner />}
              defaultCenter={defaultLocation.center}
              defaultZoom={defaultLocation.zoom}>

              {filteredLocations.map((place) => (
                <MapPin
                  key={place.id}
                  tags={place.tags}
                  title={place.title}
                  lat={parseFloat(place.lat)}
                  lng={parseFloat(place.lng)}
                />
              ))}
            </GoogleMapReact>
          </Box>
        </>
      }
      { !isLoaded && <Spinner />}
    </>
  )
}

