"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type CheckoutProps = {
  productId: string;
  productTitle: string;
  priceFormatted: string;
};

type CheckoutState = "idle" | "loading" | "error";

export function Checkout({ productId, productTitle, priceFormatted }: CheckoutProps) {
  const [email, setEmail] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentDigital, setConsentDigital] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [state, setState] = useState<CheckoutState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; terms?: string; digital?: string }>({});

  function validate(): boolean {
    const errors: typeof fieldErrors = {};

    if (!email) {
      errors.email = "Adres email jest wymagany";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Podaj prawidłowy adres email";
    }

    if (!consentTerms) {
      errors.terms = "Musisz zaakceptować regulamin";
    }

    if (!consentDigital) {
      errors.digital = "Ta zgoda jest wymagana do realizacji zakupu";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    if (!validate()) return;

    setState("loading");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-paynow-payment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: productId,
            email,
            consent_terms: consentTerms,
            consent_digital_delivery: consentDigital,
            consent_marketing: consentMarketing,
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Wystąpił błąd podczas tworzenia płatności");
      }

      const data = await res.json();
      window.location.href = data.redirect_url;
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Wystąpił nieoczekiwany błąd. Spróbuj ponownie.",
      );
    }
  }

  return (
    <div className="mt-12 rounded-card border border-border bg-background-primary p-6">
      <h2 className="font-heading text-xl font-bold text-text-dark">Kup teraz</h2>
      <p className="mt-1 text-sm text-text-muted">{productTitle}</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <Input
          label="Adres email"
          type="email"
          placeholder="jan@example.pl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
          disabled={state === "loading"}
        />

        <div className="space-y-3">
          <div>
            <Checkbox
              checked={consentTerms}
              onCheckedChange={(v) => setConsentTerms(v === true)}
              disabled={state === "loading"}
              label={
                <>
                  Akceptuję{" "}
                  <Link
                    href="/regulamin-vod"
                    className="text-accent-gold underline hover:text-accent-gold-hover"
                    target="_blank"
                  >
                    regulamin VOD
                  </Link>
                </>
              }
            />
            {fieldErrors.terms && (
              <p className="mt-1 pl-8 text-sm text-status-error">{fieldErrors.terms}</p>
            )}
          </div>

          <div>
            <Checkbox
              checked={consentDigital}
              onCheckedChange={(v) => setConsentDigital(v === true)}
              disabled={state === "loading"}
              label="Wyrażam zgodę na natychmiastowe dostarczenie treści cyfrowych i rezygnuję z prawa odstąpienia"
            />
            {fieldErrors.digital && (
              <p className="mt-1 pl-8 text-sm text-status-error">{fieldErrors.digital}</p>
            )}
          </div>

          <Checkbox
            checked={consentMarketing}
            onCheckedChange={(v) => setConsentMarketing(v === true)}
            disabled={state === "loading"}
            label="Chcę otrzymywać newsletter"
          />
        </div>

        {state === "error" && errorMessage && (
          <p className="text-sm text-status-error" role="alert">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          variant="cta"
          size="lg"
          className="w-full"
          disabled={state === "loading"}
        >
          {state === "loading" ? "Przetwarzanie..." : `Kupuję za ${priceFormatted}`}
        </Button>
      </form>
    </div>
  );
}
