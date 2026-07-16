"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";
import { formatPrice } from "@/components/product-card";

export default function PlatnosciPage() {
  const { result, query: { isLoading } } = useList({ resource: "payment_attempts" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Płatności (tylko odczyt)
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            {
              key: "id",
              header: "ID",
              render: (value) => {
                const id = value as string;
                return id ? id.slice(0, 8) + "..." : "—";
              },
            },
            {
              key: "order_id",
              header: "Zamówienie",
              render: (value) => {
                const id = value as string;
                return id ? id.slice(0, 8) + "..." : "—";
              },
            },
            { key: "status", header: "Status" },
            {
              key: "amount_minor",
              header: "Kwota",
              render: (value) =>
                value != null ? formatPrice(value as number) : "—",
            },
            { key: "provider", header: "Provider" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
