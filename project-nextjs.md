# MOC PŁOMIENIA — REVISED PROJECT SPECIFICATION

**Stack: Next.js · Supabase · Refine · Paynow · Tixx.pl · VPS**

---

## 1. PROJECT OVERVIEW

Build a production-ready new version of the Moc Płomienia website as a fully self-owned platform.

| | |
|---|---|
| Primary domain | mocplomienia.pl |
| Ticket domain | bilety.mocplomienia.pl |
| Staging domain | staging.mocplomienia.pl |
| Language | All user-facing content in Polish |
| Audience | Polish women — events, VOD recordings, workshops |

The platform sells:
1. Tickets for in-person women-only events (via Tixx.pl).
2. Paid VOD recordings (direct Paynow checkout).
3. VOD packages.
4. Occasional online and in-person workshops.

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Purpose |
|---|---|---|
| Frontend framework | **Next.js 15 (App Router)** | Public site, customer dashboard, checkout |
| UI | **Tailwind CSS 4 + Radix UI** | Design system, components, accessibility primitives |
| Admin panel | **Refine + Supabase data provider** | Content management, order/payment inspection, entitlements |
| Database | **Supabase (PostgreSQL)** — owned project | All data, RLS, realtime |
| Authentication | **Supabase Auth** | Magic-link passwordless login |
| Server functions | **Supabase Edge Functions (Deno)** | Payment processing, webhook handling, playback tokens |
| File storage | **Supabase Storage** | Images, PDFs, audio materials |
| Event ticketing | **Tixx.pl** | Ticket products, inventory, QR, delivery, refunds |
| VOD/workshop payments | **Paynow V3** (direct API) | Hosted checkout, notifications, refunds |
| Video hosting | **Mux or Cloudflare Stream** | Encoded video, signed playback |
| Transactional email | **Resend, Postmark, or Brevo** | Order confirmations, magic links, access grants |
| Newsletter/CRM | **Existing or new provider** | Marketing automation |
| Analytics | **GA4 + GTM + Meta Pixel** | Behind consent |
| Hosting | **VPS (Hetzner or similar)** | Docker, Nginx/Caddy, CI/CD |
| Source control | **GitHub** — company-controlled repo | From day one |
| CI/CD | **GitHub Actions** | Build, test, deploy to VPS |

### Key architecture decisions

- **No Lovable.** The entire frontend, admin panel, and deployment are self-owned.
- **No Stripe. No Paddle.** Paynow is the only payment provider.
- **Supabase Edge Functions** handle all server-side payment logic. No secrets ever reach the browser.
- **Next.js API routes** are used only for lightweight proxying or ISR revalidation — payment logic stays in Edge Functions where Supabase RLS and service-role access are native.
- **Refine** generates admin CRUD and connects directly to Supabase via its data provider. Custom pages are added for payment inspection, entitlement management, and audit logs.

---

## 3. SYSTEM-OF-RECORD RULES

### Tixx.pl is authoritative for:
- event-ticket categories
- event-ticket prices
- ticket-tier availability
- ticket quantities
- ticket order status
- ticket generation
- QR codes or barcodes
- refunds and cancellations
- ticket validation

### Supabase is authoritative for:
- public content
- VOD products and prices
- VOD orders
- direct Paynow payment attempts
- customer profiles
- VOD entitlements
- workshop registrations
- downloadable materials
- consent records
- audit records

### Video provider is authoritative for:
- encoded video assets
- playback IDs
- video processing status
- secure playback delivery

### Rules:
- Do not maintain independent event-ticket inventory in Supabase.
- Do not claim real-time ticket availability unless it comes from a verified Tixx.pl integration.
- Do not display synchronized Tixx.pl ticket status in the customer account until an API, webhook, or export method has been confirmed.

---

## 4. TARGET USERS

### 4.1 Guest
Can:
- browse public content
- view events and previous editions
- browse VOD
- start a VOD purchase
- follow a ticket link to Tixx.pl
- register for a free workshop
- subscribe to the newsletter

### 4.2 Customer
Can:
- log in through an email magic link
- view purchased VOD
- play authorized recordings
- access supplementary materials
- view direct Paynow VOD orders
- see access-expiry information
- update basic personal information
- log out

### 4.3 Administrator
Can:
- manage public pages
- manage homepage campaign states
- manage events and previous editions
- manage speakers
- manage Tixx.pl ticket links
- manage VOD products and packages
- manage prices and price history
- manage video-item mappings
- manage downloadable materials
- manage workshops
- manage testimonials
- view VOD orders and Paynow attempts
- view payment failures
- issue approved refunds
- grant or revoke entitlements
- manage newsletter content states
- view audit records
- manage redirects and SEO metadata

---

## 5. SITEMAP AND ROUTING

### 5.1 Next.js App Router structure

