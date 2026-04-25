import type { Metadata } from 'next'
import { VenueMap } from '@/components/map/VenueMap'

export const metadata: Metadata = {
  title: 'Map',
  description: 'A map of venues and resources for science fiction and fantasy writers in Edinburgh.',
}

export default function MapPage() {
  return (
    <main style={{ height: '100dvh' }} className="flex flex-col">
      <VenueMap />
    </main>
  )
}
