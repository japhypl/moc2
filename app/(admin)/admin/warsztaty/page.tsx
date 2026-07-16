"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function WarsztatyPage() {
  const { result, query: { isLoading } } = useList({ resource: "workshops" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Warsztaty
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "title", header: "Tytuł" },
            {
              key: "date",
              header: "Data",
              render: (value) =>
                value
                  ? new Date(value as string).toLocaleDateString("pl-PL")
                  : "—",
            },
            { key: "type", header: "Typ" },
            { key: "status", header: "Status" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