```
app/
├── (public)/
│   ├── page.tsx                          # /
│   ├── wydarzenia/
│   │   ├── page.tsx                      # /wydarzenia
│   │   └── [event-slug]/page.tsx         # /wydarzenia/[event-slug]
│   ├── vod/
│   │   ├── page.tsx                      # /vod
│   │   └── [product-slug]/page.tsx       # /vod/[product-slug]
│   ├── warsztaty/
│   │   ├── page.tsx                      # /warsztaty
│   │   └── [workshop-slug]/page.tsx      # /warsztaty/[workshop-slug]
│   ├── poprzednie-edycje/
│   │   ├── page.tsx                      # /poprzednie-edycje
│   │   └── [edition-slug]/page.tsx       # /poprzednie-edycje/[edition-slug]
│   ├── o-nas/page.tsx                    # /o-nas
│   ├── faq/page.tsx                      # /faq
│   ├── kontakt/page.tsx                  # /kontakt
│   ├── regulamin-wydarzen/page.tsx
│   ├── regulamin-vod/page.tsx
│   ├── regulamin-warsztatow/page.tsx
│   ├── polityka-prywatnosci/page.tsx
│   ├── polityka-cookies/page.tsx
│   └── dostepnosc/page.tsx
├── (auth)/
│   ├── logowanie/page.tsx
│   ├── weryfikacja/page.tsx
│   ├── wylogowanie/page.tsx
│   └── platnosc/
│       ├── status/page.tsx
│       └── blad/page.tsx
├── (customer)/
│   └── konto/
│       ├── page.tsx                      # /konto
│       ├── nagrania/
│       │   ├── page.tsx                  # /konto/nagrania
│       │   └── [product-slug]/page.tsx   # /konto/nagrania/[product-slug]
│       ├── materialy/page.tsx
│       ├── zamowienia/page.tsx
│       └── dane/page.tsx
├── (admin)/
│   └── admin/
│       ├── page.tsx                      # /admin
│       ├── strony/page.tsx
│       ├── wydarzenia/page.tsx
│       ├── prelegentki/page.tsx
│       ├── produkty/page.tsx
│       ├── vod/page.tsx
│       ├── warsztaty/page.tsx
│       ├── opinie/page.tsx
│       ├── zamowienia/page.tsx
│       ├── platnosci/page.tsx
│       ├── uzytkowniczki/page.tsx
│       ├── newsletter/page.tsx
│       ├── ustawienia/page.tsx
│       ├── integracje/page.tsx
│       ├── przekierowania/page.tsx
│       └── audyt/page.tsx
├── api/
│   └── revalidate/route.ts              # ISR on-demand revalidation
├── layout.tsx
├── not-found.tsx                         # custom 404
├── robots.ts
└── sitemap.ts
```

### 5.2 Metadata rules
- Authentication, payment-status, customer, and administration routes: `noindex, nofollow`.
- All public routes: unique `<title>`, unique `<meta description>`, canonical URL, Open Graph, one H1, logical heading hierarchy.

---

## 6. HOMEPAGE CAMPAIGN-STATE ENGINE

The homepage hero is controlled by a `campaign_state` field in the `site_settings` table, set via the admin panel.

| State | Hero content | Primary CTA |
|---|---|---|
| `PRELAUNCH` | Announced event, confirmed date/venue | "Dołącz do listy pierwszeństwa" |
| `ON_SALE` | Active event, countdown if real deadline | "Kup bilet" → Tixx.pl link |
| `LOW_AVAILABILITY` | Verified scarcity only | "Kup bilet" → Tixx.pl link |
| `SOLD_OUT` | Sold-out message | "Dołącz do listy rezerwowej" |
| `POST_EVENT` | Thank-you, VOD prep | "Powiadom mnie o nagraniach" |
| `VOD_ACTIVE` | VOD catalogue hero | "Zobacz nagrania" |
| `NO_ACTIVE_CAMPAIGN` | Brand proposition | "Dołącz do społeczności" |

### Countdown rules:
- One fixed deadline stored in `site_settings`.
- Rendered from server time (fetched via Supabase or Next.js `Date.now()` at SSR).
- Never resets per browser or per customer.
- Automatically stops after expiry.
- Never implies scarcity unless scarcity is verified.

### Homepage section order:
1. Campaign-state hero
2. Main brand proposition
3. Active event or VOD campaign
4. Three clear customer benefits
5. Active speakers or featured VOD contributors
6. Social proof
7. Featured VOD products
8. Workshops
9. Previous editions
10. FAQ
11. Newsletter
12. Footer

One primary conversion objective above the fold. Video testimonials as click-to-play thumbnails. No autoplay. No heavy video players before interaction.

---

## 7. EVENT PAGES

Each live event gets a dedicated landing page at `/wydarzenia/[event-slug]`.

Include:
- confirmed date and location
- one clear promise
- women-only statement (legal-approved)
- audience definition
- benefits
- programme
- speakers
- venue information
- ticket-category presentation
- exact Tixx.pl purchase links
- verified testimonials
- practical information
- accessibility information
- refund and transfer summary
- FAQ
- final CTA

Where real-time Tixx.pl sync is unavailable:
- do not show unverified remaining capacity
- state that final availability is confirmed in checkout
- revalidate through Tixx.pl when the customer follows the link

---

## 8. VOD CATALOGUE

### Product types supported:
- individual talks
- meditations
- audio products
- full-edition packages
- multi-edition packages
- future digital-product types

### Product fields:
title, slug, cover_image, contributor, edition, short_description, long_description, benefit_list, included_recordings (via join table), total_duration, standard_price, promotional_price, price_history, lowest_30_day_price, access_duration, access_expiry_rules, supplementary_materials, publication_status, seo_title, meta_description, og_image

Do not duplicate recordings across packages — use the `product_vod_items` relationship table.

---

## 9. DIRECT PAYNOW CHECKOUT

### Non-negotiable rules:
- Use Paynow V3 hosted checkout.
- No Stripe. No Paddle.
- No client-side Paynow secrets.
- No browser-side price calculation.
- Never treat the return URL as proof of payment.

