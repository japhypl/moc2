const encoder = new TextEncoder();

function getConfig() {
  const apiKey = Deno.env.get("PAYNOW_API_KEY") ?? "";
  const signatureKey = Deno.env.get("PAYNOW_SIGNATURE_KEY") ?? "";
  const baseUrl =
    Deno.env.get("PAYNOW_API_BASE_URL") ??
    "https://api.sandbox.paynow.pl";
  const continueUrl =
    Deno.env.get("PAYNOW_CONTINUE_URL") ??
    "https://mocplomienia.pl/platnosc/status";
  const notificationUrl = Deno.env.get("PAYNOW_NOTIFICATION_URL") ?? "";
  return { apiKey, signatureKey, baseUrl, continueUrl, notificationUrl };
}

export interface CreatePaymentParams {
  amountMinor: number;
  currency: string;
  externalId: string;
  description: string;
  buyerEmail: string;
  idempotencyKey: string;
}

export interface PaynowPaymentResponse {
  paymentId: string;
  status: string;
  redirectUrl: string;
}

export async function createPaynowPayment(
  params: CreatePaymentParams,
): Promise<PaynowPaymentResponse> {
  const config = getConfig();

  const body = {
    amount: params.amountMinor,
    currency: params.currency,
    externalId: params.externalId,
    description: params.description,
    buyer: { email: params.buyerEmail },
    continueUrl: `${config.continueUrl}?order_id=${params.externalId}`,
  };

  const res = await fetch(`${config.baseUrl}/v3/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": config.apiKey,
      "Idempotency-Key": params.idempotencyKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paynow API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function verifyPaynowSignature(
  rawBody: string,
  signatureHeader: string | null,
): Promise<boolean> {
  if (!signatureHeader) return false;

  const config = getConfig();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(config.signatureKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(rawBody),
  );

  const computed = btoa(
    String.fromCharCode(...new Uint8Array(signature)),
  );

  return computed === signatureHeader;
}

export async function computeEventHash(
  paymentId: string,
  status: string,
  modifiedAt: string,
): Promise<string> {
  const data = `${paymentId}:${status}:${modifiedAt}`;
  const hash = await crypto.subtle.digest(
    "SHA-256",
    encoder.encode(data),
  );
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface CreateRefundParams {
  paymentId: string;
  amountMinor: number;
  reason?: string;
}

export async function createPaynowRefund(
  params: CreateRefundParams,
): Promise<{ refundId: string; status: string }> {
  const config = getConfig();

  const body: Record<string, unknown> = {
    amount: params.amountMinor,
  };
  if (params.reason) body.reason = params.reason;

  const res = await fetch(
    `${config.baseUrl}/v3/payments/${params.paymentId}/refunds`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": config.apiKey,
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify(body),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paynow refund error ${res.status}: ${text}`);
  }

  return res.json();
}
