"use client";
import { LucideClipboardCopy, LucideFileImage } from "lucide-react";
import { toast } from "sonner";

const copyBio = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success("Copied bio to clipboard");
};

const downloadHeadshot = () => {
  toast.success("Downloading headshot");
};

export const AboutActions = ({ bio }: { bio: string }) => (
  <div className="md:-ml-4 flex items-center justify-between md:justify-start">
    <button
      className="ease flex items-center rounded-[12px] border-none px-4 py-2 text-neutral-500 text-sm transition-colors hover:bg-neutral-50 md:text-base dark:text-neutral-400 dark:hover:bg-neutral-900"
      onClick={() => copyBio(bio)}
      type="button"
    >
      <LucideClipboardCopy className="mr-2 h-[18px] w-[18px] text-current" />
      Copy bio
    </button>
    <span className="mx-0 md:mx-4">•</span>
    <a
      className="ease flex items-center rounded-[12px] border-none px-4 py-2 text-neutral-500 text-sm no-underline transition-colors hover:bg-neutral-50 md:text-base dark:text-neutral-400 dark:hover:bg-neutral-900"
      download
      href="/images/johnie-omni.jpg"
      onClick={downloadHeadshot}
    >
      <LucideFileImage className="mr-2 h-[18px] w-[18px] text-current" />
      Download headshot
    </a>
  </div>
);
