import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";
import { requireActiveAdmin } from "@/lib/admin/auth";

export async function GET() {
  const auth = await requireActiveAdmin();
  if (auth.error) return auth.error;

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (admin as any).from("settings").select("*").eq("id", 1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

const settingsSchema = z.object({
  hotel_name:          z.string().min(1),
  short_name:          z.string().min(1),
  tagline:             z.string().min(1),
  email:               z.string().email(),
  address:             z.string().min(1),
  address_short:       z.string().min(1),
  phone_reservation:   z.string().min(1),
  phone_front_desk:    z.string().min(1),
  phone_concierge:     z.string().min(1),
  phone_events:        z.string().min(1),
  whatsapp:            z.string().min(1),
  check_in_time:       z.string().min(1),
  check_out_time:      z.string().min(1),
  vat_rate:            z.number().min(0).max(100),
  cancellation_policy: z.string().min(1),
});

export async function PATCH(request: NextRequest) {
  const auth = await requireActiveAdmin(["super_admin"]);
  if (auth.error) return auth.error;

  const body = await request.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const admin = createAdminClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (admin as any)
    .from("settings")
    .upsert({ id: 1, ...parsed.data, updated_at: new Date().toISOString() });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
