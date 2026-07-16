-- Migration: Seed data
-- Insert default configuration values.

-- =============================================================================
-- Default site settings
-- =============================================================================
INSERT INTO public.site_settings (campaign_state, contact_email)
VALUES ('NO_ACTIVE_CAMPAIGN', 'kontakt@mocplomienia.pl')
ON CONFLICT DO NOTHING;
