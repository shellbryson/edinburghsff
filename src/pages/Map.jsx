import React from 'react';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Custom Components
import PageHeading from '../components/PageHeading';
import MapView from '../components/MapView';

export default function Map() {

  return (
    <>
      <Container>
        <PageHeading heading="Map" />
        <Typography variant="p" component="p" gutterBottom align='center'>
          Places to write, read or of interest
        </Typography>
      </Container>
      <MapView />
    </>
  )
}

