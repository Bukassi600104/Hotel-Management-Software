import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { requireActiveAdmin } from "@/lib/admin/auth";

const createSchema = z.object({
  roomId: z.string().uuid(),
  blockedFrom: z.string().min(10),
  blockedTo: z.string().min(10),
  reason: z.string().optional(),
});

export async function GET() {
  if (!hasSupabaseAdminEnv()) return NextResponse.json([]);

  const auth = await requireActiveAdmin();
  if (auth.error) return auth.error;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("blocked_dates")
    .select("*, rooms(name)")
    .gte("blocked_to", new Date().toISOString().split("T")[0])
    .order("blocked_from", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json(
      { error: "Connect Supabase to persist blocked dates." },
      { status: 503 }
    );
  }

  const auth = await requireActiveAdmin(["super_admin", "manager"]);
  if (auth.error) return auth.error;
  const { user } = auth;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { roomId, blockedFrom, blockedTo, reason } = parsed.data;
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("blocked_dates")
    .insert({
      room_id: roomId,
      blocked_from: blockedFrom,
      blocked_to: blockedTo,
      reason: reason ?? null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "block_dates",
    admin_user_id: user.id,
    entity_type: "blocked_dates",
    entity_id: data.id,
    details: { room_id: roomId, blocked_from: blockedFrom, blocked_to: blockedTo, reason },
  });

  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) return NextResponse.json({ success: true });

  const auth = await requireActiveAdmin(["super_admin", "manager"]);
  if (auth.error) return auth.error;
  const { user } = auth;

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("blocked_dates").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "unblock_dates",
    admin_user_id: user.id,
    entity_type: "blocked_dates",
    entity_id: id,
    details: {},
  });

  return NextResponse.json({ success: true });
}
