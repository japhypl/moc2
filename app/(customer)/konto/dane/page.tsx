import type { Metadata } from "next";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserProfileById } from "@/lib/supabase/queries";
import { ProfileForm } from "./profile-form";

export const metadata: Metadata = {
  title: "Dane konta — Moc Płomienia",
};

export default async function AccountDataPage() {
  const user = await requireAuth();
  const profile = await getUserProfileById(user.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Dane konta
      </h1>
      <div className="mt-6 max-w-md">
        <ProfileForm
          email={user.email ?? ""}
          displayName={profile?.display_name ?? ""}
        />
      </div>
    </div>
  );
}
