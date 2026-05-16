import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Bed, Users, Maximize2, Lock, Sparkles, Calendar } from "lucide-react";

import { BookingForm } from "@/components/public/booking-form";
import { Reveal } from "@/components/motion/reveal";
import { getRoomBySlug } from "@/lib/queries/rooms";
import { formatNaira, formatDateLong } from "@/lib/format";
import { calculateNights, isDateInPast, isValidDateString } from "@/lib/utils/dates";
import { buildPricingBreakdown } from "@/lib/utils/pricing";

export const metadata: Metadata = {
  title: "Confirm your booking",
  description: "Review your stay and complete the reservation.",
};

type SearchParams = Promise<{
  room?: string;
  checkin?: string;
  checkout?: string;
  adults?: string;
  children?: string;
}>;

export default async function BookingConfirmPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;

  // Validate required params
  if (
    !sp.room ||
    !sp.checkin ||
    !sp.checkout ||
    !isValidDateString(sp.checkin) ||
    !isValidDateString(sp.checkout)
  ) {
    redirect("/rooms");
  }

  const nights = calculateNights(sp.checkin, sp.checkout);
  if (nights < 1 || nights > 30 || isDateInPast(sp.checkin)) {
    redirect("/rooms");
  }

  const room = await getRoomBySlug(sp.room);
  if (!room) redirect("/rooms");

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
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/72 via-[var(--color-charcoal)]/62 to-[var(--color-charcoal)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <Reveal variant="fade-up" className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]">
              <span className="block h-px w-10 bg-[var(--color-gold)]" />
              Step 2 of 3 · Your details
            </span>
            <h1 className="mt-4 font-heading text-4xl leading-[1.05] tracking-tight text-balance sm:text-5xl">
              Almost there.
            </h1>
            <p className="mt-3 max-w-xl text-white/70">
              Tell us a little about the booking and we will hold the room for
              the next 15 minutes while you complete payment.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-10 xl:gap-14">
          <BookingForm
            room={room}
            checkin={sp.checkin}
            checkout={sp.checkout}
            nights={nights}
            adults={adults}
            childCount={children}
          />

          {/* Summary sidebar */}
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
                  <h3 className="mt-1 font-heading text-2xl tracking-tight">
                    {room.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {/* Stay dates */}
                <div className="flex items-start gap-3 rounded-lg bg-[var(--color-gold)]/8 p-3 text-sm">
                  <Calendar className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-dark)]" />
                  <div className="space-y-0.5">
                    <p className="font-medium">{formatDateLong(sp.checkin)} →</p>
                    <p className="font-medium">{formatDateLong(sp.checkout)}</p>
                    <p className="text-xs text-muted-foreground">{nights} night{nights !== 1 ? "s" : ""}</p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  <SpecRow icon={Bed} label={room.bedType} />
                  <SpecRow icon={Users} label={`${room.maxGuests} guests max`} />
                  <SpecRow icon={Maximize2} label={`${room.roomSizeSqm} m² interior`} />
                </ul>

                <div className="luxe-divider opacity-50" />

                <div className="space-y-2 text-sm">
                  <SummaryRow label="Per night" value={formatNaira(pricing.pricePerNight)} />
                  <SummaryRow label={`${nights} night${nights !== 1 ? "s" : ""}`} value={formatNaira(pricing.subtotal)} />
                  <SummaryRow label="VAT (7.5%)" value={formatNaira(pricing.vat)} />
                </div>

                <div className="luxe-divider opacity-50" />

                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-heading text-2xl tracking-tight">
                    {formatNaira(pricing.total)}
                  </span>
                </div>
              </div>
            </Reveal>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-4 text-xs text-foreground/75">
              <Lock className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-dark)]" />
              <p>
                Your details are encrypted in transit. Card payments are
                handled by Paystack; we never see your card number.
              </p>
            </div>

            <Link
              href="/rooms"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-[#e8dfd1] bg-card px-5 py-2.5 text-xs uppercase tracking-[0.18em] hover:bg-muted/60 transition-colors"
            >
              <Sparkles className="size-3.5" />
              Choose a different room
            </Link>
          </aside>
        </div>
      </div>

      <div className="h-24" />
    </>
  );
}

function SpecRow({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <li className="flex items-center gap-3 text-foreground/80">
      <Icon className="size-4 text-[var(--color-gold-dark)]" />
      <span className="text-sm">{label}</span>
    </li>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
