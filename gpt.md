Moc Płomienia platform rebuild

Self-hosted, custom-coded implementation plan

Document: update.md

Prepared: 16 July 2026

Status: Working delivery brief

Language of the product: Polish

Language of this document: English

Primary domain: mocplomienia.pl

Ticketing domain: bilety.mocplomienia.pl
⸻
1. Executive summary

The new Moc Płomienia platform should be developed as a custom, self-hosted web application. Lovable is removed from the architecture and delivery process.

The recommended model is a compact product squad led by a hands-on senior full-stack technical lead. The website and application run on infrastructure controlled by Moc Płomienia. External specialist services remain appropriate where they provide regulated or infrastructure-heavy capabilities:

- Tixx.pl remains the event-ticketing system.
- Paynow by mBank / mElements remains the payment provider.
- A specialist streaming platform should deliver protected VOD.
- A transactional email provider should deliver account and purchase messages.
- A newsletter or CRM platform should manage marketing subscriptions.

The recommended production architecture is:

- Next.js and TypeScript for the public website, customer area, and administration interface.
- NestJS and TypeScript for the backend API and business logic.
- PostgreSQL for persistent data.
- Redis for queues, rate limiting, locks, and short-lived caching.
- S3-compatible object storage for private PDFs, images, and non-video files.
- Mux, Cloudflare Stream, or an equivalent service for secure video delivery.
- Docker-based deployment on a managed Linux VPS or dedicated server.
- GitHub-based source control and CI/CD.
- A separate staging environment and production environment.
- Cloudflare or an equivalent CDN and web application firewall in front of the application.

A basic shared-hosting account is not suitable unless the architecture is redesigned around the capabilities of that host. The hosting environment must support long-running application services, HTTPS, background workers, PostgreSQL, secure secrets, deployment automation, backups, and monitoring.

The preferred delivery team is:

- one internal product owner,
- one senior full-stack technical lead,
- one frontend or product engineer,
- one part-time UX/UI product designer,
- one part-time DevOps/SRE engineer,
- one part-time QA engineer,
- one Polish e-commerce and privacy lawyer,
- one short independent security-testing engagement,
- one internal content, SEO, CRM, and analytics owner,
- named technical contacts at Tixx.pl and Paynow.

An additional project or implementation manager is useful when several vendors and contractors need coordination. It is not a substitute for the technical lead.

Recommended delivery model
Model	Core engineering	Indicative delivery	Cost	Delivery risk	Recommendation
Single senior developer	One full-stack lead plus specialists	18-26 weeks	Lowest	Medium-high	Acceptable for a flexible MVP
Compact squad	Technical lead plus frontend/product engineer	12-16 weeks	Medium	Medium-low	Recommended
Full agency squad	Lead, backend, frontend, design, QA, DevOps, PM	9-14 weeks	Highest	Low-medium	Suitable for a fixed deadline

These estimates assume that event information, legal decisions, Paynow access, Tixx.pl cooperation, video files, and migration data are available without long delays.

Confidence: Medium.
⸻
2. Non-negotiable decisions

2.1 Platform

- Build a custom-coded application.
- Host the application on infrastructure controlled by Moc Płomienia.
- Do not use Lovable.
- Do not use Stripe.
- Do not use Paddle.
- Do not create a second ticketing system inside the new platform.

2.2 Event ticketing

Tixx.pl remains authoritative for:

- event-ticket products,
- ticket categories and price pools,
- ticket prices,
- ticket inventory,
- ticket orders,
- event-ticket payment,
- ticket generation,
- QR codes or barcodes,
- ticket delivery,
- refunds and cancellations,
- entrance validation.

The custom website owns the event marketing pages and routes customers to the correct Tixx.pl product. Ticket status should appear inside the Moc Płomienia customer account only after a reliable Tixx.pl API, webhook, or export process is confirmed.

2.3 VOD and workshops

The custom application owns:

- the VOD catalogue,
- VOD prices,
- VOD packages,
- digital-product checkout,
- direct Paynow payment integration,
- VOD orders,
- customer accounts,
- VOD access rights,
- protected playback,
- downloadable materials,
- free and paid workshop registrations.

2.4 Payment confirmation

- The browser return page is never proof of payment.
- Only a verified server-to-server Paynow status can mark a direct VOD or workshop order as paid.
- Only a confirmed paid order can create an access entitlement.
- Payment notification handling must be idempotent.
- Invalid notification signatures must be rejected and must not change order status.

Paynow's official documentation requires notification integrity validation and states that a message with an invalid signature must not be processed. See Source S1 and Source S2.

2.5 Video delivery

Do not serve paid videos as permanent public URLs from the application server.

Use:

- signed or tokenized playback,
- short-lived playback authorization,
- server-side entitlement checks,
- a specialist video platform or a properly engineered private HLS/CDN solution.

For the first release, a specialist service is recommended. Self-hosting large-scale adaptive video streaming materially increases storage, encoding, bandwidth, CDN, monitoring, and abuse-prevention work.
⸻
3. Current-site assessment

3.1 Observed state on 16 July 2026

The current public website still displays an expired event campaign for 16 May 2026. It contains a zeroed countdown, urgency language, historical ticket packages, current VOD offers, and previous-edition speaker content on the same long page.

The current site also contains visible copy defects, including examples such as:

- ODBIERZE DOSTĘP DO VOD,
- zmiania,
- inconsistent punctuation and spacing,
- historical campaign content that remains presented as current.

The current homepage mixes several conversion goals:

- VOD purchase,
- live-event tickets,
- online-event tickets,
- speaker discovery,
- previous editions,
- general brand positioning.

This makes campaign expiry, content ownership, and conversion measurement difficult.

The public privacy route tested during the assessment did not return a usable privacy policy. The legal and operational content must be validated and rewritten before launch.

3.2 Content that can be considered for migration

Previous-edition speakers currently visible include:

- Justyna Steczkowska,
- Anna Głowacz,
- Maya Ori,
- Julia Mikołajczyk,
- Helena Orzechowska,
- Sara Gronowalska,
- Regina Yeromina.

They must be classified as previous-edition contributors unless the business explicitly confirms their participation in a new event.

Legacy VOD products visible on the current site include recordings from May 2026 and November 2025. Public legacy prices include PLN 149 for individual products and PLN 555 for edition packages. These values are migration references only. They are not approved future pricing.

3.3 Main remediation requirements
Area	Current risk	Required treatment
Campaign state	Expired campaign remains live	Add scheduled states and automatic expiry
Homepage	Multiple competing objectives	One primary conversion above the fold
Ticketing	Historical ticket offers remain visible	Archive them and link only to active Tixx.pl offers
VOD checkout	Digital content is represented through ticket-like flows	Build a dedicated VOD checkout and access model
Legal	Broken or outdated pages	Replace with approved documents and consent mechanisms
Copy	Visible errors and stale content	Complete Polish editorial review
Scarcity	Urgency remains after the deadline	Permit only verified, time-bound scarcity
VOD access	No clear first-party protected library	Add authentication, entitlements, and protected playback
Administration	Campaigns can remain stale	Add a structured CMS and scheduled publication
Analytics	Mixed funnels reduce attribution quality	Separate event, VOD, workshop, and newsletter funnels
⸻
4. Business objectives and scope

4.1 Primary objectives

- Sell tickets for Moc Płomienia live events through Tixx.pl.
- Sell VOD products and VOD packages directly through Paynow.
- Provide a first-party customer account and protected VOD library.
- Promote and register customers for workshops.
- Grow a permission-based newsletter and first-party customer database.
- Improve mobile conversion from Instagram, Facebook, and other social channels.
- Ensure expired campaigns and prices are removed automatically.
- Give the marketing team control over content without code changes.
- Preserve existing customers' valid access during migration.

4.2 Primary conversions

- Event-ticket checkout click to Tixx.pl.
- Confirmed VOD purchase.
- Confirmed paid workshop purchase.

4.3 Secondary conversions

- Free workshop registration.
- Waiting-list registration.
- Newsletter subscription.
- Magic-link login.
- VOD playback start and completion.
- Repeat purchase.

4.4 MVP scope

The first production release should include:

