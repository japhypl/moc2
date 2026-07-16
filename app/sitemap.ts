import type { MetadataRoute } from "next";

const BASE_URL = "https://mocplomienia.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/wydarzenia`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/vod`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/warsztaty`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/poprzednie-edycje`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/o-nas`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/regulamin-wydarzen`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/regulamin-vod`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/regulamin-warsztatow`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/polityka-cookies`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/dostepnosc`, changeFrequency: "yearly", priority: 0.2 },
  ];

  let dynamicRoutes: MetadataRoute.Sitemap = [];

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();

    const [{ data: events }, { data: products }, { data: workshops }, { data: archived }] =
      await Promise.all([
        supabase.from("events").select("slug, updated_at").eq("status", "published"),
        supabase.from("products").select("slug, updated_at").eq("status", "published"),
        supabase.from("workshops").select("slug, updated_at").eq("status", "published"),
        supabase.from("events").select("slug, updated_at").eq("status", "archived"),
      ]);

    dynamicRoutes = [
      ...(events ?? []).map((e) => ({
        url: `${BASE_URL}/wydarzenia/${e.slug}`,
        lastModified: new Date(e.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...(products ?? []).map((p) => ({
        url: `${BASE_URL}/vod/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...(workshops ?? []).map((w) => ({
        url: `${BASE_URL}/warsztaty/${w.slug}`,
        lastModified: new Date(w.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
      ...(archived ?? []).map((e) => ({
        url: `${BASE_URL}/poprzednie-edycje/${e.slug}`,
        lastModified: new Date(e.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.4,
      })),
    ];
  } catch {
    // Supabase not configured — return static routes only
  }

  return [...staticRoutes, ...dynamicRoutes];
}
