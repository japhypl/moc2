"use client";

import { cn } from "@/lib/utils/cn";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, record: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  readOnly?: boolean;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-text-muted">
        Ladowanie...
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-12 text-text-muted">
        Brak danych do wyswietlenia.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background-secondary">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 font-medium text-text-muted"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((record, rowIdx) => (
            <tr
              key={(record as Record<string, unknown>).id as string ?? rowIdx}
              className={cn(
                "border-b border-border last:border-b-0",
                "hover:bg-background-secondary/50 transition-colors",
              )}
            >
              {columns.map((col) => {
                const value = (record as Record<string, unknown>)[
                  col.key as string
                ];
                return (
                  <td
                    key={String(col.key)}
                    className="px-4 py-3 text-text-dark"
                  >
                    {col.render ? col.render(value, record) : String(value ?? "—")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
