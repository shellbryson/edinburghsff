import React, { useState, useEffect, useRef } from 'react';

import { getDocs, collection, query } from 'firebase/firestore';
import { db } from "../firebase";

import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';

// import GoogleMapReact from 'google-map-react';
import GoogleMapReact from 'google-maps-react-markers';

// MUI
import Box from '@mui/material/Box';

// Custom UI

const styleMap={
  display: "block",
  position: "relative",
  marginTop: "2rem",
  width: "100%",
  height: "90vh",
  overflow: "hidden",
}

const pinStyle = {

}

const LocationPin = ({ text }) => (
  <div style={ pinStyle }>
    <PushPinOutlinedIcon />
    <p className="">{text}</p>
  </div>
)

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

  return (
    <>
      { isLoaded &&
        <Box style={styleMap}>
          <GoogleMapReact
            apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
            bootstrapURLKeys={{ key: import.meta.env.VITE_GOOGLEMAPS_API_KEY }}
            yesIWantToUseGoogleMapApiInternals
            defaultCenter={defaultLocation.center}
            defaultZoom={defaultLocation.zoom}>

            {locations.map((place) => (
              <LocationPin
                key={place.id}
                text={place.title}
                lat={parseFloat(place.lat)}
                lng={parseFloat(place.lng)}
              />
            ))}

          </GoogleMapReact>
        </Box>
      }
    </>
  )
}

