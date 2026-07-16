Moc Płomienia website rebuild
Executive recommendation
Build the new mocplomienia.pl as a split-commerce platform:
Function	Recommended system
Public website, landing pages, CMS, VOD shop, workshops	Lovable
Database, authentication, orders, VOD access rights, server functions	An owned Supabase project connected to Lovable
Live-event ticketing, ticket inventory, QR codes, ticket delivery	Tixx.pl
Event-ticket payment	Paynow through the current Tixx.pl configuration
VOD and paid workshop payment	Direct Paynow integration through secure Supabase Edge Functions
Video storage and secure playback	Mux or Cloudflare Stream
Customer VOD area	Lovable and Supabase
Transactional email	Dedicated provider such as Resend, Brevo, or Postmark; provider to be selected
Newsletter and marketing automation	Existing or new CRM; provider to be selected
Analytics	GA4, GTM, and Meta Pixel behind valid consent
Do not use Stripe or Paddle. Lovable’s native payment feature currently supports Stripe and Paddle, not Paynow. Paynow must therefore be integrated as an authenticated external API through server-side functions. Lovable supports this pattern through secure secrets and Edge Functions. 
Do not recreate ticketing inside Lovable. Tixx.pl should remain the authoritative system for event-ticket prices, inventory, ticket generation, and admission. Lovable should own the marketing experience and direct visitors to the appropriate Tixx.pl checkout.
Move VOD commerce out of the current Tixx.pl ticket flow. The present VOD checkout represents recordings as event tickets, permits quantities from 1 to 10, requests postal information, and associates recordings with a dated event. That is unnecessary friction for a digital product. 
 
⸻
 
1. Current-site assessment
1.1 Main findings
Area	Current situation	Required change
Homepage conversion state	The site still displays the 16 May 2026 event and an expired countdown	Introduce CMS-controlled event states so expired campaigns disappear automatically
Primary offer	The hero sells VOD, while the same page still contains outdated live-event packages	Separate the current event funnel from the VOD shop
Event pricing	Historical packages and pricing remain visible	Archive previous prices and retrieve current ticket offers from Tixx.pl
VOD checkout	Recordings are sold using event-ticket semantics	Create a proper digital-product checkout through Paynow
Legal pages	The main privacy-policy route currently returns a 404	Publish verified privacy, cookie, event, and digital-content terms
Payment wording	Current public terms describe bank transfer and multi-day ticket delivery	Rewrite terms for the actual Tixx.pl and Paynow flow
Privacy wording	Current Tixx.pl privacy copy refers to other payment providers	Update the processor list to reflect the actual Paynow arrangement
Content quality	Visible Polish copy contains errors such as “ODBIERZE DOSTĘP” and “zmiania”	Perform a full Polish-language editorial review
Scarcity	“Last place” and expired countdown content remain visible after the event	Permit scarcity claims only when based on verified inventory or a fixed real deadline
Customer area	No clear first-party VOD library is visible	Add passwordless login and a protected customer dashboard
Administration	Current marketing content can become stale	Add a CMS with publication dates, expiry dates, and campaign states
As of 16 July 2026, the public site still references the event beginning on 16 May 2026 and displays an expired countdown. The homepage also combines the VOD proposition with historical live and online packages, including old pricing and PayPo wording. 
The public root privacy-policy page currently returns a 404. The current Tixx.pl terms describe payment by prepayment or bank transfer and delivery within several days, while its privacy copy names Przelewy24 and PayPal. These documents require legal and operational correction before the rebuild goes live. 
1.2 Current brand positioning
The public brand proposition is based on:
* a women-focused environment,
* inner strength and transformation,
* emotional safety,
* courage,
* love,
* feminine energy,
* community and mutual support,
* premium in-person experiences,
* access to recorded practices and talks.
The visual direction should retain the existing sense of warmth, ceremony, femininity, gold, and deep contrast, while improving hierarchy, readability, consistency, and mobile conversion. The current website describes Moc Płomienia as a space of light, energy, support, courage, love, and connection between women. 
1.3 Content available for migration
Previous-edition speakers visible on the current website
The current public site lists:
* Justyna Steczkowska
* Anna Głowacz
* Maya Ori
* Julia Mikołajczyk
* Helena Orzechowska
* Sara Gronowalska
* Regina Yeromina
These people should be migrated as previous-edition content, not automatically presented as participants in the next event. 
Current VOD catalogue
The following products are publicly visible and can form the initial migration inventory.
Edition	Product	Current public legacy price
May 2026	Anna Głowacz, “Droga do miłości bezwarunkowej - do siebie”	PLN 149
May 2026	Justyna Steczkowska, “Autorska medytacja śpiewana”	PLN 149
May 2026	Helena Orzechowska, “Powrót do swojej natury - ciało jako mapa życia”	PLN 149
May 2026	Julia Mikołajczyk, “Moc głosu - DNA naszej odwagi”	PLN 149
May 2026	Maya Ori, “Od procesu do życia - co naprawdę zmienia Twoją codzienność”	PLN 149
May 2026	Complete May 2026 package	PLN 555
November 2025	Anna Głowacz, “Moc kreacji”	PLN 149
November 2025	Justyna Steczkowska, “Energia Gai”	PLN 149
November 2025	Regina Yeromina, “Ciało, energia, dusza”	PLN 149
November 2025	Sara Gronowalska, “Moc transformacji”	PLN 149
November 2025	Maya Ori, “Nowa świadomość kobiety”	PLN 149
November 2025	Complete November 2025 package	PLN 555
These prices are migration references, not approved future prices. They must be confirmed before publication. 
The marketing brief also mentions a combined “Pełna Moc” package containing both editions.
* Public confirmation: ?
* Final contents: ?
* Final price: ?
* Confidence: Low
1.4 Event information
Public information confirms previous editions in November 2025 and May 2026. The brief references a new Warsaw edition in October 2026, but the following could not be reliably confirmed publicly:
* exact date,
* exact venue,
* event start and end times,
* capacity,
* ticket categories,
* ticket prices,
* speakers,
* programme,
* online-streaming availability.
The date shown in the present Tixx.pl VOD listing should not be treated as the next live event. Recordings are currently represented through a dated digital-product listing, which creates ambiguity. 
 
