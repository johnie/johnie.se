import { formatCount } from "@/lib/utils";

export const Views = ({ count }: { count: number }) => (
  <p>{`${formatCount(count)} views`}</p>
);
