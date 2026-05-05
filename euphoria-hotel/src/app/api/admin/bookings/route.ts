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
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Math.min(Number(searchParams.get("limit") ?? "20"), 200);

  const admin = createAdminClient();
  let query = admin
    .from("bookings")
    .select("*, rooms(name, slug)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (status && status !== "all") {
    const validStatuses = ["pending", "confirmed", "cancelled", "refunded", "expired", "checked_in", "checked_out"] as const;
    type BookingStatus = typeof validStatuses[number];
    if (validStatuses.includes(status as BookingStatus)) {
      query = query.eq("status", status as BookingStatus);
    }
  }
  if (from) query = query.gte("check_in_date", from);
  if (to) query = query.lte("check_in_date", to);
  if (search) {
    query = query.or(
      `guest_name.ilike.%${search}%,booking_reference.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ bookings: data, total: count ?? 0 });
}