- public homepage,
- event-listing page,
- dedicated event page,
- previous-editions archive,
- VOD catalogue,
- VOD product pages,
- VOD packages,
- direct Paynow checkout for VOD,
- customer authentication,
- customer VOD dashboard,
- protected video playback,
- downloadable materials,
- workshop module,
- newsletter registration,
- administration panel,
- content publication workflow,
- transactional email,
- analytics and consent management,
- SEO migration,
- accessibility and performance testing,
- audit logging for sensitive actions,
- infrastructure monitoring and backups.

4.5 Outside the MVP unless approved

- native mobile application,
- community forum,
- subscription billing,
- affiliate programme,
- referral programme,
- advanced learning-management features,
- certificates,
- complex gamification,
- AI content recommendations,
- rebuilding Tixx.pl ticketing,
- custom video encoding and CDN infrastructure,
- multi-language support beyond a technically prepared structure.
⸻
5. Hosting decision gate

Before the stack is finalized, the technical lead must audit the intended host.

5.1 Required host capabilities

The preferred architecture requires:

- a managed VPS, dedicated server, or private cloud VM,
- a supported Linux distribution,
- root or equivalent administrative access,
- Docker and Docker Compose, or an approved deployment platform,
- inbound HTTPS on ports 80 and 443,
- outbound HTTPS for Tixx.pl, Paynow, email, video, and analytics APIs,
- PostgreSQL,
- Redis,
- persistent volumes,
- cron or background workers,
- secure secret storage,
- staging and production environments,
- automated backups,
- off-site backup replication,
- monitoring and alerting,
- sufficient CPU, memory, disk, and bandwidth,
- DNS control,
- TLS certificate automation,
- a documented security-patching process.

5.2 Hosting types
Hosting type	Suitability	Comment
Managed Linux VPS	High	Recommended for the MVP
Dedicated Linux server	High	Suitable when operations ownership exists
Private cloud VM	High	Suitable with clear network and operations support
Kubernetes	Low for MVP	Adds unnecessary operational complexity unless already standard internally
Shared cPanel/PHP hosting	Low	Usually unsuitable for the recommended Node.js architecture
Static website hosting only	Not suitable	Cannot support payments, accounts, jobs, and administration

5.3 Decision rule

- If the host supports Docker, PostgreSQL, background workers, and secure networking, use the recommended TypeScript architecture.
- If the host is limited to PHP and a relational database, consider a Laravel architecture.
- If the host is basic shared hosting, move the application to an appropriate managed VPS rather than weakening payment, security, or operations requirements.
⸻
6. Recommended technical architecture

6.1 Preferred stack
Layer	Recommended technology	Purpose
Public web and application UI	Next.js with TypeScript	SSR/SSG, SEO, responsive UI, customer and admin interfaces
Backend API	NestJS with TypeScript	Payments, orders, permissions, integrations, audit logic
Database	PostgreSQL	Durable relational application data
Data access and migrations	Prisma or an equivalent migration-controlled ORM	Schema control, transactions, typed access
Queue and cache	Redis	Jobs, locks, throttling, caching, payment processing support
Background jobs	BullMQ or equivalent	Emails, imports, retries, media jobs, reconciliation
Private file storage	S3-compatible storage	PDFs, images, exports, and non-video private assets
VOD	Mux, Cloudflare Stream, or approved equivalent	Encoding, adaptive playback, and signed access
Reverse proxy	Caddy or Nginx	TLS, routing, compression, and security headers
Containerization	Docker	Repeatable deployment and service isolation
CI/CD	GitHub Actions or approved equivalent	Build, test, scan, and deploy
Error monitoring	Sentry, GlitchTip, or approved equivalent	Application errors and release diagnostics
Metrics and uptime	Hosted or self-hosted monitoring	Health checks, alerts, and service visibility
CDN and WAF	Cloudflare or equivalent	Asset acceleration, DNS, rate limiting, and edge protection

The exact library versions must be pinned by the technical lead at project start and maintained through a dependency-update policy.

6.2 Alternative stack for PHP-first hosting

When the hosting environment is PHP-first, a viable alternative is:

- Laravel,
- Inertia with React or Vue, or server-rendered Blade,
- PostgreSQL or MySQL,
- Redis,
- Laravel queues,
- S3-compatible storage,
- Docker where supported,
- the same Tixx.pl, Paynow, video, email, analytics, and consent boundaries.

The final choice should be based on hosting constraints and the development team's strongest production expertise, not preference alone.

6.3 Recommended repository structure

moc-plomienia/
  apps/
    web/                 # Next.js public, account, and admin UI
    api/                 # NestJS API
    worker/              # background job workers if separated
  packages/
    ui/                  # design system and reusable components
    domain/              # shared types and business rules
    config/              # shared linting and build configuration
    analytics/           # event definitions and helpers
  infrastructure/
    docker/
    reverse-proxy/
    monitoring/
    scripts/
  database/
    migrations/
    seeds/
  docs/
    architecture/
    api/
    operations/
    security/
    runbooks/


A monorepo is recommended because the platform has one product, shared domain models, and coordinated releases.

6.4 Deployment topology

Internet
  |
CDN / WAF / DNS
  |
Reverse proxy
  |-----------------------|
  |                       |
Next.js web             NestJS API
                          |
               -----------------------
               |          |          |
            PostgreSQL   Redis    Job workers
               |                     |
        encrypted backup       email / imports /
          and off-site copy     reconciliation

External services:
- Tixx.pl
- Paynow
- secure video provider
- transactional email provider
- newsletter / CRM provider
- analytics platforms after consent


6.5 Environments

At minimum:

- local development,
- shared development or integration environment,
- staging,
- production.

Staging should use sandbox payment credentials and non-production customer data. Production secrets must never be copied into local developer environments.
⸻
7. System-of-record matrix
Business object	Authoritative system	Notes
Public pages	Custom CMS in the new application	Marketing-managed
Event programme and speakers	Custom CMS	Only confirmed content is published
Event tickets	Tixx.pl	Do not duplicate inventory
Ticket price and availability	Tixx.pl	Display locally only when reliably synchronized
Ticket payment	Tixx.pl plus Paynow configuration	Existing business arrangement
Ticket generation and admission	Tixx.pl	Includes ticket recovery and validation functions
VOD catalogue	New application database	Product, pricing, packaging, and publication
VOD payment	New backend plus Paynow	Direct server-side integration
VOD orders	New application database	Internal order is the business reference
VOD entitlements	New application database	Created only after confirmed payment
Video assets	Video platform	Application stores asset identifiers, not public URLs
Customer identity	New application database	Passwordless authentication recommended
Private PDFs and audio	S3-compatible private storage	Signed access only
Newsletter contacts	Selected CRM	Consent evidence retained
Analytics	GA4 and Meta after consent	Application database remains source for revenue reconciliation
Legal consent evidence	New application database	Versioned and timestamped
Audit trail	New application database or immutable logging service	Sensitive admin and payment operations
⸻
8. Proposed sitemap

8.1 Public routes

/
/wydarzenia
/wydarzenia/[event-slug]
/vod
/vod/[product-slug]
/warsztaty
/warsztaty/[workshop-slug]
/poprzednie-edycje
/poprzednie-edycje/[edition-slug]
/o-nas
/faq
/kontakt
/regulamin-wydarzen
/regulamin-vod
/regulamin-warsztatow
/polityka-prywatnosci
/polityka-cookies
/dostepnosc


8.2 Authentication and payment routes

/logowanie
/weryfikacja
/platnosc/status
/platnosc/blad
/wylogowanie


8.3 Customer routes

/konto
/konto/nagrania
/konto/nagrania/[product-slug]
/konto/materialy
/konto/zamowienia
/konto/dane


Add /konto/bilety only after reliable Tixx.pl synchronization is available. Until then, link customers to the official Tixx.pl ticket service.

8.4 Administration routes

/admin
/admin/strony
/admin/wydarzenia
/admin/prelegentki
/admin/produkty
/admin/vod
/admin/warsztaty
/admin/opinie
/admin/zamowienia
/admin/platnosci
/admin/uzytkowniczki
/admin/newsletter
/admin/ustawienia
/admin/integracje
/admin/przekierowania
/admin/audyt


