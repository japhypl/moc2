"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl font-bold text-text-dark">500</h1>
      <p className="mt-4 text-lg text-text-muted">
        Wystąpił nieoczekiwany błąd. Przepraszamy za utrudnienia.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="cta" size="md" onClick={reset}>
          Spróbuj ponownie
        </Button>
        <Button variant="secondary" size="md" asChild>
          <Link href="/">Strona główna</Link>
        </Button>
      </div>
    </main>
  );
}
