import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Status płatności — Moc Płomienia",
};

export default function PaymentStatusPage() {
  return (
    <Card>
      <CardContent className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent-gold" />
        <p className="mt-4 font-heading text-lg font-bold text-text-dark">
          Sprawdzanie statusu płatności...
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Proszę czekać, weryfikujemy Twoją płatność.
        </p>
      </CardContent>
    </Card>
  );
}