Authentication, account, payment-status, and administration routes must be noindex.
⸻
9. Homepage campaign-state model

The homepage must not rely on a permanently hard-coded campaign.
State	Trigger	Hero content	Primary CTA
PRELAUNCH	Event announced; tickets unavailable	Confirmed event facts and early-access proposition	Dołącz do listy pierwszeństwa
ON_SALE	Valid Tixx.pl offer active	Current event, date, venue, and offer	Kup bilet
LOW_AVAILABILITY	Scarcity verified	Verified limited-availability message	Kup bilet
SOLD_OUT	Tixx.pl confirms no availability	Sold-out state and alternative	Dołącz do listy rezerwowej
POST_EVENT	Event finished	Thank-you and VOD preparation	Powiadom mnie o nagraniach
VOD_ACTIVE	Current VOD campaign active	VOD proposition and featured package	Zobacz nagrania
NO_ACTIVE_CAMPAIGN	No active commercial campaign	Evergreen brand and newsletter	Dołącz do społeczności

Countdown requirements

- One fixed deadline stored on the server.
- Server time is authoritative.
- No browser-specific reset.
- No cookie-based evergreen reset.
- Automatic expiry.
- Automatic state change after expiry.
- No fake remaining-place count.
- No urgency without a real deadline or verified inventory.
⸻
10. Functional design

10.1 Homepage

Recommended order:

1. Campaign-state hero.
2. Clear brand proposition.
3. Current event or VOD campaign.
4. Three key benefits.
5. Confirmed speakers or featured VOD contributors.
6. Social proof.
7. Featured VOD products.
8. Workshops.
9. Previous editions.
10. FAQ.
11. Newsletter.
12. Footer.

Rules:

- One primary conversion above the fold.
- Mobile sticky CTA where relevant.
- No autoplay video.
- Video testimonials load after interaction.
- No fictional testimonials or statistics.
- All time-sensitive content has an owner and an expiry date.

10.2 Event page

Include:

- event title,
- confirmed date and time,
- confirmed venue and address,
- clear value proposition,
- audience definition,
- approved women-only participation wording,
- benefits,
- programme,
- confirmed speakers,
- venue and accessibility information,
- ticket categories,
- exact Tixx.pl links,
- practical information,
- refund and transfer summary,
- verified testimonials,
- FAQ,
- final CTA.

Where real-time Tixx.pl synchronization is unavailable:

- do not claim real-time inventory,
- state that final availability is confirmed in checkout,
- use direct Tixx.pl product links,
- do not maintain an independent ticket count.

10.3 VOD catalogue

Support:

- individual talks,
- meditations,
- audio products,
- edition packages,
- multi-edition packages,
- future digital product types.

Each product should support:

- title,
- slug,
- cover image,
- contributor,
- edition,
- short description,
- long description,
- benefit list,
- included VOD items,
- total duration,
- normal price,
- promotional price,
- price history,
- legally required previous-price reference,
- access duration,
- supplementary materials,
- publication status,
- SEO title,
- meta description,
- Open Graph image.

Bundles must reference existing VOD items. They must not duplicate the media files.

10.4 VOD checkout

Target flow:

1. Customer chooses a product.
2. Customer clicks the purchase CTA.
3. Application displays a minimal checkout.
4. Customer enters email.
5. Invoice fields appear only when requested.
6. Customer accepts required purchase terms.
7. Customer separately accepts immediate digital-content delivery where legally required.
8. Newsletter consent remains optional and unselected.
9. Server reads the current product and price from the database.
10. Server creates the internal order.
11. Server creates a Paynow payment.
12. Browser redirects to the hosted Paynow checkout.
13. Paynow sends a signed asynchronous notification.
14. Backend verifies the notification.
15. Only CONFIRMED marks the order paid.
16. Only a paid order grants access.
17. Customer receives confirmation and a magic login link.
18. Status page reads the backend order status.

The checkout must not request a postal address for ordinary digital delivery unless a genuine legal, tax, or invoice need requires it.

10.5 Customer area

My recordings

- purchased products,
- modules and lessons,
- secure player,
- access-expiry information,
- playback error recovery,
- support link.

Materials

- authorized PDFs,
- worksheets,
- private audio files,
- signed or authenticated download links.

Orders

- internal order reference,
- product,
- date,
- amount,
- payment status,
- refund status.

Account

- name,
- email,
- logout,
- data-deletion process,
- consent-management link.

10.6 Workshops

The module supports:

- free online workshops,
- free in-person workshops,
- paid online workshops,
- paid in-person workshops,
- capacity and waiting lists,
- confirmation emails,
- attendance instructions,
- publication and expiry dates.

When no active workshop exists, the homepage module should become a newsletter or priority-list registration block.

10.7 Administration

Administrators need to manage the site without changing code.

Required capabilities:

- pages and reusable sections,
- navigation and footer,
- homepage campaign state,
- events and previous editions,
- speakers,
- Tixx.pl links,
- VOD products and packages,
- scheduled prices and price history,
- VOD item mapping,
- materials,
- workshops,
- testimonials,
- orders and payment attempts,
- payment errors and notification failures,
- entitlements,
- refunds,
- newsletter content state,
- SEO metadata,
- redirect rules,
- integration configuration references,
- audit records.

Publication states:

- draft,
- scheduled,
- published,
- archived.

Sensitive actions must require explicit confirmation and produce an audit record.
⸻
11. Paynow integration specification

11.1 Integration approach

Use Paynow API V3 hosted checkout for direct VOD and paid-workshop payments.

Do not:

- expose the API key or signature key to the browser,
- trust a price submitted by the browser,
- grant access from the redirect URL,
- process an unsigned or invalidly signed notification,
- assume a notification is delivered once,
- assume notifications arrive in order,
- send duplicate access or duplicate email after a retry.

11.2 Required backend endpoints or commands

POST /api/payments/paynow
POST /api/webhooks/paynow
GET  /api/orders/:publicId/status
POST /api/orders/:publicId/retry-payment
POST /api/admin/orders/:id/refund
POST /api/vod/:itemId/playback-token


11.3 Create-payment process

1. Validate the product identifier.
2. Read the published product and active price from PostgreSQL.
3. Validate currency and availability.
4. Calculate the order value on the server.
5. Create an internal order within a database transaction.
6. Create a payment-attempt row.
7. Call Paynow using server-side credentials.
8. Use a unique idempotency key.
9. Store the returned Paynow payment identifier.
10. Return only the safe hosted payment URL and public order reference.

11.4 Notification process

1. Read the raw request body.
2. Validate the official Paynow signature.
3. Reject invalid signatures.
4. Store a notification audit record.
5. Detect duplicate events.
6. Find the payment attempt and order.
7. Validate permitted state transitions.
8. Compare provider timestamps where required.
9. Prevent an older event from regressing a final status.
10. For CONFIRMED, mark the order paid atomically.
11. Create entitlements exactly once.
12. Queue confirmation email exactly once.
13. Return promptly.
14. Retry slow or failed secondary work through a queue.

11.5 Payment states
Paynow state	Internal treatment
NEW	Payment initiated; no access
PENDING	Payment processing; no access
CONFIRMED	Paid; grant access once
REJECTED	Failed; allow retry
ERROR	Technical failure; allow retry or support
EXPIRED	Expired; allow a new payment attempt
ABANDONED	Abandoned; allow recovery

Paynow documents payment recovery in which a new payment identifier can be connected to the same external business order. Each payment attempt therefore needs its own database record. See Source S3.

11.6 Refunds

Refund operations must be restricted to authorized administrators.

The refund flow must:

- validate the administrator role,
- validate refundable amount,
- use an idempotency key,
- call Paynow server-side,
- record the request and provider response,
- update status only after confirmed processing,
- follow the approved VOD-access revocation policy,
- retain an audit trail.

11.7 Secrets

PAYNOW_API_KEY
PAYNOW_SIGNATURE_KEY
PAYNOW_ENVIRONMENT
PAYNOW_API_BASE_URL
PAYNOW_CONTINUE_URL
PAYNOW_NOTIFICATION_URL


