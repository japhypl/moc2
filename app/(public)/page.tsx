import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/hero";
import type { CampaignState } from "@/components/hero";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { ProductGrid } from "@/components/product-grid";
import { ProductCard } from "@/components/product-card";
import { SpeakerCard } from "@/components/speaker-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  getSiteSettings,
  getPublishedEvents,
  getPublishedProducts,
  getPublishedWorkshops,
  getArchivedEvents,
  getSpeakers,
  getApprovedTestimonials,
  getFaqSections,
} from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Moc Płomienia — konferencja rozwojowa dla kobiet",
  description:
    "Moc Płomienia to platforma rozwojowa dla kobiet. Konferencje, warsztaty, nagrania VOD i społeczność wspierających się kobiet.",
};

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

const BENEFITS = [
  {
    title: "Inspirujące prelegentki",
    description:
      "Spotkaj ekspertki, które dzielą się wiedzą i doświadczeniem w atmosferze wzajemnego wsparcia.",
  },
  {
    title: "Dostęp do nagrań",
    description:
      "Nie możesz być na żywo? Wszystkie wystąpienia dostępne są jako nagrania VOD.",
  },
  {
    title: "Społeczność kobiet",
    description:
      "Dołącz do społeczności kobiet, które wspierają się nawzajem w rozwoju osobistym i zawodowym.",
  },
];

const PLACEHOLDER_FAQS = [
  {
    id: "faq-1",
    question: "Czym jest Moc Płomienia?",
    answer:
      "Moc Płomienia to platforma rozwojowa dla kobiet, oferująca konferencje, warsztaty i nagrania VOD.",
  },
  {
    id: "faq-2",
    question: "Jak mogę kupić bilet?",
    answer:
      "Bilety dostępne są w sekcji Wydarzenia. Płatności obsługiwane są przez bezpieczny system online.",
  },
  {
    id: "faq-3",
    question: "Czy nagrania VOD są dostępne bezterminowo?",
    answer:
      "Czas dostępu zależy od wybranego pakietu. Szczegóły znajdziesz na stronie produktu.",
  },
];

