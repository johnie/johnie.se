import { lazy, Suspense } from "react";

const MdxComponent = lazy(() =>
  import("@/components/mdx").then((mod) => ({ default: mod.Mdx }))
);

function MdxFallback() {
  return (
    <div className="prose dark:prose-invert animate-pulse">
      <div className="mb-4 h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mb-4 h-4 w-full rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mb-4 h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mb-4 h-4 w-2/3 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  );
}

export function Mdx({ code }: { code: string }) {
  return (
    <Suspense fallback={<MdxFallback />}>
      <MdxComponent code={code} />
    </Suspense>
  );
}
