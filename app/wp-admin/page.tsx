import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Login ‹ Johnie",
  description: "Bold of you to assume this is WordPress",
  robots: {
    index: false,
    follow: false,
  },
};

export default function WpAdminPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="max-w-2xl space-y-8">
        <div className="space-y-4 text-lg text-neutral-600 dark:text-neutral-400">
          <Image
            alt="GIF of a person looking surprised"
            className="mx-auto rounded-lg"
            height={270}
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTAxdXM0c2d0c2hseWZ5b3RhMzMya3lvZTZvdXA3cXFobHo1NGsxdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BcMJvmwkmbyWpKkBj3/giphy.gif"
            width={480}
          />
        </div>

        <div className="pt-8">
          <Link
            className="inline-block rounded-lg bg-neutral-900 px-6 py-3 font-medium text-sm text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
            href="/"
          >
            Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
