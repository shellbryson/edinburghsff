'use client'

import { useEffect, useState, useMemo } from 'react'
import { APIProvider, Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps'
import { subscribeToLocations } from '@/lib/firebase/locations'
import { MapPin } from '@/components/map/MapPin'
import { ListSheet, DetailSheet } from '@/components/map/LocationSheet'
import type { Location } from '@/types/location'

const EDINBURGH_CENTER = { lat: 55.9533, lng: -3.1883 }
const DEFAULT_ZOOM = 13

// ── Filter config ──────────────────────────────────────────────────────────
const FILTERS = [
  { key: 'all',        label: 'All' },
  { key: 'Bookshop',   label: 'Bookshops' },
  { key: 'Venue',      label: 'Venues' },
  { key: 'Cafe',       label: 'Cafés' },
  { key: 'Library',    label: 'Libraries' },
]

// ── Zoom controls — needs map instance ────────────────────────────────────
function ZoomControls() {
  const map = useMap()
  const zoom = (delta: number) => {
    if (!map) return
    map.setZoom((map.getZoom() ?? DEFAULT_ZOOM) + delta)
  }
  const locate = () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
      map?.panTo({ lat: coords.latitude, lng: coords.longitude })
    })
  }
  return (
    <>
      <div className="glass absolute right-3.5 z-30 flex flex-col rounded-xl overflow-hidden shadow-sm"
           style={{ top: 'calc(54px + 108px + 16px)' }}>
        <button
          onClick={() => zoom(1)}
          className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-black/5 transition-colors"
          aria-label="Zoom in"
        >+</button>
        <div className="h-px bg-black/10" />
        <button
          onClick={() => zoom(-1)}
          className="w-9 h-9 flex items-center justify-center text-lg font-medium hover:bg-black/5 transition-colors"
          aria-label="Zoom out"
        >−</button>
      </div>

      <button
        onClick={locate}
        className="glass absolute right-3.5 z-30 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm hover:bg-white/95 transition-colors"
        style={{ top: 'calc(54px + 108px + 16px + 80px + 8px)' }}
        aria-label="My location"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" fill="currentColor"/>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────
export function VenueMap() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selected, setSelected] = useState<Location | null>(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const unsubscribe = subscribeToLocations(setLocations)
    return unsubscribe
  }, [])

  const filtered = useMemo(() => {
    return locations.filter(loc => {
      if (filter !== 'all' && !loc.tags?.split(',').map(t => t.trim()).includes(filter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!(loc.title + (loc.tags ?? '') + (loc.address ?? '')).toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [locations, filter, search])

  const handlePinClick = (location: Location) => {
    setSelected(location)
  }

  const handleClose = () => {
    setSelected(null)
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative w-full h-full">
        <Map
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          defaultCenter={EDINBURGH_CENTER}
          defaultZoom={DEFAULT_ZOOM}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI
        >
          {filtered.map((location) => (
            <AdvancedMarker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
            >
              <MapPin
                location={location}
                active={selected?.id === location.id}
                onClick={handlePinClick}
              />
            </AdvancedMarker>
          ))}

          <ZoomControls />
        </Map>

        {/* Floating top controls */}
        <div className="absolute top-0 left-0 right-0 z-30 flex flex-col gap-2 p-3.5 pt-[calc(env(safe-area-inset-top,0px)+14px)]">
          {/* Search bar */}
          <div className="glass flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-[0_8px_24px_rgba(0,0,0,.08)]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-black/50 shrink-0">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search bookshops & venues"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-(--ink) placeholder:text-black/45"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-black/45 hover:text-black/70 transition-colors">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Filter chips */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
            {FILTERS.map(({ key, label }) => {
              const count = key === 'all'
                ? locations.length
                : locations.filter(l => l.tags?.split(',').map(t => t.trim()).includes(key)).length
              if (count === 0 && key !== 'all') return null
              const active = filter === key
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`glass shrink-0 flex items-center gap-1.5 px-3.5 py-1.75 rounded-full text-xs font-medium shadow-[0_4px_12px_rgba(0,0,0,.06)] transition-colors ${
                    active ? 'bg-(--ink)! border-(--ink)! text-(--paper)' : 'text-(--ink)'
                  }`}
                >
                  {label}
                  <span className={`text-[10px] tabular-nums ${active ? 'text-white/50' : 'text-black/50'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Bottom sheet */}
        {selected ? (
          <DetailSheet location={selected} onClose={handleClose} />
        ) : (
          <ListSheet locations={filtered} onSelect={setSelected} />
        )}
      </div>
    </APIProvider>
  )
}
