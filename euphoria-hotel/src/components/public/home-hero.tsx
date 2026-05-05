"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { img: string; sub: string; title: string };

const slides: Slide[] = [
  {
    img: "/hotel-assets/welcome-slide.jpg",
    sub: "Comfort & Elegance",
    title: "Luxury Stay Hotel Experience",
  },
  {
    img: "/hotel-assets/hotel-aerial.jpg",
    sub: "Like Home",
    title: "Where Every Stay Feels",
  },
  {
    img: "/hotel-assets/rooftop-dsc2573.jpg",
    sub: "Extraordinary",
    title: "Where Every Stay Is",
  },
];

export function HomeHero() {
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % slides.length),
      6000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="home"
      className="relative h-screen overflow-hidden bg-black"
    >
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            opacity: i === idx ? 1 : 0,
            transform: i === idx ? "scale(1)" : "scale(1.08)",
            transition:
              "opacity 1.5s cubic-bezier(0.22,1,0.36,1), transform 8s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <Image
            src={s.img}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.5)" }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <div className="relative z-[2] h-full flex flex-col items-center justify-center text-center px-10">
        <div className="overflow-hidden">
          <h1
            key={`title-${idx}`}
            className="font-heading font-light text-white whitespace-pre-line"
            style={{
              fontSize: "clamp(42px, 7vw, 88px)",
              lineHeight: 1.1,
              animation: "fadeUp 0.8s 0.15s ease both",
            }}
          >
            {slides[idx].title}
          </h1>
        </div>

        <div className="overflow-hidden mt-5">
          <p
            key={`sub-${idx}`}
            className="text-[12px] font-medium tracking-[5px] uppercase text-[var(--color-gold)]"
            style={{ animation: "fadeUp 0.8s 0.15s ease both" }}
          >
            {slides[idx].sub}
          </p>
        </div>

        <div className="overflow-hidden mt-10">
          <Link
            href="/rooms"
            className="inline-block px-12 py-4 bg-[var(--color-gold)] text-white text-[11px] font-semibold tracking-[4px] uppercase transition-transform duration-300 hover:-translate-y-0.5"
            style={{ animation: "fadeUp 0.8s 0.3s ease both" }}
          >
            Find Your Rooms
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 flex gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === idx ? 40 : 12,
                height: 3,
                background:
                  i === idx ? "var(--color-gold)" : "rgba(255,255,255,0.4)",
                transition: "all 0.5s",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
