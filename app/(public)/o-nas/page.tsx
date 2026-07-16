import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { getPageBySlug } from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("o-nas");
  return {
    title: page?.seo_title ?? page?.title ?? "O nas",
    description:
      page?.meta_description ??
      "Poznaj zespół i misję Moc Płomienia — platformy rozwojowej dla kobiet.",
  };
}

export default async function ONasPage() {
  const page = await getPageBySlug("o-nas");

  return (
    <>
      <Section>
        <Container>
          <Breadcrumbs
            items={[
              { label: "Strona główna", href: "/" },
              { label: "O nas" },
            ]}
          />

          <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
            {page?.title ?? "O nas"}
          </h1>

          {page ? (
            <div className="mt-8 mx-auto max-w-3xl">
              {page.content && (
                <div
                  className="prose prose-lg text-text-dark"
                  dangerouslySetInnerHTML={{ __html: page.content }}
                />
              )}

              {page.sections.length > 0 && (
                <div className="mt-12 space-y-12">
                  {page.sections.map((section) => (
                    <div key={section.id}>
                      {section.title && (
                        <h2 className="font-heading text-2xl font-bold text-text-dark">
                          {section.title}
                        </h2>
                      )}
                      {section.content && (
                        <div
                          className="mt-4 prose text-text-dark"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="mt-8 text-text-muted">Strona w przygotowaniu.</p>
          )}
        </Container>
      </Section>
    </>
  );
}
