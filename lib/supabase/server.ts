import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a no-op client that returns empty data for all queries.
    // This avoids ECONNREFUSED when developing without Supabase.
    const noopChain: Record<string, unknown> = {};
    const chainProxy: unknown = new Proxy(noopChain, {
      get(_target, prop) {
        if (prop === "then") return undefined;
        if (prop === "data") return null;
        if (prop === "error") return { message: "Supabase not configured" };
        if (prop === "single" || prop === "maybeSingle")
          return () => Promise.resolve({ data: null, error: null });
        return () => chainProxy;
      },
    });
    return { from: () => chainProxy, auth: { getUser: () => Promise.resolve({ data: { user: null }, error: null }), getSession: () => Promise.resolve({ data: { session: null }, error: null }) }, storage: { from: () => chainProxy } } as unknown as ReturnType<typeof createServerClient>;
  }

  const cookieStore = await cookies();

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // setAll can be called from a Server Component where cookies
            // are read-only. The middleware will refresh the session instead.
          }
        },
      },
    },
  );
}
