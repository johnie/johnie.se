import { lazy, Suspense } from "react";

const CMDComponent = lazy(() =>
  import("@/components/cmd").then((mod) => ({ default: mod.CMD }))
);

export const CMD = () => (
  <Suspense fallback={null}>
    <CMDComponent />
  </Suspense>
);
