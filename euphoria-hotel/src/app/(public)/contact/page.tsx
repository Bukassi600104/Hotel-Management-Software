import type { Metadata } from "next";
import {
  CalendarClock,
  Clock3,
  MailCheck,
  MapPinned,
  MessageCircle,
  Navigation,
  PhoneCall,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/components/public/contact-form";
import { Reveal } from "@/components/motion/reveal";
import {
  FacebookIcon,
  InstagramIcon,
} from "@/components/public/social-icons";
import { siteConfig } from "@/lib/site";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";
import { buildPageMetadata, findPublicSeo } from "@/lib/seo";

const seo = findPublicSeo("/contact")!;

export const metadata: Metadata = buildPageMetadata({
  path: seo.path,
  title: seo.title,
  description: seo.description,
  image: seo.image,
});

const socialMap = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
} as const;

export default async function ContactPage() {
  const cms = await getCmsPage("contact");
  return (
    <>
      <PageHero
        eyebrow={cms.hero_eyebrow}
        title={cms.hero_title}
        description={cms.hero_description}
        image={textContent(cms, "heroImageOverride", cms.hero_image)}
        crumbs={[{ label: "Contact" }]}
      />

      <section className="relative py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          {/* Info card */}
          <Reveal variant="fade-up" className="space-y-8">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-dark)]">
                <span className="block h-px w-10 bg-[var(--color-gold)]" />
                {textContent(cms, "infoEyebrow", "Visit us")}
              </span>
              <h2 className="mt-3 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
                {textContent(cms, "infoTitle", "Where to find us.")}
              </h2>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              <ContactRow
                icon={MapPinned}
                title="Address"
                lines={[siteConfig.contact.address]}
              />
              <ContactRow
                icon={PhoneCall}
                title="Phones"
                lines={siteConfig.contact.phones.map(
                  (p) => `${p.label} | ${p.number}`
                )}
              />
              <ContactRow
                icon={MailCheck}
                title="Email"
                lines={[siteConfig.contact.email]}
                href={`mailto:${siteConfig.contact.email}`}
              />
              <ContactRow
                icon={Clock3}
                title="Hours"
                lines={[
                  `Check-in | ${siteConfig.hours.checkIn}`,
                  `Check-out | ${siteConfig.hours.checkOut}`,
                  `Reception | ${siteConfig.hours.reception}`,
                ]}
              />
            </ul>

            <div className="grid gap-3 sm:grid-cols-2">
              <ActionCard
                icon={Navigation}
                title="Arriving today?"
                body="Call Front Desk before arrival for turn-by-turn guidance to Gowon Estate, Egbeda."
                href={`tel:${siteConfig.contact.phones[1].number.replace(/\s/g, "")}`}
              />
              <ActionCard
                icon={CalendarClock}
                title="Planning an event?"
                body="Speak with the Events line for conference, rooftop, and group booking support."
                href={`tel:${siteConfig.contact.phones[3].number.replace(/\s/g, "")}`}
              />
            </div>

            {/* Socials */}
            <div className="space-y-4 pt-4">
              <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                {textContent(cms, "socialTitle", "Stay in touch")}
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

      <section className="relative bg-[var(--color-cream)] px-6 py-20 lg:px-15">
        <div className="mx-auto grid max-w-[1300px] gap-5 md:grid-cols-3">
          <LocationNote icon={MapPinned} title="Location" body={siteConfig.contact.addressShort} />
          <LocationNote icon={PhoneCall} title="Reservation" body={siteConfig.contact.phones[0].number} href={`tel:${siteConfig.contact.phones[0].number.replace(/\s/g, "")}`} />
          <LocationNote icon={MessageCircle} title="WhatsApp" body={`+${siteConfig.contact.whatsapp}`} href={`https://wa.me/${siteConfig.contact.whatsapp}`} />
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
    <div className="group flex h-full items-start gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-[0_20px_60px_-54px_rgba(23,24,26,0.45)] transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]/50 hover:shadow-[0_28px_70px_-48px_rgba(23,24,26,0.55)]">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[var(--color-gold)]/12 text-[var(--color-gold-dark)] transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-dark)]">
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

function ActionCard({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-2xl border border-[var(--color-gold)]/24 bg-[var(--color-dark)] p-5 text-white shadow-[0_28px_70px_-52px_rgba(23,24,26,0.65)] transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]"
    >
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/8 text-[var(--color-gold-light)] transition-colors group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-dark)]">
          <Icon className="size-4" />
        </span>
        <span>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-light)]">
            {title}
          </span>
          <span className="mt-2 block text-sm leading-6 text-white/68">{body}</span>
        </span>
      </div>
    </a>
  );
}

function LocationNote({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href?: string;
}) {
  const content = (
    <div className="group h-full border border-[#e8dfd1] bg-[#fffdf8] p-6 shadow-[0_20px_60px_-54px_rgba(23,24,26,0.45)] transition-all hover:-translate-y-1 hover:border-[var(--color-gold)]">
      <div className="grid size-11 place-items-center rounded-full bg-[var(--color-dark)] text-[var(--color-gold-light)] transition-transform group-hover:scale-105">
        <Icon className="size-4" />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-dark)]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text-light)]">{body}</p>
    </div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
