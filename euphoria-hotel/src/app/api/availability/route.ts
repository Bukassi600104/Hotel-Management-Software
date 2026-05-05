import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getAvailableRooms } from '@/lib/queries/rooms'
import { buildPricingBreakdown } from '@/lib/utils/pricing'
import { isDateInPast, isStayTooLong, isValidDateString, calculateNights } from '@/lib/utils/dates'

const schema = z.object({
  checkin: z.string().refine(isValidDateString, 'Invalid check-in date'),
  checkout: z.string().refine(isValidDateString, 'Invalid check-out date'),
  guests: z.coerce.number().int().min(1).max(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 })
    }

    const { checkin, checkout, guests } = parsed.data

    if (isDateInPast(checkin)) {
      return NextResponse.json({ error: 'Check-in date must be today or in the future.' }, { status: 400 })
    }
    const nights = calculateNights(checkin, checkout)
    if (nights < 1) {
      return NextResponse.json({ error: 'Check-out must be after check-in.' }, { status: 400 })
    }
    if (isStayTooLong(checkin, checkout)) {
      return NextResponse.json({ error: 'Maximum stay is 30 nights.' }, { status: 400 })
    }

    const rooms = await getAvailableRooms(checkin, checkout, guests)

    const result = rooms.map((room) => ({
      ...room,
      pricing: buildPricingBreakdown(room.pricePerNight, nights),
    }))

    return NextResponse.json({ rooms: result, nights })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
