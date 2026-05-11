"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type StatsData = {
  monthlyRevenue: { month: string; revenue: number }[];
  monthlyOccupancy: { month: string; occupancy: number }[];
  bookingTypeBreakdown: { booking: number; reservation: number };
};

export function DashboardCharts() {
  const [data, setData] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setData({
          monthlyRevenue: d.monthlyRevenue ?? [],
          monthlyOccupancy: d.monthlyOccupancy ?? [],
          bookingTypeBreakdown: d.bookingTypeBreakdown ?? { booking: 0, reservation: 0 },
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mt-8 flex justify-center py-12">
        <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
      </div>
    );
  }

  if (!data) return null;

  const totalBookings = data.bookingTypeBreakdown.booking + data.bookingTypeBreakdown.reservation;
  const pieData = [
    { name: "Online booking", value: data.bookingTypeBreakdown.booking, color: "#c9a961" },
    { name: "Reservation", value: data.bookingTypeBreakdown.reservation, color: "#8b5cf6" },
  ];

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {/* Monthly Revenue */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-5">
        <h3 className="text-sm font-semibold text-white/80">Monthly Revenue (last 6 months)</h3>
        <p className="mt-0.5 text-xs text-white/35">Total amount from confirmed bookings</p>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyRevenue} barCategoryGap="28%">
              <XAxis
                dataKey="month"
                tick={{ fill: "#ffffff55", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#ffffff35", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : String(v)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1c1f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#ffffff80" }}
                formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#c9a961" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Occupancy Rate Trend */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-5">
        <h3 className="text-sm font-semibold text-white/80">Occupancy Rate (last 6 months)</h3>
        <p className="mt-0.5 text-xs text-white/35">Percentage of booked room-nights</p>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.monthlyOccupancy}>
              <XAxis
                dataKey="month"
                tick={{ fill: "#ffffff55", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#ffffff35", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1c1f",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#ffffff80" }}
                formatter={(value) => [`${value}%`, "Occupancy"]}
              />
              <Line
                type="monotone"
                dataKey="occupancy"
                stroke="#34d399"
                strokeWidth={2.5}
                dot={{ fill: "#34d399", r: 4 }}
                activeDot={{ r: 6, fill: "#34d399" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Type Breakdown */}
      <div className="rounded-xl border border-white/8 bg-white/4 p-5 lg:col-span-2">
        <h3 className="text-sm font-semibold text-white/80">Booking Type Breakdown (last 6 months)</h3>
        <p className="mt-0.5 text-xs text-white/35">Online payments vs pay-at-check-in reservations</p>
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
          <div className="h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1c1f",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-3">
                <span className="inline-block size-3 rounded-sm" style={{ backgroundColor: entry.color }} />
                <span className="text-sm text-white/70">{entry.name}</span>
                <span className="ml-auto text-sm font-semibold text-white/90">
                  {entry.value} ({totalBookings > 0 ? Math.round((entry.value / totalBookings) * 100) : 0}%)
                </span>
              </div>
            ))}
            <div className="border-t border-white/8 pt-2">
              <p className="text-xs text-white/40">Total bookings: {totalBookings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
