"use client";

import { createClient } from "@/lib/supabase/client";
import { VideoPlayer } from "@/components/video-player";

type PlayerItemProps = {
  vodItemId: string;
  title: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function PlayerItem({
  vodItemId,
  title,
  thumbnailUrl,
  durationSeconds,
}: PlayerItemProps) {
  async function handleRequestPlayback(): Promise<string> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/issue-video-playback-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token ?? ""}`,
        },
        body: JSON.stringify({ vod_item_id: vodItemId }),
      },
    );

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { error?: string }).error ??
          "Nie udało się załadować wideo.",
      );
    }

    const data = (await res.json()) as { playback_url: string };
    return data.playback_url;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-text-dark">
          {title}
        </h3>
        {durationSeconds != null && (
          <span className="text-sm text-text-muted">
            {formatDuration(durationSeconds)}
          </span>
        )}
      </div>
      {thumbnailUrl ? (
        <div className="mt-3">
          <VideoPlayer
            thumbnailUrl={thumbnailUrl}
            title={title}
            onRequestPlayback={handleRequestPlayback}
          />
        </div>
      ) : (
        <p className="mt-2 text-sm text-text-muted">
          Odtwarzacz będzie dostępny wkrótce.
        </p>
      )}
    </div>
  );
}
