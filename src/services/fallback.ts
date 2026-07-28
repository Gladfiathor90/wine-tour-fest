import { isSupabaseConfigured, supabase } from '../lib/supabase'

export async function readWithFallback<T>(tableName: string, fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured || !supabase) {
    return fallback
  }

  const { data, error } = await supabase.from(tableName).select('*')
  if (error || !data) {
    return fallback
  }

  return data as T[]
}
