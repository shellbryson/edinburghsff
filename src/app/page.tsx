import type { Metadata } from 'next'
import { VenueMap } from '@/components/map/VenueMap'

export const metadata: Metadata = {
  title: 'Edinburgh SFF — Writing Resources Map',
  description: 'A map of venues and resources for science fiction and fantasy writers in Edinburgh.',
}

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 min-h-0">
        <VenueMap />
      </div>
    </main>
  )
}
