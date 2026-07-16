import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ProductGrid } from "@/components/product-grid";
import { ProductCard } from "@/components/product-card";
import { getPublishedProducts } from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Nagrania VOD",
    description:
      "Katalog nagrań VOD z konferencji Moc Płomienia — wykłady, panele i warsztaty dostępne online.",
  };
}

export default async function VodPage() {
  const products = await getPublishedProducts();

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "VOD" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            Nagrania VOD
          </h1>

          {products.length === 0 ? (
            <p className="mt-8 text-text-muted">
              Katalog VOD jest obecnie pusty.
            </p>
          ) : (
            <ProductGrid className="mt-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  slug={product.slug}
                  coverImage={product.cover_image ?? undefined}
                  contributor={product.contributor ?? undefined}
                  priceGrosze={product.active_price?.price_minor ?? 0}
                  promotionalPriceGrosze={
                    product.active_price?.promotional_price_minor
                  }
                />
              ))}
            </ProductGrid>
          )}
        </Container>
      </Section>
    </>
  );
}
