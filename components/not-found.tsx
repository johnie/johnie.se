import { Link } from "@tanstack/react-router";

const NotFound = () => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-muted-foreground text-lg font-medium">
      Page not found <span className="text-white">404</span>
    </span>
    <p className="text-muted-foreground mt-2 text-sm">
      Sorry, we couldn&apos;t find the page you&apos;re looking for.
    </p>
    <Link
      className="ring-offset-background focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
      to="/"
    >
      Go back home
    </Link>
  </div>
);

export default NotFound;
