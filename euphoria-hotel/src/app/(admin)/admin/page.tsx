import type * as React from "react";
import Link from "next/link";
import {
  Ban,
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  TrendingUp,
} from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { AdminPageShell, adminPanelClass } from "@/components/admin/page-shell";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";
import { listDemoBookings } from "@/lib/demo/store";
import { formatNaira } from "@/lib/format";

export const dynamic = "force-dynamic";

type DashboardBooking = {
  id: string;
  guest_name: string;
  check_in_date: string;
  total_amount: number;
  status: string;
  rooms: { name: string } | null;
};

type DashboardStat = {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "gold" | "green" | "blue" | "orange";
  delta: string;
};

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
          { label: "Revenue this month", value: formatNaira(monthRevenue), icon: CircleDollarSign, tone: "gold", delta: "Local records" },
          { label: "Total bookings", value: String(bookings.length), icon: CalendarDays, tone: "green", delta: "All records" },
          { label: "Checking in today", value: "0", icon: LogIn, tone: "blue", delta: "Ready desk" },
          { label: "Checking out today", value: "0", icon: LogOut, tone: "orange", delta: "No exits" },
        ]}
        upcoming={confirmed.slice(0, 8)}
        recent={bookings.slice(0, 10)}
        occupancyRate={0}
        unreadInquiries={0}
      />
    );
  }

  const admin = createAdminClient();
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const nextWeek = new Date(now.getTime() + 7 * 86400000).toISOString().split("T")[0];
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const [
    checkingIn,
    checkingOut,
    revenueResult,
    allBookings,
    activeRooms,
    upcomingArrivals,
    recentBookings,
    unreadInquiries,
  ] = await Promise.all([
    admin.from("bookings").select("id", { count: "exact", head: true }).eq("check_in_date", today).eq("status", "confirmed"),
    admin.from("bookings").select("id", { count: "exact", head: true }).eq("check_out_date", today).eq("status", "checked_in"),
    admin.from("bookings").select("total_amount").in("status", ["confirmed", "checked_in", "checked_out"]).gte("check_in_date", monthStart),
    admin.from("bookings").select("id", { count: "exact", head: true }),
    admin.from("rooms").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin
      .from("bookings")
      .select("id, guest_name, check_in_date, status, rooms(name)")
      .eq("status", "confirmed")
      .gte("check_in_date", today)
      .lte("check_in_date", nextWeek)
      .order("check_in_date", { ascending: true })
      .limit(8),
    admin
      .from("bookings")
      .select("id, guest_name, status, total_amount, check_in_date, rooms(name)")
      .order("created_at", { ascending: false })
      .limit(10),
    admin.from("contact_inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
  ]);

  const monthRevenue = revenueResult.data?.reduce((sum, b) => sum + (b.total_amount ?? 0), 0) ?? 0;
  const roomCount = activeRooms.count ?? 0;
  const occupancyRate = roomCount > 0 ? Math.min(100, Math.round(((checkingIn.count ?? 0) / roomCount) * 100)) : 0;

  return (
    <DashboardShell
      stats={[
        { label: "Revenue this month", value: formatNaira(monthRevenue), icon: CircleDollarSign, tone: "gold", delta: "Confirmed stays" },
        { label: "Total bookings", value: String(allBookings.count ?? 0), icon: CalendarDays, tone: "green", delta: "All records" },
        { label: "Checking in today", value: String(checkingIn.count ?? 0), icon: LogIn, tone: "blue", delta: "Front desk" },
        { label: "Checking out today", value: String(checkingOut.count ?? 0), icon: LogOut, tone: "orange", delta: "Departure list" },
      ]}
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
      occupancyRate={occupancyRate}
      unreadInquiries={unreadInquiries.count ?? 0}
    />
  );
}

