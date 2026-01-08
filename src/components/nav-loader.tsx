import { lazy, Suspense } from "react";

const NavigationComponent = lazy(() =>
  import("@/components/nav").then((mod) => ({ default: mod.default }))
);

function NavigationFallback() {
  return (
    <nav className="fade relative flex flex-row items-center justify-end px-0 pb-0 md:relative">
      <div className="flex flex-row space-x-2 rounded-lg bg-neutral-50 p-1 text-sm dark:bg-black">
        {["Home", "About", "Writing", "TIL"].map((name) => (
          <span className="relative px-3 py-1 text-muted-foreground" key={name}>
            {name}
          </span>
        ))}
      </div>
    </nav>
  );
}

export default function Navigation() {
  return (
    <Suspense fallback={<NavigationFallback />}>
      <NavigationComponent />
    </Suspense>
  );
}
