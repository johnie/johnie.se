import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <span className="font-medium text-muted-foreground text-lg">
        Page not found <span className="text-white">404</span>
      </span>
      <p className="mt-2 text-sm text-muted-foreground">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <Link href="/" className="mt-6">
        <Button>Go back home</Button>
      </Link>
    </div>
  );
}
