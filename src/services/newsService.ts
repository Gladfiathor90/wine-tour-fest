import { newsItems } from '../data/demoData'
import { isSupabaseConfigured, supabase, type Database } from '../lib/supabase'
import type { NewsItem } from '../types/content'
import { removePublicFile, uploadPublicImage } from './storageService'

type NewsRow = Database['public']['Tables']['news']['Row']
type NewsInsert = Database['public']['Tables']['news']['Insert']
type NewsUpdate = Database['public']['Tables']['news']['Update']

export type NewsFormValues = {
  title: string
  slug: string
  content: string
  imageUrl: string
  publishedDate: string
  published: boolean
}

function emptyToNull(value: string) {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

export function slugifyNewsTitle(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function excerptFromContent(content: string) {
  const plain = content.replace(/\s+/g, ' ').trim()
  return plain.length > 150 ? `${plain.slice(0, 147)}...` : plain
}

function mapRow(row: NewsRow): NewsItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: excerptFromContent(row.content ?? ''),
    content: row.content ?? '',
    imageUrl: row.cover_url ?? '',
    publishedAt: row.published_date ?? row.created_at.slice(0, 10),
    author: 'Wine Tour Fest',
    important: false,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function valuesToPayload(values: NewsFormValues): NewsInsert {
  const title = values.title.trim()
  return {
    title,
    slug: values.slug.trim() || slugifyNewsTitle(title),
    cover_url: emptyToNull(values.imageUrl),
    content: emptyToNull(values.content),
    published_date: emptyToNull(values.publishedDate),
    published: values.published,
  }
}

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase non configurato. Inserisci VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  return supabase
}

export const newsService = {
  demoList: () => [...newsItems].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
  bySlug: (slug: string | undefined) => newsItems.find((item) => item.slug === slug),

  getPublished: async (): Promise<NewsItem[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(mapRow)
  },

  getAll: async (): Promise<NewsItem[]> => {
    const client = assertSupabase()
    const { data, error } = await client
      .from('news')
      .select('*')
      .order('published_date', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return data.map(mapRow)
  },

  getBySlug: async (slug: string | undefined): Promise<NewsItem | null> => {
    if (!slug) return null
    const client = assertSupabase()
    const { data, error } = await client.from('news').select('*').eq('slug', slug).eq('published', true).maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
  },

  getById: async (id: string | undefined): Promise<NewsItem | null> => {
    if (!id) return null
    const client = assertSupabase()
    const { data, error } = await client.from('news').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data ? mapRow(data) : null
  },

  create: async (values: NewsFormValues): Promise<NewsItem> => {
    const client = assertSupabase()
    const { data, error } = await client.from('news').insert(valuesToPayload(values)).select('*').single()
    if (error) throw error
    return mapRow(data)
  },

  update: async (id: string, values: NewsFormValues): Promise<NewsItem> => {
    const client = assertSupabase()
    const payload: NewsUpdate = valuesToPayload(values)
    const { data, error } = await client.from('news').update(payload).eq('id', id).select('*').single()
    if (error) throw error
    return mapRow(data)
  },

  remove: async (id: string): Promise<void> => {
    const client = assertSupabase()
    const { error } = await client.from('news').delete().eq('id', id)
    if (error) throw error
  },

  uploadImage: async (file: File, folder: string): Promise<string> => {
    const client = assertSupabase()
    return uploadPublicImage(client, 'news', file, folder)
  },

  removeImage: async (url: string): Promise<void> => {
    const client = assertSupabase()
    await removePublicFile(client, 'news', url)
  },
}
