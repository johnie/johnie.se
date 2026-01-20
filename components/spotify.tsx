import { MusicNoteIcon } from "@phosphor-icons/react/dist/ssr";
import { getCurrentOrLastSong } from "@/lib/spotify";
import { cn } from "@/lib/utils";

export async function Spotify() {
  const song = await getCurrentOrLastSong();

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
        <MusicNoteIcon
          className={cn(song.isPlaying ? "text-[#1DB954]" : "text-neutral-500")}
          size={16}
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
