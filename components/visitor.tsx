import { getLastVisitor } from '@/lib/actions';
import { Globe } from 'lucide-react';

export default async function Visitor() {
  const visitor = await getLastVisitor();

  const location = visitor.city
    ? `${visitor.city}, ${visitor.country_name}`
    : visitor.country_name;
  return (
    <div className="flex items-center gap-x-2 text-neutral-500 dark:text-neutral-400 text-sm">
      <Globe className="size-3" />
      <span>Last visit from {location}</span>
    </div>
  );
}
