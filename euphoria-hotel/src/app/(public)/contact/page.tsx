import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { Reveal } from "@/components/motion/reveal";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/public/social-icons";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Euphoria Hotel. Reservations, events, or a question for the front desk — we are usually quick to reply.",
};

const heroImage =
  "/hotel-assets/about.webp";

const socialMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
  twitter: TwitterIcon,
  youtube: YoutubeIcon,
} as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="We are quietly here, on a quiet street."
        description="Send a note, call the front desk, or drop in unannounced. The reception is staffed twenty-four hours a day."
        image={heroImage}
        crumbs={[{ label: "Contact" }]}
      />

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Info card */}
          <Reveal variant="fade-up" className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
                <span className="block h-px w-10 bg-[var(--color-gold)]" />
                Visit us
              </span>
              <h2 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                Where to find us.
              </h2>
            </div>

            <ul className="space-y-3">
              <ContactRow
                icon={MapPin}
                title="Address"
                lines={[siteConfig.contact.address]}
              />
              <ContactRow
                icon={Phone}
                title="Phones"
                lines={siteConfig.contact.phones.map(
                  (p) => `${p.label} · ${p.number}`
                )}
              />
              <ContactRow
                icon={Mail}
                title="Email"
                lines={[siteConfig.contact.email]}
                href={`mailto:${siteConfig.contact.email}`}
              />
              <ContactRow
                icon={Clock}
                title="Hours"
                lines={[
                  `Check-in · ${siteConfig.hours.checkIn}`,
                  `Check-out · ${siteConfig.hours.checkOut}`,
                  `Reception · ${siteConfig.hours.reception}`,
                ]}
              />
            </ul>

            {/* Socials */}
            <div className="space-y-4 pt-4">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                Stay in touch
              </div>
              <div className="flex items-center gap-2">
                {siteConfig.socials.map((s) => {
                  const Icon =
                    socialMap[s.icon as keyof typeof socialMap];
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="grid size-11 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal variant="fade-up" delay={0.15}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal
            variant="scale"
            className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 shadow-[0_30px_60px_-30px_rgba(23,24,26,0.25)]"
          >
            <iframe
              title="Hotel location map"
              className="absolute inset-0 h-full w-full"
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.255%2C6.567%2C3.295%2C6.597&layer=mapnik&marker=6.582%2C3.275"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactRow({
  icon: Icon,
  title,
  lines,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  lines: string[];
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-[var(--color-gold)]/40">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)]">
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {title}
        </div>
        <div className="mt-1 space-y-0.5 text-sm font-medium">
          {lines.map((l) => (
            <div key={l}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <li>
        <a href={href} className="block">
          {inner}
        </a>
      </li>
    );
  }
  return <li>{inner}</li>;
}
