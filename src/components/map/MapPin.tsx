'use client'

import { Tent, Book, Pen, Library, Pin } from 'lucide-react'
import type { Location } from '@/types/location'

const PIN_COLORS: Record<string, string> = {
  Venue: '#c184f8',
  Cafe: '#62bae3',
  Library: '#8cd672',
  Bookshop: '#d69372',
  Interesting: '#ffffff',
  default: '#ffffff',
}

const PIN_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Venue: Tent,
  Cafe: Pen,
  Library: Library,
  Bookshop: Book,
  Interesting: Pin,
  default: Pin,
}

function getPinType(tags?: string): string {
  if (!tags) return 'default'
  const tag = tags.split(',').map(t => t.trim()).find(t => t in PIN_COLORS)
  return tag ?? 'default'
}

interface MapPinProps {
  location: Location
  onClick: (location: Location) => void
}

export function MapPin({ location, onClick }: MapPinProps) {
  const pinType = getPinType(location.tags)
  const color = PIN_COLORS[pinType]
  const Icon = PIN_ICONS[pinType]

  return (
    <div
      className="map-pin"
      style={{ '--pin-color': color } as React.CSSProperties}
      onClick={() => onClick(location)}
      title={location.title}
    >
      <div className="map-pin-icon">
        <Icon size={16} />
      </div>
    </div>
  )
}
