"use client";

import { useList } from "@refinedev/core";
import { DataTable } from "@/components/admin/data-table";

export default function NewsletterPage() {
  const { result, query: { isLoading } } = useList({ resource: "newsletter_subscriptions" });
  const records = result.data ?? [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Newsletter
      </h1>
      <div className="mt-6">
        <DataTable
          columns={[
            { key: "email", header: "Email" },
            { key: "status", header: "Status" },
            {
              key: "subscribed_at",
              header: "Data subskrypcji",
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
