import { AuthProvider } from "@refinedev/core";
import { createClient } from "@/lib/supabase/client";

export const authProvider: AuthProvider = {
  login: async () => {
    return {
      success: false,
      redirectTo: "/logowanie",
    };
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return {
      success: true,
      redirectTo: "/logowanie",
    };
  },

  check: async () => {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return {
        authenticated: false,
        redirectTo: "/logowanie",
      };
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roles?.role !== "admin") {
      return {
        authenticated: false,
        redirectTo: "/logowanie",
        error: {
          name: "Brak uprawnien",
          message: "Wymagana rola administratora.",
        },
      };
    }

    return { authenticated: true };
  },

  getIdentity: async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      name: profile?.display_name ?? user.email,
      avatar: profile?.avatar_url,
    };
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return { logout: true, redirectTo: "/logowanie" };
    }
    return { error };
  },
};