### Target flow:
1. Customer opens a VOD product page.
2. Customer clicks "Kupuję".
3. Minimal checkout form appears (inline or separate route).
4. Customer provides email.
5. Invoice details appear only if requested.
6. Customer accepts required purchase terms.
7. Customer separately accepts immediate digital-content delivery and acknowledges withdrawal-right consequences.
8. Marketing consent remains optional and unchecked.
9. Frontend calls `create-paynow-payment` Edge Function.
10. Edge Function reads the current product price from the database.
11. Edge Function creates the internal order.
12. Edge Function creates a Paynow payment (server-to-server).
13. Edge Function returns the Paynow redirect URL.
14. Browser redirects to Paynow hosted checkout.
15. Paynow sends an asynchronous notification to `paynow-notification` Edge Function.
16. Edge Function verifies the Paynow signature.
17. Only a verified `CONFIRMED` status marks the order as paid.
18. Only a paid order creates an entitlement.
19. Customer receives a confirmation email with a magic login link.
20. The `/platnosc/status` page polls `get-order-status` Edge Function (reads from Supabase, not from the URL).

### Supabase Edge Functions:

| Function | Purpose |
|---|---|
| `create-paynow-payment` | Validate product, read price from DB, create order, create payment attempt, call Paynow API, return redirect URL |
| `paynow-notification` | Receive webhook, verify signature, store notification, apply state transition, grant entitlement on CONFIRMED, send confirmation email |
| `get-order-status` | Return order status from Supabase (used by the payment status page) |
| `retry-paynow-payment` | Create a new payment attempt for an existing unpaid order |
| `create-paynow-refund` | Admin-only: validate permissions, call Paynow refund API, record, revoke access per policy |
| `issue-video-playback-token` | Verify auth + entitlement + expiry, return short-lived signed video URL |

### Notification processing must:
- read the raw request body
- verify the Paynow signature using the configured signature key
- reject invalid signatures with appropriate HTTP status
- record every notification in `payment_notifications`
- detect duplicates via `external_event_hash`
- be idempotent — repeated delivery has no side effects
- handle out-of-order delivery — never regress a final status
- grant entitlement only once on `CONFIRMED`
- send confirmation email only once
- return quickly — defer slow work to async if needed

### Payment states:

| Paynow status | Internal behaviour |
|---|---|
| `NEW` | Display "payment initiated" |
| `PENDING` | Display "processing" — no access |
| `CONFIRMED` | Mark paid, grant entitlement, send confirmation |
| `REJECTED` | Mark failed, offer retry |
| `ERROR` | Mark technical failure, offer retry or support contact |
| `EXPIRED` | Mark expired, offer new attempt |
| `ABANDONED` | Mark abandoned, permit recovery |

### Environment secrets (Supabase Edge Function secrets only):
```
PAYNOW_API_KEY
PAYNOW_SIGNATURE_KEY
PAYNOW_ENVIRONMENT
PAYNOW_API_BASE_URL
PAYNOW_CONTINUE_URL
PAYNOW_NOTIFICATION_URL
```

---

## 10. CUSTOMER AUTHENTICATION

Passwordless email magic-link via Supabase Auth.

After a confirmed VOD purchase:
1. Normalize the customer's email.
2. Check for an existing Supabase Auth user.
3. Attach the order to the existing account if found.
4. Create a new user and profile if not found.
5. Grant the correct entitlement.
6. Send a confirmation email with magic login link.

Rules:
- Never create duplicate profiles for the same normalized email.
- Provide clear expired-link and resend-link states on `/weryfikacja`.
- Magic links use Supabase Auth's built-in OTP/magic-link flow.

---

## 11. CUSTOMER DASHBOARD

Located at `/konto/*`, protected by Supabase Auth middleware.

### 11.1 Moje nagrania (`/konto/nagrania`)
- Purchased products with cover images
- Modules and lessons within each product
- Access-expiry date per product
- Secure video player (Mux/Cloudflare Player SDK)
- Player fetches a signed playback token from `issue-video-playback-token` before each session

### 11.2 Materiały (`/konto/materialy`)
- Authorized PDFs, worksheets, audio files
- Served via Supabase Storage signed URLs

### 11.3 Zamówienia (`/konto/zamowienia`)
- Order reference, product, date, amount, payment status
- Link to retry payment for unpaid orders

### 11.4 Dane konta (`/konto/dane`)
- Name, email
- Logout
- Data-deletion instructions

No ticket section until reliable Tixx.pl sync is confirmed. Until then, show a clear link to the Tixx.pl ticket service.

---

## 12. VIDEO SECURITY

Use Mux Signed URLs or Cloudflare Stream Signed Tokens.

Before issuing a playback token, `issue-video-playback-token` must verify:
- user is authenticated (Supabase Auth JWT)
- entitlement belongs to the user
- entitlement is active
- entitlement includes the requested VOD item (via `product_vod_items`)
- access period has not expired

Playback tokens must:
- be short-lived (e.g., 1–4 hours)
- be generated server-side only
- never be stored permanently in frontend code
- never expose an unrestricted video URL

The objective is access control and reduction of casual sharing, not an impossible absolute guarantee.

---

## 13. ADMINISTRATION (REFINE)

### 13.1 Setup
- Refine app mounted at `/admin/*` inside the Next.js app (or as a separate build behind the same domain with path-based routing in Nginx/Caddy).
- Uses `@refinedev/supabase` data provider.
- Protected by Supabase Auth — requires `admin` role in `user_roles`.
- Service-role operations (entitlement grants, refunds) go through Edge Functions, not direct DB writes.

### 13.2 Admin sections

