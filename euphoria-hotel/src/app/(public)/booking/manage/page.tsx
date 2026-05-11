import type { Metadata } from "next";
import { ManageBookingForm } from "@/components/public/manage-booking-form";

export const metadata: Metadata = {
  title: "Manage Your Booking | Hilton Euphoria Hotel",
  description: "Look up your booking, view your reservation details, or cancel your stay.",
};

export default function ManageBookingPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] pb-16 pt-32 text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/90 to-[var(--color-charcoal)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]">
            <span className="block h-px w-10 bg-[var(--color-gold)]" />
            Guest services
          </span>
          <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight sm:text-5xl">
            Manage your booking.
          </h1>
          <p className="mt-3 max-w-xl text-white/70">
            Enter your booking reference and email address to view your reservation details, check status, or request a cancellation.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-14 -mt-8">
        <ManageBookingForm />
      </div>

      <div className="h-16" />
    </>
  );
}
