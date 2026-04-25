/** Lightweight pin entry stored in settings/index_pins */
export interface Pin {
  id: string
  lat: number
  lng: number
  name: string
  name_short?: string
  tags?: string
  featured?: boolean
  show?: boolean
}
