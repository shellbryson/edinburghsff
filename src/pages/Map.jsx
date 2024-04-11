import React from 'react';

import { useHead } from 'hoofd';

// Custom Components
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

