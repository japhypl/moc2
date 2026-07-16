import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";

import { getProductBySlug } from "@/lib/supabase/queries";
import { formatPrice } from "@/components/product-card";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

type Props = {
  params: Promise<{ "product-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "product-slug": slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.seo_title || product.title,
    description: product.meta_description,
    openGraph: product.og_image
      ? {
          images: [{ url: product.og_image }],
        }
      : undefined,
  };
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function isPromotionActive(product: {
  active_price: {
    promotional_price_minor: number | null;
    promotional_start: string | null;
    promotional_end: string | null;
  } | null;
}): boolean {
  const price = product.active_price;
  if (!price || price.promotional_price_minor == null) return false;

  const now = new Date();
  if (price.promotional_start && new Date(price.promotional_start) > now)
    return false;
  if (price.promotional_end && new Date(price.promotional_end) < now)
    return false;

  return true;
}

export default async function VodProductPage({ params }: Props) {
  const { "product-slug": slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const promotional = isPromotionActive(product);
  const currentPrice = promotional
    ? product.active_price!.promotional_price_minor!
    : product.active_price?.price_minor;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.short_description || product.meta_description,
    image: product.og_image || product.cover_image,
    offers: product.active_price
      ? {
          "@type": "Offer",
          price: (currentPrice! / 100).toFixed(2),
          priceCurrency: product.active_price.currency || "PLN",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "VOD", href: "/vod" },
              { label: product.title },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            {product.title}
          </h1>

          {product.cover_image && (
            <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={product.cover_image}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority
              />
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
            {product.contributor && <span>Prowadzący: {product.contributor}</span>}
            {product.edition && <span>Edycja: {product.edition}</span>}
            {product.total_duration_seconds != null && (
              <span>
                Czas trwania: {formatDuration(product.total_duration_seconds)}
              </span>
            )}
            {product.access_duration_days != null && (
              <span>Dostęp: {product.access_duration_days} dni</span>
            )}
          </div>

          {/* Price */}
          {product.active_price && (
            <div className="mt-6">
              {promotional ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-text-dark">
                    {formatPrice(product.active_price.promotional_price_minor!)}
                  </span>
                  <span className="text-lg text-text-muted line-through">
                    {formatPrice(product.active_price.price_minor)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-text-dark">
                  {formatPrice(product.active_price.price_minor)}
                </span>
              )}

              {promotional && product.lowest_30_day_price != null && (
                <p className="mt-1 text-xs text-text-muted">
                  Najniższa cena z 30 dni:{" "}
                  {formatPrice(product.lowest_30_day_price)}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-6">
            <Button variant="cta" size="lg">
              Kupuję
            </Button>
          </div>

          {/* Short description */}
          {product.short_description && (
            <p className="mt-8 text-lg text-text-dark">
              {product.short_description}
            </p>
          )}

          {/* Long description */}
          {product.long_description && (
            <div
              className="prose mt-6 max-w-none text-text-dark"
              dangerouslySetInnerHTML={{ __html: product.long_description }}
            />
          )}

          {/* Benefit list */}
          {product.benefit_list && product.benefit_list.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-text-dark">
                Co zyskujesz
              </h2>
              <ul className="mt-4 space-y-2">
                {product.benefit_list.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-text-dark"
                  >
                    <svg
                      className="mt-1 h-4 w-4 shrink-0 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* VOD items */}
          {product.vod_items && product.vod_items.length > 0 && (
            <div className="mt-8">
              <h2 className="font-heading text-xl font-bold text-text-dark">
                Zawartość kursu
              </h2>
              <ul className="mt-4 divide-y divide-gray-200">
                {product.vod_items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-text-dark">{item.title}</span>
                    {item.duration_seconds != null && (
                      <span className="text-sm text-text-muted">
                        {formatDuration(item.duration_seconds)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
