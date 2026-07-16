import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";

import { getEventBySlug } from "@/lib/supabase/queries";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SpeakerCard } from "@/components/speaker-card";

export const revalidate = 3600;

type Props = {
  params: Promise<{ "event-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "event-slug": slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) return {};

  return {
    title: event.seo_title || event.title,
    description: event.meta_description || undefined,
    openGraph: event.og_image ? { images: [{ url: event.og_image }] } : undefined,
  };
}

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default async function EventPage({ params }: Props) {
  const { "event-slug": slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const faqItems: { question: string; answer: string }[] = event.faq
    ? typeof event.faq === "string"
      ? JSON.parse(event.faq)
      : event.faq
    : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: event.date,
    ...(event.end_date && { endDate: event.end_date }),
    ...(event.cover_image && { image: event.cover_image }),
    location: {
      "@type": "Place",
      name: event.venue_name,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.venue_address,
        addressLocality: event.venue_city,
      },
    },
    ...(event.tixx_links.length > 0 && {
      offers: event.tixx_links.map((link) => ({
        "@type": "Offer",
        url: link.url,
        name: link.label,
      })),
    }),
    ...(event.speakers.length > 0 && {
      performer: event.speakers.map((speaker) => ({
        "@type": "Person",
        name: speaker.name,
        ...(speaker.website && { url: speaker.website }),
      })),
    }),
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
              { label: "Wydarzenia", href: "/wydarzenia" },
              { label: event.title },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            {event.title}
          </h1>

          {/* Date & venue */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-text-muted">
            <span>{formatDate(event.date)}</span>
            {event.venue_name && <span>{event.venue_name}</span>}
            {event.venue_city && <span>{event.venue_city}</span>}
          </div>

          {/* Cover image */}
          {event.cover_image && (
            <div className="mt-8">
              <img
                src={event.cover_image}
                alt={event.title}
                className="w-full rounded-lg object-cover"
              />
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="mt-8">
              <div
                className="prose prose-neutral max-w-none"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          )}

          {/* Programme */}
          {event.programme && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Program
              </h2>
              <div
                className="prose prose-neutral mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: event.programme }}
              />
            </div>
          )}

          {/* Benefits */}
          {event.benefits && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Korzyści
              </h2>
              <div
                className="prose prose-neutral mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: event.benefits }}
              />
            </div>
          )}

          {/* Speakers */}
          {event.speakers.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Prelegenci
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {event.speakers.map((speaker) => (
                  <SpeakerCard
                    key={speaker.id}
                    name={speaker.name}
                    bio={speaker.bio}
                    photo={speaker.photo}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Ticket links */}
          {event.tixx_links.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-4">
              {event.tixx_links.map((link) => (
                <Button key={link.id} variant="cta" asChild>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </Button>
              ))}
            </div>
          )}

          {/* FAQ */}
          {faqItems.length > 0 && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Najczęściej zadawane pytania
              </h2>
              <Accordion type="single" collapsible className="mt-4">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}

          {/* Accessibility info */}
          {event.accessibility_info && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Dostępność
              </h2>
              <div
                className="prose prose-neutral mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: event.accessibility_info }}
              />
            </div>
          )}

          {/* Refund info */}
          {event.refund_info && (
            <div className="mt-12">
              <h2 className="font-heading text-2xl font-bold text-text-dark">
                Polityka zwrotów
              </h2>
              <div
                className="prose prose-neutral mt-4 max-w-none"
                dangerouslySetInnerHTML={{ __html: event.refund_info }}
              />
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