| Route | Refine resource | Custom views needed |
|---|---|---|
| `/admin/strony` | `pages`, `page_sections` | Rich text editor |
| `/admin/wydarzenia` | `events`, `event_speakers` | Campaign state selector, Tixx.pl link management |
| `/admin/prelegentki` | `speakers` | Image upload |
| `/admin/produkty` | `products`, `product_prices`, `bundles` | Price scheduling, 30-day price display |
| `/admin/vod` | `vod_items`, `product_vod_items` | Video mapping UI |
| `/admin/warsztaty` | `workshops`, `workshop_registrations` | Registration list export |
| `/admin/opinie` | `testimonials` | Approval workflow |
| `/admin/zamowienia` | `orders`, `order_items` | Read-only detail view, refund button |
| `/admin/platnosci` | `payment_attempts`, `payment_notifications` | Notification inspection, failure filtering |
| `/admin/uzytkowniczki` | `profiles`, `user_roles`, `entitlements` | Entitlement grant/revoke with confirmation |
| `/admin/newsletter` | `newsletter_subscriptions` | Export, state management |
| `/admin/ustawienia` | `site_settings` | Campaign state, countdown date, contact info |
| `/admin/integracje` | `integration_sync_runs` | Sync logs, Tixx.pl status |
| `/admin/przekierowania` | `redirects` | URL mapping CRUD |
| `/admin/audyt` | `audit_logs` | Read-only, filterable |

### 13.3 Content states
All content resources support: `draft`, `published`, `scheduled`, `archived`.
With `publish_at` and `unpublish_at` dates.

### 13.4 Audit logging
Every sensitive admin operation records: administrator ID, timestamp, action, resource, previous value, new value.

Sensitive operations (refunds, entitlement changes, user role changes) require explicit confirmation dialogs.

---

## 14. DATA MODEL

### 14.1 Tables

All tables use:
- UUID primary keys (`gen_random_uuid()`)
- `created_at`, `updated_at` timestamps
- Foreign-key constraints
- Appropriate indexes
- Money stored in **minor currency units** (grosze for PLN)

#### Content & CMS
| Table | Purpose |
|---|---|
| `pages` | CMS pages with publication state, SEO fields |
| `page_sections` | Ordered modular sections per page |
| `site_settings` | Campaign state, countdown date, contact info, social URLs |
| `events` | Event content, dates, venue, campaign state |
| `speakers` | Speaker profiles, bio, image |
| `event_speakers` | M:N event ↔ speaker with sort order |
| `testimonials` | Written/video testimonials with approval state |
| `redirects` | Source path → target path, HTTP status code |

#### Tixx.pl references
| Table | Purpose |
|---|---|
| `tixx_ticket_links` | Maps event CTAs to Tixx.pl product URLs |
| `external_ticket_orders` | Optional synced ticket summaries (only if Tixx.pl supports it) |
| `integration_sync_runs` | Records import/sync attempts and results |

#### VOD catalogue
| Table | Purpose |
|---|---|
| `products` | Sellable VOD, workshop, or digital products |
| `product_prices` | Current and scheduled prices per product |
| `price_history` | All historical price changes (for 30-day lowest compliance) |
| `bundles` | Named product packages |
| `bundle_products` | M:N bundle ↔ product with sort order |
| `vod_items` | Individual recordings/lessons (video provider ID, duration) |
| `product_vod_items` | M:N product ↔ VOD item |
| `downloadable_materials` | PDFs, worksheets, audio — linked to products |

#### Orders & payments
| Table | Purpose |
|---|---|
| `orders` | Internal customer orders |
| `order_items` | Products and prices captured at purchase time |
| `payment_attempts` | One row per Paynow payment ID |
| `payment_notifications` | Raw webhook payloads for audit |
| `refunds` | Refund requests and states |

Key fields and constraints:
```sql
-- orders
id UUID PK
user_id UUID FK → auth.users (nullable for guest checkout)
normalized_email TEXT NOT NULL
currency TEXT NOT NULL DEFAULT 'PLN'
subtotal_minor BIGINT NOT NULL
total_minor BIGINT NOT NULL
status TEXT NOT NULL DEFAULT 'new'
created_at TIMESTAMPTZ
paid_at TIMESTAMPTZ

-- payment_attempts
id UUID PK
order_id UUID FK → orders
provider TEXT NOT NULL DEFAULT 'paynow'
external_payment_id TEXT
status TEXT NOT NULL DEFAULT 'NEW'
amount_minor BIGINT NOT NULL
idempotency_key TEXT UNIQUE NOT NULL
provider_modified_at TIMESTAMPTZ
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
UNIQUE(provider, external_payment_id)

-- payment_notifications
id UUID PK
provider TEXT NOT NULL
external_event_hash TEXT UNIQUE NOT NULL
external_payment_id TEXT NOT NULL
signature_valid BOOLEAN NOT NULL
payload JSONB NOT NULL
provider_modified_at TIMESTAMPTZ
processing_status TEXT NOT NULL DEFAULT 'pending'
error_message TEXT
received_at TIMESTAMPTZ
processed_at TIMESTAMPTZ
```

#### Customer & access
| Table | Purpose |
|---|---|
| `profiles` | Customer display name, preferences |
| `user_roles` | Role assignments (customer, admin) |
| `entitlements` | Right to access a specific product |
| `playback_sessions` | Short-lived video session audit |
| `email_logs` | Transactional email delivery records |
| `audit_logs` | Admin action audit trail |

