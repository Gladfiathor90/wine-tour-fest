import { events } from '../data/demoData'
import { isSupabaseConfigured, supabase, type Database } from '../lib/supabase'
import type { FestivalEvent } from '../types/content'
import { removePublicFile, uploadPublicImage } from './storageService'

type ProgramItemRow = Database['public']['Tables']['program_items']['Row']
type ProgramItemInsert = Database['public']['Tables']['program_items']['Insert']
type ProgramItemUpdate = Database['public']['Tables']['program_items']['Update']

export type EventFormValues = {
  title: string
  slug: string
  description: string
  eventDate: string
  startTime: string
  endTime: string
  location: string
  category: string
  imageUrl: string
  wineryId: string
  displayOrder: string
  published: boolean
}

const scheduleTimeValue = (time: string) => {
  const [hours = '0', minutes = '0'] = time.split(':')
  const hourValue = Number(hours)
  const minuteValue = Number(minutes)
  return (hourValue < 6 ? hourValue + 24 : hourValue) * 60 + minuteValue
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function slugifyEventTitle(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function encodeTime(startTime: string, endTime: string) {
  const start = startTime.trim()
  const end = endTime.trim()
  return end ? `${start}|${end}` : start
}

export function decodeEventTime(value: string | null | undefined) {
  const [startTime = '', endTime = ''] = (value ?? '').split('|')
  return { startTime, endTime }
}

function mapRow(row: ProgramItemRow): FestivalEvent {
  const { startTime, endTime } = decodeEventTime(row.event_time)
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.description ?? '',
    description: row.description ?? '',
    category: row.category ?? 'Programma',
    startDate: row.event_date ?? '',
    endDate: row.event_date ?? '',
    startTime,
    endTime,
    location: row.location ?? '',
    wineryId: row.winery_id ?? undefined,
    imageUrl: row.image_url ?? undefined,
    bookingRequired: false,
    status: 'scheduled',
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function valuesToPayload(values: EventFormValues): ProgramItemInsert {
  const title = values.title.trim()
  return {
    title,
    slug: values.slug.trim() || slugifyEventTitle(title),
    description: emptyToNull(values.description),
    event_date: emptyToNull(values.eventDate),
    event_time: emptyToNull(encodeTime(values.startTime, values.endTime)),
    location: emptyToNull(values.location),
    category: emptyToNull(values.category),
    image_url: emptyToNull(values.imageUrl),
    winery_id: emptyToNull(values.wineryId),
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

export const eventService = {
  demoList: () =>
    [...events].sort((a, b) => a.startDate.localeCompare(b.startDate) || scheduleTimeValue(a.startTime) - scheduleTimeValue(b.startTime)),
  bySlug: (slug: string | undefined) => events.find((event) => event.slug === slug),
  byWineryId: (wineryId: string | undefined) => events.filter((event) => event.wineryId === wineryId),

  getPublished: async (): Promise<FestivalEvent[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('program_items')
      .select('*')
      .eq('published', true)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) throw error
    return data.map(mapRow)
  },

  getAll: async (): Promise<FestivalEvent[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('program_items')
      .select('*')
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true })
      .order('display_order', { ascending: true })

    if (error) throw error
    return data.map(mapRow)
  },

  getBySlug: async (slug: string | undefined): Promise<FestivalEvent | null> => {
    if (!slug) return null
    const client = assertSupabase()
    const { data, error } = await client
      .from('program_items')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()

    if (error) throw error
    return data ? mapRow(data) : null
  },

  getById: async (id: string | undefined): Promise<FestivalEvent | null> => {
    if (!id) return null
    const client = assertSupabase()
    const { data, error } = await client
      .from('program_items')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (error) throw error
    return data ? mapRow(data) : null
  },

  create: async (values: EventFormValues): Promise<FestivalEvent> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('program_items')
      .insert(valuesToPayload(values))
      .select('*')
      .single()

    if (error) throw error
    return mapRow(data)
  },

  update: async (id: string, values: EventFormValues): Promise<FestivalEvent> => {
    const client = assertSupabase()
    const payload: ProgramItemUpdate = valuesToPayload(values)
    const { data, error } = await client
      .from('program_items')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return mapRow(data)
  },

  remove: async (id: string): Promise<void> => {
    const client = assertSupabase()
    const { error } = await client.from('program_items').delete().eq('id', id)
    if (error) throw error
  },

  uploadImage: async (file: File, folder: string): Promise<string> => {
    const client = assertSupabase()
    return uploadPublicImage(client, 'event', file, folder)
  },

  removeImage: async (url: string): Promise<void> => {
    const client = assertSupabase()
    await removePublicFile(client, 'event', url)
  },
}
