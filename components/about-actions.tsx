import { CopyIcon, FileImageIcon } from "@phosphor-icons/react";

import { toast } from "@/components/ui/toast";

const downloadHeadshot = () => {
  toast.add({ title: "Downloading headshot", type: "success" });
};

const copyBio = async (bio: string) => {
  if (!navigator.clipboard) {
    toast.add({ title: "Clipboard API not available", type: "error" });

    return;
  }

  try {
    await navigator.clipboard.writeText(bio);
    toast.add({ title: "Copied bio to clipboard", type: "success" });
  } catch (error) {
    console.error("Failed to copy bio to clipboard:", error);
    toast.add({ title: "Failed to copy bio to clipboard", type: "error" });
  }
};

const ACTION_CLASS_NAME =
  "flex items-center rounded-xl border-none px-4 py-2 text-sm text-neutral-500 transition-[background-color,scale] duration-150 hover:bg-neutral-50 active:scale-[0.97] active:bg-neutral-100 active:duration-0 md:text-base dark:text-neutral-400 dark:hover:bg-neutral-900 dark:active:bg-neutral-800";

export const AboutActions = ({
  longBio,
  shortBio,
}: {
  longBio: string;
  shortBio: string;
}) => (
  <div className="flex flex-wrap items-center justify-between md:-ml-4 md:justify-start">
    <button
      className={ACTION_CLASS_NAME}
      onClick={() => copyBio(shortBio)}
      type="button"
    >
      <CopyIcon className="mr-2 text-current" size={18} />
      Copy short bio
    </button>
    <span className="mx-0 md:mx-4">•</span>
    <button
      className={ACTION_CLASS_NAME}
      onClick={() => copyBio(longBio)}
      type="button"
    >
      <CopyIcon className="mr-2 text-current" size={18} />
      Copy long bio
    </button>
    <span className="mx-0 md:mx-4">•</span>
    <a
      className={`${ACTION_CLASS_NAME} no-underline`}
      download
      href="/images/johnie-omni.jpg"
      onClick={downloadHeadshot}
    >
      <FileImageIcon className="mr-2 text-current" size={18} />
      Download headshot
    </a>
  </div>
);