#### Engagement & consent
| Table | Purpose |
|---|---|
| `workshops` | Workshop listings and registration config |
| `workshop_registrations` | Free and paid registrations |
| `newsletter_subscriptions` | Subscription state |
| `consent_records` | Purchase, marketing, cookie consent evidence |

### 14.2 Row-Level Security

| Who | Can do |
|---|---|
| Anonymous | SELECT published public content (pages, events, speakers, products, testimonials, workshops, FAQs) |
| Authenticated customer | SELECT own profile, orders, entitlements, materials |
| Authenticated customer | INSERT workshop registrations, newsletter subscriptions (own) |
| Authenticated customer | UPDATE own profile (name only) |
| Service role (Edge Functions) | INSERT/UPDATE orders, payment_attempts, entitlements, email_logs |
| Admin (via Edge Functions) | Full access to all tables through service-role calls that verify admin role in application code |

Payment and entitlement writes **never** go through client-side Supabase calls. Always through Edge Functions using the service role.

---

## 15. DESIGN SYSTEM

### 15.1 Direction
Express: warm luxury, sisterhood, premium quality, sensuality, calm, trust, emotional depth, contemporary elegance.

### 15.2 Design tokens (provisional — mark as [BRAND APPROVAL REQUIRED])

```typescript
// tailwind.config.ts — extend theme
const tokens = {
  colors: {
    background: {
      primary: '#FAF7F2',    // warm off-white
      secondary: '#F0EBE3',  // warm cream
      dark: '#1B2432',       // deep navy
    },
    text: {
      dark: '#1B2432',
      light: '#FAF7F2',
      muted: '#6B6B6B',
    },
    accent: {
      gold: '#C5A55A',       // muted gold
      goldHover: '#B8963E',
    },
    border: '#E0D9CE',
    status: {
      success: '#2E7D4F',
      warning: '#C5882A',
      error: '#B33A3A',
    },
  },
  fontFamily: {
    heading: ['var(--font-heading)', 'serif'],
    body: ['var(--font-body)', 'sans-serif'],
  },
  spacing: {
    section: '5rem',
    sectionMobile: '3rem',
  },
  borderRadius: {
    card: '0.75rem',
    button: '0.5rem',
    input: '0.5rem',
  },
}
```

### 15.3 Do not use:
- bright childish pink
- excessive gradients
- generic corporate imagery
- heavy parallax
- autoplay video
- large decorative animations
- poor-contrast gold text
- excessive uppercase

### 15.4 Component library
Build with Tailwind + Radix UI primitives:
- Button (primary, secondary, ghost, CTA)
- Input, Textarea, Select, Checkbox
- Card (product, speaker, testimonial, benefit)
- Dialog (accessible, not trapping)
- Accordion (FAQ)
- Navigation (mobile hamburger, desktop horizontal)
- Footer
- Hero (campaign-state variants)
- Product grid
- Video player wrapper (click-to-load)
- Badge (status, tag)
- Toast/notification
- Loading skeleton
- Breadcrumbs

---

## 16. MOBILE-FIRST UX

Design first at 360px width. Test at: 360, 390, 430, 768, 1024, 1440px.

Requirements:
- No horizontal scrolling
- Primary buttons ≥ 48px height
- Sufficient touch spacing
- Readable without zooming
- Sticky CTA on mobile event and VOD pages
- Appropriate mobile keyboards (`inputmode="email"`, `inputmode="tel"`)
- Clear loading, disabled, and error states
- No layout shift when media loads
- No modal that traps the user

---

## 17. ACCESSIBILITY

Target WCAG 2.2 AA.

- Semantic HTML (header, nav, main, section, article, footer)
- Keyboard navigation on all interactive elements
- Visible focus indicators
- Correct heading hierarchy (one H1 per page)
- Form labels, field-level errors, error summaries
- Sufficient contrast (use Radix UI colors or verify tokens)
- `prefers-reduced-motion` support
- Alt text on all images
- Captions/transcripts when provided
- Accessible dialogs and accordions (Radix handles this)
- No information communicated only by colour

---

## 18. PERFORMANCE

Targets (75th percentile, mobile):
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

Implementation:
- `next/image` with AVIF/WebP, explicit dimensions, lazy loading
- `next/font` for optimized font loading
- App Router streaming and Suspense for progressive loading
- Dynamic imports for heavy components (video player, admin)
- ISR for public pages — revalidate on content change via webhook
- Deferred video players (click-to-load pattern)
- Limited third-party scripts (behind consent)
- No heavy hero animation

---

## 19. SEO

Every public page:
- Unique `<title>` and `<meta name="description">`
- Canonical URL
- Open Graph (title, description, image, type)
- One clear H1
- Logical H2/H3 structure
- Alt text
- Internal linking

Technical:
- `app/sitemap.ts` — dynamic sitemap from Supabase
- `app/robots.ts` — disallow admin, customer, auth routes
- `app/not-found.tsx` — custom 404
- Breadcrumbs on all content pages
- Structured data: Event, Product, Organization, BreadcrumbList, FAQ (when compliant)

Create a redirect map before launch. Manage redirects via admin (`redirects` table) — apply them in Next.js middleware.

---

## 20. ANALYTICS AND CONSENT

### Setup:
- GA4 property
- Google Tag Manager container
- Meta Pixel
- UTM attribution preservation

### Consent-first implementation:
Non-essential scripts are blocked until consent. Use a cookie-consent banner that:
- blocks GTM/Meta Pixel before consent
- permits granular category selection (necessary, analytics, marketing)
- stores consent in `consent_records` table
- is easy to withdraw
- uses GTM consent mode v2

### Events to track:

