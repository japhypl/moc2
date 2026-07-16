import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Błąd płatności — Moc Płomienia",
};

export default function PaymentErrorPage() {
  return (
    <Card>
      <CardContent className="text-center">
        <h1 className="font-heading text-xl font-bold text-text-dark">
          Płatność nie powiodła się
        </h1>
        <p className="mt-2 text-text-muted">
          Przepraszamy, wystąpił problem z przetwarzaniem płatności. Spróbuj
          ponownie lub skontaktuj się z nami.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="cta" size="md" asChild>
            <Link href="/">Strona główna</Link>
          </Button>
          <Button variant="secondary" size="md" asChild>
            <Link href="/kontakt">Kontakt</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