Store secrets only in protected server-side secret storage. Do not put them in the repository, frontend bundle, analytics, logs, or support screenshots.
⸻
12. Tixx.pl integration specification

Tixx.pl provides event-ticketing functions and should remain the event-ticket system of record. Its public website describes branded, mobile-responsive ticketing and core ticket-management functions. See Source S4 and Source S5.

12.1 Minimum integration

- Store exact Tixx.pl product links in the CMS.
- Link the event page directly to the relevant offer.
- Preserve campaign attribution parameters where supported.
- Track ticket_checkout_click before leaving the site.
- Do not mark a ticket order paid locally without verified data.

12.2 Integration discovery

The technical lead must confirm with Tixx.pl:

- stable product deep links,
- partner or public API,
- webhook support,
- signature verification,
- event and ticket identifiers,
- order export,
- refund and cancellation export,
- ticket recovery link,
- real-time price or inventory feed,
- return URL support,
- GTM or analytics support,
- cross-domain measurement,
- UTM preservation,
- data-processing agreement,
- sandbox or test environment.

12.3 Progressive integration levels
Level	Capability	Recommended action
1	Deep links only	Launchable MVP; Tixx.pl remains separate
2	Scheduled order export	Show delayed ticket summaries if legally and operationally useful
3	API polling	Synchronize selected status information with reconciliation
4	Signed webhooks	Real-time status updates and customer-account ticket summaries

Do not make Level 4 functionality a launch dependency unless Tixx.pl confirms and supports it contractually.
⸻
13. VOD security and media architecture

13.1 Recommended model

- Store video master files with the selected streaming provider.
- Store provider asset IDs and playback policy in PostgreSQL.
- Use signed or tokenized playback.
- Generate tokens only after a server-side entitlement check.
- Use short token expiration.
- Avoid permanent public URLs.
- Do not store video access keys in the browser.

13.2 Playback authorization

Before issuing a token, verify:

- authenticated customer,
- active account,
- active entitlement,
- product includes the requested item,
- access has not expired,
- refund or revocation has not disabled access.

13.3 Honest security statement

The platform can control access and reduce casual sharing. It cannot guarantee that content displayed on a consumer device can never be recorded or copied.

13.4 Self-hosted video alternative

A fully self-hosted media stack would require:

- transcoding workers,
- multiple renditions,
- HLS or DASH packaging,
- private object storage,
- signed manifest and segment access,
- CDN capacity,
- bandwidth forecasting,
- monitoring,
- abuse controls,
- regional performance testing,
- backup and archival policy.

This is outside the recommended MVP unless there is a strong commercial or sovereignty requirement.
⸻
14. Data model

14.1 Content and CMS
Table	Purpose
pages	Public pages and metadata
page_sections	Modular page sections
navigation_items	Main and footer navigation
site_settings	Brand, contact, campaign, and integration references
events	Current and historical events
speakers	Speaker profiles
event_speakers	Event and speaker relationship
testimonials	Approved text and video testimonials
redirects	SEO migration redirects

14.2 Tixx.pl references
Table	Purpose
tixx_ticket_links	Maps event CTA and category to official Tixx.pl links
external_ticket_orders	Optional synchronized summary; only when supported
integration_sync_runs	Import and synchronization audit

14.3 VOD catalogue
Table	Purpose
products	Sellable digital or workshop products
product_prices	Active and scheduled prices
price_history	Historical prices and prior-price compliance
bundles	Product packages
bundle_products	Products contained in packages
vod_items	Individual recordings, lessons, or audio items
product_vod_items	Entitlement mapping between products and media
downloadable_materials	Private PDFs, audio, and worksheets

14.4 Orders and payments
Table	Purpose
orders	Internal commercial order
order_items	Products and immutable purchase pricing
payment_attempts	One row per Paynow payment identifier
payment_notifications	Signed notification audit and processing state
refunds	Refund request and provider state

Important fields:

orders
- id
- public_id
- user_id
- normalized_email
- currency
- subtotal_minor
- total_minor
- status
- provider
- created_at
- paid_at
- refunded_at

payment_attempts
- id
- order_id
- provider
- external_payment_id
- external_order_id
- status
- amount_minor
- idempotency_key
- provider_modified_at
- created_at
- updated_at

payment_notifications
- id
- provider
- external_event_hash
- external_payment_id
- signature_valid
- payload_encrypted_or_redacted
- provider_modified_at
- processing_status
- error_code
- error_message_redacted
- received_at
- processed_at


Required uniqueness:

(provider, external_payment_id)
(provider, idempotency_key)
(provider, external_event_hash)


Money should be stored in minor currency units.

14.5 Identity and access
Table	Purpose
users	Authentication identity
profiles	Customer details
roles	Role definitions
user_roles	Role assignment
sessions	Secure sessions where stored server-side
magic_link_tokens	Short-lived, single-use login tokens
entitlements	Product and content access rights
playback_sessions	Token issuance audit
audit_logs	Sensitive admin and business operations

14.6 Engagement and consent
Table	Purpose
workshops	Workshop publication and capacity
workshop_registrations	Free and paid registrations
newsletter_subscriptions	Current subscription state
consent_documents	Versioned legal and marketing text
consent_records	Evidence of customer consent
email_logs	Transactional email state

14.7 Authorization rules

- Public users read only published public content.
- Customers read only their own profile, orders, entitlements, and materials.
- Customers cannot create, modify, or delete paid entitlements.
- Payment status can change only through trusted backend logic.
- Administrators require explicit roles.
- Payment, notification, audit, and security tables are not exposed publicly.
- Private files require signed or authenticated access.
- Service credentials never reach the browser.
- Sensitive administrative actions produce immutable audit records.
⸻
15. UX and visual direction

15.1 Brand qualities

- warm luxury,
- sisterhood,
- premium quality,
- sensuality,
- calm,
- trust,
- emotional depth,
- contemporary elegance.

15.2 Visual direction

- warm earth tones,
- muted gold,
- deep navy,
- off-white,
- editorial photography,
- generous spacing,
- restrained ornament,
- strong contrast,
- calm motion.

Avoid:

- childish bright pink,
- excessive gradients,
- generic corporate imagery,
- autoplay video,
- heavy parallax,
- decorative animation that harms performance,
- low-contrast gold text,
- excessive uppercase text.

Exact color values, fonts, and image rules require a validated brand guide.

15.3 Mobile-first requirements

Design and test at:

- 360 px,
- 390 px,
- 430 px,
- 768 px,
- 1024 px,
- 1440 px.

Requirements:

- no horizontal scrolling,
- primary buttons at least 48 px high,
- sufficient touch spacing,
- readable text without zoom,
- sticky CTA on key event and VOD pages,
- mobile-appropriate keyboards,
- visible loading and disabled states,
- actionable errors,
- no unexpected layout shifts,
- accessible menus, dialogs, and accordions.
⸻
16. Accessibility, performance, SEO, and analytics

16.1 Accessibility

Target WCAG 2.2 AA. W3C advises using WCAG 2.2 for current accessibility work. See Source S7.

Include:

- semantic HTML,
- full keyboard navigation,
- visible focus,
- correct heading hierarchy,
- form labels,
- field-level errors,
- error summaries where appropriate,
- sufficient contrast,
- reduced-motion support,
- meaningful alt text,
- captions or transcripts when available,
- accessible authentication,
- accessible dialogs and accordions,
- no information conveyed only through color.

16.2 Performance

Target at the 75th percentile on mobile:

- LCP at or below 2.5 seconds,
- INP at or below 200 milliseconds,
- CLS at or below 0.1.

Use:

- responsive images,
- AVIF or WebP where supported,
- explicit media dimensions,
- lazy loading,
- optimized fonts,
- route-level code splitting,
- deferred video players,
- limited third-party scripts,
- CDN caching,
- server-side rendering or static generation where appropriate.

16.3 SEO

For each public page:

- unique title,
- unique meta description,
- canonical URL,
- Open Graph metadata,
- one clear H1,
- logical H2 and H3 structure,
- alt text,
- internal linking,
- indexable content.

Add:

- XML sitemap,
- robots file,
- custom 404 page,
- redirect management,
- breadcrumbs,
- Event structured data,
- Product structured data,
- Organization structured data,
- BreadcrumbList structured data,
- FAQ structured data only where compliant and useful.

