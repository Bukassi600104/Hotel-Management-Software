import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("contact_inquiries").update({ is_read: true }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("contact_inquiries").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
