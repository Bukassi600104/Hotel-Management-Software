"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookingDrawer } from "@/components/admin/booking-drawer";

type CalBooking = {
  id: string;
  booking_reference: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  room_id?: string;
  rooms?: { name: string } | null;
};

type CalBlock = {
  id: string;
  blocked_from: string;
  blocked_to: string;
  reason: string | null;
  rooms: { name: string } | null;
  room_id: string;
};

type RoomRow = {
  id: string;
  name: string;
};

export function CalendarClient() {
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth()); // 0-based
  const [bookings, setBookings] = React.useState<CalBooking[]>([]);
  const [blocks, setBlocks] = React.useState<CalBlock[]>([]);
  const [rooms, setRooms] = React.useState<RoomRow[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedBookingId, setSelectedBookingId] = React.useState<string | null>(null);

  const monthStart = new Date(year, month, 1).toISOString().split("T")[0];
  const monthEnd = new Date(year, month + 1, 0).toISOString().split("T")[0];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/admin/bookings?from=${monthStart}&to=${monthEnd}&page=1&limit=200`).then((r) => r.json()),
      fetch("/api/admin/blocks").then((r) => r.json()),
      fetch("/api/admin/rooms").then((r) => r.json()),
    ]).then(([bData, blData, rData]) => {
      setBookings(bData.bookings ?? []);
      setBlocks(Array.isArray(blData) ? blData : []);
      setRooms(Array.isArray(rData) ? rData : []);
      setLoading(false);
    });
  }, [monthStart, monthEnd]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const monthLabel = new Date(year, month).toLocaleDateString("en-NG", { month: "long", year: "numeric" });

  function dayStr(d: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <>
      {/* Month nav */}
      <div className="mt-5 flex items-center gap-4">
        <button onClick={prevMonth} className="rounded-lg border border-white/10 p-2 hover:border-white/20 text-white/60">
          <ChevronLeft className="size-4" />
        </button>
        <h2 className="min-w-40 text-center text-sm font-semibold text-white">{monthLabel}</h2>
        <button onClick={nextMonth} className="rounded-lg border border-white/10 p-2 hover:border-white/20 text-white/60">
          <ChevronRight className="size-4" />
        </button>
        <button
          onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}
          className="ml-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 hover:border-white/20"
        >
          Today
        </button>
      </div>

      {loading ? (
        <div className="mt-10 flex justify-center">
          <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-white/8">
          <table className="min-w-max text-xs">
            <thead className="border-b border-white/8 bg-white/3">
              <tr>
                <th className="sticky left-0 z-10 w-36 bg-white/3 px-4 py-3 text-left text-[10px] uppercase tracking-wider text-white/35">
                  Room
                </th>
                {days.map((d) => {
                  const isToday = dayStr(d) === now.toISOString().split("T")[0];
                  return (
                    <th
                      key={d}
                      className={`min-w-[32px] px-1 py-3 text-center font-medium ${
                        isToday ? "text-[#c9a961]" : "text-white/35"
                      }`}
                    >
                      {d}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rooms.map((room) => {
                const roomBookings = bookings.filter((b) => {
                  const anyB = b as CalBooking & { room_id?: string };
                  return anyB.room_id === room.id;
                });
                const roomBlocks = blocks.filter((bl) => bl.room_id === room.id);

                return (
                  <tr key={room.id} className="hover:bg-white/2">
                    <td className="sticky left-0 z-10 bg-[#111316] px-4 py-2 font-medium text-white/65 hover:bg-[#161820]">
                      {room.name}
                    </td>
                    {days.map((d) => {
                      const day = dayStr(d);
                      const booking = roomBookings.find(
                        (b) => b.check_in_date <= day && b.check_out_date > day
                      );
                      const block = roomBlocks.find(
                        (bl) => bl.blocked_from <= day && bl.blocked_to >= day
                      );

                      if (booking) {
                        const isFirst = booking.check_in_date === day;
                        const isLast = booking.check_out_date ===
                          new Date(new Date(day).getTime() + 86400000).toISOString().split("T")[0];
                        const isConfirmed = booking.status === "confirmed" || booking.status === "checked_in";
                        return (
                          <td
                            key={d}
                            onClick={() => setSelectedBookingId(booking.id)}
                            className={`cursor-pointer px-0.5 py-2 ${
                              isConfirmed
                                ? "bg-[#c9a961]/20 hover:bg-[#c9a961]/30"
                                : "bg-amber-500/10 hover:bg-amber-500/20"
                            }`}
                            title={`${booking.guest_name} · ${booking.booking_reference}`}
                          >
                            {isFirst && (
                              <span className="truncate text-[9px] font-medium text-[#c9a961]">
                                {booking.guest_name.split(" ")[0]}
                              </span>
                            )}
                          </td>
                        );
                      }

                      if (block) {
                        return (
                          <td
                            key={d}
                            className="bg-white/8 px-0.5 py-2"
                            title={block.reason ?? "Blocked"}
                          >
                            <span className="block h-3 w-full bg-white/10 rounded-sm" />
                          </td>
                        );
                      }

                      return (
                        <td key={d} className="px-0.5 py-2">
                          <span className="block h-3 w-full" />
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 text-xs text-white/40">
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-sm bg-[#c9a961]/30" />Confirmed</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-sm bg-amber-500/20" />Pending</span>
        <span className="flex items-center gap-1.5"><span className="inline-block size-3 rounded-sm bg-white/12" />Blocked</span>
      </div>

      {selectedBookingId && (
        <BookingDrawer
          bookingId={selectedBookingId}
          onClose={() => setSelectedBookingId(null)}
          onUpdate={() => {
            setSelectedBookingId(null);
          }}
        />
      )}
    </>
  );
}
