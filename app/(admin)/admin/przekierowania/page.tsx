"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function PrzekierowaniaPage() {
  const { result, query: { isLoading } } = useList({ resource: "redirects" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Przekierowania
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "source_path", header: "Ścieżka źródłowa" },
            { key: "target_path", header: "Ścieżka docelowa" },
            { key: "status_code", header: "Kod statusu" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
