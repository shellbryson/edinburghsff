'use client'

import { useEffect, useState } from 'react'
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps'
import { subscribeToLocations } from '@/lib/firebase/locations'
import { MapPin } from '@/components/map/MapPin'
import { LocationModal } from '@/components/map/LocationModal'
import type { Location } from '@/types/location'

const EDINBURGH_CENTER = { lat: 55.9533, lng: -3.1883 }
const DEFAULT_ZOOM = 13

export function VenueMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selected, setSelected] = useState<Location | null>(null)

  useEffect(() => {
    const unsubscribe = subscribeToLocations(setLocations)
    return unsubscribe
  }, [])

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        defaultCenter={EDINBURGH_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        gestureHandling="greedy"
      >
        {locations.map((location) => (
          <AdvancedMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
          >
            <MapPin location={location} onClick={setSelected} />
          </AdvancedMarker>
        ))}
      </Map>

      <LocationModal location={selected} onClose={() => setSelected(null)} />
    </APIProvider>
  )
}
