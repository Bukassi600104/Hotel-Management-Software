import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  HeartHandshake,
  Leaf,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { FacilityCard } from "@/components/public/facility-card";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { facilities } from "@/lib/data/facilities";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Quietly placed in Gowon Estate, Egbeda, Euphoria has spent a decade refining a single idea — that hospitality, done patiently, is still the most generous thing a building can offer.",
};

const heroImage =
  "/hotel-assets/about.webp";

const values = [
  {
    icon: HeartHandshake,
    title: "Service that remembers",
    body: "We keep small notes — your espresso preference, the side of the bed you sleep on. Nothing intrusive. Just enough to make the second visit feel familiar.",
  },
  {
    icon: Sparkles,
    title: "Design that recedes",
    body: "Our rooms are dressed quietly. Warm neutrals, soft light, no shouting. The point is to leave attention free for the people you came to see.",
  },
  {
    icon: Leaf,
    title: "Sourced with care",
    body: "Where we can, we buy locally — produce, fabrics, the woodwork. Lagos is full of quietly excellent makers, and we like keeping that work close to home.",
  },
  {
    icon: Award,
    title: "Built to last",
    body: "Ten years in, we still maintain the building like it opened last week. The lift works. The taps run hot. The lobby smells the same on Monday as it does on Sunday.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Our story"
        title="A decade of quiet hospitality."
        description="Euphoria opened in 2014 with a small team and a single idea: that a hotel should feel like a generous host, not a transactional one."
        image={heroImage}
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
            <Reveal variant="scale" className="relative">
              <div className="grid h-[32rem] sm:h-[36rem] lg:h-[40rem] grid-cols-5 grid-rows-6 gap-3 [&>*]:rounded-3xl [&>*]:overflow-hidden [&>*]:relative">
                <div className="col-span-3 row-span-4">
                  <Image
                    src="/hotel-assets/about.webp"
                    alt="A guest suite"
                    fill
                    sizes="(min-width: 1024px) 32rem, 60vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 row-span-3 col-start-4 row-start-1">
                  <Image
                    src="/hotel-assets/restaurant-dsc6939.jpg"
                    alt="The restaurant"
                    fill
                    sizes="(min-width: 1024px) 16rem, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-2 row-span-3 col-start-4 row-start-4">
                  <Image
                    src="/hotel-assets/facility-pool.png"
                    alt="The pool"
                    fill
                    sizes="(min-width: 1024px) 16rem, 30vw"
                    className="object-cover"
                  />
                </div>
                <div className="col-span-3 row-span-2 col-start-1 row-start-5">
                  <Image
                    src="/hotel-assets/facility-rooftop.png"
                    alt="The rooftop lounge"
                    fill
                    sizes="(min-width: 1024px) 26rem, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal variant="fade-up" className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
                <span className="block h-px w-10 bg-[var(--color-gold)]" />
                Our story
              </span>
              <h2 className="font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Built slowly, on a quiet street.
              </h2>
              <div className="space-y-4 text-base leading-relaxed text-foreground/85 sm:text-lg">
                <p>
                  Euphoria began as a single building on the corner of 21/22
                  Road. The brief was straightforward — a five-star hotel that
                  Lagos could call its own, run by people who lived locally and
                  treated the building like it belonged to the neighbourhood.
                </p>
                <p className="text-muted-foreground">
                  Ten years later, much of the original team is still here. The
                  rooms have been refreshed twice. The kitchen has been
                  rebuilt. The rooftop, which was once a flat slab of concrete,
                  is now where most of our guests choose to end their evenings.
                </p>
                <p className="text-muted-foreground">
                  We are private, we are independent, and we are stubbornly
                  committed to running this hotel by ourselves — without a
                  global brand book and without a chain&apos;s sense of
                  efficiency. It takes longer. It works better.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border/60 pt-8">
                <Stat to={2014} label="Opened" useGrouping={false} />
                <Stat to={9} label="Room types" />
                <Stat to={28000} label="Guests served" suffix="+" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="relative bg-[var(--color-ivory-soft)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              How we work
            </span>
            <h2 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Four things we hold ourselves to.
            </h2>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem
                  key={v.title}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7 transition-shadow hover:shadow-[0_24px_48px_-24px_rgba(23,24,26,0.18)]"
                >
                  <div
                    aria-hidden
                    className="absolute -top-10 -right-10 size-32 rounded-full bg-[var(--color-gold)]/8 blur-2xl opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl tracking-tight">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {v.body}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              Facilities
            </span>
            <h2 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Six rooms inside one building.
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((f, i) => (
              <FacilityCard key={f.slug} facility={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] py-24 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-[640px] rounded-full bg-[var(--color-gold)]/10 blur-3xl"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-10">
          <Reveal variant="fade-up" className="space-y-5">
            <h2 className="font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Come and see for yourself.
            </h2>
            <p className="max-w-xl text-white/70 text-pretty">
              Book a room, drop in for breakfast, or hold your next gathering
              in our conference room. We are quietly here, on a quiet street,
              with the lights on.
            </p>
          </Reveal>
          <Reveal
            variant="fade-up"
            delay={0.2}
            className="flex flex-wrap gap-3 lg:justify-end"
          >
            <Link
              href="/rooms"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)]"
            >
              Browse rooms
              <ArrowUpRight className="size-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
            >
              Get in touch
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Stat({
  to,
  label,
  suffix,
  useGrouping,
}: {
  to: number;
  label: string;
  suffix?: string;
  useGrouping?: boolean;
}) {
  return (
    <div>
      <div className="font-heading text-3xl tracking-tight sm:text-4xl">
        <CountUp to={to} suffix={suffix ?? ""} useGrouping={useGrouping} />
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
