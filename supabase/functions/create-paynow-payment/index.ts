import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { createPaynowPayment } from "../_shared/paynow.ts";
import { handleCors, jsonResponse, errorResponse } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  const corsResp = handleCors(req);
  if (corsResp) return corsResp;

  try {
    const { product_id, email, consent_terms, consent_digital_delivery, consent_marketing } =
      await req.json();

    if (!product_id || !email) {
      return errorResponse("Missing required fields: product_id, email");
    }
    if (consent_terms !== true) {
      return errorResponse("consent_terms must be true");
    }
    if (consent_digital_delivery !== true) {
      return errorResponse("consent_digital_delivery must be true");
    }

    const supabase = getSupabaseAdmin();

    // Read product
    const { data: product, error: productErr } = await supabase
      .from("products")
      .select("*")
      .eq("id", product_id)
      .eq("status", "published")
      .single();

    if (productErr || !product) {
      return errorResponse("Product not found or not published", 404);
    }

    // Read active price
    const { data: price, error: priceErr } = await supabase
      .from("product_prices")
      .select("*")
      .eq("product_id", product_id)
      .eq("is_active", true)
      .single();

    if (priceErr || !price) {
      return errorResponse("No active price found for product", 404);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        normalized_email: normalizedEmail,
        currency: "PLN",
        subtotal_minor: price.amount_minor,
        total_minor: price.amount_minor,
        status: "new",
      })
      .select()
      .single();

    if (orderErr || !order) {
      return errorResponse("Failed to create order", 500);
    }

    // Create order item
    const { error: itemErr } = await supabase.from("order_items").insert({
      order_id: order.id,
      product_id: product_id,
      quantity: 1,
      unit_price_minor: price.amount_minor,
      total_minor: price.amount_minor,
      product_title: product.title,
    });

    if (itemErr) {
      return errorResponse("Failed to create order item", 500);
    }

    // Record consents
    const consents = [
      { consent_type: "terms", granted: true },
      { consent_type: "digital_delivery", granted: true },
      { consent_type: "marketing", granted: consent_marketing === true },
    ];

    await supabase.from("consent_records").insert(
      consents.map((c) => ({
        ...c,
        order_id: order.id,
        email: normalizedEmail,
        ip_address: ipAddress,
      })),
    );

    // Create payment attempt
    const idempotencyKey = crypto.randomUUID();

    const { data: attempt, error: attemptErr } = await supabase
      .from("payment_attempts")
      .insert({
        order_id: order.id,
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
      // Call Paynow
      const paynowResp = await createPaynowPayment({
        amountMinor: price.amount_minor,
        currency: "PLN",
        externalId: order.id,
        description: product.title,
        buyerEmail: normalizedEmail,
        idempotencyKey,
      });

      // Update payment attempt with external IDs
      await supabase
        .from("payment_attempts")
        .update({
          external_payment_id: paynowResp.paymentId,
          redirect_url: paynowResp.redirectUrl,
        })
        .eq("id", attempt.id);

      return jsonResponse({ order_id: order.id, redirect_url: paynowResp.redirectUrl });
    } catch (paynowErr) {
      // Mark attempt as error
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