16.4 Analytics and consent

Prepare:

- GA4,
- Google Tag Manager,
- Meta Pixel,
- UTM attribution,
- consent-mode-compatible implementation,
- server-side commercial reconciliation from the application database.

Do not activate non-essential analytics or marketing scripts before valid consent.

Track at least:

view_event
select_ticket
ticket_checkout_click
view_item
select_item
begin_checkout
payment_redirect
purchase
payment_failed
payment_abandoned
login
magic_link_requested
vod_play_started
vod_play_completed
workshop_signup
newsletter_signup


Do not send sensitive personal information to analytics platforms.
⸻
17. Security requirements

Use OWASP ASVS as the contractual verification baseline for the application. OWASP describes ASVS as a framework for defining and testing web-application security controls. See Source S6.

17.1 Core controls

- Threat model before implementation.
- Secure coding standards.
- Server-side authorization on every protected operation.
- Secure, HTTP-only, same-site cookies.
- CSRF protection where applicable.
- Strong output encoding and input validation.
- Rate limiting for login, checkout, status, and webhook endpoints.
- Secure passwordless login tokens with short expiry and single use.
- Administrator multi-factor authentication.
- Least-privilege database credentials.
- Encryption in transit.
- Encryption or approved protection for sensitive data at rest.
- Secrets kept outside source control.
- Dependency vulnerability scanning.
- Container image scanning.
- Security headers.
- Audit logging.
- Log redaction.
- Backup encryption.
- Restore testing.
- Incident-response runbooks.

17.2 Independent review

Use an external specialist for:

- architecture review before payment implementation,
- targeted penetration test before production,
- remediation verification after fixes.

17.3 Security acceptance examples

- Browser price manipulation cannot change the payable amount.
- Invalid Paynow notifications are rejected.
- Replayed notifications do not duplicate entitlements.
- A customer cannot access another customer's order.
- A customer without an entitlement cannot obtain a playback token.
- An administrator action is denied without the correct role.
- Production secrets are not present in the repository or client bundle.
- Logs do not contain payment credentials or full sensitive personal data.
⸻
18. Legal and compliance workstream

A Polish e-commerce and privacy lawyer must approve:

- event-ticket terms,
- VOD and digital-content terms,
- workshop terms,
- privacy policy,
- cookie policy,
- refund policy,
- complaints process,
- immediate digital-content delivery consent,
- withdrawal-right wording,
- promotional-price presentation,
- processor list,
- retention schedule,
- data-processing agreements,
- marketing consent,
- women-only event wording,
- accessibility obligations.

Developers implement approved legal mechanisms. They do not decide legal wording or legal applicability.

Required implementation features

- Versioned legal documents.
- Versioned consent text.
- Timestamped consent evidence.
- Optional, unselected marketing consent.
- Granular cookie choices.
- Easy withdrawal of marketing and cookie consent.
- Price-history records.
- Durable email confirmation of digital-delivery consent where required.
- Data-deletion and data-access process.
- Processor inventory.
⸻
19. Team design

19.1 Core team
Role	Typical involvement	Main responsibility
Product owner	20-30%	Scope, priorities, pricing, approvals, launch decision
Senior full-stack technical lead	100%	Architecture, backend, integrations, code quality, delivery
Frontend/product engineer	70-100%	Public UI, customer area, admin UI, responsive implementation
UX/UI product designer	20-40%, mainly early	Research, flows, wireframes, design system, conversion UX
DevOps/SRE engineer	10-20%	Hosting, deployment, backups, monitoring, security configuration
QA engineer	30-50%, mainly mid-to-late	Test design, automation, payment and permission testing
Polish legal/privacy counsel	Fixed engagement	Legal text and commercial-flow approval
Content/SEO/analytics owner	20-30%	Polish content, migration, SEO, analytics, campaigns

19.2 Specialist support
Specialist	Timing	Scope
Security tester	Before launch	Architecture and penetration testing
Video specialist	VOD build and migration	Encoding, captions, secure playback, asset migration
Tixx.pl technical contact	Discovery and integration	Deep links, exports, API, webhooks, analytics
Paynow technical contact	Payment development	Sandbox, production credentials, notifications, refunds
CRM/email specialist	Integration phase	Newsletter migration, email deliverability, consent
Polish copy editor	Before UAT	Language and editorial quality
Project/delivery manager	Optional	Vendor coordination, schedule, dependencies, status

19.3 What the technical lead must own

- architecture,
- technical decisions,
- backend code,
- database design,
- authentication,
- authorization,
- Paynow integration,
- Tixx.pl technical coordination,
- VOD entitlement logic,
- code reviews,
- technical documentation,
- migration design,
- release readiness,
- production incident leadership.

The technical lead must be hands-on. A non-coding architect is insufficient for a compact squad.

19.4 Division between two engineers

Senior technical lead and backend owner

- architecture,
- API,
- PostgreSQL,
- authentication and authorization,
- Paynow,
- Tixx.pl synchronization,
- order and entitlement state,
- email and background jobs,
- secure video tokens,
- audit logs,
- migration scripts,
- production incidents.

Frontend or product engineer

- public website,
- mobile UX,
- event pages,
- VOD catalogue,
- product pages,
- checkout interface,
- customer dashboard,
- player interface,
- administration interface,
- accessibility,
- SEO rendering,
- analytics events,
- loading, empty, and error states.
⸻
20. Hiring profile for the technical lead

Suggested title:

Senior Full-Stack Technical Lead for a self-hosted e-commerce and VOD platform

Must have

- production experience with self-hosted web applications,
- strong backend and relational-database skills,
- PostgreSQL,
- authentication and role-based authorization,
- payment-provider API integration,
- signed webhook or notification validation,
- idempotent payment processing,
- transactional consistency,
- secure customer accounts,
- Docker and Linux deployment,
- CI/CD,
- secrets management,
- monitoring and structured logging,
- backups and restoration,
- GDPR-aware engineering,
- automated testing,
- API documentation,
- Git-based delivery,
- production launch and support experience.

Strong preference

- Paynow integration,
- Polish e-commerce,
- Tixx.pl coordination or integration,
- VOD or streaming-platform experience,
- signed playback tokens,
- digital-product entitlement systems,
- customer and order migration,
- custom administration panels or headless CMS,
- accessibility implementation,
- GA4, GTM, Meta Pixel, and consent management.

Evidence to request

- production systems personally delivered,
- architecture diagrams,
- payment-flow examples,
- explanation of idempotency,
- security practices,
- testing approach,
- deployment documentation,
- backup and restore process,
- references,
- a clear answer to duplicate and delayed Paynow notifications.

Interview scenario

Ask the candidate:

Paynow sends PENDING, then CONFIRMED, then a delayed duplicate PENDING, and repeats CONFIRMED twice. Explain the database model, transaction boundaries, uniqueness constraints, and state-transition logic that prevent status regression, duplicate access, and duplicate email.

A strong answer should mention:

- raw-event audit,
- signature validation,
- unique provider event or payload hash,
- unique external payment identifier,
- monotonic or explicitly permitted state transitions,
- database transaction,
- entitlement uniqueness,
- outbox or queued email,
- idempotency,
- safe retries.

Hiring red flags

Avoid candidates or agencies that say:

- the return page confirms payment,
- Paynow keys can be placed in frontend code,
- video is secure because the URL is hidden,
- staging is unnecessary,
- backups are simply the host's responsibility,
- QA can wait until after launch,
- legal consent can be one checkbox,
- ticketing can be rebuilt quickly inside the website,
- documentation is unnecessary,
- the platform should be maintainable only by their agency.
⸻
21. Ownership matrix
Workstream	Accountable owner	Responsible contributors
Business scope	Product owner	Marketing, technical lead
Architecture	Technical lead	DevOps, frontend engineer
Public website	Frontend engineer	Designer, content owner
Backend and database	Technical lead	Second engineer
Paynow	Technical lead	Paynow contact, QA
Tixx.pl	Product owner and technical lead	Tixx.pl contact, analytics owner
VOD security	Technical lead	Video specialist, security tester
Hosting	DevOps/SRE	Technical lead
UX and design	Product designer	Product owner, frontend engineer
QA acceptance	QA engineer	Product owner, engineers
Security acceptance	Independent security specialist	Technical lead, DevOps
Legal acceptance	Polish counsel	Product owner, technical lead
Content and brand	Marketing/content owner	Copy editor, designer
SEO and analytics	Marketing/analytics owner	Frontend engineer, QA
Final go-live	Product owner and technical lead	All workstream owners
⸻
22. Redesigned implementation plan without Lovable