⸻
 
2. Architecture decision
2.1 Options
Option	Description	Pros	Cons	Relative cost	Effort	Risk
A	Keep tickets and VOD entirely in Tixx.pl	Fastest, minimal technical change	Weak VOD experience, ticket terminology, limited customer-area control, excessive checkout fields	Low	Low	Medium-high
B, recommended	Tixx.pl for tickets; Lovable, Supabase, and direct Paynow for VOD	Best customer experience, secure first-party VOD access, clear ownership, no need to rebuild ticketing	Requires a custom Paynow integration and operational backend	Medium	Medium	Medium
C	Build tickets and VOD entirely in Lovable	Maximum control	Recreates inventory, ticket delivery, QR validation, refunds, scanning, and operational tooling	High	High	High
Tixx.pl already provides ticket management, sales, price pools, payment handling, ticket generation, customer communication, vouchers, reporting, and admission-related functions. Rebuilding those features in Lovable would add cost and operational risk without improving the core proposition. 
2.2 Recommended system ownership
Business object	Authoritative system
Event marketing page	Lovable
Event schedule, speakers, venue copy, and FAQ	Lovable CMS
Event-ticket products	Tixx.pl
Ticket tiers and ticket quantities	Tixx.pl
Ticket price	Tixx.pl
Ticket availability	Tixx.pl
Ticket payment	Paynow through Tixx.pl
Ticket generation and delivery	Tixx.pl
Ticket QR or barcode	Tixx.pl
Ticket refund and cancellation status	Tixx.pl
Admission scanning	Tixx.pl
VOD catalogue	Supabase and Lovable
VOD pricing	Supabase
VOD checkout	Lovable
VOD payment	Direct Paynow integration
VOD order status	Supabase
VOD access right	Supabase
Video asset and playback	Mux or Cloudflare Stream
Customer authentication	Supabase Auth
Customer dashboard	Lovable
Downloadable material permissions	Supabase
Newsletter contacts	Selected CRM
Marketing analytics	GA4, GTM, and Meta, subject to consent
Tixx.pl’s public integration pages do not appear to document a public Paynow integration or a public API and webhook contract. Your statement confirms that Paynow is used in the actual Tixx.pl setup, but the technical integration and data-access mechanisms remain contract-level verification items. 
2.3 Recommended domains
mocplomienia.pl
Public website, event landing pages, VOD shop, workshops, customer area

bilety.mocplomienia.pl
Tixx.pl ticket checkout and ticket management

staging.mocplomienia.pl
Non-public staging environment

Optional:
media.mocplomienia.pl
Only if required by the selected video or asset architecture
The event purchase CTA should link to the exact Tixx.pl product or ticket tier whenever Tixx.pl supports stable deep links. It should not send customers to a generic ticket catalogue when a direct purchase route is available.
2.4 Backend choice
Recommendation: an owned Supabase project connected to Lovable
Criterion	Lovable Cloud	Owned Supabase
Initial speed	Higher	Medium
Backend ownership	Platform-managed	Direct business ownership
Database visibility	Simplified	Full Supabase dashboard
Custom Paynow integration	Possible	Strong fit
Operational observability	Simpler	More control
Portability	Lower	Higher
Transactional email	Built-in options available	Separate email provider normally required
Recommendation	Viable for rapid prototype	Recommended for production
Lovable can connect to an existing Supabase project and generate database migrations, authentication, storage, and Edge Functions. Lovable also supports GitHub synchronization. Lovable Cloud is simpler initially, but switching later between Lovable Cloud and a separately owned Supabase project is not automatic, so the decision should be made before building commerce and customer access. 
Recommendation confidence: Medium-high.
The main reason is not technical fashion. It is the need to own and inspect:
* payment attempts,
* notification processing,
* customer entitlements,
* data migrations,
* audit records,
* video-access decisions,
* failed-payment recovery.
 
