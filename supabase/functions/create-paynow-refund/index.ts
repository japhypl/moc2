import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { createPaynowRefund } from "../_shared/paynow.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";
import { requireAdmin } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const supabase = getSupabaseAdmin();

    // Verify admin
    const admin = await requireAdmin(req, supabase);
    if (!admin) {
      return errorResponse("Unauthorized", 401);
    }

    const { order_id, amount_minor, reason } = await req.json();

    if (!order_id) {
      return errorResponse("Missing order_id");
    }

    // Get order — must be paid
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return errorResponse("Order not found", 404);
    }

    if (order.status !== "paid") {
      return errorResponse(`Order status must be 'paid', got '${order.status}'`);
    }

    // Get confirmed payment attempt
    const { data: attempt, error: attemptErr } = await supabase
      .from("payment_attempts")
      .select("*")
      .eq("order_id", order_id)
      .eq("status", "CONFIRMED")
      .single();

    if (attemptErr || !attempt) {
      return errorResponse("No confirmed payment attempt found", 404);
    }

    // Determine refund amount
    const refundAmount = amount_minor ?? order.total_minor;

    // Create refund record
    const { data: refund, error: refundErr } = await supabase
      .from("refunds")
      .insert({
        order_id: order_id,
        payment_attempt_id: attempt.id,
        amount_minor: refundAmount,
        reason: reason ?? null,
        status: "requested",
      })
      .select()
      .single();

    if (refundErr || !refund) {
      return errorResponse("Failed to create refund record", 500);
    }

    try {
      const paynowResp = await createPaynowRefund({
        paymentId: attempt.external_payment_id,
        amountMinor: refundAmount,
        reason,
      });

      // Update refund status
      const refundStatus =
        paynowResp.status === "SUCCESSFUL" ? "completed" : "processing";

      await supabase
        .from("refunds")
        .update({ status: refundStatus })
        .eq("id", refund.id);

      // Update order status
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", order_id);

      // Revoke entitlements
      await supabase
        .from("entitlements")
        .update({
          revoked_at: new Date().toISOString(),
          revoke_reason: "refund",
        })
        .eq("order_id", order_id)
        .is("revoked_at", null);

      return jsonResponse({ refund_id: refund.id, status: refundStatus });
    } catch (paynowErr) {
      await supabase
        .from("refunds")
        .update({ status: "failed" })
        .eq("id", refund.id);

      return errorResponse(
        paynowErr instanceof Error ? paynowErr.message : "Refund provider error",
        502,
      );
    }
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : "Internal server error",
      500,
    );
  }
});
