import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Booking incomplete",
  robots: {
    index: false,
    follow: false,
  },
};

type SearchParams = Promise<{ reason?: string }>;

const REASONS: Record<string, { headline: string; body: string }> = {
  payment_failed: {
    headline: "Payment was not completed.",
    body: "Your card was not charged. This is usually a temporary issue with the payment gateway. Please try again.",
  },
  missing_reference: {
    headline: "We lost track of your booking.",
    body: "The payment reference was not returned correctly. Your card was not charged. Please try booking again.",
  },
  not_found: {
    headline: "Booking not found.",
    body: "We couldn't find a booking matching this payment. If you were charged, please contact us immediately with your bank reference.",
  },
  amount_mismatch: {
    headline: "Payment amount mismatch.",
    body: "The amount charged did not match the booking total. Your booking has been flagged for manual review. Please contact us.",
  },
  invalid_status: {
    headline: "This booking is no longer active.",
    body: "It may have been cancelled or already confirmed. Please check your email or contact us for assistance.",
  },
  server_error: {
    headline: "Something went wrong on our end.",
    body: "Your card was likely not charged. Please try again or call us and we will process the reservation manually.",
  },
};

export default async function BookingFailedPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { reason } = await searchParams;
  const content = REASONS[reason ?? ""] ?? {
    headline: "That didn't go through.",
    body: "Your card was not charged. The most common cause is a network hiccup at the payment step. Try again, or call us and we will process the reservation by hand.",
  };

  return (
    <>
      <section className="relative bg-[var(--color-charcoal)] py-24 text-white sm:py-32">
        <Image
          src="/hotel-assets/welcome-slide.jpg"
          alt=""
          fill
          preload
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/78 via-[var(--color-charcoal)]/68 to-[var(--color-charcoal)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-10">
          <Reveal
            variant="scale"
            className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-300/30"
          >
            <AlertCircle className="size-10" />
          </Reveal>

          <Reveal variant="fade-up" delay={0.1} className="mt-8">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-amber-300/80">
              <span className="block h-px w-10 bg-amber-300/60" />
              Booking incomplete
            </span>
            <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              {content.headline}
            </h1>
            <p className="mt-4 text-lg text-white/75 text-pretty">{content.body}</p>
          </Reveal>

          <Reveal
            variant="fade-up"
            delay={0.2}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/rooms"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)]"
            >
              <ArrowLeft className="size-4" />
              Try again
            </Link>
            <a
              href={`tel:${siteConfig.contact.phones[0].number.replace(/\s/g, "")}`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 px-6 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
            >
              <Phone className="size-4" />
              {siteConfig.contact.phones[0].number}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
