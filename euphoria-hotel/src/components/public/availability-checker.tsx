"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { addDays, differenceInCalendarDays, format } from "date-fns";
import { motion } from "motion/react";
import {
  CalendarDays,
  Users,
  Minus,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Variant = "hero" | "card";

type Props = {
  variant?: Variant;
  className?: string;
};

export function AvailabilityChecker({ variant = "card", className }: Props) {
  const router = useRouter();
  const today = React.useMemo(() => new Date(), []);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: addDays(today, 2),
  });
  const [adults, setAdults] = React.useState(2);
  const [children, setChildren] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const nights =
    range?.from && range?.to
      ? Math.max(1, differenceInCalendarDays(range.to, range.from))
      : 0;

  function handleSubmit() {
    if (!range?.from || !range?.to) return;
    setSubmitting(true);
    const params = new URLSearchParams({
      checkin: format(range.from, "yyyy-MM-dd"),
      checkout: format(range.to, "yyyy-MM-dd"),
      adults: String(adults),
      children: String(children),
    });
    router.push(`/rooms?${params.toString()}`);
  }

  const hero = variant === "hero";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className={cn(
        "relative w-full max-w-5xl rounded-2xl p-2",
        hero
          ? "border border-white/15 bg-white/8 backdrop-blur-2xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
          : "border border-border/60 bg-card shadow-[0_18px_48px_-24px_rgba(23,24,26,0.25)]",
        className
      )}
    >
      <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
        {/* Date range */}
        <Popover>
          <PopoverTrigger
            render={
              <button
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  hero
                    ? "bg-white/5 hover:bg-white/10 text-white"
                    : "bg-muted/40 hover:bg-muted/70 text-foreground"
                )}
              >
                <CalendarDays
                  className={cn(
                    "size-5 shrink-0",
                    hero
                      ? "text-[var(--color-gold-light)]"
                      : "text-[var(--color-gold-dark)]"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-[10px] uppercase tracking-[0.28em]",
                      hero ? "text-white/55" : "text-muted-foreground"
                    )}
                  >
                    Stay dates
                  </div>
                  <div className="truncate font-medium tracking-tight">
                    {range?.from
                      ? format(range.from, "EEE, MMM d")
                      : "Check in"}
                    <span
                      className={cn(
                        "mx-2 text-xs",
                        hero ? "text-white/40" : "text-muted-foreground"
                      )}
                    >
                      →
                    </span>
                    {range?.to ? format(range.to, "EEE, MMM d") : "Check out"}
                  </div>
                </div>
                <span
                  className={cn(
                    "hidden sm:inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]",
                    hero
                      ? "bg-white/10 text-white/70"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {nights} night{nights === 1 ? "" : "s"}
                </span>
              </button>
            }
          />
          <PopoverContent
            align="start"
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

        {/* Guests */}
        <Popover>
          <PopoverTrigger
            render={
              <button
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  hero
                    ? "bg-white/5 hover:bg-white/10 text-white"
                    : "bg-muted/40 hover:bg-muted/70 text-foreground"
                )}
              >
                <Users
                  className={cn(
                    "size-5 shrink-0",
                    hero
                      ? "text-[var(--color-gold-light)]"
                      : "text-[var(--color-gold-dark)]"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={cn(
                      "text-[10px] uppercase tracking-[0.28em]",
                      hero ? "text-white/55" : "text-muted-foreground"
                    )}
                  >
                    Guests
                  </div>
                  <div className="truncate font-medium tracking-tight">
                    {adults} adult{adults === 1 ? "" : "s"}
                    {children > 0 ? `, ${children} child${children === 1 ? "" : "ren"}` : ""}
                  </div>
                </div>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0",
                    hero ? "text-white/55" : "text-muted-foreground"
                  )}
                />
              </button>
            }
          />
          <PopoverContent
            align="end"
            className="w-72 rounded-2xl border border-border/70 bg-popover p-2 shadow-2xl"
          >
            <CounterRow
              label="Adults"
              hint="Ages 13+"
              value={adults}
              min={1}
              max={6}
              onChange={setAdults}
            />
            <CounterRow
              label="Children"
              hint="Ages 0–12"
              value={children}
              min={0}
              max={4}
              onChange={setChildren}
            />
          </PopoverContent>
        </Popover>

        {/* Submit */}
        <Button
          onClick={handleSubmit}
          disabled={submitting || !range?.from || !range?.to}
          className="h-auto min-h-12 px-6 rounded-xl gold-gradient text-charcoal font-semibold tracking-[0.18em] text-xs uppercase shadow-[0_12px_28px_-10px_rgba(201,169,97,0.6)] hover:-translate-y-0.5 transition-transform"
        >
          <Search className="size-4" />
          {submitting ? "Searching…" : "Find rooms"}
        </Button>
      </div>
    </motion.div>
  );
}

function CounterRow({
  label,
  hint,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-muted/60 transition-colors">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-8 place-items-center rounded-full border border-border bg-background text-foreground hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] disabled:opacity-40 disabled:hover:border-border transition-colors"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="w-8 text-center text-sm font-semibold tabular-nums">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid size-8 place-items-center rounded-full border border-border bg-background text-foreground hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] disabled:opacity-40 disabled:hover:border-border transition-colors"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
