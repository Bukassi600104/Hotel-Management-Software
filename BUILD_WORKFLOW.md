# Euphoria Hotel: Build Workflow

A complete, end to end build plan for replacing the compromised WordPress site with a custom Next.js hotel booking platform that the hotel fully owns. No SaaS subscriptions beyond hosting and domain.

---

## Project Overview

**Goal:** Ship a production grade hotel website with a fully owned booking engine, payment integration, automated email notifications, and a custom admin dashboard.

**Stack:**
- Next.js 14 (App Router, TypeScript)
- Supabase (PostgreSQL, Auth, Storage)
- Paystack (payments)
- Resend + React Email (transactional email)
- Vercel (hosting)
- Cloudflare (DNS, CDN, Turnstile)
- Zoho Mail free tier (booking@ inbox)

**Outcome:** Hotel owns 100 percent of code, data, and customer relationships. Zero recurring SaaS fees. No third party booking commission.

---

## Phase 0: Pre-Build Discovery

Do not write any code until this phase is complete. Skipping it is the single biggest cause of project delays.

### Client Discovery Checklist

Get from the hotel before kickoff:

- [ ] Final list of room types and current pricing in Naira
- [ ] Number of physical units per room type (this drives availability counts)
- [ ] Professional photos for every room (high resolution, multiple angles)
- [ ] Hotel logo as SVG or vector file
- [ ] Brand colour preference (or autonomy to choose)
- [ ] Cancellation and refund policy (worded for legal clarity)
- [ ] Standard check in time and check out time
- [ ] VAT or tax rules to apply on bookings
- [ ] Whether bookings collect full payment or deposit only
- [ ] Bank account details for Paystack settlement
- [ ] BVN of the business owner for Paystack KYC
- [ ] Names and emails of admin staff who need dashboard access
- [ ] Verified working WhatsApp business number
- [ ] Conference room hire pricing structure
- [ ] List of nearby landmarks for the location page

### Account Setup Checklist

- [ ] GitHub repository (private)
- [ ] Vercel account linked to GitHub
- [ ] Supabase project (free tier covers initial launch)
- [ ] Paystack business account verified and live keys issued
- [ ] Resend account with domain verification started
- [ ] Cloudflare account with hotel domain added
- [ ] Zoho Mail tenant created on hotel domain
- [ ] Domain registrar access confirmed (transfer if registrar is sketchy)

### Local Tools

- [ ] Node.js 20 LTS
- [ ] pnpm
- [ ] Supabase CLI
- [ ] Vercel CLI
- [ ] Postman or Bruno for API testing
- [ ] Claude Code configured in the project directory

---

## Phase 1: Architecture Decisions

Lock these decisions in writing before building. Changes mid build are expensive.

**Currency storage:** All prices stored in kobo (integer) to avoid floating point bugs. Display layer formats to Naira.

**Booking model:** Single physical unit per room type for v1. Multi unit support is a v2 enhancement.

**Payment model:** Full payment up front. No deposit logic in v1.

**Cancellation logic:** Manual only. Hotel admin processes cancellations and refunds via dashboard. Auto cancellation policies are a v2 feature.

**Date handling:** Dates stored as DATE type (no time component). Check in is start of day in Lagos timezone. Check out is start of day. Total nights is the difference.

**Authentication:** Public guests do not register accounts. Bookings are guest checkout only. Only hotel admins authenticate.

**Localisation:** English only for v1. All amounts displayed in Naira.

**Image strategy:** All photos uploaded through admin dashboard go to Supabase Storage. Next.js Image component handles optimisation.

---

## Phase 2: Project Foundation

### Initialise Project

```bash
pnpm create next-app@latest euphoria-hotel
```

Selections: TypeScript yes, ESLint yes, Tailwind yes, App Router yes, src directory yes, import alias yes (`@/*`).

### Folder Structure

