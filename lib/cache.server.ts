export const withEdgeCache = async <T>(
  key: string,
  ttlSeconds: number,
  load: () => Promise<T>
): Promise<T> => {
  let cache: Cache | undefined;

  const request = new Request(
    `https://cache.johnie.se/${encodeURIComponent(key)}`
  );

  try {
    cache = await caches.open("johnie-se-data");
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
