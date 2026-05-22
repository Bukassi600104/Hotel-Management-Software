import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpenText, Coffee, ConciergeBell, Utensils, Wine } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import {
  CatalogGrid,
  parseCatalogText,
  ServiceLinkCards,
} from "@/components/public/guest-service-blocks";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";

export const metadata: Metadata = {
  title: "Drink Menu",
  description:
    "Hilton Euphoria Hotel bar menu with soft drinks, wine, champagne, spirits, cocktails, beer, and yoghurt.",
};

const drinkImages: Record<string, string> = {
  "Soft Drinks & Juice": "/hotel-assets/menu/soft-drinks-juice.jpg",
  "Red Wine": "/hotel-assets/menu/red-wine.jpg",
  "Champagne & Sparkling Wine": "/hotel-assets/menu/champagne-sparkling-wine.jpg",
  Whiskies: "/hotel-assets/menu/whiskies.jpg",
  Cognac: "/hotel-assets/menu/cognac.jpg",
  Tequila: "/hotel-assets/menu/tequila.jpg",
  "Vodka, Gin": "/hotel-assets/menu/vodka-gin.jpg",
  "Vodka & Gin": "/hotel-assets/menu/vodka-gin.jpg",
  "Vodka/Gin": "/hotel-assets/menu/vodka-gin.jpg",
  "Rum & Bitters": "/hotel-assets/menu/rum-bitters.jpg",
  "Liqueur/Creams": "/hotel-assets/menu/liqueur-creams.jpg",
  Bitters: "/hotel-assets/menu/bitters.jpg",
  "Energy Drinks": "/hotel-assets/menu/energy-drinks.jpg",
  "Non-Alcoholic Wine": "/hotel-assets/menu/non-alcoholic-wine.jpg",
  Mocktails: "/hotel-assets/menu/mocktail.jpg",
  Mocktail: "/hotel-assets/menu/mocktail.jpg",
  Cocktails: "/hotel-assets/menu/cocktail.jpg",
  Cocktail: "/hotel-assets/menu/cocktail.jpg",
  Yoghurt: "/hotel-assets/menu/yoghurt.jpg",
  Beer: "/hotel-assets/menu/beer.jpg",
};

export default async function DrinksPage() {
  const cms = await getCmsPage("menu");
  const sections = parseCatalogText(textContent(cms, "drinksMenu"));

  return (
    <>
      <PageHero
        eyebrow="Bar service"
        title="Drink Menu"
        description="Browse soft drinks, wines, spirits, cocktails, beer, yoghurt, and energy drinks served across the hotel restaurant, bar, and rooftop lounge."
        image={textContent(cms, "drinksImage", "/hotel-assets/rooftop-dsc4286.jpg")}
        crumbs={[{ label: "Menu", href: "/menu" }, { label: "Drinks" }]}
      />

      <section className="bg-[var(--color-white-warm)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="label-tag mb-4">Restaurant & rooftop bar</p>
              <h2 className="heading-lg">Drinks for every service hour.</h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
                The bar menu is available for restaurant dining, room service, event hosting, and rooftop relaxation.
                For bottle service or group orders, call the hotel before arrival so the team can prepare your preferred selection.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <DrinkFeature icon={Wine} label="Wines & spirits" value="Champagne, cognac, whisky, tequila, vodka, gin, and liqueurs" />
              <DrinkFeature icon={Coffee} label="Soft drinks" value="Juice, yoghurt, energy drinks, beer, and non-alcoholic wine" />
              <DrinkFeature icon={Utensils} label="Pair with meals" value="Return to the full food and breakfast menu anytime" />
            </div>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="relative min-h-[320px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_28px_90px_-60px_rgba(23,24,26,0.5)]">
              <Image
                src="/hotel-assets/menu/champagne-sparkling-wine.jpg"
                alt="Champagne and sparkling wine service at Hilton Euphoria Hotel"
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {["/hotel-assets/menu/mocktail.jpg", "/hotel-assets/menu/whiskies.jpg"].map((src, index) => (
                <div key={src} className="relative min-h-[150px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8]">
                  <Image
                    src={src}
                    alt={`Hilton Euphoria drink menu preview ${index + 1}`}
                    fill
                    sizes="(min-width: 768px) 30vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-4">Bar menu</p>
            <h2 className="heading-lg">Available drinks</h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
              Prices and availability can change during service, especially for premium bottles. Confirm special orders
              with Front Desk or the restaurant team.
            </p>
          </div>
          <CatalogGrid sections={sections} images={drinkImages} />
        </div>
      </section>

      <section className="bg-[var(--color-white-warm)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-4">Related pages</p>
            <h2 className="heading-lg">Plan the rest of your order.</h2>
          </div>
          <ServiceLinkCards
            links={[
              {
                title: "Full Hotel Menu",
                body: "Browse food, breakfast, restaurant service, and drink categories together.",
                href: "/menu",
                icon: Utensils,
              },
              {
                title: "Guest Guide",
                body: "Find restaurant, rooftop bar, Front Desk, security, gym, and pool extensions.",
                href: "/guest-guide",
                icon: BookOpenText,
              },
              {
                title: "Contact the Hotel",
                body: "Call or email the hotel for bottle service, table planning, or event support.",
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
              Reserve a table or rooftop service.
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              Speak with the team before arrival for parties, bottle service, and event drink arrangements.
            </p>
          </div>
          <Link
            href="/contact"
            className="gold-gradient inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Contact the hotel
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function DrinkFeature({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-[#e8dfd1] bg-[#fffdf8] p-5">
      <div className="grid size-11 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
        <Icon className="size-5" strokeWidth={1.6} />
      </div>
      <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">{value}</p>
    </div>
  );
}
