"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ProfileFormProps = {
  email: string;
  displayName: string;
};

export function ProfileForm({ email, displayName }: ProfileFormProps) {
  const [name, setName] = useState(displayName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("error");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name })
      .eq("id", user.id);

    setStatus(error ? "error" : "saved");
    if (!error) {
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Adres e-mail" type="email" value={email} disabled />
      <Input
        label="Nazwa wyświetlana"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button
        type="submit"
        variant="cta"
        size="md"
        disabled={status === "saving"}
      >
        {status === "saving"
          ? "Zapisywanie..."
          : status === "saved"
            ? "Zapisano!"
            : "Zapisz zmiany"}
      </Button>
      {status === "error" && (
        <p className="text-sm text-status-error">
          Nie udało się zapisać zmian. Spróbuj ponownie.
        </p>
      )}
    </form>
  );
}