⸻
 
3. Target customer journeys
3.1 Event-ticket journey
Instagram / Facebook / Google
    ->
Lovable event landing page
    ->
Select ticket category
    ->
Exact Tixx.pl ticket link
    ->
Tixx.pl checkout
    ->
Paynow payment
    ->
Tixx.pl confirms order
    ->
Tixx.pl generates and sends ticket
    ->
Customer returns to Moc Płomienia confirmation page, where supported
Rules:
* Lovable must not maintain independent event-ticket inventory.
* A Lovable return page must not be treated as proof of payment.
* Ticket availability must not be described as real time unless Tixx.pl provides a verified feed.
* Ticket information should appear in the Lovable customer account only after a reliable Tixx.pl API, webhook, or scheduled export has been confirmed.
* Until such an integration exists, the customer area should link to the official Tixx.pl ticket-management route.
3.2 VOD journey
Instagram / Facebook / Google
    ->
Lovable VOD landing page
    ->
Product or package selection
    ->
Minimal checkout
    ->
Server creates order
    ->
Server creates Paynow payment
    ->
Customer completes Paynow hosted checkout
    ->
Paynow sends signed status notification
    ->
Server validates notification
    ->
Only CONFIRMED status grants access
    ->
Customer receives confirmation and magic login link
    ->
Customer watches content in the Moc Płomienia dashboard
Paynow’s current stable API is V3. Payment creation uses a server-side API request, returns a payment identifier and redirect URL, and supports an asynchronous notification URL. Paynow signs notifications, and the receiver must validate the signature before processing the status. Notifications can repeat or arrive out of sequence, so processing must be idempotent and state-aware. 
3.3 Workshop journey
Free workshop:
Workshop page
    ->
Registration form
    ->
Consent confirmation
    ->
Confirmation email
Paid workshop:
Workshop page
    ->
Minimal checkout
    ->
Direct Paynow payment
    ->
Verified payment notification
    ->
Registration confirmation
    ->
Access or attendance instructions
When no workshop is active, the module should automatically display a newsletter registration form.
 
⸻
 
