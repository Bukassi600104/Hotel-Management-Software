import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";

import { findDemoBooking } from "@/lib/demo/store";
import { formatDateLong, formatNaira } from "@/lib/format";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasSupabaseAdminEnv } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Preview the online payment step for a hotel booking.",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Promise<{ ref?: string; demo?: string }>;

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { ref, demo } = await searchParams;
  if (!ref) notFound();

  const booking = await findCheckoutBooking(ref);
  if (!booking) notFound();

  return (
    <section className="min-h-screen bg-[var(--color-charcoal)] px-4 pb-16 pt-32 text-white sm:px-6 sm:pt-36 lg:px-10 lg:pt-40">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_26rem]">
        <div className="rounded-2xl border border-white/10 bg-white/6 p-6 shadow-2xl backdrop-blur">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold-light)]">
            <LockKeyhole className="size-3" />
            {demo ? "Demo checkout" : "Secure checkout"}
          </div>

          <h1 className="mt-6 font-heading text-4xl leading-tight sm:text-5xl">
            Complete your payment.
          </h1>
          <p className="mt-3 max-w-2xl text-white/65">
            This page previews the Paystack handoff your client will see once
            their live API keys are connected. No card is charged in demo mode.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-[#0f1114] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
                  Merchant
                </p>
                <p className="mt-1 text-lg font-semibold">Hilton Euphoria Hotel</p>
              </div>
              <div className="grid size-12 place-items-center rounded-xl bg-[var(--color-gold)] text-[#17181a]">
                <CreditCard className="size-6" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <CheckoutField label="Card number" value="4084 0840 8408 4081" />
              <CheckoutField label="Expiry" value="12 / 30" />
              <CheckoutField label="CVV" value="123" />
              <CheckoutField label="PIN / OTP" value="Demo verified" />
            </div>

            <Link
              href={`/booking/success?ref=${booking.booking_reference}`}
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl gold-gradient text-sm font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_18px_40px_-18px_rgba(201,169,97,0.8)]"
            >
              Complete demo payment
            </Link>

            <p className="mt-3 text-center text-xs text-white/40">
              Production mode redirects here from Paystack and confirms payment through the webhook/verify API.
            </p>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/8 p-6 backdrop-blur">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-[var(--color-gold-light)]" />
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/45">
              Booking summary
            </p>
          </div>
          <h2 className="mt-4 font-heading text-3xl">{booking.rooms?.name ?? "Your room"}</h2>
          <p className="mt-1 text-sm text-white/55">
            {formatDateLong(booking.check_in_date)} to {formatDateLong(booking.check_out_date)}
          </p>

          <div className="mt-6 space-y-3 text-sm">
            <SummaryRow label="Reference" value={booking.booking_reference} />
            <SummaryRow label="Guest" value={booking.guest_name} />
            <SummaryRow label="Nights" value={`${booking.total_nights}`} />
            <SummaryRow label="Subtotal" value={formatNaira(booking.subtotal)} />
            <SummaryRow label="VAT" value={formatNaira(booking.vat_amount)} />
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-white/55">Total</span>
              <span className="font-heading text-3xl text-[var(--color-gold-light)]">
                {formatNaira(booking.total_amount)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

async function findCheckoutBooking(ref: string) {
  if (!hasSupabaseAdminEnv()) {
    return findDemoBooking(ref);
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("bookings")
    .select(
      "booking_reference, guest_name, check_in_date, check_out_date, total_nights, subtotal, vat_amount, total_amount, rooms(name)"
    )
    .eq("booking_reference", ref)
    .single();

  return data;
}

function CheckoutField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">{label}</p>
      <p className="mt-1 font-mono text-sm text-white/80">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-white/45">{label}</span>
      <span className="text-right font-medium text-white/85">{value}</span>
    </div>
  );
}
