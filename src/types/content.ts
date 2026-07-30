import type { LucideIcon } from 'lucide-react'

export type EventStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'
export type SponsorLevel = 'Main sponsor' | 'Partner' | 'Sponsor' | 'Patrocini' | 'Associazioni'
export type MapPointCategory = 'winery' | 'parking' | 'info' | 'toilet' | 'shuttle' | 'poi' | 'main'

export type Winery = {
  id: string
  name: string
  slug: string
  shortDescription: string
  description: string
  address: string
  city: string
  phone?: string
  email?: string
  website?: string
  instagram?: string
  facebook?: string
  openingHours: string
  latitude: number
  longitude: number
  googleMapsUrl: string
  logoUrl: string
  coverImageUrl: string
  gallery: string[]
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export type FestivalEvent = {
  id: string
  title: string
  slug: string
  shortDescription: string
  description: string
  category: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  location: string
  wineryId?: string
  imageUrl?: string
  externalUrl?: string
  bookingRequired: boolean
  bookingInfo?: string
  status: EventStatus
  published: boolean
  createdAt: string
  updatedAt: string
}

export type NewsItem = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  publishedAt: string
  author: string
  important: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export type Sponsor = {
  id: string
  name: string
  logoUrl: string
  website?: string
  level: SponsorLevel
  displayOrder: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export type WineryCheckIn = {
  id: string
  wineryId: string
  visitorKey: string
  createdAt: string
}

export type MapPoint = {
  id: string
  name: string
  category: MapPointCategory
  description: string
  address: string
  latitude: number
  longitude: number
  icon: string
  wineryId?: string
  active: boolean
}

export type GeneralInfo = {
  eventName: string
  edition: string
  startDate: string
  endDate: string
  city: string
  province: string
  mainVenue: string
  description: string
  email: string
  phone: string
  website: string
  instagram: string
  facebook: string
  parkingInfo: string
  accessibilityInfo: string
  usefulInfo: Array<{ title: string; content: string }>
}

export type GameSettings = {
  active: boolean
  duration: number
  lives: number
  prizeThreshold: number
  prizeText: string
  finalMessage: string
  itemScores: Record<'glass' | 'grape' | 'cheese' | 'brokenBottle', number>
  gameSpeed: number
}

export type GastronomyDay = {
  id: string
  date: string
  day: string
  month: string
  year: string
  dishes: string[]
  note?: string
  price?: string
}

export type AdminSection = {
  label: string
  path: string
  description: string
  icon: LucideIcon
}
