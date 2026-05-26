"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import {
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Presentation,
  Music,
  Sun,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { Facility } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  waves: Waves,
  utensils: UtensilsCrossed,
  dumbbell: Dumbbell,
  presentation: Presentation,
  music: Music,
  sun: Sun,
};

type Props = {
  facility: Facility;
  index?: number;
  className?: string;
};

export function FacilityCard({ facility, index = 0, className }: Props) {
  const Icon = iconMap[facility.icon] ?? Sun;
  const [hovered, setHovered] = React.useState(false);

  return (
    <motion.article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative isolate flex h-full flex-col overflow-hidden border border-[#e8dfd1] bg-[#fffdf8]",
        "shadow-[0_16px_50px_-32px_rgba(23,24,26,0.35)]",
        "transition-all hover:-translate-y-1 hover:border-[var(--color-gold)] hover:shadow-[0_30px_80px_-42px_rgba(23,24,26,0.5)]",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={facility.hero}
            alt={facility.name}
            fill
            quality={70}
            sizes="(min-width: 1280px) 28rem, (min-width: 768px) 40vw, 90vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/16 to-black/5" />

        <motion.div
          className="absolute left-5 top-5 grid size-12 place-items-center glass-dark text-[var(--color-gold-light)]"
          animate={{ rotate: hovered ? 360 : 0, scale: hovered ? 1.05 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Icon className="size-5" />
        </motion.div>

        {/* Mini gallery preview */}
        <motion.div
          className="absolute right-5 top-5 flex gap-1.5"
          initial={false}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : -8 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {facility.gallery.slice(0, 3).map((src, i) => (
            <div
              key={i}
              className="relative size-10 overflow-hidden rounded-lg ring-1 ring-white/30"
            >
              <Image
                src={src}
                alt=""
                fill
                quality={50}
                sizes="40px"
                className="object-cover"
              />
            </div>
          ))}
        </motion.div>

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <div className="mb-4 h-px w-12 bg-[var(--color-gold)]" />
          <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-gold-light)]">
            Facility
          </span>
          <h3 className="mt-1 font-heading text-3xl leading-tight tracking-tight">
            {facility.name}
          </h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="font-heading text-base text-foreground/85 italic">
          {facility.tagline}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {facility.description}
        </p>
      </div>
    </motion.article>
  );
}
