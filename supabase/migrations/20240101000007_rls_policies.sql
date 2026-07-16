-- Migration: Row-Level Security policies
-- Enables RLS on all tables and defines access policies.

-- =============================================================================
-- Enable RLS on every table
-- =============================================================================

-- Content CMS (migration 1)
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- Tixx (migration 2)
ALTER TABLE public.tixx_ticket_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.external_ticket_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_sync_runs ENABLE ROW LEVEL SECURITY;

-- Commerce (migration 3)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bundle_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- VOD (migration 4)
ALTER TABLE public.vod_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_vod_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloadable_materials ENABLE ROW LEVEL SECURITY;

-- Customer access (migration 5)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Engagement & consent (migration 6)
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_records ENABLE ROW LEVEL SECURITY;


-- =============================================================================
-- Anonymous (public) read-access for published content
-- =============================================================================

-- Helper expression for publish window checks:
--   status = 'published'
--   AND (publish_at IS NULL OR publish_at <= now())
--   AND (unpublish_at IS NULL OR unpublish_at > now())

CREATE POLICY "pages: public read published"
  ON public.pages FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

CREATE POLICY "page_sections: public read for published pages"
  ON public.page_sections FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM public.pages
      WHERE status = 'published'
        AND (publish_at IS NULL OR publish_at <= now())
        AND (unpublish_at IS NULL OR unpublish_at > now())
    )
  );

CREATE POLICY "site_settings: public read"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "events: public read published"
  ON public.events FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

CREATE POLICY "speakers: public read all"
  ON public.speakers FOR SELECT
  USING (true);

CREATE POLICY "event_speakers: public read all"
  ON public.event_speakers FOR SELECT
  USING (true);

CREATE POLICY "testimonials: public read approved"
  ON public.testimonials FOR SELECT
  USING (approval_status = 'approved');

CREATE POLICY "products: public read published"
  ON public.products FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

CREATE POLICY "product_prices: public read active"
  ON public.product_prices FOR SELECT
  USING (is_active = true);

CREATE POLICY "bundles: public read published"
  ON public.bundles FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

CREATE POLICY "bundle_products: public read all"
  ON public.bundle_products FOR SELECT
  USING (true);

CREATE POLICY "vod_items: public read all"
  ON public.vod_items FOR SELECT
  USING (true);

CREATE POLICY "product_vod_items: public read all"
  ON public.product_vod_items FOR SELECT
  USING (true);

CREATE POLICY "workshops: public read published"
  ON public.workshops FOR SELECT
  USING (
    status = 'published'
    AND (publish_at IS NULL OR publish_at <= now())
    AND (unpublish_at IS NULL OR unpublish_at > now())
  );

CREATE POLICY "tixx_ticket_links: public read all"
  ON public.tixx_ticket_links FOR SELECT
  USING (true);

CREATE POLICY "redirects: public read all"
  ON public.redirects FOR SELECT
  USING (true);


-- =============================================================================
-- Authenticated customer access (own data only)
-- =============================================================================

-- profiles: SELECT + UPDATE own row
CREATE POLICY "profiles: select own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "profiles: update own"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- orders: SELECT own
CREATE POLICY "orders: select own"
  ON public.orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- order_items: SELECT where order belongs to user
CREATE POLICY "order_items: select own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (
      SELECT id FROM public.orders WHERE user_id = auth.uid()
    )
  );

-- entitlements: SELECT own
CREATE POLICY "entitlements: select own"
  ON public.entitlements FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- playback_sessions: SELECT own
CREATE POLICY "playback_sessions: select own"
  ON public.playback_sessions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- workshop_registrations: SELECT own, INSERT own
CREATE POLICY "workshop_registrations: select own"
  ON public.workshop_registrations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "workshop_registrations: insert own"
  ON public.workshop_registrations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- newsletter_subscriptions: SELECT own (by JWT email), INSERT, UPDATE own
CREATE POLICY "newsletter_subscriptions: select own"
  ON public.newsletter_subscriptions FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "newsletter_subscriptions: insert"
  ON public.newsletter_subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "newsletter_subscriptions: update own"
  ON public.newsletter_subscriptions FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

-- downloadable_materials: SELECT if user has entitlement for the product
CREATE POLICY "downloadable_materials: select with entitlement"
  ON public.downloadable_materials FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.entitlements e
      WHERE e.user_id = auth.uid()
        AND e.product_id = downloadable_materials.product_id
        AND e.revoked_at IS NULL
        AND (e.expires_at IS NULL OR e.expires_at > now())
    )
  );

-- =============================================================================
-- Service-role-only tables (no client policies needed):
--   payment_attempts, payment_notifications, refunds, email_logs, audit_logs,
--   price_history, user_roles, consent_records, external_ticket_orders,
--   integration_sync_runs
-- RLS is enabled but no policies are defined — only service_role can access.
-- =============================================================================
