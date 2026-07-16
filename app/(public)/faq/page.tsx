import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { getFaqSections } from "@/lib/supabase/queries";

export const revalidate = 3600;

const PLACEHOLDER_FAQS = [
  {
    question: "Czym jest Moc Płomienia?",
    answer:
      "Moc Płomienia to platforma rozwojowa dla kobiet, oferująca konferencje, warsztaty i nagrania VOD z inspirującymi prelegentkami.",
  },
  {
    question: "Jak mogę kupić bilet na wydarzenie?",
    answer:
      "Bilety na wydarzenia możesz kupić bezpośrednio na naszej stronie w sekcji Wydarzenia. Płatności obsługiwane są przez bezpieczny system płatności online.",
  },
  {
    question: "Czy nagrania VOD są dostępne bezterminowo?",
    answer:
      "Czas dostępu do nagrań VOD zależy od wybranego pakietu. Szczegóły znajdziesz na stronie każdego produktu.",
  },
  {
    question: "Jak mogę się z Wami skontaktować?",
    answer:
      "Skontaktuj się z nami przez formularz na stronie Kontakt lub napisz na nasz adres e-mail.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "FAQ — Najczęściej zadawane pytania",
    description:
      "Odpowiedzi na najczęściej zadawane pytania dotyczące konferencji, nagrań VOD i warsztatów Moc Płomienia.",
  };
}

export default async function FaqPage() {
  const faqSections = await getFaqSections();

  const hasFaqs = faqSections.length > 0;
  const faqItems = hasFaqs
    ? faqSections.map((section) => ({
        id: section.id,
        question: section.title ?? "",
        answer: section.content ?? "",
      }))
    : PLACEHOLDER_FAQS.map((faq, i) => ({
        id: `placeholder-${i}`,
        question: faq.question,
        answer: faq.answer,
      }));

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "FAQ" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            Najczęściej zadawane pytania
          </h1>

          <div className="mt-8 mx-auto max-w-3xl">
            <Accordion type="single" collapsible>
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>
    </>
  );
}
