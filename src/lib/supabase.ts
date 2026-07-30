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
  missingEnvVars: Array<'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'>
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const missingEnvVars: SupabaseConfigStatus['missingEnvVars'] = [
  ...(!supabaseUrl ? ['VITE_SUPABASE_URL' as const] : []),
  ...(!supabaseAnonKey ? ['VITE_SUPABASE_ANON_KEY' as const] : []),
]

export const supabaseConfigStatus: SupabaseConfigStatus = {
  configured: missingEnvVars.length === 0,
  missingEnvVars,
}

export const isSupabaseConfigured = supabaseConfigStatus.configured

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

export function verifySupabaseClientConfig(): SupabaseConfigStatus {
  return {
    configured: supabaseConfigStatus.configured,
    missingEnvVars: [...supabaseConfigStatus.missingEnvVars],
  }
}
