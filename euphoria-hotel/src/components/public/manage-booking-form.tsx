"use client";

import * as React from "react";
import Image from "next/image";
import { Search, X, AlertTriangle, CheckCircle, Calendar, Clock } from "lucide-react";
import { formatNaira, formatDateLong } from "@/lib/format";

type BookingData = {
  id: string;
  booking_reference: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: string;
  check_out_date: string;
  total_nights: number;
  total_amount: number;
  price_per_night: number;
  subtotal: number;
  vat_amount: number;
  num_adults: number;
  num_children: number | null;
  arrival_time: string | null;
  status: string;
  booking_type: string;
  created_at: string | null;
  paid_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  rooms: { name: string; slug: string; thumbnail_url: string | null } | null;
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  confirmed: { label: "Confirmed", color: "bg-emerald-400/15 text-emerald-400" },
  pending: { label: "Pending payment", color: "bg-amber-400/15 text-amber-400" },
  checked_in: { label: "Checked in", color: "bg-sky-400/15 text-sky-400" },
  checked_out: { label: "Checked out", color: "bg-white/15 text-white/60" },
  cancelled: { label: "Cancelled", color: "bg-red-400/15 text-red-400" },
  refunded: { label: "Refunded", color: "bg-purple-400/15 text-purple-400" },
  expired: { label: "Expired", color: "bg-white/8 text-white/30" },
};

const CANCELLABLE_STATUSES = ["confirmed", "pending"];

type Step = "lookup" | "details" | "cancel-confirm" | "cancelled";

