import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function getAuthUser(req: Request, supabase: SupabaseClient) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.replace("Bearer ", "");
  const {
    data: { user },
  } = await supabase.auth.getUser(token);
  return user;
}

export async function requireAdmin(req: Request, supabase: SupabaseClient) {
  const user = await getAuthUser(req, supabase);
  if (!user) return null;

  const { data: role } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .single();

  if (!role) return null;
  return user;
}
