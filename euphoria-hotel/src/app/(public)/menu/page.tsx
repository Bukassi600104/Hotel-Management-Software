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
import { buildPageMetadata, findPublicSeo } from "@/lib/seo";

const seo = findPublicSeo("/menu")!;

export const metadata: Metadata = buildPageMetadata({
  path: seo.path,
  title: seo.title,
  description: seo.description,
  image: seo.image,
});

const foodImages: Record<string, string> = {
  "Protein, Fried, Peppered & Pepper Soup": "/hotel-assets/menu/protein-fried-pepper.jpg",
  "Starter Soups": "/hotel-assets/menu/starter-soups.jpg",
  "Continental Sauce": "/hotel-assets/menu/continental-sauce.jpg",
  "Pasta & Noodles": "/hotel-assets/menu/pasta-noodles.jpg",
  "Rice Special": "/hotel-assets/menu/rice-special.jpg",
  "Chef Special": "/hotel-assets/menu/chef-special.jpg",
  Salad: "/hotel-assets/menu/salad.jpg",
  "Porridge Meal": "/hotel-assets/menu/porridge-meal.jpg",
  "Finger Foods": "/hotel-assets/menu/finger-foods.jpg",
  "National Soup": "/hotel-assets/menu/national-soup.jpg",
  Swallow: "/hotel-assets/menu/swallow.jpg",
  "Grilled & Platters": "/hotel-assets/menu/grilled-platters.jpg",
  Barbecue: "/hotel-assets/menu/barbecue.jpg",
};

const breakfastImages: Record<string, string> = {
  "Continental Breakfast": "/hotel-assets/menu/continental-breakfast.jpg",
  "National Breakfast": "/hotel-assets/menu/national-breakfast.jpg",
  "Buffet Price": "/hotel-assets/menu/buffet.jpg",
  "Breakfast Staples": "/hotel-assets/menu/breakfast-staples.jpg",
  "Choice of Egg": "/hotel-assets/menu/choice-of-egg.jpg",
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
          <Reveal variant="fade-up" className="mb-8 max-w-3xl">
            <p className="text-pretty text-sm leading-7 text-[var(--color-text-light)] md:text-base">
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

      <MenuDivider
        icon={Utensils}
        label="Dining"
        title="Restaurant kitchen"
        body="Food and breakfast are grouped together so guests can scan meals separately from the bar list."
      />

      <MenuSection
        eyebrow="Restaurant"
        title="Food Menu"
        body="A broad hotel kitchen menu covering Nigerian classics, continental staples, grills, soups, rice dishes, finger foods, and chef specials."
        sections={parseCatalogText(textContent(cms, "foodMenu"))}
        cardImages={foodImages}
        image={textContent(cms, "foodImage", "/hotel-assets/restaurant-dsc6939.jpg")}
        imageAlt="Hilton Euphoria restaurant meal presentation"
      />

      <MenuSection
        eyebrow="Morning"
        title="Breakfast Menu"
        body="Paid breakfast options for guests and walk-in dining, separate from complimentary room breakfast entitlements."
        sections={parseCatalogText(textContent(cms, "breakfastMenu"))}
        cardImages={breakfastImages}
        image={textContent(cms, "breakfastImage", "/hotel-assets/restaurant-dsc6923.jpg")}
        imageAlt="Breakfast service at Hilton Euphoria Hotel"
        muted
      />

      <MenuDivider
        icon={Wine}
        label="Bar"
        title="Drinks & bottle service"
        body="The bar list sits in its own section for wines, spirits, mocktails, cocktails, yoghurt, beer, and soft drinks."
        dark
      />

      <MenuSection
        eyebrow="Bar"
        title="Drink Menu"
        body="Soft drinks, juice, wines, spirits, mocktails, cocktails, beer, yoghurt, and energy drinks for the restaurant, bar, and rooftop service."
        sections={parseCatalogText(textContent(cms, "drinksMenu"))}
        cardImages={drinkImages}
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
    <div className="border border-[#e8dfd1] bg-[#fffdf8] p-5 shadow-[0_18px_55px_-50px_rgba(23,24,26,0.45)]">
      <div className="grid size-10 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
        <Icon className="size-5" strokeWidth={1.6} />
      </div>
      <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
        {label}
      </p>
      <p className="mt-2 text-[13px] leading-6 text-[var(--color-text-light)]">{value}</p>
    </div>
  );
}

function MenuDivider({
  icon: Icon,
  label,
  title,
  body,
  dark,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  title: string;
  body: string;
  dark?: boolean;
}) {
  return (
    <section className={`${dark ? "bg-[var(--color-charcoal)] text-white" : "bg-[var(--color-dark)] text-white"} px-6 py-12 lg:px-15`}>
      <div className="mx-auto flex max-w-[1300px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-light)]">
            <Icon className="size-5" strokeWidth={1.6} />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[var(--color-gold-light)]">{label}</p>
            <h2 className="mt-1 font-heading text-3xl leading-tight md:text-4xl">{title}</h2>
          </div>
        </div>
        <p className="max-w-xl text-sm leading-7 text-white/68">{body}</p>
      </div>
    </section>
  );
}

function MenuSection({
  eyebrow,
  title,
  body,
  sections,
  cardImages,
  image,
  imageAlt,
  muted,
}: {
  eyebrow: string;
  title: string;
  body: string;
  sections: ReturnType<typeof parseCatalogText>;
  cardImages: Record<string, string>;
  image: string;
  imageAlt: string;
  muted?: boolean;
}) {
  return (
    <section className={`px-6 py-20 lg:px-15 ${muted ? "bg-[var(--color-cream)]" : "bg-[var(--color-white-warm)]"}`}>
      <div className="mx-auto max-w-[1300px]">
        <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="label-tag mb-4">{eyebrow}</p>
            <h2 className="heading-lg">{title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-text-light)]">{body}</p>
          </div>
          <div className="relative min-h-[180px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_28px_90px_-60px_rgba(23,24,26,0.5)] lg:min-h-[220px]">
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
                {title}
              </p>
            </div>
          </div>
        </div>
        <CatalogGrid sections={sections} images={cardImages} />
      </div>
    </section>
  );
}
