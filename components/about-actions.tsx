"use client";
import { CopyIcon, FileImageIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

const downloadHeadshot = () => {
  toast.success("Downloading headshot");
};

export const AboutActions = ({ bio }: { bio: string }) => {
  const handleCopyBio = async () => {
    if (typeof navigator !== "undefined" && "clipboard" in navigator) {
      try {
        await navigator.clipboard.writeText(bio);
        toast.success("Copied bio to clipboard");
      } catch (error) {
        console.error("Failed to copy bio to clipboard:", error);
        toast.error("Failed to copy bio to clipboard");
      }
    } else {
      toast.error("Clipboard API not available");
    }
  };

  return (
    <div className="flex items-center justify-between md:-ml-4 md:justify-start">
      <button
        className="ease flex items-center rounded-xl border-none px-4 py-2 text-neutral-500 text-sm transition-colors hover:bg-neutral-50 md:text-base dark:text-neutral-400 dark:hover:bg-neutral-900"
        onClick={handleCopyBio}
        type="button"
      >
        <CopyIcon className="mr-2 text-current" size={18} />
        Copy bio
      </button>
      <span className="mx-0 md:mx-4">•</span>
      <a
        className="ease flex items-center rounded-xl border-none px-4 py-2 text-neutral-500 text-sm no-underline transition-colors hover:bg-neutral-50 md:text-base dark:text-neutral-400 dark:hover:bg-neutral-900"
        download
        href="/images/johnie-omni.jpg"
        onClick={downloadHeadshot}
      >
        <FileImageIcon className="mr-2 text-current" size={18} />
        Download headshot
      </a>
    </div>
  );
};
