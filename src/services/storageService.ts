import type { SupabaseClient } from '@supabase/supabase-js'

export function publicUrlToStoragePath(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const markerIndex = url.indexOf(marker)
  if (markerIndex === -1) return null
  return decodeURIComponent(url.slice(markerIndex + marker.length).split('?')[0])
}

export async function removePublicFile(client: SupabaseClient, bucket: string, url: string) {
  const path = publicUrlToStoragePath(url, bucket)
  if (!path) return
  const { error } = await client.storage.from(bucket).remove([path])
  if (error) throw error
}

export async function uploadPublicImage(client: SupabaseClient, bucket: string, file: File, folder: string) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const safeName = file.name
    .replace(/\.[^.]+$/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  const path = `${folder}/${Date.now()}-${safeName || 'image'}.${extension}`
  const { error } = await client.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error

  const { data } = client.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