```
src/
  app/
    (public)/
      page.tsx
      rooms/
        page.tsx
        [slug]/page.tsx
      facilities/page.tsx
      conference/page.tsx
      about/page.tsx
      contact/page.tsx
      booking/
        confirm/page.tsx
        success/page.tsx
        failed/page.tsx
    (admin)/
      admin/
        layout.tsx
        page.tsx
        bookings/
        rooms/
        calendar/
        blocks/
        inquiries/
        users/
        settings/
        login/page.tsx
    api/
      availability/route.ts
      bookings/
        create/route.ts
        verify/route.ts
        webhook/route.ts
      contact/route.ts
      admin/
        bookings/
        rooms/
        blocks/
        users/
  components/
    public/
    admin/
    ui/
  lib/
    supabase/
      client.ts
      server.ts
      admin.ts
    paystack/
      init.ts
      verify.ts
    email/
      send.ts
    utils/
      dates.ts
      pricing.ts
      booking-reference.ts
      validation.ts
  types/
    database.ts
    booking.ts
    room.ts
emails/
public/images/
```

### Core Dependencies

```bash
pnpm add @supabase/supabase-js @supabase/ssr
pnpm add resend react-email @react-email/components
pnpm add date-fns react-day-picker
pnpm add zod react-hook-form @hookform/resolvers
pnpm add lucide-react clsx tailwind-merge
pnpm add @tanstack/react-query
pnpm add @upstash/ratelimit @upstash/redis
pnpm add -D supabase
```

### Environment Variables

`.env.local` template:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=

RESEND_API_KEY=
RESEND_FROM_EMAIL=bookings@yourdomain.com

NEXT_PUBLIC_SITE_URL=https://euphoriahotel.com
HOTEL_ADMIN_EMAIL=admin@yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=2348060260260

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### Deployment Pipeline

1. Init git, create private GitHub repo
2. Push initial commit
3. Connect Vercel to repo
4. Configure environment variables in Vercel for production and preview
5. Deploy a placeholder homepage to validate the pipeline
6. Set branch protection on main (require PR, require status checks)
7. Configure preview deployments on every PR

**Definition of done for Phase 2:** Hello world page is live on Vercel under a temporary URL, env vars resolve correctly, Supabase client initialises without errors.

---

## Phase 3: Database Layer

### Schema Migration

Create `supabase/migrations/0001_initial_schema.sql`:

```sql
-- Rooms
create table rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price_per_night integer not null,
  max_guests integer not null,
  bed_type text,
  room_size_sqm integer,
  thumbnail_url text,
  gallery_urls text[],
  amenities text[],
  is_active boolean default true,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings
create type booking_status as enum (
  'pending', 'confirmed', 'cancelled', 'refunded', 'checked_in', 'checked_out'
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text unique not null,
  room_id uuid references rooms(id) not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  check_in_date date not null,
  check_out_date date not null,
  num_adults integer not null default 1,
  num_children integer default 0,
  total_nights integer not null,
  total_amount integer not null,
  status booking_status default 'pending',
  paystack_reference text,
  paid_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  notes text,
  created_at timestamptz default now()
);

create index idx_bookings_dates on bookings(check_in_date, check_out_date);
create index idx_bookings_room on bookings(room_id);
create index idx_bookings_status on bookings(status);
create index idx_bookings_reference on bookings(booking_reference);

-- Blocked dates
create table blocked_dates (
  id uuid primary key default gen_random_uuid(),
  room_id uuid references rooms(id) not null,
  blocked_from date not null,
  blocked_to date not null,
  reason text,
  created_by uuid,
  created_at timestamptz default now()
);

create index idx_blocks_dates on blocked_dates(blocked_from, blocked_to);
create index idx_blocks_room on blocked_dates(room_id);

-- Admin users
create type admin_role as enum ('super_admin', 'manager', 'staff');

create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  role admin_role default 'staff',
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Contact inquiries
create table contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  source text default 'website',
  is_read boolean default false,
  created_at timestamptz default now()
);

-- Audit log
create table audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid references admin_users(id),
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz default now()
);
```

