import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Phone } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Booking incomplete",
};

export default function BookingFailedPage() {
  return (
    <>
      <section className="relative bg-[var(--color-charcoal)] py-24 text-white sm:py-32">
        <Image
          src="/hotel-assets/welcome-slide.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/78 via-[var(--color-charcoal)]/68 to-[var(--color-charcoal)]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-10">
          <Reveal variant="scale" className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-amber-500/15 text-amber-300 ring-1 ring-amber-300/30">
            <AlertCircle className="size-10" />
          </Reveal>

          <Reveal variant="fade-up" delay={0.1} className="mt-8">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-amber-300/80">
              <span className="block h-px w-10 bg-amber-300/60" />
              Booking incomplete
            </span>
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              That didn&apos;t go through.
            </h1>
            <p className="mt-4 text-lg text-white/75 text-pretty">
              Your card was not charged. The most common cause is a network
              hiccup at the payment step. Try again, or call us and we will
              process the reservation by hand.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
