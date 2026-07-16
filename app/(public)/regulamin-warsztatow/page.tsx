import type { Metadata } from "next";

import { getPageBySlug } from "@/lib/supabase/queries";
import { Section } from "@/components/layout/section";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const revalidate = 3600;

const PAGE_SLUG = "regulamin-warsztatow";
const PAGE_TITLE = "Regulamin warsztatów";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(PAGE_SLUG);
  return {
    title: page?.seo_title || PAGE_TITLE,
    description: page?.meta_description || undefined,
  };
}

export default async function RegulaminWarsztatowPage() {
  const page = await getPageBySlug(PAGE_SLUG);

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Strona główna", href: "/" },
            { label: PAGE_TITLE },
          ]}
        />
        <h1 className="mt-6 font-heading text-3xl font-bold text-text-dark md:text-4xl">
          {PAGE_TITLE}
        </h1>
        <div className="prose prose-neutral mt-8 max-w-none">
          {page?.content ? (
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p className="text-text-muted">Treść w przygotowaniu.</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
