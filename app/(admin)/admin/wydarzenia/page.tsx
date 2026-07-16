"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function WydarzeniaPage() {
  const { result, query: { isLoading } } = useList({ resource: "events" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Wydarzenia
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "title", header: "Tytuł" },
            { key: "slug", header: "Slug" },
            {
              key: "date",
              header: "Data",
              render: (value) =>
                value
                  ? new Date(value as string).toLocaleDateString("pl-PL")
                  : "—",
            },
            { key: "status", header: "Status" },
            { key: "campaign_state", header: "Stan kampanii" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