| Event | Trigger |
|---|---|
| `view_event` | Event page view |
| `select_ticket` | Ticket category click |
| `ticket_checkout_click` | Tixx.pl link click |
| `view_item` | VOD product page view |
| `select_item` | VOD product selection |
| `begin_checkout` | Checkout form shown |
| `payment_redirect` | Redirect to Paynow |
| `purchase` | Server-side on CONFIRMED (via Measurement Protocol) |
| `payment_failed` | Failed payment status |
| `payment_abandoned` | Abandoned payment |
| `login` | Successful magic-link login |
| `magic_link_requested` | Login form submitted |
| `vod_play_started` | Video play begins |
| `vod_play_completed` | Video completes |
| `workshop_signup` | Workshop registration |
| `newsletter_signup` | Newsletter subscription |

Do not send PII to analytics. Preserve UTMs when linking to Tixx.pl where supported.

---

## 21. LEGAL REQUIREMENTS

### Separate legal pages:
- `/regulamin-wydarzen` — event ticket terms
- `/regulamin-vod` — VOD and digital content terms
- `/regulamin-warsztatow` — workshop terms
- `/polityka-prywatnosci` — privacy policy
- `/polityka-cookies` — cookie policy
- `/dostepnosc` — accessibility statement

Do not write final legal text without legal approval.

### Digital content checkout:
- Explicit consent to begin immediate delivery
- Explicit acknowledgement of withdrawal-right consequences
- Consent stored in `consent_records` with timestamp
- Confirmation repeated in the durable purchase email

### Promotional pricing:
- Price history stored in `price_history` table
- Product page shows lowest price from previous 30 days when a promotional price is active

### Marketing consent:
- Optional, unchecked by default
- Not bundled with purchase consent

---

## 22. TRANSACTIONAL EMAILS

### Templates:

| Template | Trigger |
|---|---|
| VOD order received | Order created |
| Payment pending | Paynow status PENDING |
| Payment confirmed | Paynow status CONFIRMED |
| Payment failed | Paynow status REJECTED/ERROR |
| Payment expired | Paynow status EXPIRED |
| Payment abandoned | Paynow status ABANDONED |
| Magic login link | Login request |
| VOD access granted | Entitlement created |
| Refund initiated | Refund started |
| Refund completed | Refund confirmed |
| Workshop registration | Registration confirmed |
| Event/workshop update | Admin sends update |

### Email rules:
- Send from brand domain (e.g., `powiadomienia@mocplomienia.pl`)
- Plain-text version included
- One clear CTA per email
- Support contact in footer
- No permanent video URLs
- No sensitive payment data
- SPF, DKIM, DMARC configured

---

## 23. KNOWN LEGACY CONTENT

### Previous-edition speakers:
- Justyna Steczkowska
- Anna Głowacz
- Maya Ori
- Julia Mikołajczyk
- Helena Orzechowska
- Sara Gronowalska
- Regina Yeromina

Treat as historical/VOD content unless explicitly confirmed for a new event.

### Current VOD catalogue (migration references):

**May 2026:**
- Anna Głowacz: "Droga do miłości bezwarunkowej - do siebie" — PLN 149
- Justyna Steczkowska: "Autorska medytacja śpiewana" — PLN 149
- Helena Orzechowska: "Powrót do swojej natury - ciało jako mapa życia" — PLN 149
- Julia Mikołajczyk: "Moc głosu - DNA naszej odwagi" — PLN 149
- Maya Ori: "Od procesu do życia - co naprawdę zmienia Twoją codzienność" — PLN 149
- Complete May 2026 package — PLN 555

**November 2025:**
- Anna Głowacz: "Moc kreacji" — PLN 149
- Justyna Steczkowska: "Energia Gai" — PLN 149
- Regina Yeromina: "Ciało, energia, dusza" — PLN 149
- Sara Gronowalska: "Moc transformacji" — PLN 149
- Maya Ori: "Nowa świadomość kobiety" — PLN 149
- Complete November 2025 package — PLN 555

All prices are [BUSINESS CONFIRMATION REQUIRED] before publication.

"Pełna Moc" combined package — contents and price [BUSINESS CONFIRMATION REQUIRED].

---

## 24. CURRENT-SITE PROBLEMS TO ELIMINATE

Do not reproduce:
- hard-coded expired event countdowns
- expired event pricing
- mixed event/VOD conversion objectives in one hero
- VOD represented as an event ticket
- quantity selection for same VOD product
- mandatory postal address for digital purchases
- fake or unverified scarcity
- permanent public video links
- generic success pages as payment confirmation
- outdated legal pages
- broken privacy-policy links
- historical speakers presented as current
- fictional testimonials
- heavy autoplay video
- excessive animation

---

## 25. MIGRATION PLAN

### Content to migrate:
- Current pages → `pages` and `page_sections`
- VOD catalogue → `products`, `product_prices`, `vod_items`, `product_vod_items`
- Previous editions → `events` (with `archived` state)
- Speakers → `speakers`, `event_speakers`
- Testimonials → `testimonials`
- Images → Supabase Storage
- Videos → selected video provider (Mux/Cloudflare Stream)
- Legal content → `pages` (as draft until legal approval)
- SEO metadata → page-level fields
- Redirects → `redirects` table

### Customer migration:
- Export existing VOD customers from current system
- Import into Supabase Auth + `profiles`
- Preserve existing access — create `entitlements` for all legacy buyers
- Do not revoke access promised to legacy buyers

### Newsletter migration:
- Export subscribers only with evidence of valid consent
- Import into selected CRM/newsletter provider

