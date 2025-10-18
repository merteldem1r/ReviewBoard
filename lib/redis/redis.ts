import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache config
export const CACHE_TTL = {
  ITEMS: 300,
  TAGS: 600
};

// helpers
export async function invalidateCache(key: string): Promise<void> {
  await redis.del(key);
}

export function getCacheKeyUser(prefix: string, userId: string): string {
  return `${prefix}:${userId}`;
}


