-- Migration: VOD catalogue
-- Products, pricing, bundles, VOD items, and downloadable materials.

-- =============================================================================
-- products
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    TEXT NOT NULL UNIQUE,
  title                   TEXT NOT NULL,
  type                    TEXT NOT NULL
                            CHECK (type IN (
                              'vod_single','vod_package','meditation',
                              'audio','workshop','digital'
                            )),
  cover_image             TEXT,
  contributor             TEXT,
  edition                 TEXT,
  short_description       TEXT,
  long_description        TEXT,
  benefit_list            TEXT[],
  total_duration_seconds  INT,
  access_duration_days    INT,
  status                  TEXT NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','published','scheduled','archived')),
  publish_at              TIMESTAMPTZ,
  unpublish_at            TIMESTAMPTZ,
  seo_title               TEXT,
  meta_description        TEXT,
  og_image                TEXT,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_status ON public.products (status);
CREATE INDEX IF NOT EXISTS idx_products_type ON public.products (type);

CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- product_prices
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.product_prices (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id              UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  price_minor             BIGINT NOT NULL,
  promotional_price_minor BIGINT,
  promotional_start       TIMESTAMPTZ,
  promotional_end         TIMESTAMPTZ,
  currency                TEXT NOT NULL DEFAULT 'PLN',
  is_active               BOOLEAN NOT NULL DEFAULT true,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_prices_product_active
  ON public.product_prices (product_id, is_active);

CREATE TRIGGER trg_product_prices_updated_at
  BEFORE UPDATE ON public.product_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- price_history
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.price_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  price_minor BIGINT NOT NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  changed_by  UUID
);

CREATE INDEX IF NOT EXISTS idx_price_history_product_changed
  ON public.price_history (product_id, changed_at);

-- =============================================================================
-- bundles
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bundles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  status      TEXT NOT NULL DEFAULT 'draft'
                CHECK (status IN ('draft','published','scheduled','archived')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bundles_status ON public.bundles (status);

CREATE TRIGGER trg_bundles_updated_at
  BEFORE UPDATE ON public.bundles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- bundle_products (junction)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.bundle_products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle_id   UUID NOT NULL REFERENCES public.bundles (id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (bundle_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_bundle_products_bundle_id ON public.bundle_products (bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_products_product_id ON public.bundle_products (product_id);

-- =============================================================================
-- vod_items
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.vod_items (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title             TEXT NOT NULL,
  slug              TEXT NOT NULL UNIQUE,
  video_provider    TEXT,
  video_provider_id TEXT,
  duration_seconds  INT,
  thumbnail_url     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_vod_items_updated_at
  BEFORE UPDATE ON public.vod_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =============================================================================
-- product_vod_items (junction)
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.product_vod_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  vod_item_id UUID NOT NULL REFERENCES public.vod_items (id) ON DELETE CASCADE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, vod_item_id)
);

CREATE INDEX IF NOT EXISTS idx_product_vod_items_product_id ON public.product_vod_items (product_id);
CREATE INDEX IF NOT EXISTS idx_product_vod_items_vod_item_id ON public.product_vod_items (vod_item_id);

-- =============================================================================
-- downloadable_materials
-- =============================================================================
CREATE TABLE IF NOT EXISTS public.downloadable_materials (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID NOT NULL REFERENCES public.products (id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  file_path       TEXT,
  file_type       TEXT,
  file_size_bytes BIGINT,
  sort_order      INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_downloadable_materials_product_id
  ON public.downloadable_materials (product_id);

CREATE TRIGGER trg_downloadable_materials_updated_at
  BEFORE UPDATE ON public.downloadable_materials
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
