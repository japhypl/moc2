import type { Metadata } from "next";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserOrders } from "@/lib/supabase/queries";
import { formatPrice } from "@/components/product-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Zamówienia — Moc Płomienia",
};

const STATUS_LABELS: Record<string, string> = {
  new: "Nowe",
  pending: "Oczekujące",
  paid: "Opłacone",
  failed: "Nieudane",
  expired: "Wygasłe",
  abandoned: "Porzucone",
  refunded: "Zwrócone",
};

const STATUS_VARIANTS: Record<string, "default" | "success" | "warning" | "error"> = {
  new: "default",
  pending: "warning",
  paid: "success",
  failed: "error",
  expired: "error",
  abandoned: "default",
  refunded: "warning",
};

export default async function OrdersPage() {
  const user = await requireAuth();
  const orders = await getUserOrders(user.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Zamówienia
      </h1>

      {orders.length === 0 ? (
        <p className="mt-8 text-center text-text-muted">
          Nie masz jeszcze żadnych zamówień.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const items = (order.order_items ?? []) as Array<{
              id: string;
              product_title: string | null;
              quantity: number;
              total_minor: number;
            }>;

            return (
              <Card key={order.id}>
                <CardContent>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="text-sm text-text-muted">
                        {new Date(order.created_at).toLocaleDateString("pl-PL")}
                      </p>
                      <p className="mt-1 font-medium text-text-dark">
                        {formatPrice(order.total_minor)}
                      </p>
                    </div>
                    <Badge
                      variant={STATUS_VARIANTS[order.status] ?? "default"}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                  </div>
                  {items.length > 0 && (
                    <ul className="mt-3 space-y-1 text-sm text-text-muted">
                      {items.map((item) => (
                        <li key={item.id}>
                          {item.product_title ?? "Produkt"}{" "}
                          {item.quantity > 1 && `x${item.quantity}`}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
