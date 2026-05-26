import type { Metadata } from "next";
import Image from "next/image";
import {
  BellRing,
  Dumbbell,
  Flame,
  Headphones,
  Martini,
  MapPin,
  ShieldCheck,
  Shirt,
  Utensils,
  Waves,
  Wine,
} from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import {
  ServiceLinkCards,
  parseLabelValueText,
} from "@/components/public/guest-service-blocks";
import { getCmsPage } from "@/lib/cms/content";
import { textContent } from "@/lib/cms/defaults";

export const metadata: Metadata = {
  title: "Guest Guide",
  description:
    "Hilton Euphoria Hotel guest guide with service extensions, breakfast schedule, restaurant, bar, pool, gym, and security information.",
};

const serviceIconMap = {
  "front desk": Headphones,
  restaurant: Utensils,
  "rooftop bar": Martini,
  "executive bar": Wine,
  pool: Waves,
  grill: Flame,
  gym: Dumbbell,
  "security gate": ShieldCheck,
} as const;

export default async function GuestGuidePage() {
  const cms = await getCmsPage("guest-guide");
  const services = parseLabelValueText(textContent(cms, "serviceNumbers"));
  const breakfast = parseLabelValueText(textContent(cms, "breakfastSchedule"));

  return (
    <>
      <PageHero
        eyebrow={cms.hero_eyebrow}
        title={cms.hero_title}
        description={cms.hero_description}
        image={cms.hero_image}
        crumbs={[{ label: "Guest Guide" }]}
      />

      <section className="bg-[var(--color-white-warm)] px-6 py-20 lg:px-15">
        <div className="mx-auto grid max-w-[1300px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <p className="label-tag mb-4">Welcome</p>
            <h2 className="heading-lg">{textContent(cms, "introTitle", "Welcome to Hilton Euphoria Hotel.")}</h2>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
              {textContent(cms, "introBody")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((service, index) => {
              const key = service.label.toLowerCase() as keyof typeof serviceIconMap;
              const Icon = serviceIconMap[key] ?? BellRing;
              return (
                <article
                  key={`${service.label}-${index}`}
                  className="group relative overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] p-5 shadow-[0_20px_70px_-56px_rgba(23,24,26,0.55)] transition-all hover:-translate-y-0.5 hover:border-[var(--color-gold)]"
                >
                  <div className="absolute right-4 top-4 font-heading text-5xl leading-none text-[var(--color-cream)]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="relative grid size-11 place-items-center rounded-full bg-[var(--color-dark)] text-[var(--color-gold-light)]">
                    <Icon className="size-5" strokeWidth={1.7} />
                  </div>
                  <h3 className="relative mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-dark)]">{service.label}</h3>
                  <p className="relative mt-2 font-heading text-2xl tracking-tight text-[var(--color-gold-dark)]">
                    {service.details}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-cream)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div>
              <p className="label-tag mb-4">Breakfast</p>
              <h2 className="heading-lg">{textContent(cms, "breakfastTitle", "Complimentary breakfast")}</h2>
              <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
                {textContent(cms, "breakfastNote")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["/hotel-assets/menu/complimentary-breakfast.jpg", "/hotel-assets/menu/continental-breakfast.jpg"].map((src, index) => (
                <div key={src} className="relative min-h-[220px] overflow-hidden border border-[#e8dfd1] bg-[#fffdf8]">
                  <Image
                    src={src}
                    alt={`Complimentary breakfast service ${index + 1} at Hilton Euphoria Hotel`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {breakfast.map((day, index) => (
              <article key={day.label} className="border border-[#e8dfd1] bg-[#fffdf8] p-5 shadow-[0_18px_55px_-50px_rgba(23,24,26,0.45)]">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid size-9 place-items-center rounded-full bg-[var(--color-cream)] text-[var(--color-gold-dark)]">
                    <Utensils className="size-4" strokeWidth={1.6} />
                  </span>
                  <span className="text-[11px] tabular-nums text-[var(--color-text-light)]">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
                  {day.label}
                </p>
                <p className="mt-3 text-[13px] leading-6 text-[var(--color-text-light)]">{day.details}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-white-warm)] px-6 py-20 lg:px-15">
        <div className="mx-auto max-w-[1300px]">
          <div className="mb-10 max-w-2xl">
            <p className="label-tag mb-4">Related pages</p>
            <h2 className="heading-lg">{textContent(cms, "ctaTitle", "Need help from your room?")}</h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--color-text-light)] md:text-base">
              {textContent(cms, "ctaBody")}
            </p>
          </div>
          <ServiceLinkCards
            links={[
              {
                title: "Restaurant & Bar Menu",
                body: "Browse food, breakfast, drinks, cocktails, and wine service.",
                href: "/menu",
                icon: Utensils,
              },
              {
                title: "Laundry Service",
                body: "Check guest laundry washing and ironing tariffs.",
                href: "/laundry",
                icon: Shirt,
              },
              {
                title: "Contact & Location",
                body: "Reach reservations, Front Desk, and the hotel address.",
                href: "/contact",
                icon: MapPin,
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
