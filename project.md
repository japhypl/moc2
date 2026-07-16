PROJECT

Create a production-ready new version of the Moc Płomienia website.

Primary domain:
mocplomienia.pl

Ticket domain:
bilety.mocplomienia.pl

The platform serves a Polish audience and sells:
1. Tickets for in-person events for women.
2. Paid VOD recordings.
3. VOD packages.
4. Occasional online and in-person workshops.

All user-facing website content must be in Polish.

This prompt and technical documentation are in English.


WORKING MODE

Start exclusively in Plan mode.

Do not generate implementation code before completing the plan.

Before implementation:

1. Analyze all requirements.
2. Identify contradictions, risks, and dependencies.
3. Ask no more than 15 critical questions.
4. Mark missing business information as [CONTENT REQUIRED].
5. Mark missing technical integration information as [TECHNICAL CONFIRMATION REQUIRED].
6. Mark missing legal information as [LEGAL APPROVAL REQUIRED].
7. Do not invent event dates, speakers, testimonials, prices, legal clauses, statistics, customer numbers, or scarcity claims.
8. Do not treat historical content as current-event content.
9. Do not implement the entire platform in one change.
10. Produce a staged implementation plan and stop for approval.


NON-NEGOTIABLE PLATFORM DECISIONS

There is no Stripe integration.

There is no Paddle integration.

Do not use Lovable's native Stripe or Paddle payment components.

The confirmed payment provider is Paynow from mBank / mElements.

The confirmed event-ticketing provider is Tixx.pl.

Use the following architecture:

- Lovable for the public website, customer UI, VOD shop, administration UI, and content management.
- An owned Supabase project connected to Lovable for the database, authentication, storage, Edge Functions, orders, payment attempts, and access rights.
- Tixx.pl for event-ticket products, ticket inventory, ticket payments, ticket generation, QR codes, ticket delivery, refunds, and admission operations.
- Paynow through the existing Tixx.pl setup for event-ticket payments.
- Direct Paynow API integration for VOD and paid workshops, subject to merchant and API access confirmation.
- Mux, Cloudflare Stream, or another approved secure video provider for paid VOD.
- A dedicated transactional-email provider connected through server-side functions.
- A separate newsletter or CRM provider.

Connect the source code to a company-controlled GitHub repository from the beginning.


SYSTEM-OF-RECORD RULES

Tixx.pl is authoritative for:

- event-ticket categories,
- event-ticket prices,
- ticket-tier availability,
- ticket quantities,
- ticket order status,
- ticket generation,
- QR codes or barcodes,
- refunds and cancellations,
- ticket validation.

Supabase is authoritative for:

- public content,
- VOD products,
- VOD prices,
- VOD orders,
- direct Paynow payment attempts,
- customer profiles,
- VOD entitlements,
- workshop registrations,
- downloadable materials,
- consent records,
- audit records.

The selected video provider is authoritative for:

- encoded video assets,
- playback IDs,
- video processing status,
- secure playback delivery.

Do not maintain independent event-ticket inventory in Supabase.

Do not claim real-time ticket availability unless it comes from a verified Tixx.pl integration.

Do not display synchronized Tixx.pl ticket status inside the customer account until the API, webhook, or export method has been confirmed.


KNOWN LEGACY CONTENT

The current site contains material from previous editions.

Previous-edition speakers include:

- Justyna Steczkowska
- Anna Głowacz
- Maya Ori
- Julia Mikołajczyk
- Helena Orzechowska
- Sara Gronowalska
- Regina Yeromina

Treat them as historical or VOD content unless they are explicitly confirmed for a new event.

The current public VOD catalogue contains the following legacy products.

May 2026:

- Anna Głowacz: "Droga do miłości bezwarunkowej - do siebie"
- Justyna Steczkowska: "Autorska medytacja śpiewana"
- Helena Orzechowska: "Powrót do swojej natury - ciało jako mapa życia"
- Julia Mikołajczyk: "Moc głosu - DNA naszej odwagi"
- Maya Ori: "Od procesu do życia - co naprawdę zmienia Twoją codzienność"
- Complete May 2026 package

November 2025:

- Anna Głowacz: "Moc kreacji"
- Justyna Steczkowska: "Energia Gai"
- Regina Yeromina: "Ciało, energia, dusza"
- Sara Gronowalska: "Moc transformacji"
- Maya Ori: "Nowa świadomość kobiety"
- Complete November 2025 package

Legacy public prices are PLN 149 for individual recordings and PLN 555 for edition packages.

These prices are migration references only.

Mark all prices as [BUSINESS CONFIRMATION REQUIRED] before publication.

