"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function VerificationContent() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/konto";

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setStatus("success");
        router.push(next);
      }
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setStatus("success");
        router.push(next);
      } else {
        setTimeout(() => {
          setStatus((current) => (current === "verifying" ? "error" : current));
        }, 5000);
      }
    });
  }, [router, next]);

  return (
    <Card>
      <CardContent className="text-center">
        {status === "verifying" && (
          <>
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent-gold" />
            <p className="mt-4 text-text-muted">Weryfikacja...</p>
          </>
        )}
        {status === "error" && (
          <>
            <h2 className="font-heading text-xl font-bold text-text-dark">
              Link wygasł lub jest nieprawidłowy
            </h2>
            <p className="mt-2 text-text-muted">
              Spróbuj zalogować się ponownie.
            </p>
            <Button variant="cta" size="md" className="mt-6" asChild>
              <Link href="/logowanie">Zaloguj się ponownie</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerificationPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardContent className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent-gold" />
            <p className="mt-4 text-text-muted">Ładowanie...</p>
          </CardContent>
        </Card>
      }
    >
      <VerificationContent />
    </Suspense>
  );
}
