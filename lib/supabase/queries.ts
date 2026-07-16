import { createClient } from "./server";
import type {
  SiteSettings,
  Event,
  Speaker,
  Product,
  ProductPrice,
  Testimonial,
  Workshop,
  Page,
  PageSection,
  TixxTicketLink,
  VodItem,
  Redirect,
  Profile,
} from "@/lib/types/database";


export async function getSiteSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();
  return data;
}

export async function getPublishedEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: false });
  return data ?? [];
}

export async function getArchivedEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("status", "archived")
    .order("date", { ascending: false });
  return data ?? [];
}

export async function getEventBySlug(
  slug: string,
): Promise<(Event & { speakers: Speaker[]; tixx_links: TixxTicketLink[] }) | null> {
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) return null;

  const [{ data: eventSpeakers }, { data: tixxLinks }] = await Promise.all([
    supabase
      .from("event_speakers")
      .select("speaker_id, sort_order, speakers(*)")
      .eq("event_id", event.id)
      .order("sort_order"),
    supabase
      .from("tixx_ticket_links")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order"),
  ]);

  return {
    ...event,
    speakers: (eventSpeakers ?? []).map((es: Record<string, unknown>) => es.speakers) as Speaker[],
    tixx_links: tixxLinks ?? [],
  };
}

export async function getPublishedProducts(): Promise<
  (Product & { active_price: ProductPrice | null })[]
> {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, product_prices(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (products ?? []).map((p) => {
    const rec = p as unknown as Record<string, unknown> & { product_prices?: ProductPrice[] };
    const activePrice = rec.product_prices?.find((pp) => pp.is_active) ?? null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { product_prices, ...product } = p as unknown as Product & { product_prices?: ProductPrice[] };
    return { ...product, active_price: activePrice };
  });
}

export async function getProductBySlug(slug: string): Promise<
  | (Product & {
      active_price: ProductPrice | null;
      vod_items: VodItem[];
      lowest_30_day_price: number | null;
    })
  | null
> {
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_prices(*)")
    .eq("slug", slug)
    .single();

  if (!product) return null;

  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000,
  ).toISOString();

  const [{ data: vodItemJoins }, { data: priceHistory }] = await Promise.all([
    supabase
      .from("product_vod_items")
      .select("sort_order, vod_items(*)")
      .eq("product_id", product.id)
      .order("sort_order"),
    supabase
      .from("price_history")
      .select("price_minor")
      .eq("product_id", product.id)
      .gte("changed_at", thirtyDaysAgo)
      .order("price_minor", { ascending: true })
      .limit(1),
  ]);

  const typed = product as unknown as Product & { product_prices?: ProductPrice[] };
  const activePrice = typed.product_prices?.find((pp) => pp.is_active) ?? null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { product_prices, ...rest } = typed;

  return {
    ...rest,
    active_price: activePrice,
    vod_items: (vodItemJoins ?? []).map((j) => (j as unknown as Record<string, unknown>).vod_items) as VodItem[],
    lowest_30_day_price: priceHistory?.[0]?.price_minor ?? null,
  };
}

export async function getPublishedWorkshops(): Promise<Workshop[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workshops")
    .select("*")
    .eq("status", "published")
    .order("date", { ascending: true });
  return data ?? [];
}

export async function getWorkshopBySlug(
  slug: string,
): Promise<Workshop | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("workshops")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getSpeakers(): Promise<Speaker[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("speakers")
    .select("*")
    .order("name");
  return data ?? [];
}

export async function getPageBySlug(
  slug: string,
): Promise<(Page & { sections: PageSection[] }) | null> {
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!page) return null;

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .order("sort_order");

  return { ...page, sections: sections ?? [] };
}

export async function getFaqSections(): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_sections")
    .select("*, pages!inner(slug)")
    .eq("section_type", "faq")
    .order("sort_order");
  return data ?? [];
}

export async function getRedirects(): Promise<Redirect[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("redirects").select("*");
  return data ?? [];
}

export async function getUserProfileById(
  userId: string,
): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return data;
}

export async function getUserEntitlements(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entitlements")
    .select("*, products(id, title, slug, cover_image, type)")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .order("granted_at", { ascending: false });
  return data ?? [];
}

export async function getUserOrders(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select(
      "*, order_items(id, product_title, quantity, unit_price_minor, total_minor)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUserEntitlementForProduct(
  userId: string,
  productSlug: string,
) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("entitlements")
    .select("*, products!inner(id, title, slug, cover_image)")
    .eq("user_id", userId)
    .eq("products.slug", productSlug)
    .is("revoked_at", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString())
    .single();
  return data;
}

export async function getUserDownloadableMaterials(userId: string) {
  const supabase = await createClient();
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("product_id")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .or("expires_at.is.null,expires_at.gt." + new Date().toISOString());

  if (!entitlements?.length) return [];

  const productIds = entitlements.map((e) => e.product_id);
  const { data } = await supabase
    .from("downloadable_materials")
    .select("*")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });
  return data ?? [];
}
