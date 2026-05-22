import type { Metadata } from "next";
import Image from "next/image";
import { Dumbbell, Headphones, MapPin, Phone, Shield, Shirt, Utensils, Waves, Wine } from "lucide-react";

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

const serviceIcons = [Headphones, Utensils, Wine, Wine, Waves, Utensils, Dumbbell, Shield];

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

          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = serviceIcons[index] ?? Phone;
              return (
                <article key={`${service.label}-${index}`} className="border border-[#e8dfd1] bg-[#fffdf8] p-6">
                  <div className="grid size-12 place-items-center border border-[var(--color-gold)] text-[var(--color-gold-dark)]">
                    <Icon className="size-5" strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-5 font-heading text-2xl text-[var(--color-dark)]">{service.label}</h3>
                  <p className="mt-2 text-2xl font-light tracking-tight text-[var(--color-gold-dark)]">
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

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {breakfast.map((day) => (
              <article key={day.label} className="border border-[#e8dfd1] bg-[#fffdf8] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-dark)]">
                  {day.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-light)]">{day.details}</p>
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
