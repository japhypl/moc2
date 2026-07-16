"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Nagrania", href: "/konto/nagrania" },
  { label: "Zamówienia", href: "/konto/zamowienia" },
  { label: "Materiały", href: "/konto/materialy" },
  { label: "Dane", href: "/konto/dane" },
] as const;

export function CustomerNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto border-b border-border"
      aria-label="Panel klienta"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 border-b-2 px-4 py-3 text-sm transition-colors",
              isActive
                ? "border-accent-gold font-medium text-accent-gold"
                : "border-transparent text-text-muted hover:text-text-dark",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
