# Client CMS Dashboard Design

## Goal

Build a separate WordPress-style website CMS at `/cms` so the client can safely update public website content without touching booking operations or breaking layouts.

## Scope

The CMS manages homepage text/images, page hero content, page body copy, footer/contact details, social links, SEO fields, draft/publish status, and safe image selections. It excludes room pricing, room availability, bookings, guests, payments, and operational controls because those remain in `/admin`.

## Architecture

The implementation adds a small Supabase-backed content layer with static fallbacks. Public pages read CMS records by slug and merge them with defaults; if Supabase is unavailable or a CMS record is missing, the existing content continues to render. The CMS UI uses the same Supabase Auth/admin user gate as `/admin`, but has its own shell, navigation, and client-friendly workflow.

## Routes

- `/cms`: client-friendly command center with action tiles, page list, recent edits, checklist, and publish status.
- `/cms/pages/[slug]`: safe field editor for one public page.
- `/api/cms/content`: authenticated read/update endpoint for page and footer CMS content.

## Data Model

- `cms_pages`: one row per editable public page. Stores page status, hero fields, SEO fields, and structured JSON content.
- `cms_site_settings`: stores footer/contact/social content in structured JSON.

Both tables use RLS and service-role access through server API routes. Public pages never need direct browser access to CMS tables.

## Safety

The client edits fixed fields and section cards, not layouts. Publishing updates text/images inside existing templates only. The booking system is not modified, and room content/pricing/availability remains managed by the booking dashboard.

## Verification

Run lint, build, audit, Supabase migration push, and browser-test `/`, `/about`, `/conference`, `/menu`, `/contact`, `/cms`, and a CMS edit flow. Confirm booking/admin pages still load.
