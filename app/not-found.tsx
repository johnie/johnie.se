import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="font-medium text-lg text-muted-foreground">
        Page not found <span className="text-white">404</span>
      </span>
      <p className="mt-2 text-muted-foreground text-sm">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link className="mt-6" href="/">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
