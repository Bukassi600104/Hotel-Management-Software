import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hasSupabaseAdminEnv, hasSupabasePublicEnv } from '@/lib/supabase/config'
import { rooms as staticRooms } from '@/lib/data/rooms'
import type { Database } from '@/types/database'
import type { Room } from '@/types'

export type RoomRow = Database['public']['Tables']['rooms']['Row']

function demoRooms(): Room[] {
  return staticRooms.map((room) => ({ ...room, id: room.id || room.slug }))
}

// Converts a database row (snake_case) to the app Room type (camelCase)
function roomFromRow(row: RoomRow): Room {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name ?? row.name,
    pricePerNight: row.price_per_night,
    maxGuests: row.max_guests,
    bedType: row.bed_type ?? '',
    roomSizeSqm: row.room_size_sqm ?? 0,
    tagline: row.short_description ?? '',
    description: row.description ?? '',
    amenities: row.amenities ?? [],
    thumbnail: row.thumbnail_url ?? '',
    gallery: row.gallery_urls ?? [],
    badge: row.badge ?? undefined,
    displayOrder: row.display_order ?? 0,
  }
}

export async function getAllRooms(): Promise<Room[]> {
  if (!hasSupabasePublicEnv()) return demoRooms()

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .order('display_order')

  if (error) throw new Error(error.message)
  return (data ?? []).map(roomFromRow)
}

export async function getRoomBySlug(slug: string): Promise<Room | null> {
  if (!hasSupabasePublicEnv()) {
    return demoRooms().find((room) => room.slug === slug) ?? null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) return null
  return roomFromRow(data)
}

export async function getAllRoomSlugs(): Promise<string[]> {
  if (!hasSupabasePublicEnv()) return demoRooms().map((room) => room.slug)

  const supabase = await createClient()
  const { data } = await supabase
    .from('rooms')
    .select('slug')
    .eq('is_active', true)
  return (data ?? []).map((r) => r.slug)
}

export async function getAvailableRooms(
  checkin: string,
  checkout: string,
  guests: number
): Promise<Room[]> {
  if (!hasSupabaseAdminEnv()) {
    return demoRooms().filter((room) => room.maxGuests >= guests)
  }

  const admin = createAdminClient()

  const { data, error } = await admin.rpc('get_available_rooms', {
    p_checkin: checkin,
    p_checkout: checkout,
    p_guests: guests,
  })

  if (error) {
    // Fallback: skip availability filter if RPC fails
    const { data: all } = await admin
      .from('rooms')
      .select('*')
      .eq('is_active', true)
      .gte('max_guests', guests)
      .order('display_order')
    return (all ?? []).map(roomFromRow)
  }

  return (data as RoomRow[] ?? []).map(roomFromRow)
}

// Admin-only: all rooms regardless of is_active
export async function getAllRoomsAdmin(): Promise<RoomRow[]> {
  if (!hasSupabaseAdminEnv()) {
    throw new Error('Supabase admin environment is not configured.')
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('rooms')
    .select('*')
    .order('display_order')

  if (error) throw new Error(error.message)
  return data ?? []
}
