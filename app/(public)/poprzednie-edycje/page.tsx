import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { getArchivedEvents } from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Poprzednie edycje",
    description:
      "Archiwum poprzednich edycji konferencji Moc Płomienia.",
  };
}

function formatDatePL(dateString: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export default async function PoprzednieEdycjePage() {
  const events = await getArchivedEvents();

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "Poprzednie edycje" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            Poprzednie edycje
          </h1>

          {events.length === 0 ? (
            <p className="mt-8 text-text-muted">
              Brak poprzednich edycji.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/wydarzenia/${event.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                    {event.cover_image && (
                      <div className="relative aspect-video">
                        <Image
                          src={event.cover_image}
                          alt={event.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent className="flex flex-1 flex-col">
                      <h2 className="font-heading text-lg font-semibold text-text-dark group-hover:text-accent-gold">
                        {event.title}
                      </h2>
                      {event.date && (
                        <p className="mt-2 text-sm text-text-muted">
                          {formatDatePL(event.date)}
                        </p>
                      )}
                      {event.venue_name && (
                        <p className="mt-1 text-sm text-text-muted">
                          {event.venue_name}
                          {event.venue_city && `, ${event.venue_city}`}
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