### Row Level Security

```sql
alter table rooms enable row level security;
create policy "Public reads active rooms" on rooms
  for select using (is_active = true);

alter table bookings enable row level security;
-- No public policies. Service role only via admin client.

alter table blocked_dates enable row level security;
-- No public policies. Service role only.

alter table admin_users enable row level security;
create policy "Admins read own record" on admin_users
  for select using (auth.uid() = id);

alter table contact_inquiries enable row level security;
create policy "Public can insert inquiries" on contact_inquiries
  for insert with check (true);
```

### Generate TypeScript Types

```bash
pnpm supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
```

Re-run this command every time the schema changes.

### Seed Data

Seed the 9 room types from the current site (Mini Standard through Presidential Suite) with their existing prices as a starting point. The hotel will adjust these via the admin dashboard later.

**Definition of done for Phase 3:** Schema deployed to Supabase, RLS active, types generated, seed script runs cleanly, you can query rooms from a Next.js server component.

---

## Phase 4: Public Site Build

### Brand Identity

Configure in `tailwind.config.ts`:

- Primary: warm gold or champagne (#C9A961 area) for luxury feel
- Secondary: deep charcoal (#1A1A1A) for sophistication
- Accent: muted teal or burnt orange for CTAs
- Heading font: Playfair Display or Cormorant Garamond
- Body font: Inter or Manrope

Run a logo refresh if the current logo is low resolution.

### Page Composition

**Homepage sections in order:**
1. Hero with full screen video or 3 image carousel maximum
2. Sticky availability checker (appears after hero scroll)
3. Welcome paragraph and brand introduction
4. Featured rooms grid (6 rooms, link to full catalogue)
5. Facilities showcase (pool, restaurant, gym, conference, nightclub, rooftop)
6. Testimonials section (real Google reviews)
7. Location with embedded Google Map
8. Newsletter signup
9. Footer with full contact details and consistent social icons

### Key Components to Build

**AvailabilityChecker**
- Date range picker via react-day-picker
- Adults and children counters
- Submits to `/api/availability`
- Displays results inline or routes to `/rooms?checkin=...&checkout=...`

**RoomCard**
- Image with subtle hover zoom
- Room name and short description
- Price per night formatted in Naira
- Capacity and bed type icons
- View Details CTA

**BookingForm**
- Pulls dates and room from URL or context
- Guest fields: name, email, Nigerian phone validation, special requests
- Total cost summary always visible
- Terms acceptance checkbox
- Pay Now button initialises Paystack flow

**WhatsAppFloat**
- Persistent floating button bottom right
- Opens WhatsApp with hotel number and pre-filled greeting

**Pricing Helper**

```ts
export const formatNaira = (kobo: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0
  }).format(kobo / 100);
```

### Pages to Ship

- [ ] Homepage
- [ ] Rooms catalogue (with availability filter integration)
- [ ] Room detail page (one per room slug)
- [ ] Facilities page
- [ ] Conference / Events page
- [ ] About page
- [ ] Contact page (with form posting to `/api/contact`)
- [ ] Booking confirmation flow pages

**Definition of done for Phase 4:** All public pages render with real Supabase data, mobile responsive across iPhone SE to iPad sizes, Lighthouse accessibility score above 90.

---

## Phase 5: Booking Engine

This is the core revenue feature. Build it carefully.

### Availability API

`POST /api/availability`

Input:
```ts
{
  check_in: string;   // YYYY-MM-DD
  check_out: string;
  num_guests: number;
}
```

Logic:
1. Validate input with Zod (dates parseable, check_in is today or future, check_out is after check_in, max stay 30 nights)
2. Run availability query against Supabase using service role client
3. Filter rooms where max_guests is greater than or equal to num_guests
4. For each available room, calculate total_nights and total_amount
5. Return array of rooms with computed pricing

The core SQL:
```sql
select * from rooms
where is_active = true
  and max_guests >= $num_guests
  and id not in (
    select room_id from bookings
    where status in ('confirmed', 'pending')
      and check_in_date < $check_out
      and check_out_date > $check_in
  )
  and id not in (
    select room_id from blocked_dates
    where blocked_from < $check_out
      and blocked_to > $check_in
  );
```

Note: pending bookings count as unavailable for a 15 minute hold window. Add a cleanup job (Vercel cron) that releases pending bookings older than 15 minutes that never paid.

### Booking Creation

`POST /api/bookings/create`

Logic:
1. Validate full input with Zod
2. Re-check availability inside a database transaction (race condition prevention)
3. Generate booking reference: `EUP-{YYYY}-{6 random alphanumeric chars}`
4. Insert pending booking
5. Initialise Paystack transaction:
   ```ts
   const response = await fetch('https://api.paystack.co/transaction/initialize', {
     method: 'POST',
     headers: {
       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       email: booking.guest_email,
       amount: booking.total_amount, // in kobo
       reference: booking.booking_reference,
       callback_url: `${SITE_URL}/booking/confirm`,
       metadata: {
         booking_id: booking.id,
         booking_reference: booking.booking_reference
       }
     })
   });
   ```
6. Return Paystack authorisation URL
7. Frontend redirects guest to that URL

### Payment Verification

`GET /api/bookings/verify?reference=...`

Critical: never trust the redirect alone. Always verify server side.

Logic:
1. Receive Paystack reference from query
2. Call Paystack verify endpoint:
   ```ts
   const response = await fetch(
     `https://api.paystack.co/transaction/verify/${reference}`,
     { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` } }
   );
   ```
3. Confirm `data.status === 'success'`
4. Confirm `data.amount` matches `booking.total_amount` (security critical to prevent amount tampering)
5. Update booking: status to confirmed, set paid_at, save paystack_reference
6. Trigger guest confirmation email and admin notification email
7. Return success response with booking summary

### Paystack Webhook

`POST /api/bookings/webhook`

Backup channel for when redirects fail (network drops, browser crashes).

Logic:
1. Read raw body and signature header
2. Verify HMAC SHA512 signature against `PAYSTACK_WEBHOOK_SECRET`
3. Reject if signature does not match
4. Parse event payload
5. On `charge.success` event, look up booking by metadata reference
6. Idempotency: if already confirmed, return 200 silently
7. Otherwise confirm the booking and trigger emails
8. Return 200 to Paystack

### Race Condition Handling

The biggest risk: two guests booking the same room for overlapping dates within seconds.

Solution: wrap the availability re-check and booking insert in a Postgres transaction. If the second insert violates business rules, return a clear error to the second guest. If both somehow get confirmed (Paystack already charged), automatically refund the second one and notify admin.

Use Postgres advisory locks on `room_id` during the booking creation flow.

### Booking Hold Cleanup

Vercel cron job runs every 5 minutes:

```ts
// /api/cron/cleanup-pending
// Deletes pending bookings older than 15 minutes
```

This frees up rooms that started a booking but never completed payment.

**Definition of done for Phase 5:** Full happy path booking works end to end with test Paystack keys, race conditions tested with concurrent requests, webhook tested via Paystack dashboard.

---

## Phase 6: Email System

### Resend Setup

1. Add hotel domain to Resend
2. Configure DNS records (SPF, DKIM, DMARC) via Cloudflare
3. Verify sender domain
4. Create sender identity: `bookings@euphoriahotel.com`

### Templates with React Email

Build these in `/emails/`:

**BookingConfirmation.tsx**
Hotel logo, big booking reference, room name, check in and check out dates formatted in long form, total amount paid, hotel address with Google Maps link, WhatsApp number for questions, cancellation policy summary.

**AdminBookingAlert.tsx**
Concise. Guest name, room booked, dates, amount paid, guest phone clickable, link to admin dashboard booking detail.

**BookingCancellation.tsx**
Apology tone, refund timeline (5 to 7 business days for Paystack reversals), contact for questions.

**ContactInquiryAlert.tsx**
Sent to admin when contact form is submitted. Includes guest details and message body.

### Send Helper

```ts
// /lib/email/send.ts
import { Resend } from 'resend';
import { BookingConfirmation } from '@/emails/BookingConfirmation';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation(booking: Booking, room: Room) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: booking.guest_email,
    subject: `Booking Confirmed: ${booking.booking_reference}`,
    react: BookingConfirmation({ booking, room })
  });
}
```

**Definition of done for Phase 6:** All four email types deliver to Gmail and Outlook inboxes (not spam), mobile rendering looks correct, all dynamic data interpolates properly.

---

## Phase 7: Admin Dashboard

### Authentication

- Supabase Auth with email plus password
- No public signup. Super admin invites users by creating them in Supabase Auth and inserting into `admin_users` table
- Magic link option for password recovery
- Middleware protects all `/admin` routes
- Unauthenticated requests redirect to `/admin/login`

```ts
// middleware.ts
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin') &&
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    // verify session, redirect if missing
  }
}
```

### Dashboard Pages

**Dashboard Home (`/admin`)**
Four stat cards: today check ins count, today check outs count, this month revenue, current month occupancy rate.
Recent bookings table (last 10).
Upcoming arrivals list (next 7 days).

**Bookings (`/admin/bookings`)**
Filterable table: date range filter, status filter, room type filter, search by guest name or reference.
Click a row to open detail drawer.
Drawer shows full guest info, payment details, action buttons: cancel booking, process refund, mark as checked in, mark as checked out, add internal note.

**Rooms (`/admin/rooms`)**
Grid view of all rooms with edit, deactivate, duplicate actions.
Add or edit room form: all fields, photo upload to Supabase Storage with image optimisation pipeline.
Drag and drop to reorder room display sequence.

**Calendar (`/admin/calendar`)**
Monthly view per room. Bookings shown as colour coded bars across the dates they occupy. Manual blocks shown in a different colour.
Click any open date range on a room to create a block.
Click an existing booking or block to view or edit.

**Block Dates (`/admin/blocks`)**
Quick form: select room, pick date range, add reason, save.
List of all current and future blocks with edit and delete actions.

**Inquiries (`/admin/inquiries`)**
Table of contact form submissions. Mark as read. Reply via mailto link.

**Users (`/admin/users`)**
Super admin only. List of all admin users. Invite new user form. Deactivate or change role for existing users.

**Settings (`/admin/settings`)**
Hotel information edit (address, phone numbers, social links).
Tax rate configuration.
Cancellation policy text.

### Admin Security Layer

- Every admin API route verifies `auth.uid()` exists in `admin_users` table and `is_active = true`
- Role checks for sensitive actions (only super_admin can refund payments, invite users, or delete rooms)
- Audit log entry written for every destructive action

**Definition of done for Phase 7:** Hotel manager can perform every operational task without developer involvement: create rooms, edit pricing, view bookings, block dates, manage staff accounts.

---

## Phase 8: Security Hardening

The original site got hacked through WordPress. This rebuild has to be hardened from day one.

### Critical Security Items

- [ ] Rate limiting on `/api/bookings/create` and `/api/contact` via Upstash Redis
- [ ] Cloudflare Turnstile CAPTCHA on contact form (free)
- [ ] Honeypot field on booking form to catch bots
- [ ] Zod validation on every API route input
- [ ] Supabase parameterised queries only (no raw SQL string concatenation)
- [ ] CSRF protection on admin mutations
- [ ] Content Security Policy headers in `next.config.js`
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Strict NEXT_PUBLIC_ prefix discipline (no secret leakage)
- [ ] Service role Supabase client never imported in client components
- [ ] Webhook signature verification mandatory before processing
- [ ] Paystack amount verification on every confirmation (prevent tampering)
- [ ] Admin session timeout after 8 hours of inactivity
- [ ] Audit log for all admin destructive actions

### Security Headers

```js
// next.config.js
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
];
```

### Secrets Rotation Policy

Document for the client: rotate Paystack keys every 6 months, rotate Supabase service role key after any team member departure, rotate Resend API key annually.

**Definition of done for Phase 8:** All checklist items completed, run a security audit using your own security-auditor skill before launch.

---

## Phase 9: Testing & QA

### Manual Test Scenarios

**Happy path booking**
Search for dates, see available rooms, select one, fill guest form, pay successfully on Paystack test mode, redirect back, see success page, receive confirmation email, dates show as blocked.

**Failed payment**
Cancel on Paystack page. Verify booking remains pending, then expires after 15 minutes via cleanup cron.

**Network drop during payment**
Pay successfully on Paystack, kill network before redirect completes. Webhook fires, booking confirms, email arrives.

**Race condition test**
Open two browsers, attempt to book the same room same dates within 2 seconds. One succeeds, one rejected gracefully with clear messaging.

**Date edge cases**
Same day check in and check out (rejected). Past dates (rejected). 30 plus night stays (rejected per policy). Daylight saving boundaries (Nigeria has none, but verify timezone math anyway).

**Mobile responsiveness**
Test every page on iPhone SE (small), iPhone 14 (standard), Android medium, iPad portrait, iPad landscape.

**Admin workflow tests**
Create a room with photos. Edit pricing. Deactivate a room and verify it disappears from public site. Block dates and verify availability check excludes them. Cancel a booking and verify refund flow. Invite a new staff user and verify they receive magic link.

### Automated Tests (recommended)

- Vitest for utility functions (date math, pricing calculations, booking reference generation)
- Playwright for critical booking flow end to end
- GitHub Actions runs tests on every PR

**Definition of done for Phase 9:** Every scenario passes, no console errors, no failed network requests, accessibility audit clean.

---

## Phase 10: Production Launch

### DNS and Email Setup

1. Cloudflare account, add hotel domain
2. Update nameservers at registrar to Cloudflare
3. Add A and CNAME records pointing to Vercel
4. Configure MX records for Zoho Mail
5. Set up SPF, DKIM, DMARC records for both Resend and Zoho

### Domain Email Setup

Zoho Mail free tier (5 users, 5GB each):
- booking@yourdomain.com (primary inbox)
- info@yourdomain.com (general)
- admin@yourdomain.com (admin notifications)

Configure as IMAP in the hotel manager's preferred mail app.

### Pre-Launch Checklist

- [ ] All env vars in Vercel production environment
- [ ] Paystack switched from test to live keys
- [ ] Resend domain verified and active
- [ ] Supabase project upgraded to paid tier if traffic warrants (still cheaper than WP hosting + plugins)
- [ ] Backup automation configured for Supabase
- [ ] Google Analytics 4 or Plausible installed
- [ ] sitemap.xml and robots.txt deployed
- [ ] Open Graph and Twitter card images for every page
- [ ] Favicon set in all required sizes
- [ ] Lighthouse score 90 plus on Performance, Accessibility, Best Practices, SEO
- [ ] Submit sitemap to Google Search Console
- [ ] Bing Webmaster Tools registration
- [ ] Set up Vercel Analytics

### Migration from Old Site

1. Keep the new site on a staging URL for 7 days of internal testing
2. On launch day, backup the WordPress database (just in case)
3. Switch DNS A record to Vercel
4. Verify SSL provisioning completes (Vercel auto handles)
5. Test booking flow on production with a real low value transaction
6. Monitor Search Console for indexing issues
7. Set up 301 redirects from common old WordPress URLs to new equivalents

Common redirects to map:
```
/hilton-rooms → /rooms
/euphoria-about-us → /about
/euphoria-conference-room → /conference
/euphoria-hotel-contact-us → /contact
/hilton/euphoria-deluxe → /rooms/euphoria-deluxe
(repeat for each room slug)
```

### Client Handover

1. Record a 30 minute training video walking through the admin dashboard
2. Write a one page operations cheat sheet: how to add a room, how to refund a booking, how to block dates, how to read the dashboard stats
3. Hand over credentials in an encrypted vault (1Password share or Bitwarden export)
4. Offer a maintenance retainer: monthly dependency updates, security monitoring, minor content edits, monthly performance report

---

## Sprint Plan (6 Weeks Solo)

**Week 1: Foundation**
Phase 0 client discovery wrap up, Phase 1 architecture decisions, Phase 2 project foundation, Phase 3 database layer.
Output: Empty Next.js shell deployed, Supabase schema live, public homepage skeleton with real data binding.

**Week 2: Public Site**
Phase 4 complete public site build.
Output: All public pages live on staging URL, mobile responsive, brand identity applied.

**Week 3: Booking Engine**
Phase 5 booking engine, Phase 6 email system.
Output: End to end booking flow works with Paystack test keys, all four emails deliver correctly.

**Week 4: Admin Dashboard**
Phase 7 admin dashboard.
Output: Hotel manager can perform every operational task via dashboard.

**Week 5: Hardening and Testing**
Phase 8 security hardening, Phase 9 testing and QA.
Output: All test scenarios pass, security audit clean, performance scores hit targets.

**Week 6: Launch**
Phase 10 production launch, client handover, knowledge transfer.
Output: Site live on hotel domain, hotel staff trained, retainer contract in place if applicable.

---

## Common Pitfalls to Avoid

**Storing prices as floats.** Use integers in kobo. Always.

**Trusting the Paystack redirect.** Always verify server side. Always check the amount matches.

**Skipping the webhook handler.** Network drops happen. Without webhooks, you will have paid but unconfirmed bookings.

**Pending bookings never expire.** Without the cleanup cron, abandoned cart bookings will block real bookings indefinitely.

**Service role key on the client.** This key bypasses RLS. Never import the admin Supabase client in any file under `app/(public)`.

**Missing image optimisation.** Hotel photos are typically 5MB plus. Use Next.js Image component with proper sizes and Supabase image transformations.

**No backups.** Configure automated daily Supabase backups before launch.

**Forgetting timezone math.** Lagos is UTC+1 with no DST. Store all timestamps in UTC, format for display in `Africa/Lagos`.

**Booking reference collisions.** Use a 6 character random suffix with year prefix to keep references readable but unique.

**Underestimating photo curation time.** Allocate a full day for photo selection, cropping, and uploading. It always takes longer than expected.

---

## Definition of Done (Project Level)

- [ ] Hotel can take real bookings end to end with no developer assistance
- [ ] Admin dashboard covers every operational need
- [ ] No SaaS subscriptions beyond Vercel hosting
- [ ] Lighthouse scores above 90 across all categories
- [ ] Mobile experience is excellent on devices commonly used in Nigeria
- [ ] Security audit passes
- [ ] All test scenarios pass
- [ ] Hotel staff trained and confident with the dashboard
- [ ] Documentation handed over
- [ ] Source code repository transferred or shared with the hotel
- [ ] Old WordPress site archived and shut down

---

## Repository Conventions

**Commit messages:** conventional commits (feat, fix, docs, refactor, test, chore)
**Branches:** feature branches off main, PR required to merge
**Code style:** ESLint + Prettier on commit hook
**TypeScript:** strict mode, no `any` without comment justification
**Components:** server components by default, client only when needed
**Imports:** absolute imports via `@/` alias

---

That is the complete workflow. Build it phase by phase, do not skip the testing phase, and the result will be a hotel website the owner can be genuinely proud of and that will pay for itself in recovered bookings within months.
