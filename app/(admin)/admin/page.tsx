"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const quickLinks = [
  { label: "Strony", href: "/admin/strony" },
  { label: "Wydarzenia", href: "/admin/wydarzenia" },
  { label: "Produkty", href: "/admin/produkty" },
  { label: "Zamowienia", href: "/admin/zamowienia" },
  { label: "Ustawienia", href: "/admin/ustawienia" },
  { label: "Audyt", href: "/admin/audyt" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-text-dark">
        Witaj w panelu administracyjnym
      </h1>
      <p className="mb-8 text-text-muted">
        Zarzadzaj trescia, wydarzeniami, produktami i uzytkowniczkami.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg border border-border bg-background-secondary p-5",
              "transition-colors hover:border-accent-gold hover:bg-background-primary",
            )}
          >
            <span className="text-sm font-medium text-text-dark">
              {link.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
