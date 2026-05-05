import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const inviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  role: z.enum(["super_admin", "manager", "staff"]),
});

const updateSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["super_admin", "manager", "staff"]).optional(),
  isActive: z.boolean().optional(),
});

async function requireSuperAdmin() {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (data?.role !== "super_admin") return null;
  return user;
}

export async function GET() {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("admin_users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { email, fullName, role } = parsed.data;
  const admin = createAdminClient();

  // Invite via Supabase Auth (sends email)
  const { data: authData, error: authError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Create admin_users record
  await admin.from("admin_users").insert({
    id: authData.user.id,
    email,
    full_name: fullName,
    role,
    is_active: true,
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const user = await requireSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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

  const { id, role, isActive } = parsed.data;
  const admin = createAdminClient();

  type AdminUpdate = { role?: "super_admin" | "manager" | "staff"; is_active?: boolean };
  const update: AdminUpdate = {};
  if (role !== undefined) update.role = role;
  if (isActive !== undefined) update.is_active = isActive;

  const { error } = await admin.from("admin_users").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("audit_log").insert({
    action: "update_admin_user",
    admin_user_id: user.id,
    entity_type: "admin_user",
    entity_id: id,
    details: { role: update.role ?? null, is_active: update.is_active ?? null },
  });

  return NextResponse.json({ success: true });
}