export default async function HomePage() {
  const [
    settings,
    events,
    products,
    workshops,
    archivedEvents,
    speakers,
    testimonials,
    faqSections,
  ] = await Promise.all([
    getSiteSettings(),
    getPublishedEvents(),
    getPublishedProducts(),
    getPublishedWorkshops(),
    getArchivedEvents(),
    getSpeakers(),
    getApprovedTestimonials(),
    getFaqSections(),
  ]);

  const campaignState: CampaignState =
    settings?.campaign_state ?? "NO_ACTIVE_CAMPAIGN";
  const activeEvent = events[0] ?? null;
  const featuredProducts = products.slice(0, 6);
  const recentArchived = archivedEvents.slice(0, 3);
  const faqItems =
    faqSections.length > 0
      ? faqSections.slice(0, 5).map((s) => ({
          id: s.id,
          question: s.title ?? "",
          answer: s.content ?? "",
        }))
      : PLACEHOLDER_FAQS;

  return (
    <>
      {/* 1. Hero */}
      <Hero
        campaignState={campaignState}
        eventTitle={activeEvent?.title}
        ctaUrl={
          activeEvent ? `/wydarzenia/${activeEvent.slug}` : "#newsletter"
        }
        countdownDeadline={settings?.countdown_deadline ?? undefined}
      />

      {/* 2. Brand proposition */}
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-text-dark">
              Platforma rozwojowa dla kobiet
            </h2>
            <p className="mt-4 text-lg text-text-muted">
              Moc Płomienia to przestrzeń, w której kobiety inspirują się
              nawzajem, dzielą wiedzą i rosną razem. Konferencje na żywo,
              warsztaty i nagrania VOD — wszystko w jednym miejscu.
            </p>
          </div>
        </Container>
      </Section>

      {/* 3. Active event or VOD */}
      {activeEvent && (
        <Section className="bg-background-secondary">
          <Container>
            <div className="grid items-center gap-8 md:grid-cols-2">
              {activeEvent.cover_image && (
                <div className="relative aspect-video overflow-hidden rounded-card">
                  <Image
                    src={activeEvent.cover_image}
                    alt={activeEvent.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              )}
              <div>
                <h2 className="font-heading text-3xl font-bold text-text-dark">
                  {activeEvent.title}
                </h2>
                {activeEvent.date && (
                  <p className="mt-2 text-text-muted">
                    {formatDatePL(activeEvent.date)}
                  </p>
                )}
                {activeEvent.venue_name && (
                  <p className="mt-1 text-text-muted">
                    {activeEvent.venue_name}
                    {activeEvent.venue_city && `, ${activeEvent.venue_city}`}
                  </p>
                )}
                {activeEvent.description && (
                  <p className="mt-4 text-text-dark">
                    {activeEvent.description}
                  </p>
                )}
                <div className="mt-6">
                  <Button variant="cta" size="lg" asChild>
                    <Link href={`/wydarzenia/${activeEvent.slug}`}>
                      Dowiedz się więcej
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* 4. Customer benefits */}
      <Section>
        <Container>
          <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
            Dlaczego Moc Płomienia?
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <Card key={benefit.title}>
                <CardContent className="text-center">
                  <h3 className="font-heading text-lg font-semibold text-text-dark">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. Speakers */}
      {speakers.length > 0 && (
        <Section className="bg-background-secondary">
          <Container>
            <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
              Prelegentki
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {speakers.map((speaker) => (
                <SpeakerCard
                  key={speaker.id}
                  name={speaker.name}
                  bio={speaker.bio ?? undefined}
                  photo={speaker.photo ?? undefined}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 6. Testimonials */}
      {testimonials.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
              Opinie uczestniczek
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <TestimonialCard
                  key={t.id}
                  quote={t.quote}
                  author={t.author}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* 7. Featured VOD products */}
      {featuredProducts.length > 0 && (
        <Section className="bg-background-secondary">
          <Container>
            <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
              Nagrania VOD
            </h2>
            <ProductGrid className="mt-8">
              {featuredProducts.map((product) => (
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
            {products.length > 6 && (
              <div className="mt-8 text-center">
                <Button variant="secondary" asChild>
                  <Link href="/vod">Zobacz wszystkie nagrania</Link>
                </Button>
              </div>
            )}
          </Container>
        </Section>
      )}

      {/* 8. Workshops */}
      {workshops.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
              Warsztaty
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((workshop) => (
                <Link
                  key={workshop.id}
                  href={`/warsztaty/${workshop.slug}`}
                  className="group"
                >
                  <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <CardContent className="flex flex-1 flex-col">
                      <div className="mb-2">
                        <Badge variant="tag">
                          {WORKSHOP_TYPE_LABELS[workshop.type] ?? workshop.type}
                        </Badge>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-text-dark group-hover:text-accent-gold">
                        {workshop.title}
                      </h3>
                      {workshop.date && (
                        <p className="mt-2 text-sm text-text-muted">
                          {formatDatePL(workshop.date)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="secondary" asChild>
                <Link href="/warsztaty">Wszystkie warsztaty</Link>
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* 9. Previous editions */}
      {recentArchived.length > 0 && (
        <Section className="bg-background-secondary">
          <Container>
            <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
              Poprzednie edycje
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {recentArchived.map((event) => (
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
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )}
                    <CardContent>
                      <h3 className="font-heading text-lg font-semibold text-text-dark group-hover:text-accent-gold">
                        {event.title}
                      </h3>
                      {event.date && (
                        <p className="mt-1 text-sm text-text-muted">
                          {formatDatePL(event.date)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button variant="secondary" asChild>
                <Link href="/poprzednie-edycje">
                  Wszystkie poprzednie edycje
                </Link>
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* 10. FAQ */}
      <Section>
        <Container>
          <h2 className="text-center font-heading text-3xl font-bold text-text-dark">
            Najczęściej zadawane pytania
          </h2>
          <div className="mt-8 mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-6 text-center">
              <Button variant="secondary" asChild>
                <Link href="/faq">Wszystkie pytania</Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* 11. Newsletter signup */}
      <Section id="newsletter" className="bg-background-dark">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="font-heading text-3xl font-bold text-text-light">
              Dołącz do newslettera
            </h2>
            <p className="mt-4 text-text-light/80">
              Bądź na bieżąco z nadchodzącymi wydarzeniami, nowymi nagraniami
              i ekskluzywnymi ofertami.
            </p>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                placeholder="Twój adres e-mail"
                required
                className="flex-1 rounded-button border border-border bg-background-primary px-4 py-3 text-text-dark placeholder:text-text-muted focus:outline-2 focus:outline-accent-gold"
              />
              <Button type="submit" variant="cta" size="md">
                Zapisz się
              </Button>
            </form>
            <p className="mt-3 text-xs text-text-light/60">
              Zapisując się, wyrażasz zgodę na otrzymywanie wiadomości
              e-mail od Moc Płomienia. Możesz się wypisać w każdej chwili.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
