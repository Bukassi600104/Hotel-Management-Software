import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateBookingReference } from '@/lib/utils/booking-reference'
import { calculateNights, isDateInPast, isStayTooLong, isValidDateString } from '@/lib/utils/dates'
import { buildPricingBreakdown } from '@/lib/utils/pricing'
import { sendEmail } from '@/lib/email/send'
import ReservationConfirmation from '../../../../../emails/ReservationConfirmation'
import AdminReservationAlert from '../../../../../emails/AdminReservationAlert'
import { formatDateLong } from '@/lib/format'
import { checkRateLimit } from '@/lib/rate-limit'
import React from 'react'

const schema = z.object({
  roomSlug: z.string().min(1),
  checkin: z.string().refine(isValidDateString, 'Invalid check-in date'),
  checkout: z.string().refine(isValidDateString, 'Invalid check-out date'),
  numAdults: z.coerce.number().int().min(1).max(10).default(1),
  numChildren: z.coerce.number().int().min(0).max(6).default(0),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).regex(/^[+\d\s-]+$/),
  arrivalTime: z.string().optional(),
  notes: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const limited = await checkRateLimit(req, 'reservation_create', { limit: 5, windowSeconds: 600 })
  if (limited) return limited

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const d = parsed.data

    if (isDateInPast(d.checkin)) {
      return NextResponse.json({ error: 'Check-in date must be today or in the future.' }, { status: 400 })
    }
    const nights = calculateNights(d.checkin, d.checkout)
    if (nights < 1) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
    }
    if (isStayTooLong(d.checkin, d.checkout)) {
      return NextResponse.json({ error: 'Maximum stay is 30 nights.' }, { status: 400 })
    }

    const admin = createAdminClient()

    const { data: room, error: roomError } = await admin
      .from('rooms')
      .select('id, name, price_per_night, max_guests, is_active')
      .eq('slug', d.roomSlug)
      .eq('is_active', true)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found.' }, { status: 404 })
    }

    if (d.numAdults + d.numChildren > room.max_guests) {
      return NextResponse.json({ error: `This room accommodates up to ${room.max_guests} guests.` }, { status: 400 })
    }

    // Check availability — reservations block the room just like bookings
    const { data: conflicts } = await admin
      .from('bookings')
      .select('id')
      .eq('room_id', room.id)
      .in('status', ['confirmed', 'pending', 'checked_in'])
      .lt('check_in_date', d.checkout)
      .gt('check_out_date', d.checkin)
      .limit(1)

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json({
        error: 'Sorry — this room is already booked for those dates. Please choose different dates or another room.',
      }, { status: 409 })
    }

    const { data: blockedConflicts } = await admin
      .from('blocked_dates')
      .select('id')
      .eq('room_id', room.id)
      .lt('blocked_from', d.checkout)
      .gt('blocked_to', d.checkin)
      .limit(1)

    if (blockedConflicts && blockedConflicts.length > 0) {
      return NextResponse.json({
        error: 'The hotel has closed those dates for this room. Please choose different dates.',
      }, { status: 409 })
    }

    const pricing = buildPricingBreakdown(room.price_per_night, nights)
    const bookingRef = generateBookingReference()
    const guestName = `${d.firstName} ${d.lastName}`

    const { data: reservation, error: insertError } = await admin
      .from('bookings')
      .insert({
        booking_reference: bookingRef,
        room_id: room.id,
        guest_name: guestName,
        guest_email: d.email,
        guest_phone: d.phone,
        check_in_date: d.checkin,
        check_out_date: d.checkout,
        num_adults: d.numAdults,
        num_children: d.numChildren,
        total_nights: nights,
        price_per_night: pricing.pricePerNight,
        subtotal: pricing.subtotal,
        vat_amount: pricing.vat,
        total_amount: pricing.total,
        arrival_time: d.arrivalTime ?? null,
        notes: d.notes ?? null,
        status: 'confirmed',
        booking_type: 'reservation',
      })
      .select('id')
      .single()

    if (insertError || !reservation) {
      return NextResponse.json({ error: 'Could not create reservation. Please try again.' }, { status: 500 })
    }

    const adminEmail = process.env.ADMIN_EMAIL ?? 'booking@hiltoneuphoriahotel.com'
    const formattedCheckin = formatDateLong(d.checkin)
    const formattedCheckout = formatDateLong(d.checkout)

    // Fire-and-forget emails
    Promise.all([
      sendEmail({
        to: d.email,
        subject: `Reservation Confirmed — ${bookingRef}`,
        react: React.createElement(ReservationConfirmation, {
          guestName,
          bookingReference: bookingRef,
          roomName: room.name,
          checkInDate: formattedCheckin,
          checkOutDate: formattedCheckout,
          totalNights: nights,
          totalAmountNaira: `₦${pricing.total.toLocaleString()}`,
          checkInTime: d.arrivalTime ?? '3:00 PM',
        }),
      }),
      sendEmail({
        to: adminEmail,
        subject: `New Reservation — ${bookingRef}`,
        react: React.createElement(AdminReservationAlert, {
          guestName,
          bookingReference: bookingRef,
          roomName: room.name,
          checkInDate: formattedCheckin,
          checkOutDate: formattedCheckout,
          totalNights: nights,
          totalAmountNaira: `₦${pricing.total.toLocaleString()}`,
          guestEmail: d.email,
          guestPhone: d.phone,
        }),
      }),
    ]).catch((err) => console.error('[reservation] Email send failed:', err))

    return NextResponse.json({ bookingReference: bookingRef })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
