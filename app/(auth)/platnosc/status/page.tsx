"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type OrderStatus = "polling" | "paid" | "failed" | "expired" | "pending" | "timeout" | "no_order";

const POLL_INTERVAL = 3000;
const MAX_POLL_DURATION = 60000;

function Spinner() {
  return (
    <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent-gold" />
  );
}

function StatusBadge({ variant, children }: { variant: "success" | "error" | "warning"; children: React.ReactNode }) {
  const colors = {
    success: "bg-status-success/10 text-status-success",
    error: "bg-status-error/10 text-status-error",
    warning: "bg-accent-gold/10 text-accent-gold",
  };

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${colors[variant]}`}>
      {children}
    </span>
  );
}

function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [status, setStatus] = useState<OrderStatus>(orderId ? "polling" : "no_order");
  const [retrying, setRetrying] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!orderId) return null;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/get-order-status?order_id=${orderId}`,
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.order_status as string;
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;

    let cancelled = false;
    const startTime = Date.now();

    async function poll() {
      if (cancelled) return;

      const elapsed = Date.now() - startTime;
      if (elapsed >= MAX_POLL_DURATION) {
        setStatus("timeout");
        return;
      }

      const result = await fetchStatus();

      if (cancelled) return;

      if (result === "paid" || result === "completed") {
        setStatus("paid");
        return;
      } else if (result === "failed" || result === "rejected") {
        setStatus("failed");
        return;
      } else if (result === "expired") {
        setStatus("expired");
        return;
      } else if (result === "pending" || result === "new") {
        setStatus("pending");
      }

      setTimeout(poll, POLL_INTERVAL);
    }

    poll();

    return () => {
      cancelled = true;
    };
  }, [orderId, fetchStatus]);

  async function handleRetry() {
    if (!orderId) return;
    setRetrying(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/retry-paynow-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: orderId }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        if (data.redirect_url) {
          window.location.href = data.redirect_url;
          return;
        }
      }
    } catch {
      // fall through to show error state
    }

    setRetrying(false);
  }

  if (status === "no_order") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <StatusBadge variant="error">Błąd</StatusBadge>
          <p className="mt-4 font-heading text-lg font-bold text-text-dark">
            Brak identyfikatora zamówienia
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Nie znaleziono informacji o płatności. Sprawdź link lub skontaktuj się z nami.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link href="/kontakt">Skontaktuj się</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "polling" || status === "pending") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <Spinner />
          <p className="mt-4 font-heading text-lg font-bold text-text-dark">
            {status === "pending" ? "Przetwarzanie płatności..." : "Sprawdzanie statusu płatności..."}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Proszę czekać, weryfikujemy Twoją płatność.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (status === "paid") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <StatusBadge variant="success">Opłacone</StatusBadge>
          <p className="mt-4 font-heading text-lg font-bold text-text-dark">
            Płatność potwierdzona!
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Twoje nagrania są już dostępne.
          </p>
          <Button asChild variant="cta" className="mt-6">
            <Link href="/konto/nagrania">Przejdź do nagrań</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (status === "failed" || status === "expired") {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-10 text-center">
          <StatusBadge variant="error">
            {status === "expired" ? "Wygasła" : "Niepowodzenie"}
          </StatusBadge>
          <p className="mt-4 font-heading text-lg font-bold text-text-dark">
            {status === "expired"
              ? "Płatność wygasła"
              : "Płatność nie powiodła się"}
          </p>
          <p className="mt-2 text-sm text-text-muted">
            Możesz spróbować ponownie lub skontaktować się z nami.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              variant="cta"
              onClick={handleRetry}
              disabled={retrying}
            >
              {retrying ? "Przekierowywanie..." : "Spróbuj ponownie"}
            </Button>
            <Button asChild variant="secondary">
              <Link href="/kontakt">Skontaktuj się</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // timeout
  return (
    <Card className="mx-auto max-w-lg">
      <CardContent className="py-10 text-center">
        <StatusBadge variant="warning">Timeout</StatusBadge>
        <p className="mt-4 font-heading text-lg font-bold text-text-dark">
          Nie udało się potwierdzić płatności
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Skontaktuj się z nami, a pomożemy rozwiązać problem.
        </p>
        <Button asChild variant="secondary" className="mt-6">
          <Link href="/kontakt">Skontaktuj się</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentStatusPage() {
  return (
    <Suspense
      fallback={
        <Card className="mx-auto max-w-lg">
          <CardContent className="py-10 text-center">
            <Spinner />
            <p className="mt-4 font-heading text-lg font-bold text-text-dark">
              Ładowanie...
            </p>
          </CardContent>
        </Card>
      }
    >
      <PaymentStatusContent />
    </Suspense>
  );
}
