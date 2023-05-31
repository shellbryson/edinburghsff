import React, { useState, useEffect, useRef } from 'react';

import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";

import GoogleMapReact from 'google-maps-react-markers';

// MUI
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// Custom UI
import MapPin from './MapPin';

const styleMap={
  display: "block",
  position: "relative",
  marginTop: "2rem",
  width: "100%",
  height: "80vh",
  overflow: "hidden",
}

export default function MapView() {

  const [locations, setLocations] = useState([]);
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
        id: doc.id
      });
    });
    console.log("ESFF: loaded locations", l);
    setLocations(l);
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

  const displayLoader = () => {

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: "100%", minHeight: "300px" }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      { isLoaded &&
        <Box style={styleMap}>
          <GoogleMapReact
            apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLEMAPS_API_KEY }}
            onGoogleApiLoaded={onGoogleApiLoaded}
            loadingContent={<>{displayLoader()}</>}
            defaultCenter={defaultLocation.center}
            defaultZoom={defaultLocation.zoom}>

            {locations.map((place) => (
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
      }
      { !isLoaded && <>
          {displayLoader()}
        </>
      }
    </>
  )
}

