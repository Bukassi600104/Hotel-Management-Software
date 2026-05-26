"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Bed, Users, Maximize2, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatNaira } from "@/lib/format";
import type { Room } from "@/types";

type Props = {
  room: Room;
  className?: string;
  priority?: boolean;
};

export function RoomCard({ room, className, priority }: Props) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [4, -4]), {
    stiffness: 200,
    damping: 22,
  });
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), {
    stiffness: 200,
    damping: 22,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  function handleMouseLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  return (
    <motion.article
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformStyle: "preserve-3d",
        transformPerspective: 1100,
      }}
      className={cn(
        "group relative isolate overflow-hidden border border-[#e8dfd1] bg-[#fffdf8] shadow-[0_16px_50px_-30px_rgba(23,24,26,0.45)] transition-all hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_30px_90px_-42px_rgba(23,24,26,0.62)]",
        className
      )}
    >
      <Link
        href={`/rooms/${room.slug}`}
        className="relative block"
        aria-label={`View details for ${room.name}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <motion.div
            className="absolute inset-0"
            initial={false}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={room.thumbnail}
              alt={room.name}
              fill
              preload={priority}
              fetchPriority={priority ? "high" : "auto"}
              quality={75}
              sizes="(min-width: 1280px) 28rem, (min-width: 768px) 40vw, 90vw"
              className="object-cover"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/18 to-black/5" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

          {room.badge && (
            <span className="absolute left-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal backdrop-blur">
              <span className="size-1 rounded-full bg-[var(--color-gold)]" />
              {room.badge}
            </span>
          )}

          <div className="absolute right-5 top-5 bg-[rgba(255,253,248,0.94)] px-4 py-3 text-right text-[var(--color-dark)] shadow-[0_18px_42px_-20px_rgba(0,0,0,0.55)] backdrop-blur-md">
            <div className="text-[9px] font-semibold uppercase tracking-[2.5px] text-[var(--color-gold-dark)]">
              From
            </div>
            <div className="font-heading text-[28px] leading-none">
              {formatNaira(room.pricePerNight)}
            </div>
            <div className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-[var(--color-text-light)]">
              per night
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="mb-4 h-px w-14 bg-[var(--color-gold)]" />
            <h3 className="font-heading text-2xl leading-tight tracking-tight">
              {room.name}
            </h3>
            <p className="mt-1 text-sm text-white/80 line-clamp-1">
              {room.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Bed className="size-3.5 text-[var(--color-gold-dark)]" />
              {room.bedType}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="size-3.5 text-[var(--color-gold-dark)]" />
              {room.maxGuests} guests
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Maximize2 className="size-3.5 text-[var(--color-gold-dark)]" />
              {room.roomSizeSqm} m²
            </span>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1 border-l border-[#e8dfd1] pl-4 text-xs font-semibold tracking-[0.18em] uppercase text-charcoal">
            View
            <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