4. Missing-information register
These items could not be reliably resolved from the public website. They must be closed before or during Plan mode.
4.1 Next event
Required information	Status	Importance	Owner
Exact October 2026 date	?	Critical	Business
Start and end time	?	Critical	Business
Exact venue	?	Critical	Business
Venue address	?	Critical	Business
Maximum attendance	?	Critical	Business and Tixx.pl
Event name or subtitle	?	High	Marketing
Final value proposition	?	High	Marketing
Confirmed speakers	?	Critical	Programme team
Speaker biographies and photographs	?	High	Marketing
Programme and timings	?	Critical	Programme team
Ticket categories	?	Critical	Business and Tixx.pl
Ticket prices	?	Critical	Business and finance
Price-pool dates	?	Critical	Business and Tixx.pl
Quantity per price pool	?	Critical	Business and Tixx.pl
Service fees shown at checkout	?	High	Tixx.pl
Whether livestream access will be sold	?	High	Business
Whether a post-event recording is included	?	High	Business
Meal inclusions	?	Medium	Operations
Accommodation arrangements	?	Medium	Operations
Parking and transport instructions	?	Medium	Operations
Physical accessibility details	?	High	Venue and legal
Companion or assistant policy	?	High	Operations
Minimum age	?	High	Legal
Ticket-transfer policy	?	High	Legal and Tixx.pl
Refund policy	?	Critical	Legal
Cancellation and postponement policy	?	Critical	Legal
Photography and recording policy	?	High	Legal
Waiting-list process	?	Medium	Marketing
Customer-support contact and response target	?	High	Operations
Confidence that the exact October event remains unconfirmed publicly: High.
4.2 Tixx.pl
Required information	Status	Importance
Exact current Tixx.pl contract and plan	?	High
Stable deep links to each ticket product	?	Critical
Public or partner API availability	?	Critical for account sync
Webhook availability	?	Critical for real-time sync
Webhook signature-verification method	?	Critical
Order export format	?	High
Customer export format	?	High
Refund and cancellation export	?	High
Real-time inventory endpoint	?	High
Real-time price endpoint	?	High
Return URL after payment	?	Medium
Custom confirmation-page capability	?	Medium
GTM or analytics support	?	High
Cross-domain tracking support	?	High
UTM preservation	?	High
Ability to suppress duplicate Tixx.pl marketing email	?	Medium
Ability to import legacy customer identifiers	?	Medium
GDPR processor agreement	?	Critical
Exact Paynow arrangement inside Tixx.pl	Confirmed operationally by user; technical details ?	Critical
Tixx.pl remains the ticket system of record even if API access is unavailable.
4.3 Direct Paynow integration for VOD
Required information	Status	Importance
Separate Paynow shop or point-of-sale configuration for the new website	?	Critical
Permission to use Paynow directly outside Tixx.pl	?	Critical
Sandbox API key	?	Critical
Sandbox signature key	?	Critical
Production API key	?	Critical
Production signature key	?	Critical
Merchant identifier and account owner	?	Critical
Enabled payment methods	?	High
BLIK availability	Expected, but configuration ?	High
Pay-by-link availability	?	High
Card availability	?	Medium
PayPo availability	?	Medium
Hosted checkout enabled	?	Critical
White Label approval	?	Low for MVP
Refund permissions	?	Critical
Partial-refund support in the merchant configuration	?	High
Settlement reports	?	High
Payout frequency	?	Finance
Merchant fees	?	Finance
Production notification URL	To be created	Critical
Statement descriptor	?	Medium
Support and escalation contact	?	High
For the MVP, use Paynow hosted checkout, not White Label. White Label can reduce redirects but requires more implementation, dynamic method handling, and stricter front-end responsibilities. Paynow provides a hosted redirect model and a separate White Label option. 
4.4 VOD products
Required information	Status	Importance
Current video-hosting provider	?	Critical
Original master files available	?	Critical
Rights to migrate and re-host each recording	?	Critical
Rights to publish speaker images and names	?	Critical
Rights to sell each recording individually	?	Critical
Access period for each purchase	?	Critical
Lifetime access promised to existing buyers	?	Critical
Existing customer and purchase export	?	Critical
Number of legacy buyers	?	High
Combined “Pełna Moc” package contents	?	High
Combined-package price	?	High
Individual-product prices after migration	?	High
Package prices after migration	?	High
Promotional-price policy	?	High
Captions available	?	High
Transcripts available	?	Medium
Audio-only versions available	?	Medium
PDF worksheets available	?	Medium
Download permission	?	High
Offline-access policy	?	Medium
Concurrent-stream policy	?	Medium
Device limit	?	Medium
Content expiry behaviour	?	High
Refund and access-revocation policy	?	Critical
Customer-support process for playback issues	?	High
Secure playback should use short-lived signed tokens. Both Mux and Cloudflare Stream provide signed playback mechanisms suitable for authenticated or time-limited access. 
4.5 Brand and content
Required information	Status
Final logo files in SVG and raster formats	?
Approved logo variants	?
Exact colour values	?
Approved typography	?
Webfont licences	?
Photography library	?
Photographer permissions	?
Video testimonial permissions	?
Written testimonial permissions	?
Partner-logo permissions	?
Brand voice guide	?
Approved Polish copy	?
Whether the site will remain Polish-only	?
Future English-language requirement	?
Social-media URLs	?
Press and media assets	?
Approved founder or organizer story	?
The claim that more than 85% of traffic is mobile remains unverified.
* Status: ?
* Confidence: Low
* Required evidence: GA4, Meta Ads, or current hosting analytics.
The site should still be designed mobile-first because the acquisition strategy is social-first, but the percentage should not be presented as a fact without data.
4.6 Legal and accounting
Required information	Status	Importance
Final legal entity name	Existing legacy data; must be validated	Critical
Registered address	Existing legacy data; must be validated	Critical
NIP	Existing legacy data; must be validated	Critical
REGON	Existing legacy data; must be validated	High
VAT status	?	Critical
VAT rate for event tickets	?	Critical
VAT rate for digital content	?	Critical
Invoice provider	?	High
Automatic invoice requirement	?	High
Consumer invoice fields	?	High
Event sales terms	Must be rewritten	Critical
VOD sales terms	?	Critical
Workshop terms	?	High
Privacy policy	Must be rewritten	Critical
Cookie policy	Must be rewritten	Critical
Processor list	?	Critical
Data-retention schedule	?	High
Data-processing agreements	?	Critical
Digital-content withdrawal consent	?	Critical
Immediate-delivery acknowledgement	?	Critical
Complaints process	?	Critical
Accessibility statement	?	High
Accessibility Act applicability	?	Legal review
Women-only participation language and policy	?	Legal review
International customer restrictions	?	Medium
The legacy Tixx.pl pages display the business name “Libelule Kinga Fersing,” an address in Warsaw, NIP 5242237814, and REGON 542670666. These details must be verified before migration and must not be treated as approved solely because they appear on the old site. 
For immediate delivery of paid digital content, the checkout requires explicit prior consent, acknowledgement of the resulting loss of the withdrawal right, and confirmation on a durable medium. Promotional prices also require display of the lowest price offered during the preceding 30 days. 
Marketing and analytics consent must be voluntary, informed, specific, and easy to withdraw. Non-essential tracking must not be activated through preselected boxes or a forced cookie wall. 
4.7 Analytics, CRM, and email
Required information	Status
Existing GA4 property	?
Existing Google Tag Manager container	?
Existing Meta Pixel	?
Search Console ownership	?
Current conversion rate	?
Current mobile share	?
Current paid-social acquisition cost	?
Current average order value	?
Current VOD conversion rate	?
Newsletter provider	?
Current subscriber export	?
Subscriber consent evidence	?
Transactional-email provider	?
Sending domain	?
SPF, DKIM, and DMARC configuration	?
UTM naming convention	?
Reporting dashboard owner	?
Cookie-consent platform	?
4.8 Operations and migration
Required information	Status
Target launch date	?
Approved project budget	?
Product owner	?
Technical owner	?
Content owner	?
Legal approver	?
Payment owner	?
Tixx.pl relationship owner	?
Customer-support owner	?
Incident-response owner	?
Support hours and SLA	?
DNS and domain access	?
GitHub organization	?
Supabase organization	?
Staging users	?
UAT participants	?
Backup policy	?
Restore-test process	?
Monitoring and alerting	?
Legacy URL inventory	?
Redirect map	?
Existing customer-import file	?
Existing order-import file	?
Legacy content archive decision	?
Rollback owner	?
 