Phase 0: Discovery, hosting audit, and decision freeze

Indicative duration: 1 week

Work

- Appoint the product owner.
- Hire or select the technical lead.
- Audit the intended hosting environment.
- Confirm the preferred TypeScript or alternative Laravel stack.
- Confirm direct Paynow API access for VOD.
- Obtain Paynow sandbox access.
- Confirm Tixx.pl deep-link, API, webhook, export, and analytics capabilities.
- Inventory the current site, URLs, VOD, images, customers, orders, and subscribers.
- Confirm legal-entity details.
- Select video, email, newsletter, monitoring, and consent platforms.
- Create a data-classification and processor inventory.
- Create the initial threat model.
- Establish GitHub, branching, code-review, and release policies.

Deliverables

- architecture decision record,
- hosting audit,
- system-of-record matrix,
- risk register,
- dependency register,
- migration-source inventory,
- confirmed project team,
- initial backlog,
- definition of done.

Exit criteria

- Hosting is technically suitable.
- Direct Paynow integration is permitted.
- Tixx.pl minimum integration is understood.
- Video platform is selected.
- Critical legal work is assigned.
- No unresolved architecture contradiction remains.

Phase 1: Product design and technical foundation

Indicative duration: 2 weeks

Product design

- user journeys,
- sitemap,
- content hierarchy,
- homepage states,
- event funnel,
- VOD catalogue,
- VOD checkout,
- account area,
- administration workflows,
- responsive wireframes,
- design tokens,
- error, empty, loading, and expiry states.

Engineering foundation

- monorepo,
- TypeScript configuration,
- linting and formatting,
- automated tests,
- container setup,
- local development environment,
- staging environment,
- database migrations,
- authentication foundation,
- logging and error monitoring,
- CI pipeline,
- secret-management method,
- basic security headers.

Exit criteria

- Mobile and desktop designs approved.
- Staging deploys automatically.
- Database migrations run repeatably.
- Architecture and threat model reviewed.
- Design system foundation is implemented.

Phase 2: Public site and CMS

Indicative duration: 2-3 weeks

Work

- homepage,
- campaign-state engine,
- event listing and event page,
- previous-editions archive,
- speaker pages or components,
- VOD catalogue and product pages,
- workshop listing and detail,
- testimonials,
- FAQ,
- contact and footer,
- CMS and administration permissions,
- scheduled publishing,
- content expiry,
- Tixx.pl link management,
- SEO metadata,
- redirects,
- preview workflow.

Exit criteria

- Marketing can manage content without code.
- Scheduled and expired content behaves correctly.
- Historical content is clearly separated.
- Event CTAs use approved Tixx.pl links.
- No payment functionality is simulated.

Phase 3: Paynow commerce and order management

Indicative duration: 2-3 weeks

Work

- product-price model,
- price history,
- orders and order items,
- payment attempts,
- Paynow payment creation,
- signed notification endpoint,
- duplicate protection,
- out-of-order state handling,
- payment status page,
- retry flow,
- refund foundation,
- consent capture,
- transactional email integration,
- reconciliation tools,
- administrator payment views.

Required tests

- successful payment,
- pending payment,
- rejected payment,
- expired payment,
- abandoned payment,
- technical error,
- retry with new payment ID,
- invalid signature,
- duplicate notification,
- delayed notification,
- browser price manipulation,
- concurrent duplicate checkout,
- duplicate email prevention.

Exit criteria

- Sandbox purchase completes.
- Only confirmed payment grants access.
- Invalid signatures do not change data.
- Duplicate events create no duplicates.
- Payment recovery works.
- Order and provider reconciliation is possible.

Phase 4: Customer account and VOD

Indicative duration: 2-3 weeks

Work

- magic-link authentication,
- profile and account area,
- order history,
- entitlement engine,
- VOD item and package mappings,
- video-provider integration,
- signed playback authorization,
- materials and private downloads,
- access expiry,
- refund and revocation behavior,
- customer support states,
- legacy-access import tooling.

Exit criteria

- Authorized customers can play purchased content.
- Unauthorized customers cannot receive playback tokens.
- Access expiry works.
- Private materials are protected.
- Existing and new customers are matched safely.
- Legacy import produces a reconciliation report.

Phase 5: Workshops, CRM, analytics, legal, and migration

Indicative duration: 2 weeks

Work

- free workshop registration,
- paid workshop checkout,
- capacity and waiting list,
- newsletter integration,
- transactional and marketing email separation,
- consent platform,
- GA4,
- GTM,
- Meta Pixel,
- UTM persistence,
- Tixx.pl click attribution,
- approved legal pages,
- digital-delivery consent,
- price-history presentation,
- structured data,
- sitemap,
- Search Console,
- content migration,
- redirect map,
- customer and subscriber migration.

Exit criteria

- Non-essential tracking remains blocked before consent.
- Legal documents are approved.
- Marketing and transactional communications are separated.
- Analytics events reconcile with backend orders.
- Redirects are tested.
- Migration reports reconcile source and destination counts.

Phase 6: Quality, security, and production readiness

Indicative duration: 2 weeks

Work

- complete functional regression,
- browser and device testing,
- accessibility audit,
- performance optimization,
- load and resilience tests,
- security review and penetration test,
- vulnerability remediation,
- backup and restore test,
- incident-response rehearsal,
- operational runbooks,
- customer-support training,
- production data migration rehearsal,
- rollback rehearsal,
- launch checklist.

Exit criteria

- No open critical or high-severity defects.
- Security findings are resolved or formally accepted.
- Backup restore succeeds.
- Monitoring and alerts work.
- Support and incident owners are assigned.
- Product owner and technical lead approve launch.

Phase 7: Launch and stabilization

Indicative duration: 1 week of focused launch support plus ongoing maintenance

Work

- final content freeze,
- final database backup,
- production deployment,
- DNS and CDN cutover,
- smoke tests,
- live Paynow verification,
- live Tixx.pl link verification,
- analytics verification,
- search-engine checks,
- error and uptime monitoring,
- daily reconciliation during stabilization,
- prioritized defect correction.

Exit criteria

- Stable error rate.
- Confirmed payment reconciliation.
- Customer login and VOD access work in production.
- No major SEO or redirect failures.
- Operational ownership transitions to maintenance mode.
⸻
23. Testing strategy

23.1 Automated test layers

- Unit tests for domain rules.
- Integration tests for database transactions.
- Contract tests for Paynow adapters.
- Contract or fixture-based tests for Tixx.pl data where available.
- API authorization tests.
- End-to-end browser tests for critical journeys.
- Accessibility checks in CI.
- Static analysis and dependency scanning.
- Migration tests against anonymized copies.

23.2 Critical end-to-end journeys

- Event visitor opens the correct Tixx.pl checkout.
- Customer buys one VOD product.
- Existing customer buys another VOD product.
- Customer retries an abandoned payment.
- Duplicate notification is received.
- Refund is processed.
- Customer logs in by magic link.
- Customer watches an authorized video.
- Customer is blocked from unauthorized video.
- Entitlement expires.
- Administrator publishes and expires a campaign.
- Workshop registration completes.
- Newsletter consent is recorded.
- Non-consenting visitor is not tracked by marketing tags.

23.3 QA ownership

The QA engineer owns the test plan and acceptance evidence. Developers own unit and integration test quality. The product owner owns business acceptance.
⸻
24. Migration plan

24.1 Migration scope

- current pages,
- previous editions,
- speaker profiles,
- VOD catalogue,
- VOD files,
- images,
- testimonials,
- legal documents,
- SEO metadata,
- legacy URLs,
- VOD customers,
- historical orders,
- entitlements,
- newsletter subscribers,
- consent evidence.

