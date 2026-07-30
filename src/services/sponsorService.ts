import { sponsors } from '../data/demoData'
import { isSupabaseConfigured, supabase, type Database } from '../lib/supabase'
import type { Sponsor, SponsorLevel } from '../types/content'
import { removePublicFile, uploadPublicImage } from './storageService'

type SponsorRow = Database['public']['Tables']['sponsors']['Row']
type SponsorInsert = Database['public']['Tables']['sponsors']['Insert']
type SponsorUpdate = Database['public']['Tables']['sponsors']['Update']
type LegacySponsorRow = Omit<SponsorRow, 'published'> & { published?: boolean }

export type SponsorFormValues = {
  name: string
  logoUrl: string
  website: string
  level: SponsorLevel
  displayOrder: string
  published: boolean
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function mapRow(row: LegacySponsorRow): Sponsor {
  return {
    id: row.id,
    name: row.name,
    logoUrl: row.logo_url ?? '',
    website: row.link_url ?? undefined,
    level: (row.category || 'Sponsor') as SponsorLevel,
    displayOrder: row.display_order,
    active: row.published ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function valuesToPayload(values: SponsorFormValues): SponsorInsert {
  return {
    name: values.name.trim(),
    logo_url: emptyToNull(values.logoUrl),
    link_url: emptyToNull(values.website),
    category: values.level,
    display_order: Number(values.displayOrder) || 0,
    published: values.published,
  }
}

function valuesToLegacyPayload(values: SponsorFormValues) {
  return {
    name: values.name.trim(),
    logo_url: emptyToNull(values.logoUrl),
    link_url: emptyToNull(values.website),
    category: values.level,
    display_order: Number(values.displayOrder) || 0,
  }
}

function isMissingPublishedColumn(error: { code?: string; message?: string } | null) {
  return Boolean(error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('published')))
}

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase non configurato. Inserisci VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  return supabase
}

export const sponsorService = {
  demoList: () => [...sponsors].filter((sponsor) => sponsor.active).sort((a, b) => a.displayOrder - b.displayOrder),

  getPublished: async (): Promise<Sponsor[]> => {
    const client = assertSupabase()
    const response = await client
      .from('sponsors')
      .select('*')
      .eq('published', true)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    if (!response.error) return response.data.map(mapRow)
    if (!isMissingPublishedColumn(response.error)) throw response.error

    const { data, error } = await client.from('sponsors').select('*').order('display_order', { ascending: true }).order('name', { ascending: true })
    if (error) throw error
    return data.map(mapRow)
  },

  getAll: async (): Promise<Sponsor[]> => {
    const client = assertSupabase()
    const { data, error } = await client.from('sponsors').select('*').order('display_order', { ascending: true }).order('name', { ascending: true })
    if (error) throw error
    return data.map(mapRow)
  },

  getById: async (id: string | undefined): Promise<Sponsor | null> => {
    if (!id) return null
    const client = assertSupabase()
    const { data, error } = await client.from('sponsors').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
  },

  create: async (values: SponsorFormValues): Promise<Sponsor> => {
    const client = assertSupabase()
    const response = await client.from('sponsors').insert(valuesToPayload(values)).select('*').single()
    if (!response.error) return mapRow(response.data)
    if (!isMissingPublishedColumn(response.error)) throw response.error

    const { data, error } = await client.from('sponsors').insert(valuesToLegacyPayload(values)).select('*').single()
    if (error) throw error
    return mapRow(data)
  },

  update: async (id: string, values: SponsorFormValues): Promise<Sponsor> => {
    const client = assertSupabase()
    const payload: SponsorUpdate = valuesToPayload(values)
    const response = await client.from('sponsors').update(payload).eq('id', id).select('*').single()
    if (!response.error) return mapRow(response.data)
    if (!isMissingPublishedColumn(response.error)) throw response.error

    const { data, error } = await client.from('sponsors').update(valuesToLegacyPayload(values)).eq('id', id).select('*').single()
    if (error) throw error
    return mapRow(data)
  },

  remove: async (id: string): Promise<void> => {
    const client = assertSupabase()
    const { error } = await client.from('sponsors').delete().eq('id', id)
    if (error) throw error
  },

  uploadLogo: async (file: File, folder: string): Promise<string> => {
    const client = assertSupabase()
    return uploadPublicImage(client, 'sponsors', file, folder)
  },

  removeLogo: async (url: string): Promise<void> => {
    const client = assertSupabase()
    await removePublicFile(client, 'sponsors', url)
  },
}
