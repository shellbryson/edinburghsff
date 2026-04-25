export interface Location {
  id: string
  title: string
  title_long?: string
  name_short?: string
  lat: number
  lng: number
  description?: string
  address?: string
  url?: string
  tags?: string        // comma-separated: "Venue,Cafe"
  facilities?: string  // comma-separated: "Coffee,Wifi,Power"
  hours?: string       // comma-separated hours strings
  tips?: string
  price?: number
  noise?: number
  image?: string
  featured?: boolean
  show?: boolean
}