24.2 Rules

- Do not import newsletter subscribers without valid consent evidence.
- Do not reduce access promised to legacy VOD buyers.
- Do not assume current prices are future prices.
- Do not import unverified testimonials or media rights.
- Preserve important indexed URLs with redirects.
- Keep source exports and transformation scripts for audit.

24.3 Reconciliation report

For every imported entity, report:

- source count,
- imported count,
- rejected count,
- duplicate count,
- missing-data count,
- manually reviewed count,
- unresolved count.

24.4 Migration rehearsal

Perform at least one full rehearsal in staging using a recent, anonymized export. Record duration, errors, and rollback steps.
⸻
25. DevOps, operations, and maintenance

25.1 Deployment

- Infrastructure as code or fully documented configuration.
- Immutable or repeatable application images.
- Automated build and test pipeline.
- Manual production approval.
- Database migration backup and rollback process.
- Blue-green, rolling, or short controlled deployment strategy.

25.2 Backups

- Daily database backup at minimum.
- Encrypted off-site copy.
- Retention policy approved by operations and legal.
- Private file backup or provider redundancy.
- Monthly restore test during early operations, then scheduled quarterly.
- Documented recovery time and recovery point objectives.

25.3 Monitoring

Monitor:

- website uptime,
- API health,
- database health,
- Redis health,
- job queue backlog,
- payment-notification failures,
- payment reconciliation mismatch,
- login failures,
- video-token failures,
- email delivery failures,
- disk, CPU, memory, and network,
- TLS expiry,
- backup success,
- application error rate.

25.4 Incident response

Runbooks are required for:

- Paynow outage,
- Tixx.pl outage,
- video-provider outage,
- email outage,
- database failure,
- compromised administrator account,
- leaked secret,
- payment reconciliation mismatch,
- failed deployment,
- high error rate,
- data restore,
- customer-access incident.

25.5 Ongoing maintenance

Budget for:

- security patches,
- dependency updates,
- platform updates,
- monitoring review,
- backup testing,
- bug fixes,
- small content and UX improvements,
- annual security testing,
- pre-campaign load review,
- legal and processor updates.

A monthly maintenance agreement should name response targets for critical, high, medium, and low-severity incidents.
⸻
26. Acceptance criteria

The platform is not ready for production until the following are true.

Public experience

1. The site works correctly at 360 px.
2. There is no horizontal scrolling.
3. Each page has one clear primary objective.
4. Expired campaigns automatically stop displaying.
5. No false scarcity appears.
6. Historical speakers are clearly labelled.
7. All Polish copy has been reviewed.
8. Event CTAs use approved Tixx.pl links.
9. Event-ticket inventory is not duplicated locally.

Payment and orders

10. Product price is read from the server.
11. Browser manipulation cannot alter the order value.
12. Paynow secrets are never exposed to the client.
13. Invalid Paynow signatures are rejected.
14. Repeated notifications do not duplicate orders, entitlements, or emails.
15. Out-of-order notifications do not regress a final status.
16. Only CONFIRMED grants VOD access.
17. Pending, rejected, expired, abandoned, and error states do not grant access.
18. Payment retry can create a new attempt without duplicating the order.
19. The return URL never marks an order paid.
20. Refund actions are authorized and audited.

Identity and access

21. Existing customer emails are matched without duplicate accounts.
22. Customers cannot read another customer's data.
23. Unauthorized users cannot obtain a playback token.
24. Expired or revoked entitlements block playback.
25. Playback tokens expire.
26. Private files require authorization.
27. Administrator permissions are enforced server-side.
28. Sensitive administrator actions are audited.
29. Administrator MFA is enabled.

Legal and consent

30. Event, VOD, workshop, privacy, and cookie documents are approved.
31. Digital-delivery consent is explicit and recorded.
32. Marketing consent is optional and unselected.
33. Non-essential scripts remain blocked before consent.
34. Promotional prices show the required prior-price information.
35. Consent withdrawal works.

SEO and migration

36. Important legacy URLs redirect correctly.
37. Canonicals are correct.
38. Sitemap and robots configuration are valid.
39. Account, payment, and admin pages are noindex.
40. Structured data validates.
41. Legacy access is preserved according to approved rules.
42. Migration reconciliation has no unresolved critical gaps.

Quality and operations

43. Critical user journeys meet WCAG 2.2 AA targets.
44. Performance meets the defined mobile targets.
45. Automated tests pass.
46. No open critical or high-severity security findings remain.
47. Backups complete successfully.
48. A restore test succeeds.
49. Monitoring and alerts are active.
50. Rollback is documented and rehearsed.
51. A Tixx.pl outage does not block existing VOD access.
52. A Paynow outage cannot create a false paid order.
53. Production support ownership is documented.
⸻
27. Risk register
Risk	Impact	Probability	Mitigation
Direct Paynow API access is not approved	High	Medium	Confirm before payment build; retain Tixx.pl-only contingency for initial sales
Tixx.pl has no usable API or webhook	Medium	Medium-high	Launch with deep links; do not promise local ticket dashboard
Host cannot run the required stack	High	Medium	Complete host audit in Phase 0; move to managed VPS if needed
Legacy customer export is incomplete	High	Medium	Obtain exports early; reconcile; provide manual recovery process
Video re-hosting rights are unclear	High	Medium	Complete rights review before migration
Event content arrives late	High	High	Use content deadlines and placeholders in staging only
Legal approval is delayed	High	Medium	Engage counsel in Phase 0
Single-developer dependency	High	Medium	Use two engineers, code review, documentation, and shared access
Payment-state defects	High	Medium	Idempotent design, automated tests, QA, and security review
Newsletter consent evidence is missing	High	Medium	Import only records with evidence; run re-permission campaign where lawful
Performance suffers from media	Medium	Medium	CDN, optimized images, deferred video, performance budgets
Infrastructure is not maintained	High	Medium	Named DevOps owner and maintenance agreement
Administrator account compromise	High	Medium	MFA, least privilege, audit logs, rate limits, incident plan
Campaign content remains stale	Medium	Medium	Scheduled states, expiry dates, ownership, and admin warnings
Vendor outage	Medium	Medium	Graceful failure, clear status, retry, and separation of ticket and VOD services
⸻
28. Missing-information register

28.1 Hosting

- Hosting provider and plan: ?
- VPS, dedicated, shared, or cloud: ?
- Linux distribution: ?
- Root access: ?
- Docker support: ?
- PostgreSQL support: ?
- Redis support: ?
- Available CPU, RAM, disk, and bandwidth: ?
- Backup capability: ?
- Off-site backup capability: ?
- Staging environment: ?
- DNS and TLS ownership: ?
- Operations owner: ?

Confidence that the host supports the preferred architecture: Low until audited.

28.2 Next event

- Exact date: ?
- Exact venue and address: ?
- Start and end time: ?
- Capacity: ?
- Event subtitle: ?
- Confirmed speakers: ?
- Programme: ?
- Ticket categories and prices: ?
- Price-pool dates and quantities: ?
- Livestream availability: ?
- VOD included with tickets: ?
- Refund and transfer rules: ?
- Accessibility arrangements: ?
- Minimum age: ?
- Waiting-list process: ?

28.3 Paynow

- Direct merchant configuration for VOD: ?
- Sandbox API key: ?
- Sandbox signature key: ?
- Production API key: ?
- Production signature key: ?
- Enabled methods: ?
- BLIK configuration: ?
- Pay-by-link configuration: ?
- Card support: ?
- PayPo support: ?
- Refund permissions: ?
- Settlement reports: ?
- Merchant support contact: ?

28.4 Tixx.pl

- Current contract and plan: ?
- Stable deep links: ?
- API availability: ?
- Webhook availability: ?
- Order export: ?
- Refund export: ?
- Real-time inventory: ?
- Return URL: ?
- GTM or analytics support: ?
- UTM preservation: ?
- Data-processing agreement: ?

28.5 VOD

- Current video host: ?
- Master files available: ?
- Rights to re-host: ?
- Existing buyer export: ?
- Existing access promises: ?
- Access duration: ?
- Captions and transcripts: ?
- Download policy: ?
- Device or concurrent-stream limits: ?
- Refund and revocation policy: ?
- Final package contents and prices: ?

