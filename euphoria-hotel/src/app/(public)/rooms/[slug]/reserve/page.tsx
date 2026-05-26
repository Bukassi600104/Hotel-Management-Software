import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Calendar, Bed, Users, Maximize2, ArrowLeft } from "lucide-react";

import { ReservationForm } from "@/components/public/reservation-form";
import { Reveal } from "@/components/motion/reveal";
import { getRoomBySlug } from "@/lib/queries/rooms";
import { formatNaira, formatDateLong } from "@/lib/format";
import { calculateNights, isDateInPast, isValidDateString } from "@/lib/utils/dates";
import { buildPricingBreakdown } from "@/lib/utils/pricing";

type SearchParams = Promise<{
  checkin?: string;
  checkout?: string;
  adults?: string;
  children?: string;
}>;

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const room = await getRoomBySlug(slug);
  if (!room) return { title: "Room not found" };
  return {
    title: `Reserve ${room.name} | Hilton Euphoria Hotel`,
    description: `Reserve ${room.name} with payment at check-in. No payment required now.`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ReservePage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  if (
    !sp.checkin ||
    !sp.checkout ||
    !isValidDateString(sp.checkin) ||
    !isValidDateString(sp.checkout)
  ) {
    redirect(`/rooms/${slug}`);
  }

  const nights = calculateNights(sp.checkin, sp.checkout);
  if (nights < 1 || nights > 30 || isDateInPast(sp.checkin)) {
    redirect(`/rooms/${slug}`);
  }

  const room = await getRoomBySlug(slug);
  if (!room) notFound();

  const adults = Math.max(1, parseInt(sp.adults ?? "1", 10));
  const children = Math.max(0, parseInt(sp.children ?? "0", 10));
  const pricing = buildPricingBreakdown(room.pricePerNight, nights);

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-charcoal)] pb-16 pt-32 text-white">
        <Image
          src={room.thumbnail}
          alt=""
          fill
          preload
          fetchPriority="high"
          quality={75}
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/75 via-[var(--color-charcoal)]/65 to-[var(--color-charcoal)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="max-w-2xl">
            <Link
              href={`/rooms/${slug}`}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-white/50 hover:text-white/80 transition-colors mb-5"
            >
              <ArrowLeft className="size-3.5" />
              Back to room
            </Link>
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              Reserve — pay at check-in
            </span>
            <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Hold your room.
            </h1>
            <p className="mt-3 max-w-xl text-white/70">
              Reserve {room.name} now with no payment required. The full amount is due upon
              arrival at the front desk.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10 xl:gap-14">
          {/* Form */}
          <div>
            <ReservationForm
              room={{ slug: room.slug, name: room.name, maxGuests: room.maxGuests }}
              checkin={sp.checkin}
              checkout={sp.checkout}
              nights={nights}
              adults={adults}
              childCount={children}
            />
          </div>

          {/* Sidebar summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal
              variant="scale"
              className="overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_30px_80px_-45px_rgba(23,24,26,0.45)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={room.thumbnail}
                  alt={room.name}
                  fill
                  quality={70}
                  sizes="(min-width: 1024px) 22rem, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-light)]">
                    Your room
                  </div>
                  <h3 className="mt-1 font-heading text-2xl tracking-tight">{room.name}</h3>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {/* Dates */}
                <div className="flex items-start gap-3 rounded-lg bg-[var(--color-gold)]/8 p-3 text-sm">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-dark)]" />
                  <div className="space-y-0.5">
                    <p className="font-medium">{formatDateLong(sp.checkin)} →</p>
                    <p className="font-medium">{formatDateLong(sp.checkout)}</p>
                    <p className="text-xs text-muted-foreground">{nights} night{nights !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-3 text-foreground/80">
                    <Bed className="size-4 text-[var(--color-gold-dark)]" />
                    <span>{room.bedType}</span>
                  </li>
                  <li className="flex items-center gap-3 text-foreground/80">
                    <Users className="size-4 text-[var(--color-gold-dark)]" />
                    <span>{room.maxGuests} guests max</span>
                  </li>
                  <li className="flex items-center gap-3 text-foreground/80">
                    <Maximize2 className="size-4 text-[var(--color-gold-dark)]" />
                    <span>{room.roomSizeSqm} m² interior</span>
                  </li>
                </ul>

                <div className="luxe-divider opacity-50" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Per night</span>
                    <span>{formatNaira(pricing.pricePerNight)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{nights} night{nights !== 1 ? "s" : ""}</span>
                    <span>{formatNaira(pricing.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>VAT (7.5%)</span>
                    <span>{formatNaira(pricing.vat)}</span>
                  </div>
                </div>

                <div className="luxe-divider opacity-50" />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total due at check-in</span>
                  <span className="font-heading text-2xl tracking-tight">
                    {formatNaira(pricing.total)}
                  </span>
                </div>

                <div className="rounded-lg border border-[var(--color-gold)]/25 bg-[var(--color-gold)]/5 p-3 text-xs text-[var(--color-gold-dark)]">
                  No payment taken now. Amount due on arrival.
                </div>
              </div>
            </Reveal>

            <Link
              href={`/booking/confirm?room=${room.slug}&checkin=${sp.checkin}&checkout=${sp.checkout}&adults=${adults}&children=${children}`}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-[#e8dfd1] bg-card px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-muted/60 transition-colors"
            >
              Pay online instead
            </Link>
          </aside>
        </div>
      </div>

      <div className="h-24" />
    </>
  );
}
