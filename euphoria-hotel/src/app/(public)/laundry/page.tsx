import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenText, Clock3, ConciergeBell, Droplets, Phone, Shirt, Sparkles, Utensils } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import {
  ServiceLinkCards,
  parseLaundryText,
} from "@/components/public/guest-service-blocks";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";
import { buildPageMetadata, findPublicSeo } from "@/lib/seo";

const seo = findPublicSeo("/laundry")!;

export const metadata: Metadata = buildPageMetadata({
  path: seo.path,
  title: seo.title,
  description: seo.description,
  image: seo.image,
});

export default async function LaundryPage() {
  const cms = await getCmsPage("laundry");
  const laundry = parseLaundryText(textContent(cms, "laundryTariff"));

  return (
    <>
      <PageHero
        eyebrow={cms.hero_eyebrow}
        title={cms.hero_title}
        description={cms.hero_description}
        image={cms.hero_image}
        crumbs={[{ label: "Laundry" }]}
      />

      <section className="bg-[var(--color-white-warm)] px-6 py-20 lg:px-15">
        <div className="mx-auto grid max-w-[1300px] gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="label-tag mb-4">Guest laundry</p>
            <h2 className="heading-lg">{textContent(cms, "introTitle", "Laundry service for in-house guests.")}</h2>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
              {textContent(cms, "introBody")}
            </p>

            <LaundryGallery
              images={[
                textContent(cms, "laundryImage", "/hotel-assets/menu/laundry.jpg"),
                textContent(cms, "laundryImageTwo", "/hotel-assets/menu/laundry-care.jpg"),
                textContent(cms, "laundryImageThree", "/hotel-assets/menu/laundry-room.jpg"),
              ]}
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard icon={Phone} label="Intercom" value={textContent(cms, "intercom", "1000 / 2000")} />
              <InfoCard icon={Clock3} label="Service note" value={textContent(cms, "serviceNote")} />
            </div>
          </div>

          <LaundryPriceBoard items={laundry} />
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-4">Related pages</p>
            <h2 className="heading-lg">{textContent(cms, "ctaTitle", "Questions about your laundry?")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
              {textContent(cms, "ctaBody")}
            </p>
          </div>
          <ServiceLinkCards
            links={[
              {
                title: "Guest Guide",
                body: "Find service extensions, breakfast schedule, and hotel support contacts.",
                href: "/guest-guide",
                icon: BookOpenText,
              },
              {
                title: "Restaurant & Bar",
                body: "Browse food, drinks, cocktails, breakfast, and bar service.",
                href: "/menu",
                icon: Utensils,
              },
              {
                title: "Contact Front Desk",
                body: "Reach the hotel directly for pickup, delivery, and guest assistance.",
                href: "/contact",
                icon: ConciergeBell,
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}

function LaundryGallery({ images }: { images: string[] }) {
  return (
    <div className="mt-8 grid gap-3">
      <div className="relative min-h-[250px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_28px_90px_-60px_rgba(23,24,26,0.5)]">
        <Image
          src={images[0]}
          alt="Laundry basket service at Hilton Euphoria Hotel"
          fill
          sizes="(min-width: 1024px) 32vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center border border-[var(--color-gold-light)] text-[var(--color-gold-light)]">
              <Shirt className="size-4" strokeWidth={1.6} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">Laundry care</p>
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {images.slice(1).map((src, index) => (
          <div key={src} className="relative min-h-[150px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8]">
            <Image
              src={src}
              alt={`Laundry service support ${index + 1} at Hilton Euphoria Hotel`}
              fill
              sizes="(min-width: 1024px) 16vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Shirt;
  label: string;
  value: string;
}) {
  return (
    <article className="border border-[#e8dfd1] bg-[#fffdf8] p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
          <Icon className="size-4" strokeWidth={1.6} />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">{label}</p>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-light)]">{value}</p>
    </article>
  );
}

function LaundryPriceBoard({ items }: { items: ReturnType<typeof parseLaundryText> }) {
  const grouped = [
    { title: "Everyday Wear", items: items.slice(0, 8) },
    { title: "Native & Formal", items: items.slice(8, 16) },
    { title: "Care Items", items: items.slice(16) },
  ].filter((group) => group.items.length);

  return (
    <div className="space-y-4">
      <div className="border border-[#e8dfd1] bg-[var(--color-dark)] p-5 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-gold-light)]">Tariff board</p>
        <h2 className="mt-2 font-heading text-3xl leading-tight">Laundry prices at a glance</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <LaundryLegend icon={Droplets} title="Washing" />
          <LaundryLegend icon={Sparkles} title="Ironing" />
        </div>
      </div>

      {grouped.map((group) => (
        <section key={group.title} className="border border-[#e8dfd1] bg-[#fffdf8] p-4 shadow-[0_24px_70px_-60px_rgba(23,24,26,0.55)]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold-dark)]">{group.title}</h3>
            <span className="text-[11px] text-[var(--color-text-light)]">{group.items.length} items</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.items.map((row) => (
              <article key={row.item} className="border border-[#eee4d6] bg-white p-4">
                <p className="text-sm font-semibold text-[var(--color-dark)]">{row.item}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <PricePill icon={Droplets} label="Wash" value={row.washing} />
                  <PricePill icon={Sparkles} label="Iron" value={row.ironing} />
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function LaundryLegend({ icon: Icon, title }: { icon: typeof Shirt; title: string }) {
  return (
    <div className="flex items-center gap-3 border border-white/12 bg-white/6 p-3">
      <Icon className="size-4 text-[var(--color-gold-light)]" strokeWidth={1.6} />
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{title}</span>
    </div>
  );
}

function PricePill({ icon: Icon, label, value }: { icon: typeof Shirt; label: string; value: string }) {
  return (
    <div className="rounded-full bg-[var(--color-cream)] px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--color-text-light)]">
          <Icon className="size-3.5 text-[var(--color-gold-dark)]" strokeWidth={1.8} />
          {label}
        </span>
        <span className="text-xs font-semibold tabular-nums text-[var(--color-gold-dark)]">N{value}</span>
      </div>
    </div>
  );
}