function DashboardShell({
  stats,
  upcoming,
  recent,
  occupancyRate,
  unreadInquiries,
}: {
  stats: DashboardStat[];
  upcoming: DashboardBooking[];
  recent: DashboardBooking[];
  occupancyRate: number;
  unreadInquiries: number;
}) {
  const today = new Date();

  return (
    <AdminPageShell
      title="Welcome back"
      description={today.toLocaleDateString("en-NG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
      className="max-w-[1600px]"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className={`${adminPanelClass} p-4 sm:p-5`}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white/88">Quick actions</h2>
                <p className="mt-1 text-xs text-white/38">Common front desk tasks.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <QuickAction href="/admin/bookings" icon={Plus} label="New booking" />
              <QuickAction href="/admin/rooms" icon={BedDouble} label="Add room" />
              <QuickAction href="/admin/blocks" icon={Ban} label="Block dates" />
              <QuickAction href="/admin/inquiries" icon={MessageSquare} label="View inquiries" />
            </div>
          </div>

          <DashboardCharts />

          <RecentBookings bookings={recent} />
        </div>

        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          <MiniCalendar date={today} />
          <SchedulePanel upcoming={upcoming} />
          <div className={`${adminPanelClass} p-5`}>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white/88">Task summary</h2>
              <span className="text-xs text-white/35">Today</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <TaskStat label="Occupancy" value={`${occupancyRate}%`} tone="gold" />
              <TaskStat label="Arrivals" value={String(upcoming.length)} tone="green" />
              <TaskStat label="Unread" value={String(unreadInquiries)} tone="red" />
            </div>
          </div>
        </aside>
      </div>
    </AdminPageShell>
  );
}

function StatCard({ label, value, icon: Icon, tone, delta }: DashboardStat) {
  const tones = {
    gold: "text-[#c9a961] bg-[#c9a961]/14",
    green: "text-emerald-300 bg-emerald-400/12",
    blue: "text-sky-300 bg-sky-400/12",
    orange: "text-orange-300 bg-orange-400/12",
  };

  return (
    <div className={`${adminPanelClass} overflow-hidden p-5`}>
      <div className={`grid size-11 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon className="size-5" />
      </div>
      <p className="mt-5 text-[11px] font-medium text-white/45">{label}</p>
      <p className="mt-2 min-h-8 text-2xl font-semibold tracking-tight text-white">{value}</p>
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full bg-[#c9a961]/12 px-2 py-1 text-[10px] font-semibold text-[#c9a961]">
          <TrendingUp className="mr-1 inline size-3" />
          {delta}
        </span>
      </div>
      <div className="mt-4 flex h-8 items-end gap-1 opacity-75">
        {[32, 42, 35, 56, 48, 60, 44, 52, 63, 40].map((height, index) => (
          <span key={index} className="flex-1 rounded-full bg-[#c9a961]/35" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex min-h-20 items-center gap-3 rounded-2xl border border-white/8 bg-[#0d0e10]/45 px-4 py-3 text-sm font-medium text-white/72 transition hover:border-[#c9a961]/30 hover:bg-[#c9a961]/10 hover:text-white"
    >
      <span className="grid size-10 place-items-center rounded-2xl bg-[#c9a961]/14 text-[#c9a961]">
        <Icon className="size-4" />
      </span>
      {label}
    </Link>
  );
}

function RecentBookings({ bookings }: { bookings: DashboardBooking[] }) {
  const statusColors: Record<string, string> = {
    confirmed: "bg-emerald-400/15 text-emerald-300",
    checked_in: "bg-sky-400/15 text-sky-300",
    checked_out: "bg-white/10 text-white/55",
    pending: "bg-amber-400/15 text-amber-300",
    cancelled: "bg-red-400/15 text-red-300",
    expired: "bg-white/8 text-white/35",
    refunded: "bg-purple-400/15 text-purple-300",
  };

  return (
    <div className={`${adminPanelClass} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-white/88">Recent bookings</h2>
          <p className="mt-1 text-xs text-white/38">Latest guest activity.</p>
        </div>
        <Link href="/admin/bookings" className="rounded-xl bg-white/[0.045] px-3 py-2 text-xs text-white/55 hover:text-[#c9a961]">
          View all
        </Link>
      </div>
      <div className="divide-y divide-white/6">
        {bookings.length === 0 ? (
          <p className="px-5 py-8 text-sm text-white/32">No bookings yet.</p>
        ) : (
          bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/admin/bookings?id=${booking.id}`}
              className="grid gap-3 px-5 py-4 transition hover:bg-white/[0.035] md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_130px_120px]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white/84">{booking.rooms?.name ?? "Room"}</p>
                <p className="mt-1 truncate text-xs text-white/38">{booking.guest_name}</p>
              </div>
              <p className="self-center text-xs text-white/46">
                {new Date(booking.check_in_date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              <p className="self-center text-sm font-semibold text-white/78">{formatNaira(booking.total_amount)}</p>
              <span className={`w-fit self-center rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${statusColors[booking.status] ?? "bg-white/8 text-white/40"}`}>
                {booking.status.replace("_", " ")}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function MiniCalendar({ date }: { date: Date }) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const days = Array.from({ length: firstDay + daysInMonth }, (_, index) =>
    index < firstDay ? null : index - firstDay + 1
  );

  return (
    <div className={`${adminPanelClass} p-5`}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/88">
          {date.toLocaleDateString("en-NG", { month: "long", year: "numeric" })}
        </h2>
        <CalendarDays className="size-4 text-[#c9a961]" />
      </div>
      <div className="mt-5 grid grid-cols-7 gap-2 text-center text-[10px] uppercase text-white/30">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs">
        {days.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className={`grid aspect-square place-items-center rounded-full ${
              day === date.getDate()
                ? "bg-[#c9a961] font-semibold text-[#17181a]"
                : day
                  ? "text-white/58 hover:bg-white/[0.04]"
                  : "text-transparent"
            }`}
          >
            {day ?? "-"}
          </span>
        ))}
      </div>
    </div>
  );
}

function SchedulePanel({ upcoming }: { upcoming: DashboardBooking[] }) {
  return (
    <div className={`${adminPanelClass} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-sm font-semibold text-white/88">Today&apos;s schedule</h2>
        <Link href="/admin/calendar" className="text-xs text-[#c9a961] hover:underline">
          Full calendar
        </Link>
      </div>
      <div className="space-y-3 px-5 pb-5">
        {upcoming.length === 0 ? (
          <p className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-5 text-sm text-white/35">
            No arrivals in the next 7 days.
          </p>
        ) : (
          upcoming.slice(0, 4).map((booking, index) => (
            <Link
              key={booking.id}
              href={`/admin/bookings?id=${booking.id}`}
              className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 transition hover:border-[#c9a961]/25 hover:bg-[#c9a961]/8"
            >
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-[#c9a961]/12 text-[10px] font-bold text-[#c9a961]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white/78">{booking.guest_name}</span>
                <span className="mt-1 block truncate text-xs text-white/38">
                  {booking.rooms?.name ?? "Room"} - {new Date(booking.check_in_date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                </span>
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

function TaskStat({ label, value, tone }: { label: string; value: string; tone: "gold" | "green" | "red" }) {
  const tones = {
    gold: "bg-[#c9a961]/12 text-[#c9a961]",
    green: "bg-emerald-400/12 text-emerald-300",
    red: "bg-red-400/12 text-red-300",
  };

  return (
    <div className={`rounded-2xl p-3 text-center ${tones[tone]}`}>
      <p className="text-lg font-semibold">{value}</p>
      <p className="mt-1 text-[10px] text-white/42">{label}</p>
    </div>
  );
}
