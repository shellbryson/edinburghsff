'use client'

import type { Pin } from '@/types/pin'

interface MapPinProps {
  pin: Pin
  active: boolean
  onClick: (pin: Pin) => void
}

export function MapPin({ pin, active, onClick }: MapPinProps) {
  return (
    <div
      className={`map-pin${active ? ' active' : ''}`}
      onClick={() => onClick(pin)}
      title={pin.name}
    >
      <svg width="36" height="44" viewBox="-22 -36 44 50" overflow="visible">
        {/* pulse halo */}
        <circle className="pin-halo" cx="0" cy="-10" r="22" />
        {/* teardrop body */}
        <path
          className="pin-body"
          d="M0,-26 C-12,-26 -18,-18 -18,-10 C-18,2 0,16 0,16 C0,16 18,2 18,-10 C18,-18 12,-26 0,-26 Z"
        />
        {/* centre dot */}
        <circle className="pin-dot" cx="0" cy="-12" r="5" />
      </svg>
    </div>
  )
}
