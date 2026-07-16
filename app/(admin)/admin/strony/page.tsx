"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function StronyPage() {
  const { result, query: { isLoading } } = useList({ resource: "pages" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">Strony</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "title", header: "Tytuł" },
            { key: "slug", header: "Slug" },
            { key: "status", header: "Status" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