A combined "Pełna Moc" package is mentioned in the marketing brief, but its contents and price require confirmation.


CURRENT-SITE PROBLEMS TO REMOVE

Do not reproduce the following behaviours:

- hard-coded expired event countdowns,
- expired event pricing,
- mixed event and VOD conversion objectives in one hero,
- VOD represented as an event ticket,
- quantity selection for access to the same VOD product,
- mandatory postal address for a standard digital-content purchase,
- fake or unverified scarcity,
- permanent public video links,
- generic success pages used as payment confirmation,
- outdated legal pages,
- broken privacy-policy links,
- historical speakers presented as current speakers,
- fictional testimonials,
- heavy autoplay video,
- excessive animation.


TARGET USERS

1. Guest

A guest can:

- browse public content,
- view events and previous editions,
- browse VOD,
- start a VOD purchase,
- follow a ticket link to Tixx.pl,
- register for a free workshop,
- subscribe to the newsletter.

2. Customer

A customer can:

- log in through an email magic link,
- view purchased VOD,
- play authorized recordings,
- access supplementary materials,
- view direct Paynow VOD orders,
- see access-expiry information,
- update basic personal information,
- log out.

3. Administrator

An administrator can:

- manage public pages,
- manage homepage campaign states,
- manage events and previous editions,
- manage speakers,
- manage Tixx.pl ticket links,
- manage VOD products and packages,
- manage prices and price history,
- manage video-item mappings,
- manage downloadable materials,
- manage workshops,
- manage testimonials,
- view VOD orders and Paynow attempts,
- view payment failures,
- issue approved refunds,
- grant or revoke entitlements,
- manage newsletter content states,
- view audit records,
- manage redirects and SEO metadata.


SITEMAP

Create these public routes:

- /
- /wydarzenia
- /wydarzenia/[event-slug]
- /vod
- /vod/[product-slug]
- /warsztaty
- /warsztaty/[workshop-slug]
- /poprzednie-edycje
- /poprzednie-edycje/[edition-slug]
- /o-nas
- /faq
- /kontakt
- /regulamin-wydarzen
- /regulamin-vod
- /regulamin-warsztatow
- /polityka-prywatnosci
- /polityka-cookies
- /dostepnosc

Create these authentication and payment routes:

- /logowanie
- /weryfikacja
- /platnosc/status
- /platnosc/blad
- /wylogowanie

Create these customer routes:

- /konto
- /konto/nagrania
- /konto/nagrania/[product-slug]
- /konto/materialy
- /konto/zamowienia
- /konto/dane

Create these administration routes:

- /admin
- /admin/strony
- /admin/wydarzenia
- /admin/prelegentki
- /admin/produkty
- /admin/vod
- /admin/warsztaty
- /admin/opinie
- /admin/zamowienia
- /admin/platnosci
- /admin/uzytkowniczki
- /admin/newsletter
- /admin/ustawienia
- /admin/integracje
- /admin/przekierowania
- /admin/audyt

Set authentication, payment-status, customer, and administration routes to noindex.


HOMEPAGE STATE ENGINE

The homepage hero must be controlled by a campaign state.

Support these states:

1. PRELAUNCH
   - Show the announced event.
   - Show only confirmed date and venue information.
   - Primary CTA: "Dołącz do listy pierwszeństwa".

2. ON_SALE
   - Show the active event.
   - Primary CTA links to the exact Tixx.pl ticket product.
   - Display a countdown only when tied to a real fixed deadline.

3. LOW_AVAILABILITY
   - Use only when scarcity is verified through Tixx.pl or an authorized administrator.
   - Do not invent remaining-ticket numbers.

4. SOLD_OUT
   - Disable ticket purchase.
   - Show a waiting-list CTA.

5. POST_EVENT
   - Thank participants.
   - Show VOD preparation or waitlist content.

6. VOD_ACTIVE
   - Make the VOD catalogue the primary campaign.

7. NO_ACTIVE_CAMPAIGN
   - Show the evergreen brand proposition and newsletter registration.

The countdown must:

- use one server-side date,
- never reset per browser,
- never reset per customer,
- stop after expiry,
- automatically disappear or change state,
- never imply scarcity unless that scarcity is true.


HOMEPAGE CONTENT

Build the homepage as a modular sales hub.

Recommended section order:

1. Campaign-state hero.
2. Main brand proposition.
3. Active event or VOD campaign.
4. Three clear customer benefits.
5. Active speakers or featured VOD contributors.
6. Social proof.
7. Featured VOD products.
8. Workshops.
9. Previous editions.
10. FAQ.
11. Newsletter.
12. Footer.

