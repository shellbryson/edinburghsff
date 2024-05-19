import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import GoogleMapReact from 'google-maps-react-markers';
import { useHead } from 'hoofd';

// Contexts
import { useApp } from '../context/AppContext';

// MUI
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

// Icons
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MyLocationIcon from '@mui/icons-material/MyLocation';

// Custom UI
import MapPanel from './MapPanel';
import MapPin from './MapPin';
import LocationModal from './modals/LocationModal';
import Spinner from './Spinner';
import Filter from './Filter';
import Logo from './Logo';

// Helpers
import {
  fetchDocument,
  fetchLocationsForMapDisplay
} from '../utils/utils';

const Controls = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  padding: "2px",
  position: "absolute",
  right: "0.5rem",
  bottom: "1rem",
  zIndex: "2",
  border: `1px solid ${theme.palette.brand.main}`,
  backgroundColor: theme.palette.brand.faint,
}));

const ToggleIconButton = styled(IconButton)(({ theme }) => ({
  borderRadius: "0",
  border: `2px solid ${theme.palette.brand.main}`,
  backgroundColor: theme.palette.brand.faint,
}));

export default function Map() {

  const {
    mapLocations,
    setMapLocations,
    focusMapPin,
    mapSearchText,
    isExpanded,
  } = useApp();

  const navigate = useNavigate();
  const mapRef = useRef(null);
  const theme = useTheme();

  useHead({
    title: "Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "The writers hub. Writer-friendly cafes, bookshops and venues" }],
  });

  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const [mapReady, setMapReady] = useState(false);
  const [pinData, setPinData] = useState({});

  const [screenSize, setScreenSize] = useState(window.innerWidth);

  const mapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    mapId: import.meta.env.VITE_GOOGLEMAPS_MAP_ID,
    zoomControl: false,
    streetViewControl: false,
  }

  const defaultLocation = {
    center: {
      lat: 55.9579741,
      lng: -3.1966372,
    },
    zoom: 13
  }

  const style = {
    map: {
      display: "block",
      position: "relative",
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      opacity: mapReady ? 1 : 0,
      transition: "opacity 2000ms",
    },
    logo: {
      display: "flex",
      position: "absolute",
      top: "1rem",
      right: "0.5rem",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    }
  }

  const getLocations = () => {
    fetchLocationsForMapDisplay((data) => {
      setMapLocations(data);
      setFilteredLocations(data);
      setIsLoaded(true);
    });
  }

  const centerMapOnPin = (pin) => {
    if (!pin) return;
    mapRef.current.panTo({
      lat: parseFloat(pin.lat), lng: parseFloat(pin.lng)
    });
    mapRef.current.setZoom(18);
  }

  useEffect(() => {
    getLocations();

    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    handleOnSearchMap();

    const thisPin = mapLocations.find(location => location.id === focusMapPin);
    if (thisPin) {
      centerMapOnPin(thisPin);
    }

    const selectedLocation = new URLSearchParams(window.location.search).get("location");
    if (selectedLocation) {
      fetchDocument("locations", selectedLocation, (pin) => {
        setPinData(pin);
        setIsOpenDialog(true);
      });
    }
  }, [mapSearchText, focusMapPin, mapLocations]);

  const onGoogleApiLoaded = ({map}) => {
    mapRef.current = map;
    setMapReady(true);
  }

  const onClickPin = (data) => {
    navigate(`?location=${encodeURIComponent(data.id)}`);
    setIsLoadingLocation(true);
    fetchDocument("locations", data.id, (pin) => {
      setPinData(pin);
      setIsLoadingLocation(false);
    });
    setIsOpenDialog(true);
  }

  const handleCloseDetails = () => {
    setPinData({});
    setIsOpenDialog(false);
    navigate(`/`);
  };

  const handleFilterMap = (tag) => {
    const filtered = tag ? mapLocations.filter(entry => entry.tags.includes(tag)) : mapLocations;
    setFilteredLocations(filtered);
  }

  const handleOnSearchMap = () => {
    if (mapLocations.length === 0) return;
    const filtered = mapLocations.filter(entry => entry.name.toLowerCase().includes(mapSearchText.toLowerCase()));
    if (mapSearchText === "") {
      setFilteredLocations(mapLocations);
    } else {
      setFilteredLocations(filtered);
    }
  }

  const handleZoomIn = () => {
    mapRef.current.setZoom(mapRef.current.getZoom() + 1);
  }

  const handleZoomOut = () => {
    mapRef.current.setZoom(mapRef.current.getZoom() - 1);
  }

  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((position) => {
      const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
      mapRef.current.panTo(pos);
    }, () => {
      console.log("Error: The Geolocation service failed.");
    });
  }

  const MapControls = () => {
    if (isExpanded && screenSize <= 380) return;
    return (
      <Controls>
        <Box style={{ backgroundColor: "#000"}}>
          <ToggleIconButton variant="outlined" onClick={handleZoomIn} style={style.action}><ZoomInIcon color="brand" /></ToggleIconButton>
        </Box>
        <Box style={{ backgroundColor: "#000"}}>
          <ToggleIconButton variant="outlined" onClick={handleZoomOut} style={style.action}><ZoomOutIcon color="brand" /></ToggleIconButton>
        </Box>
        <Box style={{ backgroundColor: "#000"}}>
          <ToggleIconButton variant="outlined" onClick={(e) => handleMyLocation()} style={style.action}><MyLocationIcon color="brand" /></ToggleIconButton>
        </Box>
      </Controls>
    )
  }

  return (
    isLoaded ?
      <>
        <Box style={style.map} className="sff-map">
          <MapControls />
          <GoogleMapReact
            apiKey={import.meta.env.VITE_GOOGLEMAPS_API_KEY}
            onGoogleApiLoaded={onGoogleApiLoaded}
            options={mapOptions}
            loadingContent={<Spinner />}
            defaultCenter={defaultLocation.center}
            defaultZoom={defaultLocation.zoom}
            >
            {filteredLocations.map((place, i) => (
              <MapPin
                onClickPin={onClickPin}
                key={i}
                data={place}
                lat={parseFloat(place.lat)}
                lng={parseFloat(place.lng)}
              />
            ))}
          </GoogleMapReact>
        </Box>
        <Box style={style.logo} className="sff-logo">
          <Logo />
        </Box>
        <Filter onFilterMap={handleFilterMap} onSearchMap={handleOnSearchMap} />
        <LocationModal
          pinData={pinData}
          isOpenDialog={isOpenDialog}
          isLoadingLocation={isLoadingLocation}
          handleCloseDetails={handleCloseDetails}
        />
        <MapPanel onSearchMap={handleOnSearchMap}/>
      </>
    : <Spinner />
  )
}