### Reconciliation reports:
Per migration batch: source count, imported count, rejected count, duplicate count, missing-data count.

---

## 26. VPS DEPLOYMENT

### Server setup:
- **OS:** Ubuntu 24.04 LTS or Debian 12
- **Reverse proxy:** Caddy (automatic HTTPS) or Nginx + Certbot
- **Runtime:** Node.js 22 LTS via Docker or nvm
- **Process manager:** Docker Compose (preferred) or PM2
- **CI/CD:** GitHub Actions → build → push Docker image → deploy

### Docker setup:
```
docker-compose.yml
├── app (Next.js production build)
├── caddy (reverse proxy + SSL)
```

### Deployment flow:
1. Push to `main` branch.
2. GitHub Actions runs: lint → type-check → build → push image to GitHub Container Registry (or Docker Hub).
3. GitHub Actions SSHs to VPS (or uses a deployment webhook).
4. VPS pulls new image and restarts via `docker compose up -d`.
5. Caddy handles SSL termination and routing.
6. Health check confirms the new deployment is serving.

### Domain routing (Caddy example):
```
mocplomienia.pl {
    reverse_proxy app:3000
}

staging.mocplomienia.pl {
    reverse_proxy app-staging:3000
    basicauth * {
        staging $2a$... # password-protect staging
    }
}
```

### Monitoring:
- **Uptime:** UptimeRobot, Hetrixtools, or similar (free tier)
- **Errors:** Sentry (free tier)
- **Logs:** Docker logs + optional log aggregation (Loki, Logtail)
- **Performance:** Web Vitals reporting via `next/web-vitals` → GA4

### Backups:
- Supabase handles database backups (daily, point-in-time on Pro plan)
- Supabase Storage: consider periodic export of critical assets
- VPS: automated snapshots (Hetzner supports this)
- Document restore procedure and test it before launch

---

## 27. IMPLEMENTATION PLAN

**Estimated duration: 8–12 weeks** (one senior developer)

### Phase 0: Discovery and setup (3–5 days)

**Work:**
- Confirm direct Paynow API access for VOD
- Confirm Tixx.pl capabilities (API, deep links, exports)
- Set up GitHub repo with Next.js, Tailwind, Radix UI, Refine
- Create Supabase project, connect to GitHub
- Set up VPS, Docker, CI/CD pipeline
- Configure staging domain
- Inventory current content, customers, and redirects
- Assign legal work

**Exit criteria:**
- Repo builds and deploys to staging
- Paynow access confirmed
- Migration sources identified
- No unresolved platform contradictions

---

### Phase 1: Design system and information architecture (1–2 weeks)

**Work:**
- Design tokens in Tailwind config
- Component library (Button, Card, Input, Dialog, Accordion, Navigation, Hero, Footer, etc.)
- Mobile-first layouts at 360px → 1440px
- Homepage wireframe with all 7 campaign states
- Event page wireframe
- VOD catalogue and product page wireframes
- Customer dashboard layout
- Admin panel layout (Refine shell + navigation)

**Exit criteria:**
- Components render correctly at all breakpoints
- Stakeholder approves visual direction
- All missing copy marked as [CONTENT REQUIRED]

---

### Phase 2: Public site and CMS (1.5–2.5 weeks)

**Work:**
- Supabase schema: pages, page_sections, site_settings, events, speakers, event_speakers, testimonials, redirects, workshops, tixx_ticket_links
- RLS policies for public read access
- Public pages: homepage, events, VOD catalogue, workshops, previous editions, about, FAQ, contact, legal pages
- Homepage campaign-state engine
- ISR with on-demand revalidation
- Redirect middleware
- SEO: sitemap.ts, robots.ts, structured data, Open Graph
- Refine admin: pages, events, speakers, workshops, testimonials, site settings, redirects

**Exit criteria:**
- Admin can create/publish/schedule/archive content
- Campaign states switch correctly
- Expired content auto-hides
- SEO metadata renders correctly
- Public pages work at 360px

---

### Phase 3: Paynow VOD commerce (1.5–2.5 weeks)

**Work:**
- Supabase schema: products, product_prices, price_history, bundles, bundle_products, vod_items, product_vod_items, downloadable_materials, orders, order_items, payment_attempts, payment_notifications, refunds
- Edge Functions: create-paynow-payment, paynow-notification, get-order-status, retry-paynow-payment, create-paynow-refund
- VOD product pages with purchase flow
- Minimal checkout UI
- Payment status page (polls get-order-status)
- Payment error page
- Consent capture (purchase terms, digital delivery, marketing)
- Refine admin: products, prices, bundles, VOD items, orders, payment attempts, notifications
- Sandbox testing: full payment lifecycle

**Exit criteria:**
- Sandbox purchase completes end-to-end
- CONFIRMED grants access exactly once
- Invalid signatures rejected
- Duplicate/out-of-order notifications handled correctly
- Failed/expired/abandoned payments grant no access
- Browser price manipulation cannot alter an order
- Retry creates a new payment attempt, not a duplicate order

---

### Phase 4: Customer account and video (1.5–2.5 weeks)

**Work:**
- Supabase schema: profiles, user_roles, entitlements, playback_sessions, email_logs, audit_logs
- Magic-link authentication flow
- Login, verification, logout pages
- Customer dashboard: recordings, materials, orders, account
- Video provider integration (Mux or Cloudflare Stream)
- Edge Function: issue-video-playback-token
- Video player component (click-to-load, signed playback)
- Supabase Storage for downloadable materials (signed URLs)
- Transactional email integration
- Legacy customer import process
- Refine admin: users, roles, entitlements (grant/revoke with confirmation)

