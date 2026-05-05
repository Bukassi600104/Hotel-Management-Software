import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString()

  const { data, error } = await admin
    .from('bookings')
    .update({ status: 'expired' })
    .eq('status', 'pending')
    .lt('created_at', cutoff)
    .select('id')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const released = data?.length ?? 0
  return NextResponse.json({ released, message: `${released} pending booking(s) expired.` })
}
