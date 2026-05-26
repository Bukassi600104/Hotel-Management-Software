import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/admin'
import { generateBookingReference } from '@/lib/utils/booking-reference'
import { calculateNights, isDateInPast, isStayTooLong, isValidDateString } from '@/lib/utils/dates'
import { buildPricingBreakdown } from '@/lib/utils/pricing'
import { checkRateLimit } from '@/lib/rate-limit'
import { hasSupabaseAdminEnv } from '@/lib/supabase/config'
import { createDemoBooking } from '@/lib/demo/store'
import { sendEmail } from '@/lib/email/send'
import { formatDateLong, formatNaira } from '@/lib/format'
import { siteConfig } from '@/lib/site'
import BookingConfirmation from '@emails/BookingConfirmation'
import AdminBookingAlert from '@emails/AdminBookingAlert'
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
  const limited = await checkRateLimit(req, 'booking_create', { limit: 5, windowSeconds: 600 })
  if (limited) return limited

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const d = parsed.data

    // Date validation
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

    if (!hasSupabaseAdminEnv()) {
      const booking = createDemoBooking({
        roomSlug: d.roomSlug,
        bookingType: 'online',
        checkin: d.checkin,
        checkout: d.checkout,
        firstName: d.firstName,
        lastName: d.lastName,
        email: d.email,
        phone: d.phone,
        numAdults: d.numAdults,
        numChildren: d.numChildren,
        arrivalTime: d.arrivalTime,
        notes: d.notes,
      })
      const roomName = booking.rooms?.name ?? 'Your room'
      const adminEmail = process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email
      Promise.allSettled([
        sendEmail({
          to: booking.guest_email,
          subject: `Demo booking confirmed - ${booking.booking_reference}`,
          react: React.createElement(BookingConfirmation, {
            guestName: booking.guest_name,
            bookingReference: booking.booking_reference,
            roomName,
            checkInDate: formatDateLong(booking.check_in_date),
            checkOutDate: formatDateLong(booking.check_out_date),
            totalNights: booking.total_nights,
            totalAmountNaira: formatNaira(booking.total_amount),
            checkInTime: siteConfig.hours.checkIn,
          }),
        }),
        sendEmail({
          to: adminEmail,
          subject: `Demo booking - ${booking.booking_reference} - ${booking.guest_name}`,
          react: React.createElement(AdminBookingAlert, {
            guestName: booking.guest_name,
            guestEmail: booking.guest_email,
            guestPhone: booking.guest_phone,
            bookingReference: booking.booking_reference,
            roomName,
            checkInDate: formatDateLong(booking.check_in_date),
            checkOutDate: formatDateLong(booking.check_out_date),
            totalNights: booking.total_nights,
            totalAmountNaira: formatNaira(booking.total_amount),
            bookingId: booking.id,
          }),
        }),
      ]).catch((err) => console.error('[demo booking email]', err))
      return NextResponse.json({
        paymentUrl: `/booking/checkout?ref=${booking.booking_reference}&demo=1`,
        demo: true,
      })
    }

    const admin = createAdminClient()

    // Fetch the room
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

    // Re-check availability (race condition prevention)
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
        error: 'Sorry — this room was just booked for those dates. Please choose different dates or another room.',
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

    // Calculate pricing
    const pricing = buildPricingBreakdown(room.price_per_night, nights)
    const bookingRef = generateBookingReference()
    const guestName = `${d.firstName} ${d.lastName}`

    // Insert pending booking
    const { data: booking, error: insertError } = await admin
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
        status: 'pending',
      })
      .select('id')
      .single()

    if (insertError || !booking) {
      return NextResponse.json({ error: 'Could not create booking. Please try again.' }, { status: 500 })
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      await admin
        .from('bookings')
        .update({
          status: 'confirmed',
          booking_type: 'online',
          paid_at: new Date().toISOString(),
          paystack_reference: `DEMO-${Date.now()}`,
        })
        .eq('id', booking.id)

      Promise.allSettled([
        sendEmail({
          to: d.email,
          subject: `Demo booking confirmed - ${bookingRef}`,
          react: React.createElement(BookingConfirmation, {
            guestName,
            bookingReference: bookingRef,
            roomName: room.name,
            checkInDate: formatDateLong(d.checkin),
            checkOutDate: formatDateLong(d.checkout),
            totalNights: nights,
            totalAmountNaira: formatNaira(pricing.total),
            checkInTime: siteConfig.hours.checkIn,
          }),
        }),
        sendEmail({
          to: process.env.ADMIN_EMAIL ?? process.env.RESEND_FROM_EMAIL ?? siteConfig.contact.email,
          subject: `Demo booking - ${bookingRef} - ${guestName}`,
          react: React.createElement(AdminBookingAlert, {
            guestName,
            guestEmail: d.email,
            guestPhone: d.phone,
            bookingReference: bookingRef,
            roomName: room.name,
            checkInDate: formatDateLong(d.checkin),
            checkOutDate: formatDateLong(d.checkout),
            totalNights: nights,
            totalAmountNaira: formatNaira(pricing.total),
            bookingId: booking.id,
          }),
        }),
      ]).catch((err) => console.error('[supabase demo booking email]', err))

      return NextResponse.json({
        paymentUrl: `/booking/checkout?ref=${bookingRef}&demo=1`,
        demo: true,
      })
    }

    // Initialise Paystack transaction
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: d.email,
        amount: pricing.total * 100, // DB stores Naira; Paystack requires kobo
        reference: bookingRef,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings/verify`,
        metadata: {
          booking_id: booking.id,
          booking_reference: bookingRef,
          guest_name: guestName,
          room_name: room.name,
        },
      }),
    })

    const paystackData = await paystackRes.json()

    if (!paystackRes.ok || !paystackData.data?.authorization_url) {
      // Roll back the pending booking if Paystack fails
      await admin.from('bookings').delete().eq('id', booking.id)
      return NextResponse.json({ error: 'Payment gateway error. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ paymentUrl: paystackData.data.authorization_url })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
