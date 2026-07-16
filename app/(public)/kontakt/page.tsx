import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Kontakt",
    description:
      "Skontaktuj się z zespołem Moc Płomienia — e-mail, telefon i media społecznościowe.",
  };
}

export default async function KontaktPage() {
  const settings = await getSiteSettings();

  const email = settings?.contact_email;
  const phone = settings?.contact_phone;
  const facebook = settings?.social_facebook;
  const instagram = settings?.social_instagram;
  const youtube = settings?.social_youtube;

  const hasContactInfo = email || phone;
  const hasSocial = facebook || instagram || youtube;

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "Kontakt" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            Kontakt
          </h1>

          <div className="mt-8 mx-auto max-w-2xl">
            {hasContactInfo ? (
              <Card>
                <CardContent className="space-y-4">
                  {email && (
                    <div>
                      <h2 className="text-sm font-medium text-text-muted">
                        E-mail
                      </h2>
                      <a
                        href={`mailto:${email}`}
                        className="text-lg text-text-dark hover:text-accent-gold"
                      >
                        {email}
                      </a>
                    </div>
                  )}
                  {phone && (
                    <div>
                      <h2 className="text-sm font-medium text-text-muted">
                        Telefon
                      </h2>
                      <a
                        href={`tel:${phone}`}
                        className="text-lg text-text-dark hover:text-accent-gold"
                      >
                        {phone}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent>
                  <p className="text-text-muted">
                    Dane kontaktowe zostaną wkrótce uzupełnione. Zapraszamy
                    do odwiedzenia nas ponownie.
                  </p>
                </CardContent>
              </Card>
            )}

            {hasSocial && (
              <div className="mt-8">
                <h2 className="font-heading text-xl font-semibold text-text-dark">
                  Media społecznościowe
                </h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {facebook && (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-gold"
                    >
                      Facebook
                    </a>
                  )}
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-gold"
                    >
                      Instagram
                    </a>
                  )}
                  {youtube && (
                    <a
                      href={youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-muted hover:text-accent-gold"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
