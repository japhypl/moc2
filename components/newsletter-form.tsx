"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) return;

    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("newsletter_subscriptions")
        .upsert({ email: trimmed }, { onConflict: "email" });

      if (error) throw error;
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="mt-8 text-lg font-medium text-text-light">
        Dziękujemy za zapisanie się!
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Twój adres e-mail"
          required
          disabled={status === "loading"}
          className="flex-1 rounded-button border border-border bg-background-primary px-4 py-3 text-text-dark placeholder:text-text-muted focus:outline-2 focus:outline-accent-gold disabled:opacity-50"
        />
        <Button type="submit" variant="cta" size="md" disabled={status === "loading"}>
          {status === "loading" ? "Zapisywanie..." : "Zapisz się"}
        </Button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-sm text-status-error">
          Nie udało się zapisać. Spróbuj ponownie.
        </p>
      )}
    </>
  );
}
