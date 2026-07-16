import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
};

function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://mocplomienia.pl${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Breadcrumb" className={cn("text-sm text-text-muted", className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-border">/</span>
              )}
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-text-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={index === items.length - 1 ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

export { Breadcrumbs };
export type { BreadcrumbItem, BreadcrumbsProps };
