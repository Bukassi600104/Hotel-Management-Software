import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email/send'
import BookingCancellation from '../../../../../emails/BookingCancellation'
import { formatDateLong } from '@/lib/format'
import React from 'react'
import { hasSupabaseAdminEnv } from '@/lib/supabase/config'
import { cancelDemoBooking } from '@/lib/demo/store'

const schema = z.object({
  bookingReference: z.string().min(1),
  email: z.string().email(),
  reason: z.string().optional(),
})

const NON_CANCELLABLE_STATUSES = ['cancelled', 'refunded', 'expired', 'checked_in', 'checked_out']

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
    }

    const { bookingReference, email, reason } = parsed.data

    if (!hasSupabaseAdminEnv()) {
      const booking = cancelDemoBooking(bookingReference, email, reason)
      if (!booking) {
        return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
      }
      const hoursUntilCheckIn = (new Date(booking.check_in_date).getTime() - Date.now()) / 3_600_000
      return NextResponse.json({ success: true, isWithin24Hours: hoursUntilCheckIn < 24 })
    }

    const admin = createAdminClient()

    // Fetch and verify ownership
    const { data: booking, error } = await admin
      .from('bookings')
      .select('id, booking_reference, guest_name, guest_email, check_in_date, check_out_date, status, rooms(name)')
      .eq('booking_reference', bookingReference.toUpperCase().trim())
      .eq('guest_email', email.toLowerCase().trim())
      .single()

    if (error || !booking) {
      return NextResponse.json({ error: 'Booking not found.' }, { status: 404 })
    }

    if (!booking.status || NON_CANCELLABLE_STATUSES.includes(booking.status)) {
      return NextResponse.json({ error: `This booking cannot be cancelled (current status: ${(booking.status ?? 'unknown').replace('_', ' ')}).` }, { status: 400 })
    }

    // Check 24-hour policy (we still allow cancellation but note refund policy)
    const checkIn = new Date(booking.check_in_date)
    const now = new Date()
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / 3_600_000
    const isWithin24Hours = hoursUntilCheckIn < 24

    // Cancel the booking
    const { error: updateError } = await admin
      .from('bookings')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason ?? 'Cancelled by guest',
      })
      .eq('id', booking.id)

    if (updateError) {
      return NextResponse.json({ error: 'Could not cancel booking. Please try again.' }, { status: 500 })
    }

    const roomName = (booking.rooms as { name: string } | null)?.name ?? 'your room'

    // Send cancellation email to guest (best-effort)
    try {
      await sendEmail({
        to: booking.guest_email,
        subject: `Booking Cancelled — ${booking.booking_reference}`,
        react: React.createElement(BookingCancellation, {
          guestName: booking.guest_name,
          bookingReference: booking.booking_reference,
          roomName,
          checkInDate: formatDateLong(booking.check_in_date),
          checkOutDate: formatDateLong(booking.check_out_date),
          cancellationReason: reason,
        }),
      })
    } catch (emailErr) {
      console.error('[cancel] Email send failed:', emailErr)
    }

    return NextResponse.json({ success: true, isWithin24Hours })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