⸻
 
5. Proposed sitemap
Public routes
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
Authentication and payment
/logowanie
/weryfikacja
/platnosc/status
/platnosc/blad
/wylogowanie
Customer area
/konto
/konto/nagrania
/konto/nagrania/[product-slug]
/konto/materialy
/konto/zamowienia
/konto/dane
A ticket section can be added only after Tixx.pl data synchronization is technically confirmed:
/konto/bilety
Until then, the dashboard should provide a clear external link to the official Tixx.pl ticket service.
Administration
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
 
6. Homepage campaign-state model
The homepage hero must not contain a permanently hard-coded event campaign.
State	Trigger	Hero content	Primary CTA
PRELAUNCH	Event announced, tickets not yet available	Event date or “coming soon,” key proposition, waitlist	“Dołącz do listy pierwszeństwa”
ON_SALE	At least one valid Tixx.pl offer is active	Next event, date, location, active offer	“Kup bilet”
LOW_AVAILABILITY	Only when confirmed by Tixx.pl or an authorized admin	Verified scarcity message	“Kup bilet”
SOLD_OUT	Tixx.pl confirms no availability	Sold-out message and alternative	“Dołącz do listy rezerwowej”
POST_EVENT	Event ended, VOD is being prepared	Thank-you message and VOD waitlist	“Powiadom mnie o nagraniach”
VOD_ACTIVE	VOD is available	VOD hero	“Zobacz nagrania”
NO_ACTIVE_CAMPAIGN	No event or VOD campaign	Brand proposition and newsletter	“Dołącz do społeczności”
Countdown requirements:
* use one fixed deadline,
* use server time,
* never reset by browser, cookie, or device,
* automatically expire,
* never continue after its deadline,
* be removable from the CMS,
* not imply inventory scarcity unless inventory is verified.
 
⸻
 
