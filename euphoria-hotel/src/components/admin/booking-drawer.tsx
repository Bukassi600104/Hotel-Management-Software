"use client";

import * as React from "react";
import {
  X,
  Phone,
  Mail,
  BedDouble,
  CalendarCheck,
  CreditCard,
  FileText,
  LogIn,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { formatNaira, formatDateLong, formatDateShort } from "@/lib/format";

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
  rooms: { name: string; slug: string; thumbnail_url: string | null } | null;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-emerald-400/15 text-emerald-400",
  checked_in: "bg-sky-400/15 text-sky-400",
  checked_out: "bg-white/10 text-white/50",
  pending: "bg-amber-400/15 text-amber-400",
  cancelled: "bg-red-400/15 text-red-400",
  expired: "bg-white/8 text-white/30",
  refunded: "bg-purple-400/15 text-purple-400",
};

export function BookingDrawer({
  bookingId,
  onClose,
  onUpdate,
}: {
  bookingId: string;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [booking, setBooking] = React.useState<Booking | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notes, setNotes] = React.useState("");
  const [savingNotes, setSavingNotes] = React.useState(false);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const [cancelReason, setCancelReason] = React.useState("");
  const [cancelling, setCancelling] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/admin/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        setBooking(data);
        setNotes(data.internal_notes ?? "");
        setLoading(false);
      });
  }, [bookingId]);

  async function performAction(action: string, extra?: Record<string, unknown>) {
    setActionLoading(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    setActionLoading(false);
    onUpdate();
    onClose();
  }

  async function saveNotes() {
    setSavingNotes(true);
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_notes", internalNotes: notes }),
    });
    setSavingNotes(false);
    setBooking((b) => b ? { ...b, internal_notes: notes } : b);
  }

  async function handleCancel() {
    setCancelling(true);
    await performAction("cancel", { cancellationReason: cancelReason });
  }

  const today = new Date().toISOString().split("T")[0];
  const canCheckIn = booking?.status === "confirmed" && booking?.check_in_date <= today;
  const canCheckOut = booking?.status === "checked_in";
  const canCancel = !["cancelled", "refunded", "expired", "checked_out"].includes(booking?.status ?? "");

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 flex w-full flex-col border-l border-white/8 bg-[#111316] shadow-2xl sm:max-w-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
          <div>
            <p className="font-mono text-sm text-[#c9a961]">
              {booking?.booking_reference ?? "Loading…"}
            </p>
            {booking && (
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${STATUS_COLORS[booking.status] ?? ""}`}>
                {booking.status.replace("_", " ")}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="size-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="size-6 animate-spin rounded-full border-2 border-white/20 border-t-[#c9a961]" />
          </div>
        ) : booking ? (
          <div className="flex-1 space-y-6 p-5">
            {/* Guest info */}
            <section>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/35">Guest</p>
              <p className="text-base font-semibold text-white">{booking.guest_name}</p>
              <div className="mt-2 space-y-1">
                <a href={`mailto:${booking.guest_email}`} className="flex items-center gap-2 text-sm text-white/55 hover:text-white/80">
                  <Mail className="size-3.5 text-white/30" />
                  {booking.guest_email}
                </a>
                <a href={`tel:${booking.guest_phone}`} className="flex items-center gap-2 text-sm text-white/55 hover:text-white/80">
                  <Phone className="size-3.5 text-white/30" />
                  {booking.guest_phone}
                </a>
              </div>
              {(booking.num_adults || booking.num_children) && (
                <p className="mt-2 text-xs text-white/35">
                  {booking.num_adults} adult{booking.num_adults !== 1 ? "s" : ""}
                  {booking.num_children ? ` · ${booking.num_children} child${booking.num_children !== 1 ? "ren" : ""}` : ""}
                </p>
              )}
              {booking.arrival_time && (
                <p className="mt-1 text-xs text-white/35">Estimated arrival: {booking.arrival_time}</p>
              )}
            </section>

            {/* Room & dates */}
            <section>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/35">Reservation</p>
              <div className="space-y-2">
                <Row icon={BedDouble} label="Room" value={booking.rooms?.name ?? "—"} />
                <Row icon={CalendarCheck} label="Check-in" value={formatDateLong(booking.check_in_date)} />
                <Row icon={CalendarCheck} label="Check-out" value={formatDateLong(booking.check_out_date)} />
                <Row icon={CalendarCheck} label="Duration" value={`${booking.total_nights} night${booking.total_nights !== 1 ? "s" : ""}`} />
              </div>
            </section>

            {/* Pricing */}
            <section>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/35">Payment</p>
              <div className="rounded-lg border border-white/8 bg-white/3 p-4 space-y-2 text-sm">
                <div className="flex justify-between text-white/55">
                  <span>{formatNaira(booking.price_per_night)} × {booking.total_nights} nights</span>
                  <span>{formatNaira(booking.subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/55">
                  <span>VAT (7.5%)</span>
                  <span>{formatNaira(booking.vat_amount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-white border-t border-white/8 pt-2">
                  <span>Total</span>
                  <span>{formatNaira(booking.total_amount)}</span>
                </div>
                {booking.paid_at && (
                  <p className="pt-1 flex items-center gap-2 text-xs text-emerald-400">
                    <CreditCard className="size-3.5" />
                    Paid {formatDateShort(booking.paid_at)}
                    {booking.paystack_reference && (
                      <span className="text-white/30">· {booking.paystack_reference}</span>
                    )}
                  </p>
                )}
              </div>
            </section>

            {/* Guest notes */}
            {booking.notes && (
              <section>
                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-white/35">Guest notes</p>
                <p className="rounded-lg border border-white/8 bg-white/3 p-3 text-sm text-white/65">{booking.notes}</p>
              </section>
            )}

            {/* Internal notes */}
            <section>
              <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/35">
                <FileText className="size-3" />
                Internal notes (staff only)
              </p>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a note visible only to staff…"
                className="w-full resize-none rounded-lg border border-white/10 bg-white/4 p-3 text-sm text-white/80 placeholder:text-white/20 focus:border-[#c9a961]/40 focus:outline-none"
              />
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="mt-2 rounded-lg bg-white/8 px-3 py-1.5 text-xs text-white/60 hover:bg-white/12 disabled:opacity-40"
              >
                {savingNotes ? "Saving…" : "Save notes"}
              </button>
            </section>

            {/* Cancellation info */}
            {booking.cancelled_at && (
              <section>
                <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-red-400/60">Cancellation</p>
                <p className="text-sm text-white/50">
                  Cancelled on {formatDateShort(booking.cancelled_at)}
                  {booking.cancellation_reason && ` — ${booking.cancellation_reason}`}
                </p>
              </section>
            )}

            {/* Actions */}
            {(canCheckIn || canCheckOut || canCancel) && (
              <section className="space-y-2">
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Actions</p>

                {canCheckIn && (
                  <button
                    disabled={actionLoading}
                    onClick={() => performAction("check_in")}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500/15 py-2.5 text-sm font-medium text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-40 transition-colors"
                  >
                    <LogIn className="size-4" />
                    Mark as Checked In
                  </button>
                )}

                {canCheckOut && (
                  <button
                    disabled={actionLoading}
                    onClick={() => performAction("check_out")}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500/15 py-2.5 text-sm font-medium text-sky-400 hover:bg-sky-500/25 disabled:opacity-40 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Mark as Checked Out
                  </button>
                )}

                {canCancel && (
                  <button
                    onClick={() => setShowCancelDialog(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 py-2.5 text-sm text-red-400/70 hover:border-red-500/40 hover:text-red-400 transition-colors"
                  >
                    <AlertTriangle className="size-4" />
                    Cancel booking
                  </button>
                )}
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-white/30">Booking not found.</p>
          </div>
        )}
      </div>

      {/* Cancel confirmation dialog */}
      {showCancelDialog && (
        <>
          <div className="fixed inset-0 z-50 bg-black/70" />
          <div className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 rounded-xl border border-white/10 bg-[#1a1c20] p-6 shadow-2xl sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2">
            <h2 className="text-base font-semibold text-white">Cancel this booking?</h2>
            <p className="mt-2 text-sm text-white/50">
              A cancellation email will be sent to the guest. This action cannot be undone.
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs text-white/40">Reason (optional)</label>
              <input
                type="text"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g. Guest requested cancellation"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/25 focus:border-[#c9a961]/40 focus:outline-none"
              />
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-white/60 hover:border-white/20"
              >
                Keep booking
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-lg bg-red-500/15 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/25 disabled:opacity-40"
              >
                {cancelling ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <Icon className="mt-0.5 size-4 shrink-0 text-white/25" />
      <div className="flex flex-1 justify-between gap-2">
        <span className="text-white/40">{label}</span>
        <span className="text-right text-white/75">{value}</span>
      </div>
    </div>
  );
}
