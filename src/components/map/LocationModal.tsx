'use client'

import ReactMarkdown from 'react-markdown'
import {
  Tent, Book, Pen, Library, Pin,
  Coffee, Beer, Sandwich, Utensils, Wifi, Zap, PawPrint,
} from 'lucide-react'
import type { Location } from '@/types/location'

const TAG_COLORS: Record<string, string> = {
  Venue: '#c184f8',
  Cafe: '#62bae3',
  Library: '#8cd672',
  Bookshop: '#d69372',
  Interesting: '#ffffff',
}

const TAG_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Venue: Tent,
  Cafe: Pen,
  Library: Library,
  Bookshop: Book,
  Interesting: Pin,
}

const FACILITY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Coffee,
  Alcohol: Beer,
  Meal: Utensils,
  Food: Sandwich,
  Wifi,
  Power: Zap,
  Pet: PawPrint,
}

interface LocationModalProps {
  location: Location | null
  onClose: () => void
}

export function LocationModal({ location, onClose }: LocationModalProps) {
  if (!location) return null

  const tags = location.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? []
  const facilities = location.facilities?.split(',').map(f => f.trim()).filter(Boolean) ?? []
  const hours = location.hours?.split(',').map(h => h.trim()).filter(Boolean) ?? []
  const hasFacilityBar = tags.length > 0 || facilities.length > 0
  const hasFooterMeta = (location.price ?? 0) > 0 || (location.noise ?? 0) > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70" />

      <div
        className="location-modal relative w-full max-w-sm max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {location.image && (
            <div className="flex justify-center mb-6 mt-2">
              <img src={location.image} alt={location.title} className="h-16 w-auto" />
            </div>
          )}

          <h2
            className="text-2xl uppercase text-center mb-4"
            style={{ color: '#fded07', fontFamily: '"Chakra Petch", sans-serif' }}
          >
            {location.title_long ?? location.title}
          </h2>

          {hours.length > 0 && (
            <div className="flex flex-col items-center mb-4 text-sm" style={{ color: '#f2f2f2' }}>
              {hours.map((hour, i) => <p key={i} className="m-0">{hour}</p>)}
            </div>
          )}

          {hasFacilityBar && (
            <div
              className="flex justify-center items-center gap-4 mb-6 p-4"
              style={{ backgroundColor: '#27260d' }}
            >
              {tags.map((tag) => {
                const Icon = TAG_ICONS[tag]
                const color = TAG_COLORS[tag]
                if (!Icon || !color) return null
                return (
                  <div
                    key={tag}
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ border: `1px solid ${color}`, color }}
                  >
                    <Icon size={20} />
                  </div>
                )
              })}
              {facilities.map((facility) => {
                const Icon = FACILITY_ICONS[facility]
                if (!Icon) return null
                return (
                  <div
                    key={facility}
                    className="flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ border: '1px solid #fded07', color: '#fded07' }}
                  >
                    <Icon size={20} />
                  </div>
                )
              })}
            </div>
          )}

          {location.description && (
            <div className="text-sm leading-relaxed" style={{ color: '#f2f2f2' }}>
              <ReactMarkdown>{location.description}</ReactMarkdown>
            </div>
          )}

          {location.tips && (
            <div className="mt-6">
              <h3
                className="uppercase mb-2"
                style={{ color: '#fded07', fontFamily: '"Chakra Petch", sans-serif' }}
              >
                Tips
              </h3>
              <div className="text-sm leading-relaxed" style={{ color: '#f2f2f2' }}>
                <ReactMarkdown>{location.tips}</ReactMarkdown>
              </div>
            </div>
          )}

          {hasFooterMeta && (
            <div
              className="flex gap-4 mt-6 p-4"
              style={{ backgroundColor: '#27260d' }}
            >
              {(location.price ?? 0) > 0 && (
                <div className="w-1/2 text-center p-2" style={{ backgroundColor: '#1b1a01' }}>
                  <p className="text-sm m-0" style={{ color: '#f2f2f2' }}>
                    Price: {location.price} / 10
                  </p>
                </div>
              )}
              {(location.noise ?? 0) > 0 && (
                <div className="w-1/2 text-center p-2" style={{ backgroundColor: '#1b1a01' }}>
                  <p className="text-sm m-0" style={{ color: '#f2f2f2' }}>
                    Noise: {location.noise} / 10
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div
          className="flex justify-end p-4"
          style={{ borderTop: '2px solid #27260d' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm border cursor-pointer transition-colors"
            style={{
              borderColor: '#fded07',
              color: '#fded07',
              fontFamily: '"Chakra Petch", sans-serif',
              textTransform: 'uppercase',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fded07'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#fded07'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
