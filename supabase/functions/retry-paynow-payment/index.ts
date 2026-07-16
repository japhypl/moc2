import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { createPaynowPayment } from "../_shared/paynow.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const { order_id } = await req.json();

    if (!order_id) {
      return errorResponse("Missing order_id");
    }

    const supabase = getSupabaseAdmin();

    // Get order — must be in retryable status
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderErr || !order) {
      return errorResponse("Order not found", 404);
    }

    const retryableStatuses = ["failed", "expired", "abandoned"];
    if (!retryableStatuses.includes(order.status)) {
      return errorResponse(
        `Order status '${order.status}' is not retryable. Must be one of: ${retryableStatuses.join(", ")}`,
      );
    }

    // Get order items to find product
    const { data: items, error: itemsErr } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);

    if (itemsErr || !items || items.length === 0) {
      return errorResponse("No order items found", 404);
    }

    const productId = items[0].product_id;

    // Get product
    const { data: product, error: productErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productErr || !product) {
      return errorResponse("Product not found", 404);
    }

    // Get active price
    const { data: price, error: priceErr } = await supabase
      .from("product_prices")
      .select("*")
      .eq("product_id", productId)
      .eq("is_active", true)
      .single();

    if (priceErr || !price) {
      return errorResponse("No active price found for product", 404);
    }

    // Create new payment attempt
    const idempotencyKey = crypto.randomUUID();

    const { data: attempt, error: attemptErr } = await supabase
      .from("payment_attempts")
      .insert({
        order_id: order_id,
        provider: "paynow",
        status: "NEW",
        amount_minor: price.amount_minor,
        idempotency_key: idempotencyKey,
      })
      .select()
      .single();

    if (attemptErr || !attempt) {
      return errorResponse("Failed to create payment attempt", 500);
    }

    try {
      const paynowResp = await createPaynowPayment({
        amountMinor: price.amount_minor,
        currency: "PLN",
        externalId: order_id,
        description: product.title,
        buyerEmail: order.normalized_email,
        idempotencyKey,
      });

      // Update attempt with external IDs
      await supabase
        .from("payment_attempts")
        .update({
          external_payment_id: paynowResp.paymentId,
          redirect_url: paynowResp.redirectUrl,
        })
        .eq("id", attempt.id);

      // Update order status to pending
      await supabase
        .from("orders")
        .update({ status: "pending" })
        .eq("id", order_id);

      return jsonResponse({ redirect_url: paynowResp.redirectUrl });
    } catch (paynowErr) {
      await supabase
        .from("payment_attempts")
        .update({ status: "ERROR" })
        .eq("id", attempt.id);

      return errorResponse(
        paynowErr instanceof Error ? paynowErr.message : "Payment provider error",
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
