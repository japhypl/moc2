import { notFound } from "next/navigation";
import { Metadata } from "next";

import { getWorkshopBySlug } from "@/lib/supabase/queries";
import { formatPrice } from "@/components/product-card";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const revalidate = 3600;

type Props = {
  params: Promise<{ "workshop-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "workshop-slug": slug } = await params;
  const workshop = await getWorkshopBySlug(slug);

  if (!workshop) {
    return {};
  }

  return {
    title: workshop.seo_title || workshop.title,
    description: workshop.meta_description,
    openGraph: workshop.og_image
      ? {
          images: [{ url: workshop.og_image }],
        }
      : undefined,
  };
}

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function WorkshopPage({ params }: Props) {
  const { "workshop-slug": slug } = await params;
  const workshop = await getWorkshopBySlug(slug);

  if (!workshop) {
    notFound();
  }

  const formattedDate = workshop.date
    ? dateFormatter.format(new Date(workshop.date))
    : null;
  const formattedEndDate = workshop.end_date
    ? dateFormatter.format(new Date(workshop.end_date))
    : null;

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Strona główna", href: "/" },
            { label: "Warsztaty", href: "/warsztaty" },
            { label: workshop.title },
          ]}
        />

        <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
          {workshop.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Badge variant={workshop.type === "online" ? "default" : "tag"}>
            {workshop.type === "online" ? "Online" : "Stacjonarnie"}
          </Badge>

          <span className="text-text-muted">
            {formattedDate}
            {formattedEndDate ? ` — ${formattedEndDate}` : null}
          </span>
        </div>

        {workshop.type === "in_person" && workshop.venue_name && (
          <div className="mt-4 text-text-dark">
            <p className="font-semibold">{workshop.venue_name}</p>
            {workshop.venue_address && (
              <p className="text-text-muted">{workshop.venue_address}</p>
            )}
          </div>
        )}

        {workshop.max_participants && (
          <p className="mt-3 text-text-muted">
            Maksymalna liczba uczestników: {workshop.max_participants}
          </p>
        )}

        {workshop.cover_image && (
          <img
            src={workshop.cover_image}
            alt={workshop.title}
            className="mt-6 w-full rounded-lg object-cover"
          />
        )}

        {workshop.description && (
          <div
            className="prose mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: workshop.description }}
          />
        )}

        <div className="mt-8 flex items-center gap-4">
          <p className="text-lg font-semibold text-text-dark">
            {workshop.is_paid && workshop.price_minor != null
              ? formatPrice(workshop.price_minor)
              : "Bezpłatne"}
          </p>

          <Button variant="cta">Zapisz się</Button>
        </div>
      </Container>
    </Section>
  );
}
