import { isSupabaseConfigured, supabase } from '../lib/supabase'

const visitorKeyName = 'wtf_visitor_key'
const duplicateWindowMinutes = 10

function fallbackKey(wineryId: string, visitorKey: string) {
  return `wtf_checkin_${wineryId}_${visitorKey}`
}

function getVisitorKey() {
  const existing = window.localStorage.getItem(visitorKeyName)
  if (existing) return existing
  const created = crypto.randomUUID()
  window.localStorage.setItem(visitorKeyName, created)
  return created
}

function assertSupabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase non configurato.')
  }

  return supabase
}

export const checkInService = {
  createWineryCheckIn: async (wineryId: string) => {
    const client = assertSupabase()
    const visitorKey = getVisitorKey()
    const since = new Date(Date.now() - duplicateWindowMinutes * 60 * 1000).toISOString()
    const { data: recent, error: recentError } = await client
      .from('winery_checkins')
      .select('id, created_at')
      .eq('winery_id', wineryId)
      .eq('visitor_key', visitorKey)
      .gte('created_at', since)
      .maybeSingle()

    if (recentError) {
      const key = fallbackKey(wineryId, visitorKey)
      const last = window.localStorage.getItem(key)
      if (last && new Date(last).getTime() >= new Date(since).getTime()) {
        return { status: 'duplicate' as const, createdAt: last }
      }
      const createdAt = new Date().toISOString()
      window.localStorage.setItem(key, createdAt)
      return { status: 'created' as const, createdAt }
    }
    if (recent) return { status: 'duplicate' as const, createdAt: recent.created_at }

    const { data, error } = await client
      .from('winery_checkins')
      .insert({ winery_id: wineryId, visitor_key: visitorKey })
      .select('id, created_at')
      .single()

    if (error) throw error
    return { status: 'created' as const, createdAt: data.created_at }
  },
}
