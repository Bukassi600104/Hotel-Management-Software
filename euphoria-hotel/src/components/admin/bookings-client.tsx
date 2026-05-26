"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { formatNaira, formatDateShort } from "@/lib/format";
import { BookingDrawer } from "@/components/admin/booking-drawer";
import { adminGhostButtonClass, adminInputClass, adminPanelClass } from "@/components/admin/page-shell";

type Booking = {
  id: string;
  booking_reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  total_amount: number;
  subtotal: number;
  vat_amount: number;
  price_per_night: number;
  status: string;
  booking_type: string | null;
  num_adults: number;
  num_children: number | null;
  arrival_time: string | null;
  notes: string | null;
  internal_notes: string | null;
  paystack_reference: string | null;
  paid_at: string | null;
  created_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  rooms: { name: string; slug: string } | null;
};

const STATUSES = ["all", "pending", "confirmed", "checked_in", "checked_out", "cancelled", "expired", "refunded"];

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-400/15 text-emerald-400",
  checked_in: "bg-sky-400/15 text-sky-400",
  checked_out: "bg-white/10 text-white/50",
  pending: "bg-amber-400/15 text-amber-400",
  cancelled: "bg-red-400/15 text-red-400",
  expired: "bg-white/8 text-white/30",
  refunded: "bg-purple-400/15 text-purple-400",
};

export function BookingsClient() {
  const searchParams = useSearchParams();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState(searchParams.get("search") ?? "");
  const [status, setStatus] = React.useState(searchParams.get("status") ?? "all");
  const [page, setPage] = React.useState(Number(searchParams.get("page") ?? "1"));
  const [selectedId, setSelectedId] = React.useState<string | null>(searchParams.get("id"));

  const limit = 20;
  const queryString = searchParams.toString();

  React.useEffect(() => {
    const params = new URLSearchParams(queryString);
    setSearch(params.get("search") ?? "");
    setStatus(params.get("status") ?? "all");
    setPage(Number(params.get("page") ?? "1"));
    setSelectedId(params.get("id"));
  }, [queryString]);

  const fetchBookings = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      params.set("page", String(page));

      const res = await fetch(`/api/admin/bookings?${params.toString()}`);
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Failed to load bookings.");
      setBookings(data?.bookings ?? []);
      setTotal(data?.total ?? 0);
    } catch {
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  function exportCSV() {
    const headers = ["Reference", "Guest", "Email", "Phone", "Room", "Check-in", "Check-out", "Nights", "Amount", "Status"];
    const rows = bookings.map((b) => [
      b.booking_reference,
      b.guest_name,
      b.guest_email,
      b.guest_phone,
      b.rooms?.name ?? "",
      b.check_in_date,
      b.check_out_date,
      b.total_nights,
      b.total_amount,
      b.status,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Filters */}
      <div className={`${adminPanelClass} flex flex-wrap items-center gap-3 p-4`}>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search guest name or reference…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className={`${adminInputClass} h-11 pl-9`}
          />
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1); }}
              className={`h-8 rounded-lg px-3 text-xs capitalize transition-colors ${
                status === s
              ? "bg-[#c9a961] text-[#17181a] font-semibold"
                  : "border border-white/10 bg-white/[0.025] text-white/50 hover:border-white/20 hover:text-white/80"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <button
          onClick={exportCSV}
          className={`${adminGhostButtonClass} ml-auto`}
        >
          <Download className="size-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className={`${adminPanelClass} mt-5 overflow-hidden`}>
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex h-48 items-center justify-center">
            <p className="text-sm text-white/30">No bookings found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/8 bg-[#0d0e10]/55">
                <tr>
                  {["Reference", "Guest", "Room", "Check-in", "Check-out", "Amount", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-medium uppercase tracking-wider text-white/35">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => {
                  const statusCls = STATUS_COLORS[b.status] ?? "bg-white/8 text-white/40";
                  return (
                    <tr
                      key={b.id}
                      onClick={() => setSelectedId(b.id)}
                      className="cursor-pointer transition-colors hover:bg-white/[0.035]"
                    >
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-[#c9a961]">{b.booking_reference}</p>
                        {b.booking_type === "reservation" && (
                          <span className="mt-0.5 inline-block rounded-full bg-violet-400/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-violet-400">
                            Pay at check-in
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-white/85">{b.guest_name}</p>
                        <p className="text-xs text-white/35">{b.guest_email}</p>
                      </td>
                      <td className="px-4 py-3 text-white/65">{b.rooms?.name ?? "—"}</td>
                      <td className="px-4 py-3 text-white/65">{formatDateShort(b.check_in_date)}</td>
                      <td className="px-4 py-3 text-white/65">{formatDateShort(b.check_out_date)}</td>
                      <td className="px-4 py-3 text-white/85">{formatNaira(b.total_amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${statusCls}`}>
                          {b.status.replace("_", " ")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <span>{total} bookings total</span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-2 hover:border-white/20 disabled:opacity-30"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span>Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="rounded-xl border border-white/10 bg-white/[0.025] p-2 hover:border-white/20 disabled:opacity-30"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Detail drawer */}
      {selectedId && (
        <BookingDrawer
          bookingId={selectedId}
          onClose={() => { setSelectedId(null); fetchBookings(); }}
          onUpdate={fetchBookings}
        />
      )}
    </>
  );
}
