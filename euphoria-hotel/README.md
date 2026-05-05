# Euphoria Hotel — Frontend

A Next.js 16 + React 19 + Tailwind v4 + shadcn/ui rebuild of the Euphoria Hotel website. Premium animations via Motion (formerly Framer Motion), smooth scrolling via Lenis, carousels via Embla.

## Quick start

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Drop-in assets needed before launch

| Path | What | Specs |
|---|---|---|
| `public/brand/logo.png` | Hotel logo (winged H badge) | 512×512 transparent PNG, upscaled from source |
| Room photography | Replace Unsplash URLs in `src/lib/data/rooms.ts` | 1600×1067 hero, 1200×800 thumbnails |
| Facility photography | Replace Unsplash URLs in `src/lib/data/facilities.ts` | 1600×1067 hero, 1200×800 gallery |
| Menu dish photography | Replace Unsplash URLs in `src/lib/data/menu.ts` | 800×600 |
| Restaurant ambient photo | Used in `src/app/(public)/menu/page.tsx` hero | 2000×1333 |
| Hero carousel slides | `src/components/public/hero-carousel.tsx` | 2000×1333 |

All placeholder image URLs are flagged with `TODO` comments adjacent to where they are defined.

## Stack

- **Next.js 16** App Router, React Server Components, async params
- **React 19**
- **Tailwind v4** with CSS-based `@theme` token system
- **shadcn/ui** components (built on @base-ui/react)
- **Motion** for animations (`import { motion } from "motion/react"`)
- **Embla** carousels (hero, room gallery, facility mini-galleries)
- **Lenis** for smooth scrolling
- **react-hook-form + Zod** for form validation
- **Sonner** for toast notifications
- **date-fns + react-day-picker** for the availability checker

## Key folders

```
src/
  app/
    (public)/              # Public-facing routes
      layout.tsx           # Header + footer + smooth-scroll provider + WhatsApp FAB
      page.tsx             # Homepage
      rooms/page.tsx       # Catalogue
      rooms/[slug]/page.tsx
      about/
      conference/
      menu/
      contact/
      booking/
        confirm/           # Step 2 of reservation flow (UI only)
        success/
        failed/
    icon.tsx               # Auto-generated favicon
    sitemap.ts
    robots.ts
    layout.tsx             # Root layout (fonts, metadata)
    globals.css            # Theme tokens, animations, utilities
  components/
    public/                # Site-specific components
    motion/                # Reusable motion primitives (Reveal, Stagger, CountUp, MagneticButton, Marquee)
    ui/                    # shadcn primitives
  lib/
    data/                  # Seed data — replace with real content
    site.ts                # Hotel contact, nav, hours
    format.ts              # ₦ formatting helpers
    motion.ts              # Easing curves and variants
    utils.ts               # cn() helper
  types/
```

## Brand tokens (Tailwind v4 / CSS variables)

Defined in `src/app/globals.css` under `@theme inline`:

| Token | Hex | Usage |
|---|---|---|
| `--color-charcoal` | `#17181A` | Primary dark / header / dark sections |
| `--color-ivory` | `#FAF7F2` | Background |
| `--color-ivory-soft` | `#F3EEE5` | Alternating section bg |
| `--color-gold` | `#C9A961` | Premium accent (CTAs, dividers) |
| `--color-gold-light` | `#E6CC88` | Highlights |
| `--color-gold-dark` | `#9B7E3E` | Text on light bg |
| `--color-burgundy` | `#8B2E2E` | Logo / brand mark colour |
| `--container-7xl` | `1200px` | Centered content max-width (overrides default) |

## Pages shipped

| Route | Notes |
|---|---|
| `/` | Hero carousel · availability checker · welcome · featured rooms grid · testimonial marquee · facilities grid · secondary amenities · location |
| `/rooms` | Page hero · sticky availability checker · 9-card grid |
| `/rooms/[slug]` | Full-bleed gallery with thumbnails + lightbox · sticky booking sidebar · amenity grid · related rooms |
| `/about` | Story split + photo collage · animated stat counters · values grid · facilities · CTA band |
| `/conference` | Hero · feature grid · layouts table · gallery · validated inquiry form |
| `/menu` | Animated tabs · 16 dishes across 4 categories |
| `/contact` | Info card + validated form + map embed |
| `/booking/confirm` | Reservation summary + guest form (UI only — Paystack wiring is a later workflow phase) |
| `/booking/success` | Confirmation with auto-generated reference (`EUP-{YEAR}-{6 chars}`) |
| `/booking/failed` | Friendly recovery page |

## Animation primitives

```tsx
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { Marquee } from "@/components/motion/marquee";
import { MagneticButton } from "@/components/motion/magnetic-button";
```

All respect `prefers-reduced-motion: reduce` via the global rule in `globals.css`.

## What's intentionally not built yet

Per the wider build plan (see `../BUILD_WORKFLOW.md`), this milestone covers the **public site only** (Phases 0-4 of the workflow). Still ahead:

- **Phase 5** — Live booking engine (availability API, Paystack integration, webhooks, race-condition handling)
- **Phase 6** — Resend transactional emails (confirmation, admin alert, cancellation, contact)
- **Phase 7** — Admin dashboard (Supabase Auth, bookings table, calendar, room editor, blocks, inquiries, users, settings)
- **Phase 8** — Security hardening (rate limiting, Turnstile CAPTCHA, CSP headers, audit log)
- **Phase 9** — End-to-end test scenarios
- **Phase 10** — Production launch (DNS, email, Vercel deploy, SEO submit)

## Known dev-server quirks

- Next 16 + Turbopack occasionally times out fetching upstream Unsplash images on first compile (returns 500 from `/_next/image`). Hard refresh; subsequent loads use the disk cache. Real hotel photography served from your own CDN or Supabase Storage will not exhibit this.
- Lenis smooth scroll is disabled when `prefers-reduced-motion: reduce` is set.

## Author handoff checklist

Before going live:

- [ ] Save real logo to `public/brand/logo.png`
- [ ] Replace all Unsplash placeholders with real hotel photography (search `TODO` in `src/lib/data/`)
- [ ] Update `siteConfig.url` in `src/lib/site.ts` to the production domain
- [ ] Update room descriptions in `src/lib/data/rooms.ts` if the hotel has its own preferred copy
- [ ] Wire Phase 5 booking engine (Paystack + Supabase)
- [ ] Wire Phase 6 transactional email (Resend)
- [ ] Run Lighthouse audit; target ≥ 90 across all categories
