import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireActiveAdmin } from "@/lib/admin/auth";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";

export async function GET(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ inquiries: [], total: 0 });
  }

  const auth = await requireActiveAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = 25;
  const unreadOnly = searchParams.get("unread") === "true";

  const admin = createAdminClient();
  let query = admin
    .from("contact_inquiries")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (unreadOnly) query = query.eq("is_read", false);

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inquiries: data, total: count ?? 0 });
}

export async function PATCH(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const auth = await requireActiveAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("contact_inquiries").update({ is_read: true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!hasSupabaseAdminEnv()) {
    return NextResponse.json({ success: true, demo: true });
  }

  const auth = await requireActiveAdmin(["super_admin", "manager"]);
  if (auth.error) return auth.error;

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("contact_inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
