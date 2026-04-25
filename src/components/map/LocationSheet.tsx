'use client'

import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Coffee, Beer, Sandwich, Utensils, Wifi, Zap, PawPrint, X } from 'lucide-react'
import type { Location } from '@/types/location'
import type { Pin } from '@/types/pin'

const FACILITY_ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  Coffee,
  Alcohol: Beer,
  Meal: Utensils,
  Food: Sandwich,
  Wifi,
  Power: Zap,
  Pet: PawPrint,
}

// ── List sheet (no selection) ──────────────────────────────────────────────

interface ListSheetProps {
  pins: Pin[]
  onSelect: (pin: Pin) => void
}

export function ListSheet({ pins, onSelect }: ListSheetProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`map-sheet sheet-enter absolute bottom-0 left-0 right-0 z-40 flex flex-col transition-[height] duration-300 ease-[cubic-bezier(.2,.7,.2,1)]`}
      style={{ height: expanded ? '70%' : '200px' }}
    >
      {/* Grab handle */}
      <button
        className="w-full h-6 flex items-center justify-center flex-shrink-0"
        onClick={() => setExpanded(v => !v)}
        aria-label={expanded ? 'Collapse list' : 'Expand list'}
      >
        <div className="w-9 h-1 rounded-full bg-black/20" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0 border-b border-black/[0.06] cursor-pointer"
        onClick={() => setExpanded(v => !v)}
      >
        <div>
          <p className="text-[10px] font-bold tracking-[.14em] uppercase text-black/50">
            {pins.length} places
          </p>
          <p className="font-display font-bold text-[22px] tracking-tight leading-tight mt-0.5">
            Bookshops & venues
          </p>
        </div>
        <span className="text-[11px] font-semibold tracking-[.04em] px-3.5 py-1.5 rounded-full bg-[var(--ink)] text-[var(--paper)]">
          {expanded ? 'Map' : 'List'}
        </span>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3.5 pb-20">
        {pins.map((pin, i) => (
          <button
            key={pin.id}
            className="w-full flex items-center gap-3.5 px-2 py-3 rounded-[10px] text-left hover:bg-black/[0.04] transition-colors"
            onClick={() => onSelect(pin)}
          >
            <span className="font-display font-bold text-sm text-black/40 w-6 text-right tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-[15px] tracking-tight leading-snug">
                {pin.name}
              </p>
              {pin.tags && (
                <p className="text-[11px] text-black/55 mt-0.5">
                  {pin.tags.split(',')[0].trim()}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Detail sheet (pin selected) ────────────────────────────────────────────

interface DetailSheetProps {
  location: Location
  onClose: () => void
}

export function DetailSheet({ location, onClose }: DetailSheetProps) {
  const facilities = location.facilities?.split(',').map(f => f.trim()).filter(Boolean) ?? []
  const tags = location.tags?.split(',').map(t => t.trim()).filter(Boolean) ?? []
  const hours = location.hours?.split(',').map(h => h.trim()).filter(Boolean) ?? []

  return (
    <div className="map-sheet sheet-enter absolute bottom-0 left-0 right-0 z-40 pb-5 max-h-[72%] flex flex-col">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-black/[0.06] flex items-center justify-center z-10"
        aria-label="Close"
      >
        <X size={12} />
      </button>

      {/* Grab bar */}
      <div className="w-9 h-1 rounded-full bg-black/20 mx-auto mt-3 mb-1 flex-shrink-0" />

      {/* Scrollable content */}
      <div className="overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-1 gap-3">
          <div className="flex-1 min-w-0 pr-8">
            {tags.length > 0 && (
              <p className="text-[10px] font-bold tracking-[.14em] uppercase text-black/50 mb-1">
                {tags[0]}
              </p>
            )}
            <h2 className="font-display font-extrabold text-[26px] leading-[1.1] tracking-[-0.03em]">
              {location.title_long ?? location.title}
            </h2>
            {location.address && (
              <p className="text-[13px] text-black/65 mt-1">{location.address}</p>
            )}
          </div>
        </div>

        {/* Pills row */}
        {(hours.length > 0 || facilities.length > 0) && (
          <div className="flex gap-1.5 flex-wrap px-5 pt-3.5">
            {hours.length > 0 && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.06]">
                Open · {hours[0]}
              </span>
            )}
            {facilities.map(f => {
              const Icon = FACILITY_ICONS[f]
              if (!Icon) return null
              return (
                <span key={f} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.06] flex items-center gap-1">
                  <Icon size={11} /> {f}
                </span>
              )
            })}
          </div>
        )}

        {/* Description */}
        {location.description && (
          <p className="px-5 pt-3.5 text-[14px] leading-[1.5] text-black/70 italic">
            {/* strip markdown for the brief note */}
            {location.description.replace(/[*_#`]/g, '').slice(0, 180)}
            {location.description.length > 180 ? '…' : ''}
          </p>
        )}

        {/* Tips */}
        {location.tips && (
          <div className="px-5 pt-3.5 text-[13px] leading-relaxed text-black/70">
            <ReactMarkdown>{location.tips}</ReactMarkdown>
          </div>
        )}

        {/* Price / noise */}
        {((location.price ?? 0) > 0 || (location.noise ?? 0) > 0) && (
          <div className="flex gap-2 px-5 pt-3.5">
            {(location.price ?? 0) > 0 && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--esff-accent)', color: 'var(--ink)' }}>
                Price {location.price}/10
              </span>
            )}
            {(location.noise ?? 0) > 0 && (
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/[0.06]">
                Noise {location.noise}/10
              </span>
            )}
          </div>
        )}

        {/* Action row */}
        <div className="flex gap-2 px-5 pt-4">
          {location.url && (
            <a
              href={location.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 h-11 rounded-xl border border-black/[0.12] flex items-center justify-center text-[13px] font-semibold gap-1.5 hover:bg-black/[0.04] transition-colors"
            >
              Website
            </a>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl flex items-center justify-center text-[13px] font-semibold gap-1.5"
            style={{ background: 'var(--ink)', color: 'var(--paper)' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
