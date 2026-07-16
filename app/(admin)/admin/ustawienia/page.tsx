"use client";

import { useList } from "@refinedev/core";

const CAMPAIGN_STATES = [
  "NO_ACTIVE_CAMPAIGN",
  "pre_launch",
  "early_bird",
  "regular_sale",
  "last_chance",
  "sold_out",
  "event_live",
  "post_event",
] as const;

export default function UstawieniaPage() {
  const { result, query: { isLoading } } = useList({
    resource: "site_settings",
    pagination: { currentPage: 1, pageSize: 1 },
  });
  const settings = result.data?.[0] as Record<string, unknown> | undefined;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-text-muted">
        Ładowanie...
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Ustawienia
      </h1>
      <div className="mt-6 max-w-xl space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Stan kampanii
          </label>
          <select
            className="w-full rounded-lg border border-border bg-background-primary px-3 py-2 text-sm text-text-dark"
            defaultValue={(settings?.campaign_state as string) ?? ""}
            disabled
          >
            {CAMPAIGN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Deadline odliczania
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-border bg-background-primary px-3 py-2 text-sm text-text-dark"
            defaultValue={(settings?.countdown_deadline as string) ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Email kontaktowy
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-border bg-background-primary px-3 py-2 text-sm text-text-dark"
            defaultValue={(settings?.contact_email as string) ?? ""}
            readOnly
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text-muted">
            Telefon kontaktowy
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-border bg-background-primary px-3 py-2 text-sm text-text-dark"
            defaultValue={(settings?.contact_phone as string) ?? ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
}
