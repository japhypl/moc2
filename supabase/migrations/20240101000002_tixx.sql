-- Migration: Tixx integration
-- Ticket links, external order sync, and integration run tracking.

-- =============================================================================
-- tixx_ticket_links
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.tixx_ticket_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id    UUID NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  url         TEXT NOT NULL,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tixx_ticket_links_event_id ON public.tixx_ticket_links (event_id);

CREATE TRIGGER trg_tixx_ticket_links_updated_at
  BEFORE UPDATE ON public.tixx_ticket_links
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- external_ticket_orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.external_ticket_orders (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id           UUID NOT NULL REFERENCES public.events (id) ON DELETE CASCADE,
  external_order_id  TEXT NOT NULL UNIQUE,
  buyer_email        TEXT,
  status             TEXT,
  synced_at          TIMESTAMPTZ,
  raw_data           JSONB,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_external_ticket_orders_event_id ON public.external_ticket_orders (event_id);
CREATE INDEX IF NOT EXISTS idx_external_ticket_orders_buyer_email ON public.external_ticket_orders (buyer_email);

CREATE TRIGGER trg_external_ticket_orders_updated_at
  BEFORE UPDATE ON public.external_ticket_orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- integration_sync_runs
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.integration_sync_runs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider          TEXT NOT NULL DEFAULT 'tixx',
  direction         TEXT,
  status            TEXT NOT NULL
                      CHECK (status IN ('running','success','failed')),
  records_total     INT,
  records_imported  INT,
  records_rejected  INT,
  error_message     TEXT,
  started_at        TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_integration_sync_runs_provider ON public.integration_sync_runs (provider);
CREATE INDEX IF NOT EXISTS idx_integration_sync_runs_status ON public.integration_sync_runs (status);
