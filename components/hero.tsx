import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

type CampaignState =
  | "PRELAUNCH"
  | "ON_SALE"
  | "LOW_AVAILABILITY"
  | "SOLD_OUT"
  | "POST_EVENT"
  | "VOD_ACTIVE"
  | "NO_ACTIVE_CAMPAIGN";

type HeroProps = {
  campaignState: CampaignState;
  eventTitle?: string;
  eventDate?: string;
  ctaUrl?: string;
  countdownDeadline?: string;
};

const CAMPAIGN_CONFIG: Record<
  CampaignState,
  { heading: string; cta: string; ctaVariant: "cta" | "primary" | "secondary" }
> = {
  PRELAUNCH: {
    heading: "Nowe wydarzenie już wkrótce",
    cta: "Dołącz do listy pierwszeństwa",
    ctaVariant: "cta",
  },
  ON_SALE: {
    heading: "Bilety dostępne",
    cta: "Kup bilet",
    ctaVariant: "cta",
  },
  LOW_AVAILABILITY: {
    heading: "Ostatnie miejsca",
    cta: "Kup bilet",
    ctaVariant: "cta",
  },
  SOLD_OUT: {
    heading: "Wyprzedane",
    cta: "Dołącz do listy rezerwowej",
    ctaVariant: "secondary",
  },
  POST_EVENT: {
    heading: "Dziękujemy za wspólne spotkanie",
    cta: "Powiadom mnie o nagraniach",
    ctaVariant: "primary",
  },
  VOD_ACTIVE: {
    heading: "Nagrania dostępne",
    cta: "Zobacz nagrania",
    ctaVariant: "cta",
  },
  NO_ACTIVE_CAMPAIGN: {
    heading: "Moc Płomienia",
    cta: "Dołącz do społeczności",
    ctaVariant: "primary",
  },
};

function Hero({
  campaignState,
  eventTitle,
  ctaUrl = "#",
}: HeroProps) {
  const config = CAMPAIGN_CONFIG[campaignState];

  return (
    <section className="bg-background-dark py-section-mobile text-text-light md:py-section">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {eventTitle && (
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent-gold">
              {eventTitle}
            </p>
          )}
          <h1 className="font-heading text-4xl font-bold md:text-6xl">
            {config.heading}
          </h1>
          <div className="mt-8">
            <Button variant={config.ctaVariant} size="lg" asChild>
              <a href={ctaUrl}>{config.cta}</a>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { Hero, CAMPAIGN_CONFIG };
export type { CampaignState, HeroProps };
