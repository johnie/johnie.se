import Link from "next/link";

import { Button } from "@/components/ui/button";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-muted-foreground text-lg font-medium">
      Page not found <span className="text-white">404</span>
    </span>
    <p className="text-muted-foreground mt-2 text-sm">
      Sorry, we couldn&apos;t find the page you&apos;re looking for.
    </p>
    <Link className="mt-6" href="/">
      <Button>Go back home</Button>
    </Link>
  </div>
);

export default NotFound;
