-- Migration: Orders & payments
-- Orders, order items, payment attempts, notifications, and refunds.

-- =============================================================================
-- orders
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  normalized_email  TEXT NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'PLN',
  subtotal_minor    BIGINT NOT NULL,
  total_minor       BIGINT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'new',
  paid_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_normalized_email ON public.orders (normalized_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- order_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id         UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  product_id       UUID NOT NULL REFERENCES public.products (id) ON DELETE RESTRICT,
  quantity         INT NOT NULL DEFAULT 1,
  unit_price_minor BIGINT NOT NULL,
  total_minor      BIGINT NOT NULL,
  product_title    TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items (product_id);

-- =============================================================================
-- payment_attempts
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payment_attempts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  provider              TEXT NOT NULL DEFAULT 'paynow',
  external_payment_id   TEXT,
  status                TEXT NOT NULL DEFAULT 'NEW',
  amount_minor          BIGINT NOT NULL,
  idempotency_key       TEXT NOT NULL UNIQUE,
  redirect_url          TEXT,
  provider_modified_at  TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, external_payment_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_attempts_order_id ON public.payment_attempts (order_id);

CREATE TRIGGER trg_payment_attempts_updated_at
  BEFORE UPDATE ON public.payment_attempts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- payment_notifications
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.payment_notifications (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider              TEXT NOT NULL,
  external_event_hash   TEXT NOT NULL UNIQUE,
  external_payment_id   TEXT NOT NULL,
  signature_valid       BOOLEAN NOT NULL,
  payload               JSONB NOT NULL,
  provider_modified_at  TIMESTAMPTZ,
  processing_status     TEXT NOT NULL DEFAULT 'pending',
  error_message         TEXT,
  received_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_notifications_external_payment_id
  ON public.payment_notifications (external_payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_notifications_processing_status
  ON public.payment_notifications (processing_status);

-- =============================================================================
-- refunds
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.refunds (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id            UUID NOT NULL REFERENCES public.orders (id) ON DELETE CASCADE,
  payment_attempt_id  UUID NOT NULL REFERENCES public.payment_attempts (id) ON DELETE RESTRICT,
  amount_minor        BIGINT NOT NULL,
  reason              TEXT,
  status              TEXT NOT NULL DEFAULT 'requested'
                        CHECK (status IN ('requested','processing','completed','failed')),
  external_refund_id  TEXT,
  requested_by        UUID,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refunds_order_id ON public.refunds (order_id);
CREATE INDEX IF NOT EXISTS idx_refunds_payment_attempt_id ON public.refunds (payment_attempt_id);

CREATE TRIGGER trg_refunds_updated_at
  BEFORE UPDATE ON public.refunds
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