7. Paynow implementation specification
7.1 Recommended approach
Use Paynow V3 hosted checkout for VOD and paid workshops.
Do not:
* put Paynow keys in browser code,
* calculate the payable amount in the browser,
* trust the redirect URL as payment confirmation,
* grant access from a query parameter,
* process a notification before verifying its signature,
* assume notifications arrive once or in order.
7.2 Server functions
create-paynow-payment
paynow-notification
get-order-status
retry-paynow-payment
create-paynow-refund
issue-video-playback-token
create-paynow-payment
Responsibilities:
1. Require a valid product identifier.
2. Read the product and active price from the database.
3. Calculate the order total on the server.
4. Create an internal order.
5. Create a payment-attempt record.
6. Call Paynow V3 using server secrets.
7. Use the order UUID as the external business identifier.
8. Use a unique idempotency key for the payment-creation operation.
9. Store the returned Paynow payment identifier.
10. Return only the hosted payment URL and internal order reference to the browser.
paynow-notification
Responsibilities:
1. Read the raw HTTP request body.
2. Validate the Paynow signature using the configured signature key.
3. Reject invalid signatures.
4. Store the notification event for audit.
5. Detect duplicate notifications.
6. Locate the corresponding order and payment attempt.
7. Respect valid status transitions.
8. Ignore older out-of-sequence state changes.
9. Grant an entitlement only for CONFIRMED.
10. Send confirmation only once.
11. Return an appropriate response quickly.
12. Move slow operations to an asynchronous job where necessary.
get-order-status
Used by the customer-facing status page.
It must return the status stored in the Moc Płomienia backend, not a status passed through the browser.
retry-paynow-payment
A recovery attempt can produce a new Paynow payment identifier while retaining the same internal order reference. Each payment attempt must therefore have a separate database row.
create-paynow-refund
Admin-only function.
It must:
* validate administrator permissions,
* verify refundable value,
* use Paynow’s refund operation,
* apply idempotency,
* record the request,
* update the refund state only after confirmation,
* revoke or preserve VOD access according to the approved legal policy.
Paynow documents payment states including NEW, PENDING, CONFIRMED, REJECTED, ERROR, EXPIRED, and ABANDONED. Its payment-recovery model can create another payment identifier for the same external business order. Refund operations are also available through the API. 
7.3 Environment secrets
PAYNOW_API_KEY
PAYNOW_SIGNATURE_KEY
PAYNOW_ENVIRONMENT
PAYNOW_API_BASE_URL
PAYNOW_CONTINUE_URL
PAYNOW_NOTIFICATION_URL
These values must exist only in secure server-side secret storage.
7.4 Payment-state behaviour
Paynow state	Internal behaviour
NEW	Display “payment initiated”
PENDING	Display “payment processing”; no access
CONFIRMED	Mark paid, grant access, send confirmation
REJECTED	Mark failed; offer retry
ERROR	Mark technical failure; offer retry or support
EXPIRED	Mark expired; offer new payment attempt
ABANDONED	Mark abandoned; permit recovery
 
⸻
 
8. Data model
8.1 Content and CMS
Table	Purpose
pages	Main pages and metadata
page_sections	Modular page sections
site_settings	Brand, contact, navigation, and campaign settings
events	Event content and campaign state
speakers	Speaker profiles
event_speakers	Event-to-speaker relationship
testimonials	Written and video testimonials
redirects	SEO redirect management
8.2 Tixx.pl references
Table	Purpose
tixx_ticket_links	Maps event CTAs to official Tixx.pl products
external_ticket_orders	Optional synchronized ticket summaries, only if technically supported
integration_sync_runs	Records imports or synchronization attempts
Do not create a local ticket-inventory table unless Tixx.pl provides an authoritative synchronization contract.
8.3 VOD catalogue
Table	Purpose
products	Sellable VOD, workshop, or digital products
product_prices	Current and scheduled prices
price_history	Historical prices and 30-day-lowest-price compliance
bundles	Product packages
bundle_products	Products contained in a package
vod_items	Individual recordings or lessons
product_vod_items	Recording access by product
downloadable_materials	PDFs, worksheets, and audio files
8.4 Orders and payment
Table	Purpose
orders	Internal customer order
order_items	Products and prices purchased
payment_attempts	One row for each Paynow payment ID
payment_notifications	Signed notification audit records
refunds	Refund requests and states
Important fields:
orders
- id
- user_id
- normalized_email
- currency
- subtotal_minor
- total_minor
- status
- provider
- external_id
- created_at
- paid_at

payment_attempts
- id
- order_id
- provider
- external_payment_id
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
- payload
- provider_modified_at
- processing_status
- error_message
- received_at
- processed_at
Required uniqueness:
provider + external_payment_id
provider + idempotency_key
provider + external_event_hash
8.5 Customer and access
Table	Purpose
profiles	Customer profile
user_roles	Customer and administrator roles
entitlements	Right to access a product
playback_sessions	Short-lived video session records
email_logs	Transactional-email delivery
audit_logs	Sensitive administrative operations
8.6 Engagement and consent
Table	Purpose
workshops	Workshop listings
workshop_registrations	Free and paid registrations
newsletter_subscriptions	Subscription state
consent_records	Legal, marketing, and cookie consent evidence
8.7 Access-control rules
* Public visitors can read only published public content.
* Customers can read only their own profile, orders, entitlements, and materials.
* Customers cannot create or alter paid entitlements.
* Paynow status changes can be written only by trusted server functions.
* Administrators require an explicit role.
* Payment and audit tables are not publicly readable.
* Private files use signed URLs.
* Video tokens are created only after a server-side entitlement check.
* Service-role credentials never reach the client.
* Administrative actions are written to an immutable audit log.
 
⸻
 
9. Full Lovable master prompt
Paste this into Lovable Plan mode, not directly into Build mode.
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
The Paynow portions of this prompt reflect the official V3 payment, notification, signature, state, recovery, and refund models. The Lovable sections reflect its current external-API, Supabase, GitHub, and native-payment limitations. 
 
⸻
 
