"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type VideoPlayerProps = {
  thumbnailUrl: string;
  title: string;
  onRequestPlayback: () => Promise<string>;
  className?: string;
};

function VideoPlayer({
  thumbnailUrl,
  title,
  onRequestPlayback,
  className,
}: VideoPlayerProps) {
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePlay() {
    setLoading(true);
    setError(null);
    try {
      const url = await onRequestPlayback();
      setPlaybackUrl(url);
    } catch {
      setError("Nie udało się załadować wideo. Spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  }

  if (playbackUrl) {
    return (
      <div className={cn("relative aspect-video overflow-hidden rounded-card", className)}>
        <iframe
          src={playbackUrl}
          title={title}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={cn("group relative aspect-video overflow-hidden rounded-card", className)}>
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 66vw, 50vw"
      />
      <button
        type="button"
        onClick={handlePlay}
        disabled={loading}
        className="absolute inset-0 flex items-center justify-center bg-background-dark/30 transition-colors hover:bg-background-dark/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-gold"
        aria-label={`Odtwórz: ${title}`}
      >
        {loading ? (
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-text-light/30 border-t-text-light" />
        ) : (
          <PlayIcon />
        )}
      </button>
      {error && (
        <div className="absolute inset-x-0 bottom-0 bg-status-error/90 p-3 text-center text-sm text-text-light">
          {error}
        </div>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="drop-shadow-lg"
    >
      <circle cx="32" cy="32" r="32" fill="white" fillOpacity="0.9" />
      <path d="M26 20l20 12-20 12V20z" fill="#1B2432" />
    </svg>
  );
}

export { VideoPlayer };
export type { VideoPlayerProps };