Use no more than one primary conversion objective above the fold.

Use video testimonials as click-to-play thumbnails.

Do not autoplay video.

Do not load large video players before interaction.


EVENT PAGE

Each live event requires a dedicated landing page.

Include:

- confirmed date,
- confirmed location,
- one clear promise,
- women-only participation statement approved by legal counsel,
- audience definition,
- benefits,
- programme,
- speakers,
- venue information,
- ticket-category presentation,
- exact Tixx.pl purchase links,
- verified testimonials,
- practical information,
- accessibility information,
- refund and transfer summary,
- FAQ,
- final CTA.

Tixx.pl remains authoritative for ticket prices and inventory.

Where real-time synchronization is unavailable:

- do not show unverified remaining capacity,
- state that final availability is confirmed in checkout,
- revalidate through Tixx.pl when the customer follows the ticket link.


VOD CATALOGUE

Support:

- individual talks,
- meditations,
- audio products,
- full-edition packages,
- multi-edition packages,
- future digital-product types.

Each product supports:

- title,
- slug,
- cover image,
- contributor,
- edition,
- short description,
- long description,
- benefit list,
- included recordings,
- total duration,
- standard price,
- promotional price,
- price-history records,
- lowest previous 30-day price,
- access duration,
- access-expiry rules,
- supplementary materials,
- publication status,
- SEO title,
- meta description,
- Open Graph image.

Do not duplicate recordings when they are included in multiple packages.

Use relationship tables between products and VOD items.


DIRECT PAYNOW CHECKOUT

Use Paynow V3 hosted checkout.

Do not use Stripe.

Do not use Paddle.

Do not use client-side Paynow secrets.

Do not calculate final prices in the browser.

The target flow is:

1. Customer opens a VOD product.
2. Customer clicks "Kupuję".
3. Customer enters a minimal checkout.
4. Customer provides email.
5. Invoice details appear only when an invoice is requested.
6. Customer accepts required purchase terms.
7. Customer separately accepts immediate digital-content delivery and acknowledges the resulting withdrawal-right consequences.
8. Marketing consent remains optional and unchecked.
9. The server reads the current product price from the database.
10. The server creates the internal order.
11. The server creates a Paynow payment.
12. The browser redirects to Paynow.
13. Paynow sends an asynchronous notification.
14. A server function verifies the Paynow signature.
15. Only a verified CONFIRMED status marks the order as paid.
16. Only a paid order creates an entitlement.
17. The customer receives a confirmation and magic login link.
18. The payment-status page reads status from the application backend.

Create these server functions:

- create-paynow-payment
- paynow-notification
- get-order-status
- retry-paynow-payment
- create-paynow-refund
- issue-video-playback-token

Paynow notification processing must:

- read the raw request body,
- verify the official signature,
- reject invalid signatures,
- record every notification,
- detect duplicates,
- support repeated delivery,
- support out-of-order delivery,
- apply valid state transitions,
- be idempotent,
- grant access only once,
- send confirmation only once.

Support these payment states:

- NEW
- PENDING
- CONFIRMED
- REJECTED
- ERROR
- EXPIRED
- ABANDONED

A payment retry can create a new external payment ID for the same internal order.

Store each payment attempt separately.

Never treat the return URL as proof of payment.


CUSTOMER AUTHENTICATION

Use passwordless email magic-link authentication.

After a confirmed VOD purchase:

- normalize the customer's email,
- locate an existing account,
- attach the order to the existing account where possible,
- create a profile if needed,
- grant the correct entitlement,
- send account-access instructions.

Do not create duplicate customer profiles for the same normalized email.

Provide clear expired-link and resend-link states.


CUSTOMER DASHBOARD

Include:

1. Moje nagrania
   - purchased products,
   - modules,
   - lessons,
   - access-expiry date,
   - secure player.

2. Materiały
   - authorized PDFs,
   - worksheets,
   - audio files.

3. Zamówienia
   - order reference,
   - product,
   - date,
   - amount,
   - payment status.

4. Dane konta
   - name,
   - email,
   - logout,
   - data-deletion instructions.

Do not show a ticket section until a reliable Tixx.pl synchronization mechanism has been confirmed.

Until then, provide a clear link to the official Tixx.pl ticket service.


VIDEO SECURITY

Use a video provider that supports signed playback.

Before issuing a playback token, verify on the server:

- the user is authenticated,
- the entitlement belongs to the user,
- the entitlement is active,
- the entitlement includes the requested VOD item,
- the access period has not expired.

Playback tokens must:

- be short-lived,
- be generated server-side,
- not be stored permanently in front-end code,
- not expose an unrestricted video URL.

