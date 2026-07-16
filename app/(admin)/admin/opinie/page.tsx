"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function OpiniePage() {
  const { result, query: { isLoading } } = useList({ resource: "testimonials" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Opinie
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "author", header: "Autor" },
            {
              key: "quote",
              header: "Cytat",
              render: (value) => {
                const text = value as string;
                if (!text) return "—";
                return text.length > 80 ? text.slice(0, 80) + "..." : text;
              },
            },
            { key: "approval_status", header: "Status" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
