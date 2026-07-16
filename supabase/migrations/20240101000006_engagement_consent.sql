-- Migration: Engagement & consent
-- Workshops, registrations, newsletter subscriptions, consent records.

-- =============================================================================
-- workshops
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.workshops (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL UNIQUE,
  title             TEXT NOT NULL,
  description       TEXT,
  type              TEXT NOT NULL DEFAULT 'in_person'
                      CHECK (type IN ('online', 'in_person')),
  date              TIMESTAMPTZ,
  end_date          TIMESTAMPTZ,
  venue_name        TEXT,
  venue_address     TEXT,
  max_participants  INT,
  is_paid           BOOLEAN NOT NULL DEFAULT false,
  price_minor       BIGINT,
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  publish_at        TIMESTAMPTZ,
  unpublish_at      TIMESTAMPTZ,
  cover_image       TEXT,
  seo_title         TEXT,
  meta_description  TEXT,
  og_image          TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workshops_status ON public.workshops (status);
CREATE INDEX IF NOT EXISTS idx_workshops_slug ON public.workshops (slug);

CREATE TRIGGER trg_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- workshop_registrations
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.workshop_registrations (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id    UUID NOT NULL REFERENCES public.workshops (id) ON DELETE CASCADE,
  user_id        UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  email          TEXT NOT NULL,
  name           TEXT,
  registered_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (workshop_id, email)
);

CREATE INDEX IF NOT EXISTS idx_workshop_registrations_workshop_id ON public.workshop_registrations (workshop_id);
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_user_id ON public.workshop_registrations (user_id);

-- =============================================================================
-- newsletter_subscriptions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  name              TEXT,
  status            TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at   TIMESTAMPTZ,
  source            TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_newsletter_subscriptions_updated_at
  BEFORE UPDATE ON public.newsletter_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- consent_records
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.consent_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  email         TEXT,
  consent_type  TEXT NOT NULL
                  CHECK (consent_type IN (
                    'purchase', 'digital_delivery', 'withdrawal_right',
                    'marketing', 'analytics',
                    'cookie_necessary', 'cookie_analytics', 'cookie_marketing'
                  )),
  granted       BOOLEAN NOT NULL,
  ip_address    INET,
  user_agent    TEXT,
  granted_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON public.consent_records (user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_email ON public.consent_records (email);
