import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Volume2,
  Video,
  Lightbulb,
  Wifi,
  ShieldCheck,
  Users,
  ArrowUpRight,
  Phone,
  Mail,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { ConferenceInquiryForm } from "@/components/public/conference-inquiry-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conference Room",
  description:
    "Boardroom-grade venues, configured to your agenda — soundproofed, lit on dimmers, and supported by a dedicated coordinator.",
};

const heroImage =
  "/hotel-assets/facility-conference.png";

const features = [
  {
    icon: Volume2,
    title: "Soundproofed walls",
    body: "The room is built for privacy — confidential discussions stay in the room they were held in.",
  },
  {
    icon: Video,
    title: "Audiovisual kit",
    body: "Wireless microphones, ceiling speakers, 4K display, and a desktop console kept current.",
  },
  {
    icon: Lightbulb,
    title: "Lighting on dimmers",
    body: "Layered lighting, fully adjustable — useful for presentations, helpful for long days.",
  },
  {
    icon: Wifi,
    title: "Dedicated bandwidth",
    body: "A separate, prioritised line for your session. Video calls, large uploads, presentations — all handled.",
  },
  {
    icon: ShieldCheck,
    title: "On-site coordinator",
    body: "A dedicated host stays close throughout the session, looking after catering, breaks, and tech.",
  },
  {
    icon: Users,
    title: "Seats up to 30",
    body: "Boardroom for 14, classroom for 24, theatre-style for 30. We reset between sessions on request.",
  },
];

const layouts = [
  { name: "Boardroom", capacity: "14", note: "Single long table" },
  { name: "U-shape", capacity: "18", note: "Open-end with central display" },
  { name: "Classroom", capacity: "24", note: "Paired writing desks, front-facing" },
  { name: "Theatre", capacity: "30", note: "Compact rows, no desks" },
];

const gallery = [
  "/hotel-assets/facility-conference.png",
  "/hotel-assets/conference-gallery2.jpg",
  "/hotel-assets/conference-gallery1.jpg",
  "/hotel-assets/conference-gallery.jpg",
];

export default function ConferencePage() {
  return (
    <>
      <PageHero
        eyebrow="Conference & events"
        title="Modern, elegant, kept quiet."
        description="A purpose-built venue for executive gatherings — sound-treated, lit on dimmers, and supported by a dedicated coordinator from arrival to wrap."
        image={heroImage}
        crumbs={[{ label: "Conference" }]}
      />

      {/* Features grid */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              What you get
            </span>
            <h2 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Built around the way meetings actually run.
            </h2>
          </Reveal>

          <StaggerGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <StaggerItem
                  key={f.title}
                  className="group rounded-3xl border border-border/60 bg-card p-7 transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)]/40 hover:shadow-[0_24px_48px_-24px_rgba(23,24,26,0.18)]"
                >
                  <div className="grid size-12 place-items-center rounded-2xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)] transition-colors group-hover:bg-[var(--color-gold)]/20">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.body}
                  </p>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      {/* Layouts table + Gallery */}
      <section className="relative bg-[var(--color-ivory-soft)] py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
            <Reveal variant="fade-up" className="space-y-6">
              <h2 className="font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Four ways to set the room.
              </h2>
              <p className="text-muted-foreground">
                Tell us how you would like the day to go and we will configure
                accordingly. Catering and AV setup happen quietly between
                breaks.
              </p>

              <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                {layouts.map((l, i) => (
                  <div
                    key={l.name}
                    className={`grid grid-cols-[1.2fr_auto_1.6fr] items-center gap-4 px-6 py-5 ${i > 0 ? "border-t border-border/60" : ""}`}
                  >
                    <span className="font-heading text-lg tracking-tight">
                      {l.name}
                    </span>
                    <span className="rounded-full bg-[var(--color-gold)]/12 px-3 py-1 text-xs font-semibold tabular-nums text-[var(--color-gold-dark)]">
                      Up to {l.capacity}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {l.note}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={0.15} className="grid grid-cols-2 gap-3">
              {gallery.map((src, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-3xl ${i % 2 === 0 ? "aspect-[3/4]" : "aspect-square"}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 24rem, 50vw"
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Inquiry form + contact */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="fade-up" className="space-y-6">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
                <span className="block h-px w-10 bg-[var(--color-gold)]" />
                Plan the day
              </span>
              <h2 className="font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Tell us about the gathering.
              </h2>
              <p className="text-muted-foreground text-pretty">
                Send a short note with your preferred date, expected guests,
                and the kind of session you have in mind. Our events lead will
                reply within a working day with a tailored quote.
              </p>

              <div className="mt-8 space-y-4 text-sm">
                <a
                  href={`tel:${siteConfig.contact.phones[3].number.replace(/\s/g, "")}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-[var(--color-gold)]/40"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      Events
                    </div>
                    <div className="font-medium">
                      {siteConfig.contact.phones[3].number}
                    </div>
                  </div>
                  <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-[var(--color-gold)]/40"
                >
                  <div className="grid size-11 place-items-center rounded-xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
                    <Mail className="size-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      Email
                    </div>
                    <div className="font-medium">{siteConfig.contact.email}</div>
                  </div>
                  <ArrowUpRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={0.15}>
              <ConferenceInquiryForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] py-20 text-white sm:py-24">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <h2 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">
              Ready to walk the room?
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              Site visits are by appointment. We are happy to walk you through
              the building any weekday morning.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)]"
          >
            Schedule a visit
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
