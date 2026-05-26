"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Crumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  crumbs?: Crumb[];
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  crumbs,
  className,
  children,
}: Props) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden text-white",
        "h-[68vh] min-h-[460px] max-h-[640px]",
        className
      )}
    >
      <Image
        src={image}
        alt=""
        fill
        preload
        fetchPriority="high"
        quality={75}
        sizes="100vw"
        className="object-cover animate-ken-burns"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-charcoal)]/50 via-[var(--color-charcoal)]/36 to-[var(--color-charcoal)]/88" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-white-warm)]/20 to-transparent" />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-6 lg:px-10 lg:pb-20">
        {crumbs && crumbs.length > 0 && (
          <motion.nav
            aria-label="Breadcrumb"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 flex w-fit items-center gap-1.5 border border-white/15 bg-black/25 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-md"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <React.Fragment key={`${c.label}-${i}`}>
                <ChevronRight className="size-3 opacity-50" />
                {c.href ? (
                  <Link
                    href={c.href}
                    className="hover:text-white transition-colors"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-[var(--color-gold-light)]">
                    {c.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </motion.nav>
        )}

        {eyebrow && (
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]"
          >
            <span className="block h-px w-10 bg-[var(--color-gold)]" />
            {eyebrow}
          </motion.span>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-4 max-w-3xl font-heading text-5xl leading-[1.05] tracking-tight text-balance drop-shadow-[0_16px_34px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
            className="mt-5 max-w-xl border-l border-[var(--color-gold)] pl-5 text-base leading-relaxed text-white/84 sm:text-lg text-pretty"
          >
            {description}
          </motion.p>
        )}

        {children && <div className="mt-7">{children}</div>}
      </div>
    </section>
  );
}
