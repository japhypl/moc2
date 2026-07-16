# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Moc Płomienia — a Polish women's event, VOD, and workshop platform at mocplomienia.pl. All user-facing content is in Polish. The project is currently in the specification phase (see `project-nextjs.md` and `gpt.md`).

## Architecture

There are two specification documents with partially overlapping but diverging stack recommendations:

- **`project-nextjs.md`**: Supabase-centric — Next.js 15 App Router + Supabase (auth, DB, Edge Functions, storage) + Refine admin panel. No separate backend service.
- **`gpt.md`**: Separate backend — Next.js frontend + NestJS API + PostgreSQL + Redis + BullMQ workers. More traditional monorepo with `apps/web`, `apps/api`, `apps/worker`, `packages/*`.

**Confirm with the project owner which architecture to follow before starting implementation.** The business rules and data model are consistent across both documents.

## Stack (common across both specs)

- **Frontend**: Next.js 15 (App Router), Tailwind CSS 4, Radix UI
- **Database**: PostgreSQL — UUIDs for PKs, money in minor units (grosze), `created_at`/`updated_at` timestamps on all tables
- **Auth**: Passwordless magic-link login
- **Payments**: Paynow V3 hosted checkout (no Stripe, no Paddle)
- **Ticketing**: Tixx.pl (external — do not duplicate ticket inventory locally)
- **Video**: Mux or Cloudflare Stream (signed/tokenized playback)
- **Admin**: Refine with Supabase data provider (in `project-nextjs.md`) or custom admin
- **Deployment**: Docker on VPS behind Cloudflare CDN/WAF, Caddy reverse proxy
- **CI/CD**: GitHub Actions

## Critical Business Rules

### Payment processing (Paynow)
- All payment logic runs server-side only — no secrets, no price calculation in the browser
- The browser return URL is **never** proof of payment
- Only a verified `CONFIRMED` webhook status grants access
- Webhook signature must be validated; invalid signatures are rejected
- Notification handling must be idempotent — handle duplicates and out-of-order delivery
- Each payment retry creates a new `payment_attempts` row, not a new order
- State transitions are monotonic — never regress a final status (e.g., CONFIRMED back to PENDING)

### System-of-record boundaries
- **Tixx.pl** owns: ticket inventory, ticket prices, ticket orders, QR codes, refunds
- **This platform** owns: VOD products/prices/orders, customer profiles, entitlements, workshop registrations, consent records
- **Video provider** owns: encoded assets, playback delivery

### Video security
- Playback tokens are short-lived, server-generated, and require active entitlement + auth
- Never expose permanent public video URLs

### Content integrity
- No fictional speakers, testimonials, dates, prices, or scarcity claims
- Countdown uses a single server-side deadline — no browser/cookie resets
- Campaign states control the homepage hero (7 states: PRELAUNCH, ON_SALE, LOW_AVAILABILITY, SOLD_OUT, POST_EVENT, VOD_ACTIVE, NO_ACTIVE_CAMPAIGN)

## Data Model Conventions

- UUID primary keys via `gen_random_uuid()`
- Money stored as `BIGINT` in minor currency units (grosze for PLN)
- Uniqueness constraints: `(provider, external_payment_id)`, `(provider, idempotency_key)`, `(provider, external_event_hash)`
- Content states: `draft`, `published`, `scheduled`, `archived` with `publish_at`/`unpublish_at`
- Row-level security: anonymous reads published content only; customers read own data only; payment/entitlement writes go through server-side functions only

## Design System

- Brand: warm luxury, sisterhood, contemporary elegance
- Colors: warm off-white (#FAF7F2), muted gold (#C5A55A), deep navy (#1B2432)
- Mobile-first: design at 360px, test at 360/390/430/768/1024/1440px
- Avoid: bright pink, autoplay video, heavy parallax, low-contrast gold text, excessive animation
- Accessibility: WCAG 2.2 AA target
- Performance: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 (75th percentile, mobile)

## Routes

All routes use Polish paths. Auth/payment/customer/admin routes are `noindex, nofollow`. See `project-nextjs.md` §5 for the full App Router structure.

## Legal/Consent Requirements

- Marketing consent: optional, unchecked by default, never bundled with purchase consent
- Non-essential scripts (GA4, GTM, Meta Pixel) blocked until explicit consent
- VOD checkout requires separate consent for immediate digital delivery + withdrawal-right acknowledgement
- Promotional prices must display the lowest price from previous 30 days (`price_history` table)
