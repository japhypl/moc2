-- Migration: Content CMS
-- Creates core content management tables: pages, sections, site settings,
-- events, speakers, testimonials, redirects.

-- =============================================================================
-- Trigger function: auto-update updated_at on row modification
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- pages
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.pages (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT NOT NULL UNIQUE,
  title          TEXT NOT NULL,
  content        TEXT,
  status         TEXT NOT NULL DEFAULT 'draft'
                   CHECK (status IN ('draft','published','scheduled','archived')),
  publish_at     TIMESTAMPTZ,
  unpublish_at   TIMESTAMPTZ,
  seo_title      TEXT,
  meta_description TEXT,
  og_image       TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pages_status ON public.pages (status);

CREATE TRIGGER trg_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- page_sections
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.page_sections (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id        UUID NOT NULL REFERENCES public.pages (id) ON DELETE CASCADE,
  section_type   TEXT,
  title          TEXT,
  content        TEXT,
  sort_order     INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_page_sections_page_id ON public.page_sections (page_id);

CREATE TRIGGER trg_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- site_settings
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_state      TEXT
                        CHECK (campaign_state IN (
                          'PRELAUNCH','ON_SALE','LOW_AVAILABILITY','SOLD_OUT',
                          'POST_EVENT','VOD_ACTIVE','NO_ACTIVE_CAMPAIGN'
                        )),
  countdown_deadline  TIMESTAMPTZ,
  contact_email       TEXT,
  contact_phone       TEXT,
  social_facebook     TEXT,
  social_instagram    TEXT,
  social_youtube      TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- events
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                TEXT NOT NULL UNIQUE,
  title               TEXT NOT NULL,
  description         TEXT,
  date                TIMESTAMPTZ,
  end_date            TIMESTAMPTZ,
  venue_name          TEXT,
  venue_address       TEXT,
  venue_city          TEXT,
  status              TEXT NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','published','scheduled','archived')),
  campaign_state      TEXT
                        CHECK (campaign_state IN (
                          'PRELAUNCH','ON_SALE','LOW_AVAILABILITY','SOLD_OUT',
                          'POST_EVENT','VOD_ACTIVE','NO_ACTIVE_CAMPAIGN'
                        )),
  cover_image         TEXT,
  programme           TEXT,
  benefits            TEXT,
  accessibility_info  TEXT,
  refund_info         TEXT,
  faq                 TEXT,
  seo_title           TEXT,
  meta_description    TEXT,
  og_image            TEXT,
  publish_at          TIMESTAMPTZ,
  unpublish_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_status ON public.events (status);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events (date);

CREATE TRIGGER trg_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- speakers
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.speakers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  bio         TEXT,
  photo       TEXT,
  website     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_speakers_updated_at
  BEFORE UPDATE ON public.speakers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- event_speakers (junction)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.event_speakers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  speaker_id  UUID NOT NULL REFERENCES public.speakers (id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, speaker_id)
);

CREATE INDEX IF NOT EXISTS idx_event_speakers_event_id ON public.event_speakers (event_id);
CREATE INDEX IF NOT EXISTS idx_event_speakers_speaker_id ON public.event_speakers (speaker_id);

-- =============================================================================
-- testimonials
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.testimonials (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote            TEXT NOT NULL,
  author           TEXT NOT NULL,
  role             TEXT,
  photo            TEXT,
  video_url        TEXT,
  approval_status  TEXT NOT NULL DEFAULT 'pending'
                     CHECK (approval_status IN ('pending','approved','rejected')),
  event_id         UUID REFERENCES public.events (id) ON DELETE SET NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_approval_status ON public.testimonials (approval_status);
CREATE INDEX IF NOT EXISTS idx_testimonials_event_id ON public.testimonials (event_id);

CREATE TRIGGER trg_testimonials_updated_at
  BEFORE UPDATE ON public.testimonials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- redirects
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.redirects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path  TEXT NOT NULL UNIQUE,
  target_path  TEXT NOT NULL,
  status_code  INT NOT NULL DEFAULT 301,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_redirects_updated_at
  BEFORE UPDATE ON public.redirects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
