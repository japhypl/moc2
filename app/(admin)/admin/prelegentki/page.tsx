"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function PrelegentkiPage() {
  const { result, query: { isLoading } } = useList({ resource: "speakers" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Prelegentki
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "name", header: "Imię i nazwisko" },
            { key: "slug", header: "Slug" },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
