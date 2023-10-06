'use client';
import { LucideClipboardCopy, LucideFileImage } from 'lucide-react';
import { toast } from 'sonner';

const copyBio = (text: string) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied bio to clipboard');
};

const downloadHeadshot = () => {
  toast.success('Downloading headshot');
};

export const AboutActions = ({ bio }: { bio: string }) => {
  return (
    <div className="flex items-center md:-ml-4 md:justify-start justify-between">
      <button
        className="flex items-center px-4 py-2 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ease text-sm md:text-base"
        onClick={() => copyBio(bio)}
      >
        <LucideClipboardCopy className="h-[18px] w-[18px] text-current mr-2" />
        Copy bio
      </button>
      <span className="mx-4">•</span>
      <a
        className="flex items-center px-4 py-2 rounded-[12px] border-none hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors ease text-sm md:text-base"
        download
        href="/images/johnie.jpg"
        onClick={downloadHeadshot}
      >
        <LucideFileImage className="h-[18px] w-[18px] text-current mr-2" />
        Download headshot
      </a>
    </div>
  );
};
