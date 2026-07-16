-- Migration: Customer access
-- Profiles, roles, entitlements, playback sessions, email & audit logs.

-- =============================================================================
-- profiles
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- user_roles
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'customer'
                CHECK (role IN ('customer', 'admin')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

-- =============================================================================
-- entitlements
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.entitlements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  product_id     UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  order_id       UUID REFERENCES public.orders (id) ON DELETE SET NULL,
  granted_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at     TIMESTAMPTZ,
  revoked_at     TIMESTAMPTZ,
  revoked_by     UUID,
  revoke_reason  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_entitlements_user_product ON public.entitlements (user_id, product_id);

CREATE TRIGGER trg_entitlements_updated_at
  BEFORE UPDATE ON public.entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- playback_sessions
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.playback_sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  vod_item_id       UUID REFERENCES public.vod_items (id) ON DELETE SET NULL,
  token_issued_at   TIMESTAMPTZ,
  token_expires_at  TIMESTAMPTZ,
  ip_address        INET,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_playback_sessions_user_id ON public.playback_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_playback_sessions_vod_item_id ON public.playback_sessions (vod_item_id);

-- =============================================================================
-- email_logs
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  to_email             TEXT NOT NULL,
  template             TEXT NOT NULL,
  subject              TEXT,
  provider             TEXT,
  provider_message_id  TEXT,
  status               TEXT NOT NULL DEFAULT 'queued'
                         CHECK (status IN ('queued', 'sent', 'delivered', 'bounced', 'failed')),
  sent_at              TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs (status);

-- =============================================================================
-- audit_logs
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id   UUID REFERENCES auth.users (id) ON DELETE SET NULL,
  action          TEXT NOT NULL,
  resource_type   TEXT NOT NULL,
  resource_id     UUID,
  previous_value  JSONB,
  new_value       JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_admin_user_id ON public.audit_logs (admin_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs (resource_type, resource_id);