export function ManageBookingForm() {
  const [currentTime] = React.useState(() => Date.now());
  const [step, setStep] = React.useState<Step>("lookup");
  const [reference, setReference] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [booking, setBooking] = React.useState<BookingData | null>(null);
  const [cancelReason, setCancelReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isWithin24h, setIsWithin24h] = React.useState(false);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference: reference, email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Booking not found.");
      } else {
        setBooking(data.booking);
        setStep("details");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/bookings/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingReference: reference, email, reason: cancelReason || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not cancel booking.");
      } else {
        setIsWithin24h(data.isWithin24Hours ?? false);
        setStep("cancelled");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setStep("lookup");
    setReference("");
    setEmail("");
    setBooking(null);
    setCancelReason("");
    setError(null);
  }

  if (step === "cancelled") {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto mb-4 inline-grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle className="size-7" />
        </div>
        <h2 className="font-heading text-2xl tracking-tight">Booking cancelled.</h2>
        <p className="mt-3 text-muted-foreground">
          Your booking <span className="font-mono font-semibold text-foreground">{reference.toUpperCase()}</span> has been cancelled
          and a confirmation email has been sent to <strong>{email}</strong>.
        </p>
        {isWithin24h && (
          <p className="mt-3 rounded-xl border border-amber-400/25 bg-amber-400/8 px-4 py-3 text-sm text-amber-600">
            Since this cancellation is within 24 hours of check-in, a one-night charge may apply per our cancellation policy.
          </p>
        )}
        <p className="mt-3 text-sm text-muted-foreground">
          Refunds are processed within 5–7 business days to your original payment method.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
        >
          Look up another booking
        </button>
      </div>
    );
  }

  if (step === "cancel-confirm" && booking) {
    const statusInfo = STATUS_LABELS[booking.status];
    const checkIn = new Date(booking.check_in_date);
    const hoursUntil = (checkIn.getTime() - currentTime) / 3_600_000;
    const within24h = hoursUntil < 24 && hoursUntil > 0;

    return (
      <div className="mx-auto max-w-xl">
        <h2 className="font-heading text-2xl tracking-tight">Cancel your booking</h2>
        <p className="mt-2 text-muted-foreground">
          Please review the details below before confirming cancellation.
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-5 text-sm">
          <p className="font-semibold text-foreground">{booking.booking_reference}</p>
          <p className="mt-0.5 text-muted-foreground">
            {booking.rooms?.name} · {formatDateLong(booking.check_in_date)} → {formatDateLong(booking.check_out_date)}
          </p>
          {statusInfo && (
            <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          )}
        </div>

        {within24h && (
          <div className="mt-4 flex gap-3 rounded-xl border border-amber-400/25 bg-amber-400/8 p-4 text-sm text-amber-700">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" />
            <p>
              Your check-in is in less than 24 hours. A one-night charge may apply per our cancellation policy.
            </p>
          </div>
        )}

        <form onSubmit={handleCancel} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Reason for cancellation (optional)</label>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Let us know why you're cancelling…"
              className="w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-[var(--color-gold)]/50 focus:outline-none"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 rounded-xl bg-red-500 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Cancelling…" : "Confirm cancellation"}
            </button>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="h-11 rounded-xl border border-border px-5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Go back
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === "details" && booking) {
    const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, color: "bg-white/8 text-white/40" };
    const canCancel = CANCELLABLE_STATUSES.includes(booking.status);

    return (
      <div className="mx-auto max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl tracking-tight">Your booking</h2>
            <p className="mt-1 text-muted-foreground text-sm">Found booking for {booking.guest_name}</p>
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3.5" /> New lookup
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Room image */}
          {booking.rooms?.thumbnail_url && (
            <div className="relative h-44 overflow-hidden">
              <Image
                src={booking.rooms.thumbnail_url}
                alt={booking.rooms.name}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 672px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-light)]">Your room</p>
                  <h3 className="font-heading text-2xl text-white">{booking.rooms.name}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Reference */}
            <div className="flex items-center justify-between gap-4 rounded-xl bg-muted/50 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Booking reference</p>
                <p className="mt-0.5 font-mono text-xl font-bold text-[var(--color-gold-dark)] tracking-wider">
                  {booking.booking_reference}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>

            {/* Dates */}
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailCard icon={Calendar} label="Check-in" value={formatDateLong(booking.check_in_date)} sub={`From ${booking.arrival_time ?? "3:00 PM"}`} />
              <DetailCard icon={Calendar} label="Check-out" value={formatDateLong(booking.check_out_date)} sub="By 12:00 PM" />
            </div>

            {/* Stay info */}
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoRow label="Duration" value={`${booking.total_nights} night${booking.total_nights !== 1 ? "s" : ""}`} />
              <InfoRow label="Guests" value={`${booking.num_adults} adult${booking.num_adults !== 1 ? "s" : ""}${booking.num_children ? `, ${booking.num_children} child${booking.num_children !== 1 ? "ren" : ""}` : ""}`} />
              <InfoRow label="Payment type" value={booking.booking_type === "reservation" ? "Pay at check-in" : "Paid online"} />
            </div>

            {/* Pricing */}
            <div className="rounded-xl border border-border/60 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Per night</span>
                <span>{formatNaira(booking.price_per_night)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{booking.total_nights} night{booking.total_nights !== 1 ? "s" : ""}</span>
                <span>{formatNaira(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VAT (7.5%)</span>
                <span>{formatNaira(booking.vat_amount)}</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 font-semibold text-foreground">
                <span>Total</span>
                <span>{formatNaira(booking.total_amount)}</span>
              </div>
            </div>

            {/* Guest contact */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p><span className="font-medium text-foreground">Guest: </span>{booking.guest_name}</p>
              <p><span className="font-medium text-foreground">Email: </span>{booking.guest_email}</p>
              <p><span className="font-medium text-foreground">Phone: </span>{booking.guest_phone}</p>
            </div>

            {/* Cancellation notice */}
            {booking.cancelled_at && (
              <div className="flex gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm">
                <Clock className="mt-0.5 size-4 shrink-0 text-red-400" />
                <div>
                  <p className="font-medium text-red-600">Cancelled on {formatDateLong(booking.cancelled_at.split("T")[0])}</p>
                  {booking.cancellation_reason && (
                    <p className="mt-0.5 text-muted-foreground">Reason: {booking.cancellation_reason}</p>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            {canCancel && (
              <button
                onClick={() => setStep("cancel-confirm")}
                className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-red-500/30 text-sm font-medium text-red-500 hover:bg-red-500/8 transition-colors"
              >
                Cancel this booking
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Need help? Call us at <a href="tel:+2348060260260" className="underline">+234 806 026 0260</a> or email{" "}
          <a href="mailto:booking@hiltoneuphoriahotel.com" className="underline">booking@hiltoneuphoriahotel.com</a>
        </p>
      </div>
    );
  }

  // Step: lookup
  return (
    <div className="mx-auto max-w-lg">
      <form onSubmit={handleLookup} className="space-y-5">
        <div>
          <label htmlFor="ref" className="mb-2 block text-sm font-medium">
            Booking reference
          </label>
          <input
            id="ref"
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value.toUpperCase())}
            placeholder="e.g. HEH-2026-AB12CD"
            required
            className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm font-mono uppercase placeholder:normal-case placeholder:text-muted-foreground focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your reference is in your confirmation email (format: HEH-YYYY-XXXXXX).
          </p>
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="The email used when booking"
            required
            className="h-12 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-[var(--color-gold)]/50 focus:outline-none"
          />
        </div>

        {error && (
          <div className="flex gap-3 rounded-xl border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-600">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 gold-gradient text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.5)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          <Search className="size-4" />
          {loading ? "Looking up…" : "Find my booking"}
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-border/60 bg-muted/30 p-5 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Can&apos;t find your booking?</p>
        <p className="mt-1">
          Call our front desk at{" "}
          <a href="tel:+2348060260260" className="text-[var(--color-gold-dark)] underline">
            +234 806 026 0260
          </a>{" "}
          or email{" "}
          <a href="mailto:booking@hiltoneuphoriahotel.com" className="text-[var(--color-gold-dark)] underline">
            booking@hiltoneuphoriahotel.com
          </a>
          . We&apos;re available 24 hours a day.
        </p>
      </div>
    </div>
  );
}

function DetailCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/30 p-4">
      <div className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-semibold">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-sm">
      <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
