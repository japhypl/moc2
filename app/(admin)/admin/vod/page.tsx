"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function VodPage() {
  const { result, query: { isLoading } } = useList({ resource: "vod_items" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">VOD</h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "title", header: "Tytuł" },
            { key: "video_provider", header: "Provider" },
            {
              key: "duration_seconds",
              header: "Czas trwania",
              render: (value) => {
                const seconds = value as number;
                if (seconds == null) return "—";
                return (
                  Math.floor(seconds / 60) +
                  ":" +
                  (seconds % 60).toString().padStart(2, "0")
                );
              },
            },
          ]}
          data={records}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
