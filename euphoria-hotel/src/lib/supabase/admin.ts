import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// SECURITY: This client bypasses Row Level Security.
// Only import this file inside src/app/api/** routes — never in public pages.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
