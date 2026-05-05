import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  short_name: z.string().min(2).optional(),
  description: z.string().optional(),
  price_per_night: z.number().positive().optional(),
  max_guests: z.number().int().min(1).optional(),
  bed_type: z.string().optional(),
  room_size_sqm: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  badge: z.string().nullable().optional(),
  display_order: z.number().int().optional(),
  is_active: z.boolean().optional(),
});

async function requireAdmin() {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  return user;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("rooms")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "update_room",
    admin_user_id: user.id,
    entity_type: "room",
    entity_id: id,
    details: parsed.data,
  });

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const admin = createAdminClient();
  const { error } = await admin.from("rooms").update({ is_active: false }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "deactivate_room",
    admin_user_id: user.id,
    entity_type: "room",
    entity_id: id,
    details: {},
  });

  return NextResponse.json({ success: true });
}
