import { collection, onSnapshot, getDoc, doc, GeoPoint } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { Location } from '@/types/location'
import type { Pin } from '@/types/pin'

function parseCoords(data: Record<string, unknown>): { lat: number; lng: number } {
  // Firestore GeoPoint stored in a `position` or `location` field
  for (const key of ['position', 'location', 'geopoint']) {
    const val = data[key]
    if (val instanceof GeoPoint) {
      return { lat: val.latitude, lng: val.longitude }
    }
  }
  // Firestore GeoPoint stored directly as lat/lng fields
  if (data.lat instanceof GeoPoint) {
    return { lat: data.lat.latitude, lng: (data.lng as GeoPoint).longitude }
  }
  // Plain numbers or numeric strings
  return {
    lat: Number(data.lat),
    lng: Number(data.lng),
  }
}

export async function getIndexedLocations(): Promise<Pin[]> {
  const snap = await getDoc(doc(db, 'settings', 'index_pins'))
  if (!snap.exists()) return []
  const { pins } = snap.data() as { pins: Record<string, unknown>[] }
  return pins
    .map(data => {
      const lat = Number(data.lat)
      const lng = Number(data.lng)
      if (isNaN(lat) || isNaN(lng)) {
        console.warn('Indexed pin has invalid coordinates', data)
        return null
      }
      return { ...data, lat, lng } as Pin
    })
    .filter((pin): pin is Pin => pin !== null)
}

export function subscribeToLocations(
  callback: (locations: Location[]) => void
): () => void {
  return onSnapshot(collection(db, 'locations'), (snapshot) => {
const locations = snapshot.docs
      .map((doc) => {
        const data = doc.data() as Record<string, unknown>
        const { lat, lng } = parseCoords(data)
        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Location ${doc.id} has invalid coordinates`, data)
          return null
        }
        return { ...data, id: doc.id, lat, lng } as Location
      })
      .filter((loc): loc is Location => loc !== null)
    callback(locations)
  })
}
