"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type DownloadLinkProps = {
  filePath: string;
  title: string;
};

export function DownloadLink({ filePath, title }: DownloadLinkProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from("materials")
        .createSignedUrl(filePath, 3600);

      if (error || !data?.signedUrl) {
        throw new Error("Nie udało się wygenerować linku do pobrania.");
      }

      window.open(data.signedUrl, "_blank");
    } catch {
      alert("Nie udało się pobrać pliku. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="shrink-0 text-sm font-medium text-accent-gold hover:text-accent-gold-hover disabled:opacity-50"
      aria-label={`Pobierz: ${title}`}
    >
      {loading ? "Generowanie..." : "Pobierz"}
    </button>
  );
}
