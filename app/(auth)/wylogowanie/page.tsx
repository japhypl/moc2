"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.signOut().then(() => {
      router.push("/");
    });
  }, [router]);

  return (
    <div className="text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent-gold" />
      <p className="mt-4 text-text-muted">Wylogowywanie...</p>
    </div>
  );
}
