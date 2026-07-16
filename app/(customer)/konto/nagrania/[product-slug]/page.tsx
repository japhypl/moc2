import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireAuth } from "@/lib/supabase/auth";
import {
  getUserEntitlementForProduct,
  getProductBySlug,
} from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlayerItem } from "./player-item";

type Props = {
  params: Promise<{ "product-slug": string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "product-slug": slug } = await params;
  return {
    title: `Odtwarzacz — ${slug} — Moc Płomienia`,
  };
}

export default async function PlayerPage({ params }: Props) {
  const { "product-slug": slug } = await params;
  const user = await requireAuth();

  const entitlement = await getUserEntitlementForProduct(user.id, slug);
  if (!entitlement) notFound();

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const vodItems = product.vod_items ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        {product.title}
      </h1>
      {entitlement.expires_at && (
        <p className="mt-2 text-sm text-text-muted">
          Dostęp do:{" "}
          <Badge variant="warning">
            {new Date(entitlement.expires_at).toLocaleDateString("pl-PL")}
          </Badge>
        </p>
      )}

      {vodItems.length === 0 ? (
        <p className="mt-8 text-text-muted">
          Brak materiałów wideo dla tego produktu.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {vodItems.map((item, index) => (
            <Card key={item.id ?? index}>
              <CardContent>
                <PlayerItem
                  vodItemId={item.id}
                  title={item.title}
                  thumbnailUrl={item.thumbnail_url}
                  durationSeconds={item.duration_seconds}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
