"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function IntegracjePage() {
  const { result, query: { isLoading } } = useList({ resource: "integration_sync_runs" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Integracje (tylko odczyt)
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "provider", header: "Provider" },
            { key: "status", header: "Status" },
            { key: "records_total", header: "Łącznie" },
            { key: "records_imported", header: "Zaimportowano" },
            {
              key: "started_at",
              header: "Rozpoczęto",
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
