import { MusicNoteIcon } from "@phosphor-icons/react/dist/ssr";

import { getCurrentOrLastSong } from "@/lib/spotify";
import { cn } from "@/lib/utils";

export const Spotify = async () => {
  const song = await getCurrentOrLastSong();

  if (!song) {
    return null;
  }

  return (
    <a
      className="group flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
      href={song.songUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-2">
        <MusicNoteIcon
          className={cn(song.isPlaying ? "text-[#1DB954]" : "text-neutral-500")}
          size={16}
        />
      </div>
      <div className="flex min-w-0 items-center gap-1">
        <span className="truncate font-medium text-neutral-300 group-hover:text-neutral-100">
          {song.title}
        </span>
        <span className="shrink-0 text-neutral-500">by</span>
        <span className="truncate text-neutral-400 group-hover:text-neutral-200">
          {song.artist}
        </span>
      </div>
    </a>
  );
};
