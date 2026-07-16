"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/konto";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/weryfikacja?next=${encodeURIComponent(next)}`,
      },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(
        error.message.includes("rate")
          ? "Zbyt wiele prób. Spróbuj ponownie za chwilę."
          : "Nie udało się wysłać linku. Sprawdź adres e-mail.",
      );
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="text-center">
        <h2 className="font-heading text-xl font-bold text-text-dark">
          Sprawdź swoją skrzynkę e-mail
        </h2>
        <p className="mt-3 text-text-muted">
          Wysłaliśmy link do logowania na adres{" "}
          <span className="font-medium text-text-dark">{email}</span>. Kliknij
          w link, aby się zalogować.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm text-accent-gold hover:text-accent-gold-hover"
        >
          Użyj innego adresu e-mail
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Adres e-mail"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        error={status === "error" ? errorMessage : undefined}
      />
      <Button
        type="submit"
        variant="cta"
        size="md"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Wysyłanie..." : "Wyślij link do logowania"}
      </Button>
    </form>
  );
}
