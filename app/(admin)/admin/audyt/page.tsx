"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function AudytPage() {
  const { result, query: { isLoading } } = useList({ resource: "audit_logs" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Audyt (tylko odczyt)
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "action", header: "Akcja" },
            { key: "resource_type", header: "Typ zasobu" },
            {
              key: "resource_id",
              header: "ID zasobu",
              render: (value) => {
                const id = value as string;
                return id ? id.slice(0, 8) + "..." : "—";
              },
            },
            {
              key: "created_at",
              header: "Data",
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
