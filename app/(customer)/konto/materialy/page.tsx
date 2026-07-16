import type { Metadata } from "next";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserDownloadableMaterials } from "@/lib/supabase/queries";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadLink } from "./download-link";

export const metadata: Metadata = {
  title: "Materiały — Moc Płomienia",
};

export default async function MaterialsPage() {
  const user = await requireAuth();
  const materials = await getUserDownloadableMaterials(user.id);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-text-dark">
        Materiały do pobrania
      </h1>

      {materials.length === 0 ? (
        <p className="mt-8 text-center text-text-muted">
          Brak materiałów do pobrania.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {materials.map((material) => (
            <Card key={material.id}>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-text-dark">
                      {material.title}
                    </h2>
                    {material.file_type && (
                      <p className="mt-1 text-sm text-text-muted">
                        {material.file_type.toUpperCase()}
                      </p>
                    )}
                  </div>
                  {material.file_path && (
                    <DownloadLink
                      filePath={material.file_path}
                      title={material.title}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
