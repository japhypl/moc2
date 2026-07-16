import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/lib/supabase/auth";
import {
  getUserEntitlements,
  getUserOrders,
  getUserProfileById,
} from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Moje konto — Moc Płomienia",
};

export default async function AccountDashboardPage() {
  const user = await requireAuth();
  const [profile, entitlements, orders] = await Promise.all([
    getUserProfileById(user.id),
    getUserEntitlements(user.id),
    getUserOrders(user.id),
  ]);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Witaj{profile?.display_name ? `, ${profile.display_name}` : ""}!
      </h1>
      <p className="mt-2 text-text-muted">
        Zarządzaj swoimi nagraniami, zamówieniami i danymi konta.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        <Link href="/konto/nagrania" className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-accent-gold">
                {entitlements.length}
              </p>
              <p className="mt-1 text-sm text-text-muted group-hover:text-text-dark">
                Dostępne nagrania
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/konto/zamowienia" className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-accent-gold">
                {orders.length}
              </p>
              <p className="mt-1 text-sm text-text-muted group-hover:text-text-dark">
                Zamówienia
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/konto/dane" className="group">
          <Card className="transition-shadow hover:shadow-md">
            <CardContent className="text-center">
              <p className="text-3xl font-bold text-accent-gold">
                {user.email?.charAt(0).toUpperCase() ?? "?"}
              </p>
              <p className="mt-1 text-sm text-text-muted group-hover:text-text-dark">
                Dane konta
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
