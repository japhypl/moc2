"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authProvider } from "@/lib/refine/auth-provider";
import { supabaseDataProvider } from "@/lib/refine/data-provider";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Strony", path: "/admin/strony" },
  { label: "Wydarzenia", path: "/admin/wydarzenia" },
  { label: "Prelegentki", path: "/admin/prelegentki" },
  { label: "Produkty", path: "/admin/produkty" },
  { label: "VOD", path: "/admin/vod" },
  { label: "Warsztaty", path: "/admin/warsztaty" },
  { label: "Opinie", path: "/admin/opinie" },
  { label: "Zamowienia", path: "/admin/zamowienia" },
  { label: "Platnosci", path: "/admin/platnosci" },
  { label: "Uzytkowniczki", path: "/admin/uzytkowniczki" },
  { label: "Newsletter", path: "/admin/newsletter" },
  { label: "Ustawienia", path: "/admin/ustawienia" },
  { label: "Integracje", path: "/admin/integracje" },
  { label: "Przekierowania", path: "/admin/przekierowania" },
  { label: "Audyt", path: "/admin/audyt" },
] as const;

const resources = [
  { name: "pages", list: "/admin/strony", meta: { label: "Strony" } },
  { name: "events", list: "/admin/wydarzenia", meta: { label: "Wydarzenia" } },
  {
    name: "speakers",
    list: "/admin/prelegentki",
    meta: { label: "Prelegentki" },
  },
  { name: "products", list: "/admin/produkty", meta: { label: "Produkty" } },
  { name: "vod_items", list: "/admin/vod", meta: { label: "VOD" } },
  {
    name: "workshops",
    list: "/admin/warsztaty",
    meta: { label: "Warsztaty" },
  },
  {
    name: "testimonials",
    list: "/admin/opinie",
    meta: { label: "Opinie" },
  },
  {
    name: "orders",
    list: "/admin/zamowienia",
    meta: { label: "Zamowienia" },
  },
  {
    name: "payment_attempts",
    list: "/admin/platnosci",
    meta: { label: "Platnosci" },
  },
  {
    name: "profiles",
    list: "/admin/uzytkowniczki",
    meta: { label: "Uzytkowniczki" },
  },
  {
    name: "newsletter_subscriptions",
    list: "/admin/newsletter",
    meta: { label: "Newsletter" },
  },
  {
    name: "site_settings",
    list: "/admin/ustawienia",
    meta: { label: "Ustawienia" },
  },
  {
    name: "integration_sync_runs",
    list: "/admin/integracje",
    meta: { label: "Integracje" },
  },
  {
    name: "redirects",
    list: "/admin/przekierowania",
    meta: { label: "Przekierowania" },
  },
  {
    name: "audit_logs",
    list: "/admin/audyt",
    meta: { label: "Audyt" },
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Refine
      routerProvider={routerProvider}
      authProvider={authProvider}
      dataProvider={supabaseDataProvider}
      resources={resources}
      options={{
        syncWithLocation: true,
        disableTelemetry: true,
      }}
    >
      <div className="flex min-h-screen bg-background-primary">
        {/* Sidebar */}
        <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-background-secondary">
          <div className="border-b border-border px-5 py-4">
            <Link
              href="/admin"
              className="text-lg font-bold tracking-tight text-text-dark"
            >
              Panel admina
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-0.5">
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-accent-gold/10 font-medium text-accent-gold"
                          : "text-text-muted hover:bg-background-primary hover:text-text-dark",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </Refine>
  );
}
