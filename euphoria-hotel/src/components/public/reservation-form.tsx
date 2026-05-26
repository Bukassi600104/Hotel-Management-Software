"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, AlertTriangle } from "lucide-react";

type Room = {
  slug: string;
  name: string;
  maxGuests: number;
};

type Props = {
  room: Room;
  checkin: string;
  checkout: string;
  nights: number;
  adults: number;
  childCount: number;
};

export function ReservationForm({ room, checkin, checkout, nights, adults, childCount }: Props) {
  const router = useRouter();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    numAdults: adults,
    numChildren: childCount,
    arrivalTime: "",
    notes: "",
  });

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [bookingRef, setBookingRef] = React.useState<string | null>(null);

  function set(field: keyof typeof form, value: string | number) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/reservations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomSlug: room.slug,
          checkin,
          checkout,
          numAdults: form.numAdults,
          numChildren: form.numChildren,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          arrivalTime: form.arrivalTime || undefined,
          notes: form.notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create reservation. Please try again.");
      } else {
        setBookingRef(data.bookingReference);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (bookingRef) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-8 text-center">
        <div className="mx-auto mb-4 inline-grid size-14 place-items-center rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle className="size-7" />
        </div>
        <h2 className="font-heading text-2xl tracking-tight">Reservation confirmed!</h2>
        <p className="mt-3 text-muted-foreground">
          Your reservation reference is{" "}
          <span className="font-mono font-bold text-[var(--color-gold-dark)] text-lg">{bookingRef}</span>.
          A confirmation email has been sent to <strong>{form.email}</strong>.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/5 px-4 py-3 text-sm text-[var(--color-gold-dark)]">
          Payment of your total amount is due at check-in. We accept cash (Naira) and card.
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/booking/manage")}
            className="flex-1 h-11 rounded-xl border border-border px-5 text-sm font-medium hover:bg-muted/60 transition-colors"
          >
            Manage my booking
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 h-11 rounded-xl gold-gradient text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest info */}
      <div>
        <h3 className="text-base font-semibold mb-4">Your details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" required>
            <input
              type="text"
              value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)}
              required
              minLength={2}
              className={inputCls}
              placeholder="Adaeze"
            />
          </Field>
          <Field label="Last name" required>
            <input
              type="text"
              value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)}
              required
              minLength={2}
              className={inputCls}
              placeholder="Okafor"
            />
          </Field>
          <Field label="Email address" required>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              required
              className={inputCls}
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Phone number" required>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              required
              className={inputCls}
              placeholder="+234 800 000 0000"
            />
          </Field>
        </div>
      </div>

      {/* Guests */}
      <div>
        <h3 className="text-base font-semibold mb-4">Guests</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Adults">
            <select
              value={form.numAdults}
              onChange={(e) => set("numAdults", Number(e.target.value))}
              className={inputCls}
            >
              {Array.from({ length: room.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} adult{n !== 1 ? "s" : ""}</option>
              ))}
            </select>
          </Field>
          <Field label="Children">
            <select
              value={form.numChildren}
              onChange={(e) => set("numChildren", Number(e.target.value))}
              className={inputCls}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n === 0 ? "No children" : `${n} child${n !== 1 ? "ren" : ""}`}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>

      {/* Preferences */}
      <div>
        <h3 className="text-base font-semibold mb-4">Arrival preferences</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Expected arrival time">
            <select
              value={form.arrivalTime}
              onChange={(e) => set("arrivalTime", e.target.value)}
              className={inputCls}
            >
              <option value="">Select a time (optional)</option>
              {["Before 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM", "6:00 PM – 9:00 PM", "After 9:00 PM"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Special requests or notes">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Dietary requirements, accessibility needs, celebrations, or any other requests…"
              className={`${inputCls} resize-none`}
            />
          </Field>
        </div>
      </div>

      {/* Pay-at-checkin notice */}
      <div className="flex gap-3 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-4 text-sm">
        <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-dark)]" />
        <div>
          <p className="font-medium text-foreground">No payment required now</p>
          <p className="mt-0.5 text-muted-foreground">
            This reservation holds your room at no cost. Payment is collected in full at check-in.
            We accept cash (Naira) and card.
          </p>
        </div>
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
        className="inline-flex h-13 w-full items-center justify-center gold-gradient text-xs font-semibold uppercase tracking-[0.2em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.5)] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {loading ? "Confirming reservation…" : `Confirm reservation — ${nights} night${nights !== 1 ? "s" : ""}`}
      </button>

      <p className="text-center text-xs text-muted-foreground">
        By confirming, you agree to our cancellation policy: free cancellation up to 48 hours before check-in.
      </p>
    </form>
  );
}

const inputCls =
  "h-11 w-full rounded-xl border border-border bg-card px-4 text-sm placeholder:text-muted-foreground focus:border-[var(--color-gold)]/50 focus:outline-none";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-[var(--color-gold-dark)]">*</span>}
      </label>
      {children}
    </div>
  );
}
