import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Coffee,
  ConciergeBell,
  Shirt,
  Utensils,
  Wine,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { Reveal } from "@/components/motion/reveal";
import {
  CatalogGrid,
  parseCatalogText,
  ServiceLinkCards,
} from "@/components/public/guest-service-blocks";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";

export const metadata: Metadata = {
  title: "Restaurant & Bar Menu",
  description:
    "Food, breakfast, drinks, wine, cocktails, and bar service at Hilton Euphoria Hotel.",
};

export default async function MenuPage() {
  const cms = await getCmsPage("menu");
  return (
    <>
      <PageHero
        eyebrow={cms.hero_eyebrow}
        title={cms.hero_title}
        description={cms.hero_description}
        image={cms.hero_image}
        crumbs={[{ label: "Menu" }]}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="mb-10 max-w-3xl">
            <p className="text-pretty text-muted-foreground">
              {textContent(
                cms,
                "introBody",
                "Our restaurant runs all day, breakfast through to a late kitchen that finishes at 11pm. Room service available 24 hours via the dedicated line. Prices are inclusive of VAT."
              )}
            </p>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-3">
            <MenuFeature icon={Utensils} label="Food Menu" value="Kitchen classics, soups, grills and platters" />
            <MenuFeature icon={Coffee} label="Breakfast" value="Continental, national breakfast and buffet pricing" />
            <MenuFeature icon={Wine} label="Bar & Drinks" value="Soft drinks, wine, spirits, beer and cocktails" />
          </div>
        </div>
      </section>

      <MenuSection
        eyebrow="Restaurant"
        title="Food Menu"
        body="A broad hotel kitchen menu covering Nigerian classics, continental staples, grills, soups, rice dishes, finger foods, and chef specials."
        sections={parseCatalogText(textContent(cms, "foodMenu"))}
        image={textContent(cms, "foodImage", "/hotel-assets/restaurant-dsc6939.jpg")}
        imageAlt="Hilton Euphoria restaurant meal presentation"
      />

      <MenuSection
        eyebrow="Morning"
        title="Breakfast Menu"
        body="Paid breakfast options for guests and walk-in dining, separate from complimentary room breakfast entitlements."
        sections={parseCatalogText(textContent(cms, "breakfastMenu"))}
        image={textContent(cms, "breakfastImage", "/hotel-assets/restaurant-dsc6923.jpg")}
        imageAlt="Breakfast service at Hilton Euphoria Hotel"
        muted
      />

      <MenuSection
        eyebrow="Bar"
        title="Drink Menu"
        body="Soft drinks, juice, wines, spirits, mocktails, cocktails, beer, yoghurt, and energy drinks for the restaurant, bar, and rooftop service."
        sections={parseCatalogText(textContent(cms, "drinksMenu"))}
        image={textContent(cms, "drinksImage", "/hotel-assets/rooftop-dsc4286.jpg")}
        imageAlt="Rooftop bar and drinks service at Hilton Euphoria Hotel"
      />

      <section className="bg-[var(--color-cream)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-4">Guest services</p>
            <h2 className="heading-lg">Need something else?</h2>
          </div>
          <ServiceLinkCards
            links={[
              {
                title: "Guest Guide",
                body: "Find Front Desk, restaurant, bar, pool, gym, and security extensions.",
                href: "/guest-guide",
                icon: BookOpenText,
              },
              {
                title: "Laundry Service",
                body: "View washing and ironing tariffs for in-house guest laundry.",
                href: "/laundry",
                icon: Shirt,
              },
              {
                title: "Contact the Hotel",
                body: "Call, email, or send a direct inquiry before visiting the restaurant.",
                href: "/contact",
                icon: ConciergeBell,
              },
            ]}
          />
        </div>
      </section>

      <section className="relative bg-[var(--color-charcoal)] py-20 text-white sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <div>
            <h2 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">
              {textContent(cms, "ctaTitle", "Reserve a table.")}
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              {textContent(cms, "ctaBody", "Booked tables are released 14 days ahead. Call ahead for parties of six or more.")}
            </p>
          </div>
          <Link
            href={textContent(cms, "ctaButtonHref", "/contact")}
            className="gold-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            {textContent(cms, "ctaButtonText", "Get in touch")}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function MenuFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#e8dfd1] bg-[#fffdf8] p-6">
      <div className="grid size-12 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
        <Icon className="size-5" strokeWidth={1.6} />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">{value}</p>
    </div>
  );
}

function MenuSection({
  eyebrow,
  title,
  body,
  sections,
  image,
  imageAlt,
  muted,
}: {
  eyebrow: string;
  title: string;
  body: string;
  sections: ReturnType<typeof parseCatalogText>;
  image: string;
  imageAlt: string;
  muted?: boolean;
}) {
  return (
    <section className={`px-6 py-20 lg:px-15 ${muted ? "bg-[var(--color-cream)]" : "bg-[var(--color-white-warm)]"}`}>
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-10 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="label-tag mb-4">{eyebrow}</p>
            <h2 className="heading-lg">{title}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">{body}</p>
          </div>
          <div className="relative min-h-[260px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_28px_90px_-60px_rgba(23,24,26,0.5)] lg:min-h-[340px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
                {title}
              </p>
            </div>
          </div>
        </div>
        <CatalogGrid sections={sections} />
      </div>
    </section>
  );
}
