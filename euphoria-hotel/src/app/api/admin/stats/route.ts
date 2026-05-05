import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const [checkingIn, checkingOut, revenueResult, occupancyResult] = await Promise.all([
    admin
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("check_in_date", today)
      .eq("status", "confirmed"),

    admin
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("check_out_date", today)
      .eq("status", "checked_in"),

    admin
      .from("bookings")
      .select("total_amount")
      .in("status", ["confirmed", "checked_in", "checked_out"])
      .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),

    admin
      .from("bookings")
      .select("total_nights")
      .in("status", ["confirmed", "checked_in", "checked_out"])
      .gte(
        "check_in_date",
        new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
      )
      .lte(
        "check_out_date",
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split("T")[0]
      ),
  ]);

  const monthRevenue =
    revenueResult.data?.reduce((sum, b) => sum + (b.total_amount ?? 0), 0) ?? 0;

  const bookedNights =
    occupancyResult.data?.reduce((sum, b) => sum + (b.total_nights ?? 0), 0) ?? 0;

  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  const roomCount = 9;
  const occupancyPct =
    daysInMonth > 0 && roomCount > 0
      ? Math.round((bookedNights / (daysInMonth * roomCount)) * 100)
      : 0;

  return NextResponse.json({
    checkingInToday: checkingIn.count ?? 0,
    checkingOutToday: checkingOut.count ?? 0,
    monthRevenue,
    occupancyPct,
  });
}