28.6 Brand and content

- Final SVG logo: ?
- Approved colors: ?
- Approved fonts and licenses: ?
- Photography permissions: ?
- Testimonial permissions: ?
- Final Polish copy: ?
- Brand voice guide: ?
- English-language future requirement: ?

28.7 Legal and finance

- Legal entity details validated: ?
- VAT treatment for tickets: ?
- VAT treatment for digital content: ?
- Invoice system: ?
- Final terms and privacy documents: ?
- Processor list: ?
- Data-retention schedule: ?
- Accessibility-law applicability: ?
- Digital-content withdrawal flow: ?

28.8 Analytics, email, and CRM

- GA4 property: ?
- GTM container: ?
- Meta Pixel: ?
- Search Console: ?
- Newsletter provider: ?
- Transactional email provider: ?
- Sending domain and DNS records: ?
- Cookie-consent platform: ?
- Current mobile share: ?
- Current conversion rate: ?
- Current average order value: ?
⸻
29. Immediate actions

Business and product

- Appoint one product owner.
- Confirm the next event facts and owners.
- Freeze the first-release scope.
- Decide whether ticket summaries inside the customer account are required for launch.
- Confirm legacy VOD access promises.

Hiring

- Hire the senior full-stack technical lead first.
- Add a frontend/product engineer for the recommended compact squad.
- Engage design, DevOps, QA, legal, and security specialists.
- Name internal content, SEO, analytics, and CRM owners.

Technical

- Audit the host.
- Create the company GitHub organization and repositories.
- Obtain Paynow sandbox credentials.
- Open the technical integration discussion with Tixx.pl.
- Select the video provider.
- Select transactional email and newsletter providers.
- Export and securely store the current site, database, customers, orders, subscribers, and media.

Current website

Until the rebuild launches:

- remove the expired May 2026 countdown,
- remove stale urgency statements,
- archive expired ticket packages,
- repair or replace the privacy-policy route,
- correct visible Polish copy defects,
- verify current payment and PayPo wording,
- clarify VOD purchase and access terms,
- preserve customer exports before any platform change.
⸻
30. Contract and handover deliverables

The development contract should require:

- source code in a company-controlled repository,
- company ownership of infrastructure accounts,
- architecture diagrams,
- database schema and migrations,
- API documentation,
- environment and deployment documentation,
- Paynow integration documentation,
- Tixx.pl integration documentation,
- threat model,
- test plan and test evidence,
- security findings and remediation evidence,
- backup and restore documentation,
- incident runbooks,
- migration scripts and reports,
- analytics specification,
- administrator guide,
- support guide,
- dependency inventory,
- license inventory,
- final production handover session,
- defined warranty period,
- optional ongoing maintenance agreement.

The agency or contractor must not be the sole owner of:

- the domain,
- DNS,
- source repository,
- hosting account,
- database account,
- Paynow account,
- Tixx.pl account,
- video account,
- email account,
- analytics accounts,
- encryption keys or secrets.
⸻
31. Final recommendation

Use the compact squad model:

- internal product owner,
- hands-on senior full-stack technical lead,
- frontend/product engineer,
- part-time UX/UI designer,
- part-time DevOps/SRE engineer,
- part-time QA engineer,
- Polish legal/privacy counsel,
- independent security tester,
- internal content/SEO/analytics owner.

Build a custom self-hosted application with a Docker-capable Linux environment, PostgreSQL, a TypeScript frontend and backend, direct Paynow integration for VOD, Tixx.pl for tickets, and a specialist secure-video provider.

Do not start implementation until these six points are resolved:

1. The intended host passes the technical audit.
2. Direct Paynow API access for VOD is confirmed.
3. The Tixx.pl integration level is confirmed.
4. The video provider and media rights are confirmed.
5. The next event's factual content is confirmed.
6. The legal checkout and migration requirements are approved.
⸻
32. Confidence assessment
Statement	Confidence
A custom self-hosted application needs a senior full-stack technical lead	High
A second engineer materially reduces delivery and continuity risk	High
Tixx.pl should remain the ticketing system of record	High
Paynow notification validation must be server-side	High
A specialist video platform is preferable for the MVP	High
The recommended TypeScript stack fits a Docker-capable Linux host	High
The user's current host supports this stack	Low until audited
Tixx.pl provides a suitable real-time API or webhook	Low until confirmed
Direct Paynow merchant access for VOD is available	Medium-low until confirmed
Existing VOD content may be re-hosted	Low until rights are checked
The compact squad can deliver in 12-16 weeks	Medium
The current mobile share exceeds 85%	Low until analytics verifies it
⸻
33. Official source references

- S1. Paynow API documentation: Paynow Developer Portal
- S2. Paynow integration and notification-signature validation: Paynow V3 Integration
- S3. Paynow payment recovery and payment identifiers: Paynow V3 Payments
- S4. Tixx.pl ticketing functions: Tixx.pl Functions
- S5. Tixx.pl integrations: Tixx.pl Integrations
- S6. OWASP Application Security Verification Standard: OWASP ASVS
- S7. Web Content Accessibility Guidelines 2.2: W3C WCAG 2.2
- S8. Current Moc Płomienia website assessed on 16 July 2026: mocplomienia.pl
⸻
Appendix A. Definition of done for each feature

A feature is complete only when:

- requirements are accepted,
- UX states are designed,
- implementation is reviewed,
- authorization is tested,
- unit and integration tests pass,
- browser tests cover the critical journey,
- accessibility is checked,
- analytics is implemented where approved,
- logging and monitoring are present,
- documentation is updated,
- staging acceptance is complete,
- no critical defect remains.
⸻
Appendix B. Suggested first engineering backlog

Epic 1: Platform foundation

- Repository and CI.
- Docker development environment.
- Staging deployment.
- PostgreSQL migrations.
- Redis and workers.
- Logging and monitoring.
- Authentication foundation.
- Role and permission framework.

Epic 2: Content and campaign CMS

- Pages.
- Modular sections.
- Events.
- Speakers.
- Previous editions.
- Campaign states.
- Scheduled publishing.
- Redirects and SEO metadata.

Epic 3: Event funnel

- Event listing.
- Event detail.
- Tixx.pl links.
- Checkout-click tracking.
- Sold-out and waiting-list state.
- Event FAQ.

Epic 4: VOD catalogue

- Products.
- Prices and price history.
- Bundles.
- VOD items.
- Materials.
- Product pages.
- Catalogue filtering.

Epic 5: Paynow commerce

- Orders.
- Order items.
- Payment attempts.
- Payment creation.
- Signed notifications.
- Status page.
- Retry.
- Refund.
- Reconciliation.

Epic 6: Customer access

- Magic links.
- Account dashboard.
- Entitlements.
- Playback authorization.
- Private materials.
- Access expiry.

Epic 7: Workshops and newsletter

- Workshop publication.
- Free registration.
- Paid registration.
- Capacity and waiting list.
- CRM integration.
- Consent records.

Epic 8: Compliance and quality

- Legal pages.
- Cookie consent.
- Analytics.
- Accessibility.
- Performance.
- Security testing.
- Migration.
- Backup and operations.
⸻
Appendix C. Go-live checklist

Business

- Current campaign approved.
- Prices approved.
- Tixx.pl offers active.
- Support contact active.
- Refund policy approved.

Content

- Polish copy approved.
- Speaker permissions approved.
- Testimonial permissions approved.
- Media rights approved.
- Legal pages published.

Technical

- Production deployment complete.
- Database migration complete.
- Paynow live credentials active.
- Paynow notification endpoint verified.
- Email domain verified.
- Video playback verified.
- Backups verified.
- Monitoring verified.
- Security headers verified.
- Admin MFA verified.

Quality

- Critical journeys pass.
- Mobile devices pass.
- Accessibility issues closed.
- Performance budgets pass.
- Security test closed.
- Redirects pass.
- Analytics events pass.

Operations

- Incident contacts confirmed.
- Support team briefed.
- Rollback ready.
- Reconciliation owner assigned.
- Launch monitoring window staffed.

