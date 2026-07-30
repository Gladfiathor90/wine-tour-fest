import { isSupabaseConfigured, supabase, type Database } from '../lib/supabase'
import { wineries } from '../data/demoData'
import type { Winery } from '../types/content'
import { removePublicFile, uploadPublicImage } from './storageService'

type WineryRow = Database['public']['Tables']['wineries']['Row']
type WineryInsert = Database['public']['Tables']['wineries']['Insert']
type WineryUpdate = Database['public']['Tables']['wineries']['Update']

export type WineryFormValues = {
  name: string
  slug: string
  shortDescription: string
  description: string
  logoUrl: string
  coverImageUrl: string
  gallery: string[]
  address: string
  city: string
  province: string
  latitude: string
  longitude: string
  phone: string
  email: string
  website: string
  facebook: string
  instagram: string
  openingHours: string
  tastings: string
  displayOrder: string
  published: boolean
}

const fallbackLogo = '/logos/wine%20tour%20fest%20svg.svg'
const fallbackCover = '/images/brand-identity-2026.jpeg'

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function numberOrNull(value: string) {
  const trimmed = value.trim().replace(',', '.')
  if (!trimmed) return null
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : null
}

export function slugifyWineryName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function mapRow(row: WineryRow): Winery {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description ?? '',
    description: row.description ?? row.short_description ?? '',
    address: row.address ?? '',
    city: row.city ?? 'Lizzano',
    phone: row.phone ?? undefined,
    email: row.email ?? undefined,
    website: row.website ?? undefined,
    instagram: row.instagram ?? undefined,
    facebook: row.facebook ?? undefined,
    openingHours: row.opening_hours ?? '',
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    googleMapsUrl: row.latitude && row.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${row.latitude},${row.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${row.address ?? ''} ${row.city ?? 'Lizzano'} ${row.province ?? 'TA'}`)}`,
    logoUrl: row.logo_url || fallbackLogo,
    coverImageUrl: row.cover_image_url || fallbackCover,
    gallery: row.gallery_urls?.length ? row.gallery_urls : [],
    featured: false,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function valuesToPayload(values: WineryFormValues): WineryInsert {
  const name = values.name.trim()
  const slug = values.slug.trim() || slugifyWineryName(name)

  return {
    name,
    slug,
    short_description: emptyToNull(values.shortDescription),
    description: emptyToNull(values.description),
    logo_url: emptyToNull(values.logoUrl),
    cover_image_url: emptyToNull(values.coverImageUrl),
    gallery_urls: values.gallery.filter(Boolean),
    address: emptyToNull(values.address),
    city: emptyToNull(values.city),
    province: emptyToNull(values.province),
    latitude: numberOrNull(values.latitude),
    longitude: numberOrNull(values.longitude),
    phone: emptyToNull(values.phone),
    email: emptyToNull(values.email),
    website: emptyToNull(values.website),
    facebook: emptyToNull(values.facebook),
    instagram: emptyToNull(values.instagram),
    opening_hours: emptyToNull(values.openingHours),
    tastings: emptyToNull(values.tastings),
    display_order: Number(values.displayOrder) || 0,
    published: values.published,
  }
}

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase non configurato. Inserisci VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  return supabase
}

export const wineryService = {
  demoList: () => wineries,
  bySlug: (slug: string | undefined) => wineries.find((winery) => winery.slug === slug),
  byId: (id: string | undefined) => wineries.find((winery) => winery.id === id),

  getPublished: async (): Promise<Winery[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('wineries')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    return data.map(mapRow)
  },

  getAll: async (): Promise<Winery[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('wineries')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error
    return data.map(mapRow)
  },

  getBySlug: async (slug: string | undefined): Promise<Winery | null> => {
    if (!slug) return null
    const client = assertSupabase()
    const { data, error } = await client
      .from('wineries')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error) throw error
    return data ? mapRow(data) : null
  },

  getById: async (id: string | undefined): Promise<Winery | null> => {
    if (!id) return null
    const client = assertSupabase()
    const { data, error } = await client
      .from('wineries')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ? mapRow(data) : null
  },

  create: async (values: WineryFormValues): Promise<Winery> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('wineries')
      .insert(valuesToPayload(values))
      .select('*')
      .single()

    if (error) throw error
    return mapRow(data)
  },

  update: async (id: string, values: WineryFormValues): Promise<Winery> => {
    const client = assertSupabase()
    const payload: WineryUpdate = valuesToPayload(values)
    const { data, error } = await client
      .from('wineries')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return mapRow(data)
  },

  remove: async (id: string): Promise<void> => {
    const client = assertSupabase()
    const { error } = await client.from('wineries').delete().eq('id', id)
    if (error) throw error
  },

  uploadImage: async (file: File, folder: string): Promise<string> => {
    const client = assertSupabase()
    return uploadPublicImage(client, 'wineries', file, folder)
  },

  removeImage: async (url: string): Promise<void> => {
    const client = assertSupabase()
    await removePublicFile(client, 'wineries', url)
  },
}
