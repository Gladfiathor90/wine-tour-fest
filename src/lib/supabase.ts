import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: {
      wineries: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          description: string | null
          logo_url: string | null
          cover_image_url: string | null
          gallery_urls: string[]
          address: string | null
          city: string | null
          province: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          email: string | null
          website: string | null
          facebook: string | null
          instagram: string | null
          opening_hours: string | null
          tastings: string | null
          display_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_urls?: string[]
          address?: string | null
          city?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          website?: string | null
          facebook?: string | null
          instagram?: string | null
          opening_hours?: string | null
          tastings?: string | null
          display_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          gallery_urls?: string[]
          address?: string | null
          city?: string | null
          province?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          website?: string | null
          facebook?: string | null
          instagram?: string | null
          opening_hours?: string | null
          tastings?: string | null
          display_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type SupabaseConfigStatus = {
  configured: boolean
  missingEnvVars: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_PUBLISHABLE_KEY'>
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

const missingEnvVars: SupabaseConfigStatus['missingEnvVars'] = [
  ...(!supabaseUrl ? ['VITE_SUPABASE_URL' as const] : []),
  ...(!supabasePublishableKey ? ['VITE_SUPABASE_PUBLISHABLE_KEY' as const] : []),
]

export const supabaseConfigStatus: SupabaseConfigStatus = {
  configured: missingEnvVars.length === 0,
  missingEnvVars,
}

export const isSupabaseConfigured = supabaseConfigStatus.configured

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabasePublishableKey)
  : null

export function verifySupabaseClientConfig(): SupabaseConfigStatus {
  return {
    configured: supabaseConfigStatus.configured,
    missingEnvVars: [...supabaseConfigStatus.missingEnvVars],
  }
}
