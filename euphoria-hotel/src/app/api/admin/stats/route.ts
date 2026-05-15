import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { listDemoBookings } from "@/lib/demo/store";

export async function GET() {
  const now = new Date();

  if (!hasSupabaseAdminEnv()) {
    const bookings = listDemoBookings().filter((booking) =>
      ["confirmed", "checked_in", "checked_out"].includes(booking.status)
    );
    const months: { label: string; start: string; end: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = d.toISOString().split("T")[0];
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
      const label = d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
      months.push({ label, start, end });
    }
    return NextResponse.json({
      checkingInToday: 0,
      checkingOutToday: 0,
      monthRevenue: bookings.reduce((sum, booking) => sum + booking.total_amount, 0),
      occupancyPct: 8,
      monthlyRevenue: months.map(({ label }, index) => ({
        month: label,
        revenue: index === months.length - 1 ? bookings.reduce((sum, booking) => sum + booking.total_amount, 0) : 0,
      })),
      monthlyOccupancy: months.map(({ label }, index) => ({
        month: label,
        occupancy: index === months.length - 1 ? 8 : 0,
      })),
      bookingTypeBreakdown: {
        booking: bookings.filter((booking) => booking.booking_type === "online").length,
        reservation: bookings.filter((booking) => booking.booking_type === "reservation").length,
      },
    });
  }

  const serverClient = await createClient();
  const {
    data: { user },
  } = await serverClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const today = now.toISOString().split("T")[0];

  // Build last 6 months date range
  const months: { label: string; start: string; end: string }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = d.toISOString().split("T")[0];
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-NG", { month: "short", year: "2-digit" });
    months.push({ label, start, end });
  }

  const [checkingIn, checkingOut, revenueResult, occupancyResult, allBookingsForMonths, roomCount] =
    await Promise.all([
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
        .gte("created_at", new Date(now.getFullYear(), now.getMonth(), 1).toISOString()),

      admin
        .from("bookings")
        .select("total_nights")
        .in("status", ["confirmed", "checked_in", "checked_out"])
        .gte(
          "check_in_date",
          new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]
        )
        .lte(
          "check_out_date",
          new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0]
        ),

      // All bookings for last 6 months (for chart data)
      admin
        .from("bookings")
        .select("total_amount, total_nights, check_in_date, check_out_date, booking_type, created_at")
        .in("status", ["confirmed", "checked_in", "checked_out"])
        .gte("created_at", months[0].start + "T00:00:00Z"),

      admin.from("rooms").select("id", { count: "exact", head: true }).eq("is_active", true),
    ]);

  const monthRevenue =
    revenueResult.data?.reduce((sum, b) => sum + (b.total_amount ?? 0), 0) ?? 0;

  const bookedNights =
    occupancyResult.data?.reduce((sum, b) => sum + (b.total_nights ?? 0), 0) ?? 0;

  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const totalRooms = roomCount.count ?? 9;
  const occupancyPct =
    daysInCurrentMonth > 0 && totalRooms > 0
      ? Math.round((bookedNights / (daysInCurrentMonth * totalRooms)) * 100)
      : 0;

  // Build monthly revenue and booking counts for charts
  const bookingsData = allBookingsForMonths.data ?? [];

  const monthlyRevenue = months.map(({ label, start, end }) => {
    const revenue = bookingsData
      .filter((b) => {
        const created = b.created_at?.split("T")[0] ?? "";
        return created >= start && created <= end;
      })
      .reduce((sum, b) => sum + (b.total_amount ?? 0), 0);
    return { month: label, revenue };
  });

  const monthlyOccupancy = months.map(({ label, start, end }) => {
    const d = new Date(start);
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const booked = bookingsData
      .filter((b) => {
        const checkin = b.check_in_date ?? "";
        const checkout = b.check_out_date ?? "";
        return checkin <= end && checkout >= start;
      })
      .reduce((sum, b) => sum + (b.total_nights ?? 0), 0);
    const pct = daysInMonth > 0 && totalRooms > 0
      ? Math.round((booked / (daysInMonth * totalRooms)) * 100)
      : 0;
    return { month: label, occupancy: Math.min(pct, 100) };
  });

  const bookingTypeBreakdown = {
    booking: bookingsData.filter((b) => !b.booking_type || b.booking_type === "booking").length,
    reservation: bookingsData.filter((b) => b.booking_type === "reservation").length,
  };

  return NextResponse.json({
    checkingInToday: checkingIn.count ?? 0,
    checkingOutToday: checkingOut.count ?? 0,
    monthRevenue,
    occupancyPct,
    monthlyRevenue,
    monthlyOccupancy,
    bookingTypeBreakdown,
  });
}
