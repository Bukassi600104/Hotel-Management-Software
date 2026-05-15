import { createAdminClient } from "@/lib/supabase/admin";
import { formatNaira } from "@/lib/format";
import { TrendingUp, BedDouble, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { listDemoBookings } from "@/lib/demo/store";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!hasSupabaseAdminEnv()) {
    const bookings = listDemoBookings();
    const confirmed = bookings.filter((booking) =>
      ["confirmed", "checked_in", "checked_out"].includes(booking.status)
    );
    const monthRevenue = confirmed.reduce((sum, booking) => sum + booking.total_amount, 0);
    return (
      <DashboardShell
        stats={[
          {
            label: "Checking in today",
            value: "0",
            icon: LogIn,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
          },
          {
            label: "Checking out today",
            value: "0",
            icon: LogOut,
            color: "text-sky-400",
            bg: "bg-sky-400/10",
          },
          {
            label: "Revenue this month",
            value: formatNaira(monthRevenue),
            icon: TrendingUp,
            color: "text-[#c9a961]",
            bg: "bg-[#c9a961]/10",
          },
        ]}
        upcoming={confirmed.slice(0, 8).map((booking) => ({
          id: booking.id,
          guest_name: booking.guest_name,
          check_in_date: booking.check_in_date,
          total_amount: booking.total_amount,
          status: booking.status,
          rooms: booking.rooms,
        }))}
        recent={bookings.slice(0, 10).map((booking) => ({
          id: booking.id,
          guest_name: booking.guest_name,
          check_in_date: booking.check_in_date,
          total_amount: booking.total_amount,
          status: booking.status,
          rooms: booking.rooms,
        }))}
      />
    );
  }

  const admin = createAdminClient();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0];
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [checkingIn, checkingOut, revenueResult, upcomingArrivals, recentBookings] =
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
        .gte("check_in_date", monthStart),

      admin
        .from("bookings")
        .select("id, guest_name, check_in_date, booking_reference, status, rooms(name)")
        .eq("status", "confirmed")
        .gte("check_in_date", today)
        .lte("check_in_date", nextWeek)
        .order("check_in_date", { ascending: true })
        .limit(8),

      admin
        .from("bookings")
        .select("id, guest_name, booking_reference, status, total_amount, check_in_date, rooms(name)")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

  const monthRevenue =
    revenueResult.data?.reduce((sum, b) => sum + (b.total_amount ?? 0), 0) ?? 0;

  const stats = [
    {
      label: "Checking in today",
      value: String(checkingIn.count ?? 0),
      icon: LogIn,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      label: "Checking out today",
      value: String(checkingOut.count ?? 0),
      icon: LogOut,
      color: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      label: "Revenue this month",
      value: formatNaira(monthRevenue),
      icon: TrendingUp,
      color: "text-[#c9a961]",
      bg: "bg-[#c9a961]/10",
    },
  ];

  return (
    <DashboardShell
      stats={stats}
      upcoming={(upcomingArrivals.data ?? []).map((booking) => ({
        id: booking.id,
        guest_name: booking.guest_name,
        check_in_date: booking.check_in_date,
        total_amount: 0,
        status: booking.status ?? "",
        rooms: booking.rooms as { name: string } | null,
      }))}
      recent={(recentBookings.data ?? []).map((booking) => ({
        id: booking.id,
        guest_name: booking.guest_name,
        check_in_date: booking.check_in_date,
        total_amount: booking.total_amount,
        status: booking.status ?? "",
        rooms: booking.rooms as { name: string } | null,
      }))}
    />
  );
}

type DashboardBooking = {
  id: string;
  guest_name: string;
  check_in_date: string;
  total_amount: number;
  status: string;
  rooms: { name: string } | null;
};

function DashboardShell({
  stats,
  upcoming,
  recent,
}: {
  stats: Array<{
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bg: string;
  }>;
  upcoming: DashboardBooking[];
  recent: DashboardBooking[];
}) {
  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-400/15 text-emerald-400",
    checked_in: "bg-sky-400/15 text-sky-400",
    checked_out: "bg-white/10 text-white/50",
    pending: "bg-amber-400/15 text-amber-400",
    cancelled: "bg-red-400/15 text-red-400",
    expired: "bg-white/8 text-white/30",
    refunded: "bg-purple-400/15 text-purple-400",
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-white">Dashboard</h1>
      <p className="mt-1 text-sm text-white/40">
        {new Date().toLocaleDateString("en-NG", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-white/8 bg-white/4 p-5"
          >
            <div className={`inline-grid size-10 place-items-center rounded-lg ${bg} ${color}`}>
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-2xl font-semibold tabular-nums text-white">{value}</p>
            <p className="mt-1 text-xs text-white/45">{label}</p>
          </div>
        ))}
      </div>

      {/* Analytics charts */}
      <DashboardCharts />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Upcoming arrivals */}
        <div className="rounded-xl border border-white/8 bg-white/4">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold text-white/80">
              <BedDouble className="mr-2 inline size-4 text-[#c9a961]" />
              Upcoming arrivals (next 7 days)
            </h2>
            <Link href="/admin/bookings" className="text-xs text-[#c9a961] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-white/6">
            {upcoming.length === 0 ? (
              <p className="px-5 py-6 text-sm text-white/30">No arrivals in the next 7 days.</p>
            ) : (
              upcoming.map((b) => {
                const room = b.rooms?.name ?? "Room";
                return (
                  <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white/85">{b.guest_name}</p>
                      <p className="text-xs text-white/40">
                        {room} ·{" "}
                        {new Date(b.check_in_date).toLocaleDateString("en-NG", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <CheckInButton bookingId={b.id} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="rounded-xl border border-white/8 bg-white/4">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-sm font-semibold text-white/80">Recent bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-[#c9a961] hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-white/6">
            {recent.map((b) => {
              const room = b.rooms?.name ?? "Room";
              const statusCls = statusColors[b.status ?? ""] ?? "bg-white/8 text-white/50";
              return (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/85">{b.guest_name}</p>
                    <p className="text-xs text-white/40">
                      {room} · {formatNaira(b.total_amount)}
                    </p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusCls}`}>
                    {b.status?.replace("_", " ")}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckInButton({ bookingId }: { bookingId: string }) {
  return (
    <Link
      href={`/admin/bookings?id=${bookingId}`}
      className="shrink-0 rounded-lg bg-[#c9a961]/15 px-3 py-1.5 text-[11px] font-medium text-[#c9a961] hover:bg-[#c9a961]/25 transition-colors"
    >
      Check in
    </Link>
  );
}
