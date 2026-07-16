import { getSupabaseAdmin } from "../_shared/supabase-admin.ts";
import { verifyPaynowSignature, computeEventHash } from "../_shared/paynow.ts";

Deno.serve(async (req) => {
  try {
    const rawBody = await req.text();

    // Verify signature
    const signatureValid = await verifyPaynowSignature(
      rawBody,
      req.headers.get("Signature"),
    );

    if (!signatureValid) {
      return new Response("Invalid signature", { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const { paymentId, status, modifiedAt } = payload;

    const externalEventHash = await computeEventHash(paymentId, status, modifiedAt);

    const supabase = getSupabaseAdmin();

    // Insert notification with dedup
    const { data: notification, error: notifErr } = await supabase
      .from("payment_notifications")
      .insert({
        provider: "paynow",
        external_event_hash: externalEventHash,
        external_payment_id: paymentId,
        signature_valid: true,
        payload,
        provider_modified_at: modifiedAt,
        processing_status: "pending",
      })
      .select()
      .single();

    // ON CONFLICT — already processed, return 200
    if (notifErr) {
      return new Response("OK", { status: 200 });
    }

    // Find payment attempt
    const { data: attempt } = await supabase
      .from("payment_attempts")
      .select("*")
      .eq("provider", "paynow")
      .eq("external_payment_id", paymentId)
      .single();

    if (!attempt) {
      await supabase
        .from("payment_notifications")
        .update({ processing_status: "error" })
        .eq("id", notification.id);
      return new Response("OK", { status: 200 });
    }

    // Never regress from final statuses
    const finalStatuses = ["CONFIRMED", "REJECTED"];
    if (finalStatuses.includes(attempt.status)) {
      await supabase
        .from("payment_notifications")
        .update({ processing_status: "skipped" })
        .eq("id", notification.id);
      return new Response("OK", { status: 200 });
    }

    // Update payment attempt status
    await supabase
      .from("payment_attempts")
      .update({ status, provider_modified_at: modifiedAt })
      .eq("id", attempt.id);

    if (status === "CONFIRMED") {
      // Get order
      const { data: order } = await supabase
        .from("orders")
        .select("*")
        .eq("id", attempt.order_id)
        .single();

      if (order) {
        // Mark order as paid
        await supabase
          .from("orders")
          .update({ status: "paid", paid_at: new Date().toISOString() })
          .eq("id", order.id);

        // Get order items
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);

        let userId = order.user_id;

        // If no user_id, try to find user by email
        if (!userId && order.normalized_email) {
          const { data: usersData } = await supabase.auth.admin.listUsers();
          const matchedUser = usersData?.users?.find(
            (u: { email?: string }) =>
              u.email?.toLowerCase() === order.normalized_email,
          );
          if (matchedUser) {
            userId = matchedUser.id;
            await supabase
              .from("orders")
              .update({ user_id: userId })
              .eq("id", order.id);
          }
        }

        // Create entitlements for each order item
        if (items && userId) {
          for (const item of items) {
            await supabase.from("entitlements").upsert(
              {
                user_id: userId,
                product_id: item.product_id,
                order_id: order.id,
                granted_at: new Date().toISOString(),
              },
              { onConflict: "user_id,product_id,order_id", ignoreDuplicates: true },
            );
          }
        }
      }
    } else {
      // Map other statuses to order statuses
      const statusMap: Record<string, string> = {
        REJECTED: "failed",
        ERROR: "failed",
        EXPIRED: "expired",
        ABANDONED: "abandoned",
        PENDING: "pending",
      };

      const orderStatus = statusMap[status];
      if (orderStatus) {
        await supabase
          .from("orders")
          .update({ status: orderStatus })
          .eq("id", attempt.order_id);
      }
    }

    // Mark notification as processed
    await supabase
      .from("payment_notifications")
      .update({
        processing_status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", notification.id);

    return new Response("OK", { status: 200 });
  } catch (_err) {
    return new Response("Internal error", { status: 500 });
  }
});
