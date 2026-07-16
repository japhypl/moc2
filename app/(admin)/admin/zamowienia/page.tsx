"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";
import { formatPrice } from "@/components/product-card";

export default function ZamowieniaPage() {
  const { result, query: { isLoading } } = useList({ resource: "orders" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Zamówienia (tylko odczyt)
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
            { key: "normalized_email", header: "Email" },
            {
              key: "total_minor",
              header: "Kwota",
              render: (value) =>
                value != null ? formatPrice(value as number) : "—",
            },
            { key: "status", header: "Status" },
            {
              key: "created_at",
              header: "Data utworzenia",
              render: (value) =>
                value
                  ? new Date(value as string).toLocaleDateString("pl-PL")
                  : "—",
            },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