Do not promise that browser video can never be copied.

The objective is access control and reduction of casual sharing, not an impossible absolute guarantee.


ADMINISTRATION

Administrators must be able to manage the site without editing code.

Provide:

- draft, published, scheduled, and archived states,
- publish and unpublish dates,
- campaign-state controls,
- expired-content warnings,
- event management,
- speaker management,
- Tixx.pl link management,
- product management,
- scheduled prices,
- price history,
- VOD mappings,
- material uploads,
- workshop management,
- testimonial approval,
- order inspection,
- payment-attempt inspection,
- failed-notification inspection,
- entitlement management,
- refund initiation,
- redirect management,
- SEO metadata,
- audit logs.

Sensitive operations must require explicit confirmation.

Record the administrator, timestamp, previous value, and new value in the audit log.


DATA MODEL

Design a relational schema including:

- profiles
- user_roles
- pages
- page_sections
- site_settings
- events
- speakers
- event_speakers
- tixx_ticket_links
- external_ticket_orders
- products
- product_prices
- price_history
- bundles
- bundle_products
- vod_items
- product_vod_items
- downloadable_materials
- orders
- order_items
- payment_attempts
- payment_notifications
- refunds
- entitlements
- playback_sessions
- workshops
- workshop_registrations
- testimonials
- newsletter_subscriptions
- consent_records
- email_logs
- redirects
- integration_sync_runs
- audit_logs

Use:

- UUID primary keys,
- foreign-key constraints,
- suitable indexes,
- unique provider identifiers,
- timestamps,
- publication states,
- soft deletion only where legally and operationally appropriate.

Store money in minor currency units.

Use PLN as the initial currency.

Create row-level security policies.

Public users can read only published public content.

Customers can read only their own data.

Payment and entitlement changes require trusted server-side operations.


DESIGN DIRECTION

The design should express:

- warm luxury,
- sisterhood,
- premium quality,
- sensuality,
- calm,
- trust,
- emotional depth,
- contemporary elegance.

Use:

- warm earth tones,
- muted gold,
- deep navy,
- off-white,
- large editorial imagery,
- generous spacing,
- restrained decorative elements.

Do not use:

- bright childish pink,
- excessive gradients,
- generic corporate imagery,
- heavy parallax,
- autoplay video,
- large decorative animations,
- poor-contrast gold text,
- excessive uppercase text.

Use the existing visual identity only as a starting reference.

Create design tokens for:

- primary background,
- secondary background,
- dark text,
- light text,
- accent gold,
- borders,
- success,
- warning,
- error,
- spacing,
- radii,
- typography.

Do not invent exact brand colour values when no approved brand guide has been provided.

Mark provisional visual values clearly.


MOBILE-FIRST UX

Design first at 360 px width.

Test at:

- 360 px
- 390 px
- 430 px
- 768 px
- 1024 px
- 1440 px

Requirements:

- no horizontal scrolling,
- primary buttons at least 48 px high,
- sufficient touch spacing,
- readable text without zooming,
- sticky CTA on mobile event and VOD pages,
- mobile-appropriate form keyboards,
- clear loading states,
- clear disabled states,
- actionable errors,
- no layout shifts when media loads,
- no modal that traps the user incorrectly.


ACCESSIBILITY

Target WCAG 2.2 AA.

Include:

- semantic HTML,
- keyboard navigation,
- visible focus,
- accessible navigation,
- correct heading hierarchy,
- form labels,
- field-level errors,
- error summaries where appropriate,
- sufficient contrast,
- reduced-motion support,
- alt text,
- captions or transcripts when provided,
- accessible dialogs,
- accessible accordions,
- accessible authentication,
- no information communicated only by colour.


PERFORMANCE

Target the 75th percentile on mobile:

- LCP no greater than 2.5 seconds,
- INP no greater than 200 milliseconds,
- CLS no greater than 0.1.

Use:

- responsive images,
- AVIF or WebP where supported,
- explicit image dimensions,
- lazy loading,
- optimized fonts,
- code splitting,
- deferred non-critical scripts,
- deferred video players,
- limited third-party scripts,
- no heavy hero animation.


SEO

For every public page provide:

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

- sitemap.xml,
- robots.txt,
- custom 404 page,
- redirect management,
- breadcrumbs,
- Event structured data,
- Product structured data,
- Organization structured data,
- BreadcrumbList structured data,
- FAQ structured data only when compliant with search-engine requirements.

Create a migration redirect map before launch.

Do not change indexed URLs without a redirect.


ANALYTICS AND CONSENT

Prepare:

