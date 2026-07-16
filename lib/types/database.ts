// Types matching the Supabase schema. Regenerate with `npx supabase gen types typescript`
// once the DB is running — these are hand-written to match the migrations.

export type ContentStatus = "draft" | "published" | "scheduled" | "archived";

export type CampaignState =
  | "PRELAUNCH"
  | "ON_SALE"
  | "LOW_AVAILABILITY"
  | "SOLD_OUT"
  | "POST_EVENT"
  | "VOD_ACTIVE"
  | "NO_ACTIVE_CAMPAIGN";

export type ProductType =
  | "vod_single"
  | "vod_package"
  | "meditation"
  | "audio"
  | "workshop"
  | "digital";

export type PaymentStatus =
  | "NEW"
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "ERROR"
  | "EXPIRED"
  | "ABANDONED";

export type OrderStatus =
  | "new"
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "abandoned"
  | "refunded";

export type RefundStatus = "requested" | "processing" | "completed" | "failed";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type UserRole = "customer" | "admin";
export type EmailStatus = "queued" | "sent" | "delivered" | "bounced" | "failed";
export type WorkshopType = "online" | "in_person";
export type SubscriptionStatus = "active" | "unsubscribed";

export type ConsentType =
  | "purchase"
  | "digital_delivery"
  | "withdrawal_right"
  | "marketing"
  | "analytics"
  | "cookie_necessary"
  | "cookie_analytics"
  | "cookie_marketing";

// ---------------------------------------------------------------------------
// Content & CMS
// ---------------------------------------------------------------------------

export interface Page {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  status: ContentStatus;
  publish_at: string | null;
  unpublish_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageSection {
  id: string;
  page_id: string;
  section_type: string;
  title: string | null;
  content: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSettings {
  id: string;
  campaign_state: CampaignState;
  countdown_deadline: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_youtube: string | null;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  date: string | null;
  end_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_city: string | null;
  status: ContentStatus;
  campaign_state: CampaignState | null;
  cover_image: string | null;
  programme: string | null;
  benefits: string | null;
  accessibility_info: string | null;
  refund_info: string | null;
  faq: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  publish_at: string | null;
  unpublish_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Speaker {
  id: string;
  name: string;
  slug: string;
  bio: string | null;
  photo: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventSpeaker {
  id: string;
  event_id: string;
  speaker_id: string;
  sort_order: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string | null;
  photo: string | null;
  video_url: string | null;
  approval_status: ApprovalStatus;
  event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Redirect {
  id: string;
  source_path: string;
  target_path: string;
  status_code: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Tixx.pl
// ---------------------------------------------------------------------------

export interface TixxTicketLink {
  id: string;
  event_id: string;
  label: string;
  url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExternalTicketOrder {
  id: string;
  event_id: string;
  external_order_id: string;
  buyer_email: string | null;
  status: string | null;
  synced_at: string | null;
  raw_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationSyncRun {
  id: string;
  provider: string;
  direction: string | null;
  status: "running" | "success" | "failed";
  records_total: number | null;
  records_imported: number | null;
  records_rejected: number | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// VOD Catalogue
// ---------------------------------------------------------------------------

export interface Product {
  id: string;
  slug: string;
  title: string;
  type: ProductType;
  cover_image: string | null;
  contributor: string | null;
  edition: string | null;
  short_description: string | null;
  long_description: string | null;
  benefit_list: string[] | null;
  total_duration_seconds: number | null;
  access_duration_days: number | null;
  status: ContentStatus;
  publish_at: string | null;
  unpublish_at: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductPrice {
  id: string;
  product_id: string;
  price_minor: number;
  promotional_price_minor: number | null;
  promotional_start: string | null;
  promotional_end: string | null;
  currency: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  price_minor: number;
  changed_at: string;
  changed_by: string | null;
}

export interface Bundle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface BundleProduct {
  id: string;
  bundle_id: string;
  product_id: string;
  sort_order: number;
  created_at: string;
}

export interface VodItem {
  id: string;
  title: string;
  slug: string;
  video_provider: string | null;
  video_provider_id: string | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProductVodItem {
  id: string;
  product_id: string;
  vod_item_id: string;
  sort_order: number;
  created_at: string;
}

export interface DownloadableMaterial {
  id: string;
  product_id: string;
  title: string;
  file_path: string;
  file_type: string | null;
  file_size_bytes: number | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Orders & Payments
// ---------------------------------------------------------------------------

export interface Order {
  id: string;
  user_id: string | null;
  normalized_email: string;
  currency: string;
  subtotal_minor: number;
  total_minor: number;
  status: OrderStatus;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_minor: number;
  total_minor: number;
  product_title: string | null;
  created_at: string;
}

export interface PaymentAttempt {
  id: string;
  order_id: string;
  provider: string;
  external_payment_id: string | null;
  status: PaymentStatus;
  amount_minor: number;
  idempotency_key: string;
  redirect_url: string | null;
  provider_modified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentNotification {
  id: string;
  provider: string;
  external_event_hash: string;
  external_payment_id: string;
  signature_valid: boolean;
  payload: Record<string, unknown>;
  provider_modified_at: string | null;
  processing_status: string;
  error_message: string | null;
  received_at: string;
  processed_at: string | null;
  created_at: string;
}

export interface Refund {
  id: string;
  order_id: string;
  payment_attempt_id: string;
  amount_minor: number;
  reason: string | null;
  status: RefundStatus;
  external_refund_id: string | null;
  requested_by: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Customer & Access
// ---------------------------------------------------------------------------

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  order_id: string | null;
  granted_at: string;
  expires_at: string | null;
  revoked_at: string | null;
  revoked_by: string | null;
  revoke_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaybackSession {
  id: string;
  user_id: string;
  vod_item_id: string;
  token_issued_at: string | null;
  token_expires_at: string | null;
  ip_address: string | null;
  created_at: string;
}

export interface EmailLog {
  id: string;
  user_id: string | null;
  to_email: string;
  template: string;
  subject: string | null;
  provider: string | null;
  provider_message_id: string | null;
  status: EmailStatus;
  sent_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_user_id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  previous_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Engagement & Consent
// ---------------------------------------------------------------------------

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  type: WorkshopType;
  date: string | null;
  end_date: string | null;
  venue_name: string | null;
  venue_address: string | null;
  max_participants: number | null;
  is_paid: boolean;
  price_minor: number | null;
  status: ContentStatus;
  publish_at: string | null;
  unpublish_at: string | null;
  cover_image: string | null;
  seo_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkshopRegistration {
  id: string;
  workshop_id: string;
  user_id: string | null;
  email: string;
  name: string | null;
  registered_at: string;
  cancelled_at: string | null;
  created_at: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  name: string | null;
  status: SubscriptionStatus;
  subscribed_at: string;
  unsubscribed_at: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: string;
  user_id: string | null;
  email: string | null;
  consent_type: ConsentType;
  granted: boolean;
  ip_address: string | null;
  user_agent: string | null;
  granted_at: string;
  revoked_at: string | null;
  created_at: string;
}
