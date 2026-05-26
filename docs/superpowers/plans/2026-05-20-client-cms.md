# Client CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a separate WordPress-style CMS dashboard that safely edits public website content without changing booking operations.

**Architecture:** Add Supabase CMS tables and a fallback-aware content layer. Build `/cms` routes and authenticated API endpoints, then connect selected public pages/footer to CMS content with static defaults.

**Tech Stack:** Next.js 16 App Router, React 19, Supabase Auth/Postgres, TypeScript, Tailwind CSS.

---

### Task 1: CMS Data Layer

**Files:**
- Create: `src/lib/cms/defaults.ts`
- Create: `src/lib/cms/content.ts`
- Modify: `src/types/database.ts`
- Modify: `supabase/migrations/20260520025214_cms_content_manager.sql`

- [x] Define CMS page/footer types and defaults.
- [x] Add safe Supabase readers that merge database rows with defaults.
- [x] Add SQL tables, RLS, seed records, and updated-at triggers.

### Task 2: CMS API

**Files:**
- Create: `src/app/api/cms/content/route.ts`

- [x] Add authenticated GET/PATCH handlers.
- [x] Validate page and footer payloads.
- [x] Write audit log entries for CMS updates.

### Task 3: CMS UI

**Files:**
- Create: `src/components/cms/cms-shell.tsx`
- Create: `src/components/cms/cms-dashboard.tsx`
- Create: `src/components/cms/cms-page-editor.tsx`
- Create: `src/app/(cms)/cms/layout.tsx`
- Create: `src/app/(cms)/cms/page.tsx`
- Create: `src/app/(cms)/cms/pages/[slug]/page.tsx`
- Modify: `middleware.ts`

- [x] Add `/cms` auth protection.
- [x] Build the Option 3 command center.
- [x] Build safe page editor forms with preview, draft, and publish actions.

### Task 4: Public Website Connection

**Files:**
- Modify: `src/components/public/home-hero.tsx`
- Modify: `src/components/public/site-footer.tsx`
- Modify: public pages under `src/app/(public)`

- [x] Connect homepage, About, Conference, Menu, Contact, and Footer to CMS content.
- [x] Preserve static fallbacks.
- [x] Avoid touching booking system routes.

### Task 5: Verification and Deployment

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run `npm audit --audit-level=moderate`.
- [x] Push Supabase migration.
- [x] Browser-test public pages, `/cms`, `/admin`, and booking lookup.
- [x] Deploy to Vercel.
