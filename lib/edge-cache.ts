/** The part of the Workers `CacheStorage` the edge cache uses. */
export interface CacheStore {
  open: (cacheName: string) => Promise<Pick<Cache, "match" | "put">>;
}

/**
 * Returns the cached JSON value for `key`, or runs `load` and caches its
 * result for `ttlSeconds`. An unavailable cache never fails the read.
 */
export type EdgeCache = <T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T>
) => Promise<T>;

const CACHE_NAME = "johnie-se-data";

export const createEdgeCache =
  (store: CacheStore): EdgeCache =>
  async <T>(key: string, ttlSeconds: number, load: () => Promise<T>) => {
    let cache: Pick<Cache, "match" | "put"> | undefined;

    const request = new Request(
      `https://cache.johnie.se/${encodeURIComponent(key)}`
    );

    try {
      cache = await store.open(CACHE_NAME);
      const hit = await cache.match(request);

      if (hit) {
        // SAFETY: This cache key is written only with the same loader's JSON value.
        return (await hit.json()) as T;
      }
    } catch (error) {
      console.error("Edge cache unavailable:", error);
    }

    const value = await load();

    if (cache) {
      try {
        await cache.put(
          request,
          Response.json(value, {
            headers: { "Cache-Control": `public, max-age=${ttlSeconds}` },
          })
        );
      } catch (error) {
        console.error("Edge cache unavailable:", error);
      }
    }

    return value;
  };
