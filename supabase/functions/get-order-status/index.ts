import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("order_id");

    if (!orderId) {
      return errorResponse("Missing order_id");
    }

    const supabase = getSupabaseAdmin();

    // Get order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderErr || !order) {
      return errorResponse("Order not found", 404);
    }

    // Get latest payment attempt
    const { data: attempt } = await supabase
      .from("payment_attempts")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return jsonResponse({
      order_id: order.id,
      order_status: order.status,
      payment_status: attempt?.status ?? null,
      paid_at: order.paid_at ?? null,
    });
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
    );
  }
});
