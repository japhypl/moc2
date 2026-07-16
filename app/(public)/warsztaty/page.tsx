import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPublishedWorkshops } from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Warsztaty",
    description:
      "Warsztaty Moc Płomienia — rozwój osobisty, sesje online i stacjonarne dla kobiet.",
  };
}

function formatDatePL(dateString: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

const WORKSHOP_TYPE_LABELS: Record<string, string> = {
  online: "Online",
  in_person: "Stacjonarnie",
};

export default async function WarsztatyPage() {
  const workshops = await getPublishedWorkshops();

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "Warsztaty" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            Warsztaty
          </h1>

          {workshops.length === 0 ? (
            <p className="mt-8 text-text-muted">
              Obecnie nie ma dostępnych warsztatów.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <Link
                  key={workshop.id}
                  href={`/warsztaty/${workshop.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                    {workshop.cover_image && (
                      <div className="relative aspect-video">
                        <Image
                          src={workshop.cover_image}
                          alt={workshop.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-1 flex-col">
                      <div className="mb-2">
                        <Badge variant="tag">
                          {WORKSHOP_TYPE_LABELS[workshop.type] ?? workshop.type}
                        </Badge>
                      </div>
                      <h2 className="font-heading text-lg font-semibold text-text-dark group-hover:text-accent-gold">
                        {workshop.title}
                      </h2>
                      {workshop.date && (
                        <p className="mt-2 text-sm text-text-muted">
                          {formatDatePL(workshop.date)}
                        </p>
                      )}
                      {workshop.type === "in_person" && workshop.venue_name && (
                        <p className="mt-1 text-sm text-text-muted">
                          {workshop.venue_name}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
