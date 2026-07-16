"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function UzytkowniczkiPage() {
  const { result, query: { isLoading } } = useList({ resource: "profiles" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Użytkowniczki
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
            { key: "display_name", header: "Nazwa" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
