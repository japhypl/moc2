import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ProductCardProps = {
  title: string;
  slug: string;
  coverImage?: string;
  contributor?: string;
  priceGrosze: number;
  promotionalPriceGrosze?: number | null;
  lowest30DayPriceGrosze?: number | null;
  badge?: string;
};

function formatPrice(grosze: number): string {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  }).format(grosze / 100);
}

function ProductCard({
  title,
  slug,
  coverImage,
  contributor,
  priceGrosze,
  promotionalPriceGrosze,
  lowest30DayPriceGrosze,
  badge,
}: ProductCardProps) {
  const currentPrice = promotionalPriceGrosze ?? priceGrosze;
  const isPromotional = promotionalPriceGrosze != null;

  return (
    <Card className="flex flex-col overflow-hidden">
      {coverImage && (
        <div className="relative aspect-video">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {badge && (
            <div className="absolute left-3 top-3">
              <Badge>{badge}</Badge>
            </div>
          )}
        </div>
      )}
      <CardContent className="flex flex-1 flex-col">
        {contributor && (
          <p className="text-sm text-text-muted">{contributor}</p>
        )}
        <h3 className="mt-1 font-heading text-lg font-semibold text-text-dark">
          {title}
        </h3>
        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-text-dark">
              {formatPrice(currentPrice)}
            </span>
            {isPromotional && (
              <span className="text-sm text-text-muted line-through">
                {formatPrice(priceGrosze)}
              </span>
            )}
          </div>
          {isPromotional && lowest30DayPriceGrosze != null && (
            <p className="mt-0.5 text-xs text-text-muted">
              Najniższa cena z 30 dni: {formatPrice(lowest30DayPriceGrosze)}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="cta" size="md" className="w-full" asChild>
          <Link href={`/vod/${slug}`}>Kupuję</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ProductCard, formatPrice };
export type { ProductCardProps };
