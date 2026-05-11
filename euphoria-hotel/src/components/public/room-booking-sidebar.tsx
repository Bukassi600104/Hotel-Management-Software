"use client";

import * as React from "react";
import Link from "next/link";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { ArrowUpRight, Phone, CalendarDays } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatNaira } from "@/lib/format";

type Props = {
  roomSlug: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  reception: string;
  phoneNumber: string;
};

export function RoomBookingSidebar({
  roomSlug,
  pricePerNight,
  checkIn,
  checkOut,
  reception,
  phoneNumber,
}: Props) {
  const today = React.useMemo(() => new Date(), []);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 2),
  });

  const nights =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;

  const bookingHref = React.useMemo(() => {
    if (!range?.from || !range?.to) return null;
    const params = new URLSearchParams({
      room: roomSlug,
      checkin: format(range.from, "yyyy-MM-dd"),
      checkout: format(range.to, "yyyy-MM-dd"),
    });
    return `/booking/confirm?${params.toString()}`;
  }, [range, roomSlug]);

  const reserveHref = React.useMemo(() => {
    if (!range?.from || !range?.to) return `/rooms/${roomSlug}/reserve`;
    const params = new URLSearchParams({
      checkin: format(range.from, "yyyy-MM-dd"),
      checkout: format(range.to, "yyyy-MM-dd"),
    });
    return `/rooms/${roomSlug}/reserve?${params.toString()}`;
  }, [range, roomSlug]);

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start">
      <div className="border border-[#e8dfd1] bg-[#fffdf8] p-6 shadow-[0_30px_80px_-45px_rgba(23,24,26,0.5)]">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
              From
            </div>
            <div className="mt-1 font-heading text-5xl tracking-tight text-[var(--color-dark)]">
              {formatNaira(pricePerNight)}
            </div>
          </div>
          <span className="text-xs text-muted-foreground">per night</span>
        </div>

        <div className="my-5 h-px bg-[#e8dfd1]" />

        {/* Date picker */}
        <Popover>
          <PopoverTrigger
            render={
              <button className="flex w-full items-center gap-3 rounded-lg border border-[#e8dfd1] bg-white px-4 py-3 text-left transition-colors hover:border-[var(--color-gold)]">
                <CalendarDays className="size-5 shrink-0 text-[var(--color-gold-dark)]" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    Stay dates
                  </div>
                  <div className="truncate text-sm font-medium tracking-tight text-[var(--color-dark)]">
                    {range?.from ? format(range.from, "MMM d") : "Check in"}
                    <span className="mx-2 text-xs text-muted-foreground">→</span>
                    {range?.to ? format(range.to, "MMM d") : "Check out"}
                    {nights > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({nights} night{nights !== 1 ? "s" : ""})
                      </span>
                    )}
                  </div>
                </div>
              </button>
            }
          />
          <PopoverContent
            align="center"
            className="w-auto p-0 rounded-2xl border border-border/70 bg-popover shadow-2xl"
          >
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ before: today }}
              className="p-3"
            />
          </PopoverContent>
        </Popover>

        {nights > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-[var(--color-gold)]/8 px-4 py-2.5">
            <span className="text-xs text-muted-foreground">
              {nights} night{nights !== 1 ? "s" : ""}
            </span>
            <span className="text-sm font-semibold text-[var(--color-dark)]">
              {formatNaira(pricePerNight * nights)}
            </span>
          </div>
        )}

        <div className="my-4 space-y-3 text-sm">
          <SidebarRow label="Check-in" value={checkIn} />
          <SidebarRow label="Check-out" value={checkOut} />
          <SidebarRow label="Reception" value={reception} />
        </div>

        {bookingHref ? (
          <Link
            href={bookingHref}
            className="mt-2 inline-flex w-full h-12 items-center justify-center gap-2 gold-gradient text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)] transition-transform hover:-translate-y-0.5"
          >
            Book now — pay online
            <ArrowUpRight className="size-4" />
          </Link>
        ) : (
          <div className="mt-2 inline-flex w-full h-12 items-center justify-center gap-2 bg-muted text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground cursor-not-allowed">
            Select dates to book
          </div>
        )}

        <Link
          href={reserveHref}
          className="mt-2 inline-flex w-full h-11 items-center justify-center gap-2 border border-[var(--color-gold)]/50 text-[var(--color-gold-dark)] text-xs uppercase tracking-[0.18em] hover:bg-[var(--color-gold)]/8 transition-colors"
        >
          Reserve — pay at check-in
        </Link>

        <a
          href={`tel:${phoneNumber.replace(/\s/g, "")}`}
          className="mt-2 inline-flex w-full h-11 items-center justify-center gap-2 border border-[#e8dfd1] bg-background text-xs uppercase tracking-[0.18em] hover:bg-muted/60 transition-colors"
        >
          <Phone className="size-3.5" />
          Call to book
        </a>
      </div>

      <div className="mt-4 border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/5 p-5 text-sm text-foreground/80">
        <p className="font-heading text-base">Flexible cancellation</p>
        <p className="mt-1 text-muted-foreground">
          Free to cancel up to 48 hours before check-in. After that, the first
          night is non-refundable.
        </p>
      </div>
    </aside>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
