import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin, CalendarCheck, Mail } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Booking confirmed",
};

function makeReference() {
  const year = new Date().getFullYear();
  const random = Array.from({ length: 6 })
    .map(() =>
      "ABCDEFGHJKMNPQRSTUVWXYZ23456789".charAt(Math.floor(Math.random() * 30))
    )
    .join("");
  return `EUP-${year}-${random}`;
}

export default function BookingSuccessPage() {
  const reference = makeReference();

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] py-24 text-white sm:py-32">
        <Image
          src="/hotel-assets/hotel-aerial.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/78 via-[var(--color-charcoal)]/68 to-[var(--color-charcoal)]" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-10">
          <Reveal variant="scale" className="mx-auto inline-flex size-20 items-center justify-center rounded-full bg-[var(--color-gold)]/15 text-[var(--color-gold-light)] ring-1 ring-[var(--color-gold)]/30">
            <CheckCircle2 className="size-10" />
          </Reveal>

          <Reveal variant="fade-up" delay={0.1} className="mt-8">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              Booking confirmed
            </span>
            <h1 className="mt-4 font-heading text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
              We have your room held.
            </h1>
            <p className="mt-4 text-lg text-white/75 text-pretty">
              A confirmation email is on its way with everything you need for
              your stay. We look forward to welcoming you.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={0.2} className="mt-10">
            <div className="mx-auto inline-flex flex-col items-center border border-white/15 bg-white/8 px-8 py-6 backdrop-blur-xl">
              <span className="text-[10px] uppercase tracking-[0.32em] text-white/55">
                Booking reference
              </span>
              <span className="mt-2 font-heading text-3xl tabular-nums tracking-[0.18em] text-[var(--color-gold-light)]">
                {reference}
              </span>
              <span className="mt-3 max-w-xs text-xs text-white/55">
                Quote this when you arrive at reception or contact us.
              </span>
            </div>
          </Reveal>

          <Reveal
            variant="fade-up"
            delay={0.3}
            className="mt-10 grid gap-3 text-left sm:grid-cols-3"
          >
            <InfoTile
              icon={CalendarCheck}
              title="Check-in"
              body={`Doors open from ${siteConfig.hours.checkIn}.`}
            />
            <InfoTile
              icon={MapPin}
              title="Find us"
              body={siteConfig.contact.addressShort}
            />
            <InfoTile
              icon={Mail}
              title="Questions?"
              body={siteConfig.contact.email}
            />
          </Reveal>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)]"
            >
              Back home
            </Link>
            <Link
              href="/rooms"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
            >
              Browse other rooms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoTile({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-[var(--color-gold)]/15 text-[var(--color-gold-light)]">
          <Icon className="size-4" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-white/60">
          {title}
        </span>
      </div>
      <p className="mt-3 text-white/85">{body}</p>
    </div>
  );
}
