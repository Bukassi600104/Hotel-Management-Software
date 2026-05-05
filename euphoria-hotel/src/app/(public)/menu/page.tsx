import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { PageHero } from "@/components/public/page-hero";
import { MenuTabs } from "@/components/public/menu-tabs";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Hotel Menu",
  description:
    "Signature dishes from our kitchen — traditional Nigerian flavours, classical technique, and a small bar that takes its cocktails seriously.",
};

const heroImage =
  "/hotel-assets/restaurant-dsc6939.jpg";

export default function MenuPage() {
  return (
    <>
      <PageHero
        eyebrow="In the kitchen"
        title="Our table, set every day."
        description="A short menu, cooked carefully — Nigerian classics alongside continental staples, and a bar that takes cocktails as seriously as it takes wine."
        image={heroImage}
        crumbs={[{ label: "Menu" }]}
      />

      <section className="relative py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="mb-10 max-w-2xl">
            <p className="text-muted-foreground text-pretty">
              Our restaurant runs all day, breakfast through to a late kitchen
              that finishes at 11pm. Room service available 24 hours via the
              dedicated line. Prices are inclusive of VAT.
            </p>
          </Reveal>

          <MenuTabs />
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-[var(--color-charcoal)] py-20 text-white sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <h2 className="font-heading text-3xl leading-tight tracking-tight sm:text-4xl">
              Reserve a table.
            </h2>
            <p className="mt-2 max-w-xl text-white/70">
              Booked tables are released 14 days ahead. Call ahead for parties
              of six or more, or for the chef&apos;s table.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal"
          >
            Get in touch
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