**Exit criteria:**
- Authorized customer can watch purchased content
- Unauthorized customer cannot access paid video
- Expired entitlements prevent playback
- Playback tokens are short-lived
- Legacy customer import reconciles correctly
- Magic link works end-to-end

---

### Phase 5: Analytics, compliance, and migration (1–2 weeks)

**Work:**
- Cookie consent banner (blocks non-essential scripts)
- GTM + GA4 + Meta Pixel (consent mode v2)
- Consent records stored in Supabase
- UTM persistence across checkout
- Event tracking (all events from section 20)
- Server-side `purchase` event via Measurement Protocol
- Legal pages published (after legal review)
- Price history display (30-day lowest)
- Previous-edition content migration
- Customer and order migration
- Newsletter subscriber migration (with consent evidence)
- Redirect map implementation and testing
- Search Console setup

**Exit criteria:**
- Non-essential scripts blocked before consent
- Legal pages approved and published
- Analytics events fire correctly
- Redirects work for all legacy URLs
- Migration reconciliation reports clean

---

### Phase 6: UAT and launch (1–2 weeks)

**Work:**
- Mobile QA (360px–1440px, real devices)
- Cross-browser QA (Chrome, Safari, Firefox, Edge)
- Accessibility audit (axe, keyboard testing, screen reader)
- Performance audit (Lighthouse, WebPageTest)
- Production Paynow testing (real payment with immediate refund)
- Refund flow testing
- Security review (RLS, Edge Function auth, no secret leaks)
- Content review (no fictional data, correct Polish copy)
- Backup and restore test
- Rollback rehearsal
- DNS cutover plan
- Production monitoring setup (Sentry, uptime, Web Vitals)
- Go-live

**Exit criteria:**
- All 35 acceptance criteria pass (see section 28)
- Critical/high issues closed
- Support team has procedures
- Monitoring active
- Rollback documented and tested

---

## 28. ACCEPTANCE CRITERIA

The platform is not production-ready until:

1. Works correctly at 360px.
2. No horizontal scrolling.
3. Expired campaigns automatically stop displaying.
4. No false scarcity appears.
5. Ticket CTAs use approved Tixx.pl links.
6. Event-ticket inventory is not duplicated locally.
7. VOD prices are calculated on the server.
8. Browser price manipulation cannot alter an order.
9. Paynow secrets are never exposed (not in client bundle, not in logs).
10. Invalid Paynow signatures are rejected.
11. Repeated notifications do not duplicate access.
12. Out-of-order notifications do not regress a final status.
13. Only CONFIRMED grants VOD access.
14. Pending, rejected, expired, abandoned, and failed payments do not grant access.
15. Payment retry creates a new payment attempt without duplicating the order.
16. The return URL never marks payment as paid.
17. Existing customer emails are matched without creating duplicate accounts.
18. Unauthorized users cannot play paid video.
19. Expired entitlements prevent playback.
20. Playback tokens expire.
21. Private files require authorization (signed URLs).
22. Refund behaviour follows the approved policy.
23. Marketing consent remains optional and unchecked.
24. Non-essential scripts remain blocked before consent.
25. Promotional prices show required 30-day price-history information.
26. Critical journeys meet WCAG 2.2 AA.
27. Core Web Vitals meet targets (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).
28. Customer, payment, and admin pages are noindex.
29. Redirects preserve important legacy URLs.
30. No fictional speaker, testimonial, date, price, statistic, or scarcity claim appears.
31. Admin permissions enforced server-side (Edge Functions verify role, not just frontend).
32. Sensitive admin actions are audited.
33. A Tixx.pl outage does not block existing VOD access.
34. A Paynow outage cannot create a false paid order.
35. Backup and rollback procedures are documented and tested.

---

## 29. CRITICAL-PATH DECISIONS

These block major parts of the build:

| Rank | Decision | Required before |
|---|---|---|
| 1 | Confirm direct Paynow API access for VOD | Phase 3 |
| 2 | Select and provision video provider (Mux vs Cloudflare Stream) | Phase 4 |
| 3 | Obtain next-event date, venue, tiers, programme | Event page publication |
| 4 | Confirm Tixx.pl deep-link, API, export capabilities | Ticket integration |
| 5 | Approve event, VOD, privacy, cookie, consent legal text | Phase 5 / launch |
| 6 | Obtain legacy buyer and order export | Phase 4 (customer migration) |
| 7 | Select transactional email provider | Phase 4 |
| 8 | Select newsletter/CRM provider | Phase 5 |
| 9 | Validate brand assets and usage permissions | Phase 1 |
| 10 | Approve redirect and SEO migration map | Launch |

---

## 30. IMMEDIATE CORRECTIONS TO CURRENT SITE

These should not wait for the rebuild:

1. Remove the expired 16 May 2026 countdown and "last place" messaging.
2. Remove or archive outdated ticket packages.
3. Remove outdated PayPo wording unless still active.
4. Repair the root privacy-policy 404.
5. Update Tixx.pl sales terms to describe the actual payment flow.
6. Update the Tixx.pl privacy processor list to reflect Paynow.
7. Clarify or remove the 30 September 2026 pseudo-event used to sell VOD.
8. Correct visible Polish copy errors.
9. Verify testimonial consent.
10. Verify rights for all speaker photos, recordings, and materials.
11. Export all legacy VOD customers before changing the sales system.
12. Preserve existing access promises during migration.