10. Implementation plan
Assumptions behind the estimate
* One experienced Lovable and full-stack implementer.
* Marketing provides copy and assets without long delays.
* Legal counsel reviews the legal flows.
* Tixx.pl ticketing is retained.
* The first release contains the current VOD catalogue rather than a large learning-management system.
* Direct Paynow API access is approved.
* No native mobile application is required.
Indicative duration: 7 to 11 weeks.
Confidence: Medium. Tixx.pl integration, legacy-customer migration, video rights, and content readiness can materially change the schedule.
Phase 0: Discovery and decision freeze
Duration: 3 to 5 business days
Work
* Confirm project ownership.
* Obtain Lovable, GitHub, Supabase, domain, Tixx.pl, Paynow, analytics, and video access.
* Confirm whether direct Paynow API use is permitted.
* Confirm Tixx.pl API, webhook, deep-link, export, and tracking capabilities.
* Inventory current pages, products, images, videos, customers, orders, and subscribers.
* Confirm legal entity data.
* Decide video and email providers.
* Create a complete redirect inventory.
Exit criteria
* Architecture signed off.
* Direct Paynow path confirmed.
* Next-event data owner assigned.
* Migration sources identified.
* Critical legal work assigned.
* No unresolved platform contradiction.
Phase 1: Information architecture and design system
Duration: 1 to 2 weeks
Work
* Sitemap.
* Wireframes.
* Homepage campaign states.
* Event funnel.
* VOD catalogue and product page.
* Customer-dashboard structure.
* Mobile navigation.
* Design tokens.
* Component library.
* Content model.
* Responsive prototype.
Exit criteria
* Mobile and desktop prototype approved.
* One clear primary conversion per page.
* Brand direction approved.
* All missing copy visibly marked.
Phase 2: Public site and CMS
Duration: 1 to 2 weeks
Work
* Supabase schema foundation.
* Public pages.
* CMS administration.
* Events and previous editions.
* Speakers.
* VOD catalogue.
* Workshops.
* Testimonials.
* FAQ.
* Contact.
* SEO metadata.
* Homepage campaign-state engine.
* Tixx.pl ticket links.
Exit criteria
* Marketing can update content without code.
* Expiry and scheduling work.
* Draft and published states work.
* No payment functionality is simulated.
Phase 3: Direct Paynow VOD commerce
Duration: 1.5 to 2.5 weeks
Work
* Orders and order items.
* Payment-attempt model.
* Paynow sandbox integration.
* Hosted checkout.
* Signed notification endpoint.
* Idempotency.
* Out-of-order event handling.
* Payment status page.
* Retry flow.
* Refund foundation.
* Transactional-email integration.
* Consent capture.
Exit criteria
* Sandbox purchase completes.
* CONFIRMED grants access once.
* Invalid signatures fail safely.
* Repeated events create no duplication.
* Failed and abandoned payments grant no access.
* Amount manipulation tests fail safely.
Phase 4: Customer account and VOD
Duration: 1.5 to 2.5 weeks
Work
* Magic-link authentication.
* Customer profiles.
* Order history.
* Entitlements.
* Video-provider integration.
* Signed playback tokens.
* Private PDF and audio materials.
* Access expiry.
* Legacy-customer import process.
* Customer-support states.
Exit criteria
* Authorized customer can watch purchased content.
* Unauthorized customer cannot.
* Access expiry works.
* Legacy import reconciles correctly.
* Video URLs are not permanently public.
Phase 5: Analytics, compliance, Tixx.pl, and migration
Duration: 1 to 2 weeks
Work
* GA4 and GTM.
* Meta Pixel.
* Consent platform.
* UTM persistence.
* Tixx.pl cross-domain tracking where supported.
* Legal pages.
* Digital-content consent.
* Price-history display.
* Structured data.
* Redirects.
* Sitemap.
* Search Console.
* Previous-edition migration.
* Customer and newsletter migration.
Exit criteria
* Marketing scripts remain blocked before consent.
* Legal documents are approved.
* Redirects are tested.
* Analytics purchase events reconcile with orders.
* Tixx.pl CTA attribution is tested where supported.
Phase 6: UAT and launch
Duration: 1 to 2 weeks
Work
* Mobile QA.
* Browser QA.
* Accessibility audit.
* Performance audit.
* Payment testing.
* Refund testing.
* Content review.
* Security review.
* Backup test.
* Rollback rehearsal.
* DNS cutover.
* Production monitoring.
Exit criteria
* Acceptance criteria pass.
* Critical and high-severity issues are closed.
* Support team has procedures.
* Monitoring and alerts are active.
* Rollback is documented.
 
⸻
 
11. Critical-path decisions
These decisions block major parts of the build.
Rank	Decision	Required before
1	Confirm direct Paynow API access for VOD	Payment development
2	Confirm owned Supabase versus Lovable Cloud	Database implementation
3	Select video provider and confirm migration rights	VOD development
4	Obtain next-event date, venue, tiers, and programme	Event-page publication
5	Confirm Tixx.pl API, export, and deep-link capabilities	Ticket-account and analytics integration
6	Approve event, VOD, privacy, cookie, and consent terms	Checkout launch
7	Obtain legacy buyer and order export	Customer migration
8	Select transactional email and newsletter providers	Customer communication
9	Validate brand assets and usage permissions	Final visual implementation
10	Approve redirect and SEO migration map	Domain cutover
 
