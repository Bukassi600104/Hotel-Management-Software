"use client";

import * as React from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

export function RoomGallery({ images, alt }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = React.useState(0);
  const [lightbox, setLightbox] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!embla) return;
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    return () => {
      embla.off("select", onSelect);
    };
  }, [embla]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[16/10] overflow-hidden border border-[#e8dfd1] bg-muted shadow-[0_28px_80px_-48px_rgba(23,24,26,0.55)]">
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="relative h-full min-w-0 flex-[0_0_100%] cursor-zoom-in"
                aria-label={`Open image ${i + 1}`}
              >
                <Image
                  src={src}
                  alt={`${alt} — image ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => embla?.scrollPrev()}
            className="pointer-events-auto grid size-11 place-items-center bg-black/45 text-white backdrop-blur-md hover:bg-black/65 transition-colors"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => embla?.scrollNext()}
            className="pointer-events-auto grid size-11 place-items-center bg-black/45 text-white backdrop-blur-md hover:bg-black/65 transition-colors"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>

        {/* Counter + expand */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            aria-label="Expand gallery"
            onClick={() => setLightbox(selected)}
            className="grid size-10 place-items-center bg-black/45 text-white backdrop-blur-md hover:bg-black/65 transition-colors"
          >
            <Expand className="size-4" />
          </button>
          <span className="bg-black/45 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md tabular-nums">
            {selected + 1} / {images.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => embla?.scrollTo(i)}
            className={cn(
              "relative aspect-[4/3] overflow-hidden border border-[#e8dfd1] transition-all",
              selected === i
                ? "border-[var(--color-gold)] shadow-[0_12px_30px_-20px_rgba(23,24,26,0.5)]"
                : "opacity-65 hover:opacity-100"
            )}
            aria-label={`Show image ${i + 1}`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="120px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative aspect-[3/2] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightbox]}
              alt={`${alt} — image ${lightbox + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
