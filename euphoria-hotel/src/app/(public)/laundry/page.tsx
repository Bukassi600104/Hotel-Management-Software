import type { Metadata } from "next";
import Image from "next/image";
import { BookOpenText, Clock3, ConciergeBell, Phone, Shirt, Utensils } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import {
  ServiceLinkCards,
  parseLaundryText,
} from "@/components/public/guest-service-blocks";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";

export const metadata: Metadata = {
  title: "Laundry Service",
  description:
    "Hilton Euphoria Hotel laundry service tariff for washing and ironing guest clothing.",
};

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

            <div className="relative mt-8 min-h-[300px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_28px_90px_-60px_rgba(23,24,26,0.5)]">
              <Image
                src={textContent(cms, "laundryImage", "/hotel-assets/room-287.webp")}
                alt="Guest room laundry service at Hilton Euphoria Hotel"
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

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <InfoCard icon={Phone} label="Intercom" value={textContent(cms, "intercom", "1000 / 2000")} />
              <InfoCard icon={Clock3} label="Service note" value={textContent(cms, "serviceNote")} />
            </div>
          </div>

          <div className="overflow-hidden border border-[#e8dfd1] bg-[#fffdf8]">
            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] bg-[var(--color-dark)] px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              <span>Item</span>
              <span className="text-right">Washing</span>
              <span className="text-right">Ironing</span>
            </div>
            <div className="divide-y divide-[#ede5da]">
              {laundry.map((row) => (
                <div key={row.item} className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-3 px-5 py-4 text-sm">
                  <span className="font-medium text-[var(--color-dark)]">{row.item}</span>
                  <span className="text-right tabular-nums text-[var(--color-gold-dark)]">N{row.washing}</span>
                  <span className="text-right tabular-nums text-[var(--color-gold-dark)]">N{row.ironing}</span>
                </div>
              ))}
            </div>
          </div>
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