⸻
 
12. Production acceptance criteria
Public experience
* Works from 360 px without horizontal scrolling.
* Navigation, forms, dialogs, and media are keyboard-accessible.
* Event and VOD campaigns have distinct conversion objectives.
* Expired campaigns disappear automatically.
* Countdown dates are real and server-controlled.
* No artificial urgency appears.
* Historical speakers are labelled as historical.
* All Polish copy is editorially reviewed.
Event ticketing
* Ticket links route to the correct Tixx.pl product.
* Tixx.pl remains authoritative for price and inventory.
* Lovable does not issue event tickets.
* No ticket is shown as paid without verified Tixx.pl data.
* A Tixx.pl failure does not affect existing VOD access.
VOD payment
* Product price is read from the server.
* Paynow keys remain server-side.
* Invalid signatures are rejected.
* Duplicate notifications are idempotent.
* Out-of-order notifications cannot incorrectly regress status.
* Only CONFIRMED creates entitlement.
* Retry creates a payment attempt, not a duplicate order.
* Customer return URL is never proof of payment.
* Refunds are auditable.
Access security
* Customer accounts are separated.
* Row-level security is active.
* Paid video requires entitlement.
* Playback tokens expire.
* Private files require authorization.
* Expired access is enforced.
* Administrators cannot bypass audit logging.
Legal and consent
* Separate event and VOD terms are published.
* Immediate digital-delivery consent is explicit.
* Marketing consent is optional and unchecked.
* Cookie categories are granular.
* Non-essential scripts are blocked before consent.
* Promotional prices include the required previous-price information.
* The privacy policy names the actual processors.
SEO and migration
* Important legacy URLs redirect correctly.
* Canonicals are correct.
* Sitemap and robots file are valid.
* Customer, payment, and admin pages are noindex.
* Event and Product structured data validate.
* Search Console is connected.
* No indexed VOD pseudo-event remains after migration.
Performance and accessibility
Targets should be measured at the 75th percentile on mobile:
* LCP at or below 2.5 seconds,
* INP at or below 200 milliseconds,
* CLS at or below 0.1.
The design should target WCAG 2.2 AA. The exact applicability of Poland’s accessibility legislation to the operating entity requires legal analysis, but accessibility should be treated as a product requirement regardless. 
 
⸻
 
13. Immediate corrections to the current website
These should not wait for the full rebuild:
1. Remove the expired 16 May 2026 countdown and “last place” messaging.
2. Remove or archive outdated May 2026 ticket packages.
3. Remove outdated PayPo wording unless it is still contractually active.
4. Repair the root privacy-policy 404.
5. Update Tixx.pl sales terms to describe the real payment and ticket-delivery process.
6. Update the Tixx.pl privacy processor list to reflect the actual Paynow setup.
7. Clarify or remove the 30 September 2026 pseudo-event used to sell VOD.
8. Correct visible Polish copy errors.
9. Verify testimonial consent.
10. Verify rights for every speaker photograph, recording, meditation, and downloadable file.
11. Export all legacy VOD customers before changing the sales system.
12. Preserve existing access promises during migration.
The stale campaign state, obsolete packages, broken privacy route, VOD ticket semantics, and outdated legal wording are visible on the current public properties. 
 
⸻
 
14. Confidence assessment
Finding or recommendation	Confidence
Paynow is the actual payment provider	High; confirmed by you
Tixx.pl is the current ticketing platform	High
Tixx.pl should remain the event-ticket system of record	High
VOD should move to Lovable, Supabase, and direct Paynow	High
Owned Supabase is preferable to Lovable Cloud for this implementation	Medium-high
Direct Paynow API access can be added to the merchant account	? Medium-low until confirmed
Tixx.pl provides usable API or webhook access	? Low
Tixx.pl can provide real-time inventory to Lovable	? Low
Current public VOD inventory is complete	Medium
Existing legacy prices should remain unchanged	? Low
“Pełna Moc” package is already configured	? Low
The next event is in October 2026	Medium; based on the marketing brief
Exact October 2026 date and location	? Low
More than 85% of traffic is mobile	? Low
Current legal entity details remain correct	? Medium-low
Existing customers can be exported with purchase and access history	? Medium
All current recordings may legally be re-hosted	? Low
Seven-to-eleven-week implementation estimate	Medium
The build should not enter Lovable Build mode until direct Paynow access, the backend choice, the video provider, the next-event facts, the legal checkout requirements, and the legacy-buyer migration method are resolved.

