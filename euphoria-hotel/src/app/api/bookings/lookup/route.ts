import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'

const schema = z.object({
  bookingReference: z.string().min(1),
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Please provide a valid booking reference and email.' }, { status: 400 })
    }

    const { bookingReference, email } = parsed.data
    const admin = createAdminClient()

    const { data: booking, error } = await admin
      .from('bookings')
      .select('id, booking_reference, guest_name, guest_email, guest_phone, room_id, check_in_date, check_out_date, total_nights, total_amount, price_per_night, subtotal, vat_amount, num_adults, num_children, arrival_time, status, booking_type, created_at, paid_at, cancelled_at, cancellation_reason, notes, rooms(name, slug, thumbnail_url)')
      .eq('booking_reference', bookingReference.toUpperCase().trim())
      .eq('guest_email', email.toLowerCase().trim())
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'No booking found with that reference and email combination.' }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
