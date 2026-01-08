import { Music2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getSpotifySong } from "@/lib/server-functions";
import { cn } from "@/lib/utils";

interface SongData {
  title: string;
  artist: string;
  album: string;
  songUrl: string;
  isPlaying: boolean;
}

export function Spotify() {
  const [song, setSong] = useState<SongData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSpotifySong()
      .then((data) => {
        setSong(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="mb-2 flex h-5 items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded bg-neutral-700" />
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-700" />
      </div>
    );
  }

  if (!song) {
    return null;
  }

  return (
    <a
      className="group mb-2 flex items-center gap-2 text-neutral-400 text-sm transition-colors hover:text-neutral-200"
      href={song.songUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-2">
        <Music2
          className={cn(
            "h-4 w-4",
            song.isPlaying ? "text-[#1DB954]" : "text-neutral-500"
          )}
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="font-medium text-neutral-300 group-hover:text-neutral-100">
          {song.title}
        </span>
        <span className="text-neutral-500">by</span>
        <span className="text-neutral-400 group-hover:text-neutral-200">
          {song.artist}
        </span>
      </div>
    </a>
  );
}
