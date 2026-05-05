"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
};

const u = (id: string) => `/hotel-assets/${id}`;

const slides: Slide[] = [
  {
    id: "s1",
    image: u("about.webp"),
    eyebrow: "Welcome to Euphoria",
    title: "Five-star comfort,\nquietly delivered.",
    body: "Refined rooms, generous service, and a long list of small details that turn a stay into a story.",
    cta: { label: "Find your room", href: "/rooms" },
  },
  {
    id: "s2",
    image: u("facility-pool.png"),
    eyebrow: "Lagos, with a softer edge",
    title: "An address that\nfeels like a retreat.",
    body: "Set quietly in Gowon Estate, Egbeda — a few minutes from the airport, a long way from the noise.",
    cta: { label: "Discover the hotel", href: "/about" },
  },
  {
    id: "s3",
    image: u("facility-rooftop.png"),
    eyebrow: "Rooftop, restaurant, and rest",
    title: "Three good reasons\nto stay an extra night.",
    body: "From breakfast on the terrace to last-call cocktails on the rooftop — the building keeps its rhythm late.",
    cta: { label: "Explore facilities", href: "/about#facilities" },
  },
];

const splitTitle = (text: string) =>
  text.split(/(\n)/).map((part) =>
    part === "\n" ? <br key={Math.random()} /> : part
  );

export function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 40 });
  const [selected, setSelected] = React.useState(0);

  const scrollTo = React.useCallback(
    (idx: number) => embla?.scrollTo(idx),
    [embla]
  );
  const scrollPrev = React.useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = React.useCallback(() => embla?.scrollNext(), [embla]);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect);
      embla.off("reInit", onSelect);
    };
  }, [embla]);

  // Autoplay
  React.useEffect(() => {
    if (!embla) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const id = setInterval(() => embla.scrollNext(), 6500);
    return () => clearInterval(id);
  }, [embla]);

  return (
    <section
      aria-label="Featured highlights"
      className="relative isolate h-[100svh] min-h-[640px] w-full overflow-hidden bg-charcoal"
    >
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="relative h-full min-w-0 flex-[0_0_100%]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className={cn(
                    "object-cover",
                    selected === i && "animate-ken-burns"
                  )}
                />
              </div>
              <div className="absolute inset-0 vignette" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />
            </div>
          ))}
        </div>
      </div>

      {/* Caption — switches with active slide */}
      <div className="pointer-events-none absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto max-w-2xl text-white"
            >
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[var(--color-gold-light)]">
                <span className="block h-px w-10 bg-[var(--color-gold)]" />
                {slides[selected].eyebrow}
              </span>
              <h1 className="mt-6 font-heading text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl lg:text-7xl">
                {splitTitle(slides[selected].title)}
              </h1>
              <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg text-pretty">
                {slides[selected].body}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  href={slides[selected].cta.href}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full gold-gradient px-6 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal shadow-[0_12px_30px_-10px_rgba(201,169,97,0.6)] transition-transform hover:-translate-y-0.5"
                >
                  {slides[selected].cta.label}
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-xs uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
                >
                  Our story
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-3 py-2 backdrop-blur-xl">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={scrollPrev}
            className="grid size-8 place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className="group relative h-1.5 overflow-hidden rounded-full bg-white/20 transition-all"
                style={{ width: selected === i ? 36 : 14 }}
              >
                {selected === i && (
                  <motion.span
                    key={`progress-${selected}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 6.4, ease: "linear" }}
                    className="absolute inset-0 origin-left bg-[var(--color-gold)]"
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next slide"
            onClick={scrollNext}
            className="grid size-8 place-items-center rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 translate-y-12 text-[10px] uppercase tracking-[0.4em] text-white/55 md:block">
        Scroll
      </div>
    </section>
  );
}
