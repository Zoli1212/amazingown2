type CacheItem<T> = {
  data: T;
  timestamp: number;
};

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const cache = new Map<string, CacheItem<unknown>>();

export function getCache<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;

  const isExpired = Date.now() - item.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return item.data as T;
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const cached = getCache<T>(key);
  if (cached) return cached;

  const data = await fn();
  setCache(key, data);
  return data;
}
