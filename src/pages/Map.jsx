import React from 'react';

import { useHead } from 'hoofd';

// MUI
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// Custom Components
import PageHeading from '../components/PageHeading';
import MapView from '../components/MapView';

export default function Map() {

  useHead({
    title: "Map - Edinburgh SFF",
    language: 'en',
    metas: [{ name: 'description', content: "Writer-friendly cafes, bookshops and venues" }],
  });

  return (
    <>
      <MapView />
    </>
  )
}

