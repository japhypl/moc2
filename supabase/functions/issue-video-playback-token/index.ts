import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { getAuthUser } from "../_shared/auth.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  const supabase = getSupabaseAdmin();

  const user = await getAuthUser(req, supabase);
  if (!user) {
    return errorResponse("Unauthorized", 401);
  }

  const { vod_item_id } = await req.json();
  if (!vod_item_id) {
    return errorResponse("Missing vod_item_id");
  }

  const { data: vodItem } = await supabase
    .from("vod_items")
    .select("id, title, video_provider, video_external_id")
    .eq("id", vod_item_id)
    .single();

  if (!vodItem) {
    return errorResponse("VOD item not found", 404);
  }

  // Verify entitlement via product_vod_items join
  const { data: productVodItems } = await supabase
    .from("product_vod_items")
    .select("product_id")
    .eq("vod_item_id", vod_item_id);

  if (!productVodItems?.length) {
    return errorResponse("VOD item not linked to any product", 404);
  }

  const productIds = productVodItems.map((pvi) => pvi.product_id);
  const now = new Date().toISOString();

  const { data: entitlement } = await supabase
    .from("entitlements")
    .select("id")
    .eq("user_id", user.id)
    .in("product_id", productIds)
    .is("revoked_at", null)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .single();

  if (!entitlement) {
    return errorResponse("No active entitlement for this content", 403);
  }

  // TODO: In production, generate Mux Signed URL or Cloudflare Stream signed token
  const playbackUrl = vodItem.video_external_id ?? "";
  const tokenLifetimeHours = 4;
  const expiresAt = new Date(
    Date.now() + tokenLifetimeHours * 60 * 60 * 1000,
  ).toISOString();

  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("cf-connecting-ip") ??
    null;

  await supabase.from("playback_sessions").insert({
    user_id: user.id,
    vod_item_id,
    token_issued_at: now,
    token_expires_at: expiresAt,
    ip_address: clientIp,
  });

  return jsonResponse({
    playback_url: playbackUrl,
    expires_at: expiresAt,
  });
});
