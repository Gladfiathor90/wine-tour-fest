import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export type Database = {
  public: {
    Tables: Record<string, never>
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
