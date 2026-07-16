import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserEntitlements } from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Moje nagrania — Moc Płomienia",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("pl-PL");
}

export default async function RecordingsPage() {
  const user = await requireAuth();
  const entitlements = await getUserEntitlements(user.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Moje nagrania
      </h1>

      {entitlements.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-text-muted">
            Nie masz jeszcze żadnych nagrań. Sprawdź naszą ofertę VOD.
          </p>
          <Link
            href="/vod"
            className="mt-4 inline-block text-sm font-medium text-accent-gold hover:text-accent-gold-hover"
          >
            Przeglądaj nagrania VOD
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {entitlements.map((entitlement) => {
            const product = entitlement.products as {
              id: string;
              title: string;
              slug: string;
              cover_image: string | null;
              type: string;
            } | null;
            if (!product) return null;

            return (
              <Link
                key={entitlement.id}
                href={`/konto/nagrania/${product.slug}`}
                className="group"
              >
                <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                  {product.cover_image && (
                    <div className="relative aspect-video">
                      <Image
                        src={product.cover_image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <CardContent className="flex flex-1 flex-col">
                    <h2 className="font-heading text-lg font-semibold text-text-dark group-hover:text-accent-gold">
                      {product.title}
                    </h2>
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      {entitlement.expires_at ? (
                        <Badge variant="warning">
                          Dostęp do {formatDate(entitlement.expires_at)}
                        </Badge>
                      ) : (
                        <Badge variant="success">Dostęp bezterminowy</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