- GA4,
- Google Tag Manager,
- Meta Pixel,
- UTM attribution,
- consent-mode-compatible implementation.

Do not activate non-essential analytics or marketing scripts before consent.

Track:

- view_event
- select_ticket
- ticket_checkout_click
- view_item
- select_item
- begin_checkout
- payment_redirect
- purchase
- payment_failed
- payment_abandoned
- login
- magic_link_requested
- vod_play_started
- vod_play_completed
- workshop_signup
- newsletter_signup

Do not send sensitive personal information to analytics tools.

Preserve attribution when linking to Tixx.pl where technically supported.


LEGAL REQUIREMENTS

Create separate legal structures for:

- event tickets,
- VOD and digital content,
- workshops,
- privacy,
- cookies.

Do not write final legal text without legal approval.

For immediately delivered digital content:

- require explicit consent to begin delivery,
- require acknowledgement of the applicable withdrawal-right consequence,
- store evidence of consent,
- repeat the confirmation in a durable email.

For promotional pricing:

- store price history,
- show the legally required previous-price reference.

Marketing consent must:

- be optional,
- remain unchecked,
- not be bundled with purchase consent.

Cookie consent must:

- block non-essential scripts before consent,
- permit granular selection,
- be easy to withdraw.


EMAILS

Prepare transactional templates for:

- VOD order received,
- payment pending,
- payment confirmed,
- payment failed,
- payment expired,
- payment abandoned,
- magic login link,
- VOD access granted,
- refund initiated,
- refund completed,
- workshop registration,
- event or workshop update.

Emails must:

- use the brand domain,
- have a plain-text version,
- include one clear CTA,
- include support contact details,
- not contain permanent video URLs,
- not expose sensitive payment data.


MIGRATION

Create a migration plan covering:

- current pages,
- current VOD catalogue,
- previous editions,
- previous speakers,
- testimonials,
- images,
- videos,
- legal content,
- SEO metadata,
- redirects,
- existing VOD customers,
- existing order history,
- newsletter subscribers.

Do not import newsletter subscribers without evidence of valid consent.

Do not revoke access promised to legacy VOD buyers.

Provide reconciliation reports:

- source record count,
- imported record count,
- rejected record count,
- duplicate count,
- missing-data count.


ACCEPTANCE TESTING

The platform is not ready for production until:

1. It works correctly at 360 px.
2. It has no horizontal scrolling.
3. Expired campaigns automatically stop displaying.
4. No false scarcity appears.
5. Ticket CTAs use approved Tixx.pl links.
6. Event-ticket inventory is not duplicated locally.
7. VOD prices are calculated on the server.
8. Browser price manipulation cannot alter an order.
9. Paynow secrets are never exposed.
10. Invalid Paynow signatures are rejected.
11. Repeated notifications do not duplicate access.
12. Out-of-order notifications do not regress a final status.
13. Only CONFIRMED grants VOD access.
14. Pending, rejected, expired, abandoned, and failed payments do not grant access.
15. Payment retry can create a new payment attempt without duplicating the order.
16. The return URL never marks payment as paid.
17. Existing customer emails are matched without creating duplicate accounts.
18. Unauthorized users cannot play paid video.
19. Expired entitlements prevent playback.
20. Playback tokens expire.
21. Private files require authorization.
22. Refund behaviour follows the approved policy.
23. Marketing consent remains optional.
24. Non-essential scripts remain blocked before consent.
25. Promotional prices show required price-history information.
26. Critical journeys meet WCAG 2.2 AA.
27. Core Web Vitals meet the defined targets.
28. Account and administration pages are noindex.
29. Redirects preserve important legacy URLs.
30. No fictional speaker, testimonial, date, price, statistic, or scarcity claim appears.
31. Administrator permissions are enforced server-side.
32. Sensitive administrator actions are audited.
33. A Tixx.pl outage does not block existing VOD access.
34. A Paynow outage cannot create a false paid order.
35. Backup and rollback procedures are documented and tested.


PLAN MODE OUTPUT

Before building, produce:

1. Confirmed requirements.
2. Assumptions.
3. Missing information.
4. Architecture diagram.
5. System-of-record matrix.
6. Sitemap.
7. User journeys.
8. Homepage state model.
9. Database schema.
10. Row-level security design.
11. Paynow sequence diagram.
12. Tixx.pl integration options.
13. Video-security architecture.
14. Content-migration plan.
15. Analytics and consent plan.
16. Legal dependency list.
17. Risk register.
18. Test strategy.
19. Implementation plan divided into no more than seven phases.
20. Go-live and rollback plan.

Stop after presenting the plan.

Wait for explicit approval before entering Build mode.

