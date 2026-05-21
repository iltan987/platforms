import { Redis as UpstashRedis } from '@upstash/redis';
import IORedis from 'ioredis';

type RedisLike = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<'OK' | null>;
  del(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  mget<T extends unknown[]>(...keys: string[]): Promise<T>;
};

function parse<T>(value: string | null): T | null {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

function createIORedis(url: string): RedisLike {
  const client = new IORedis(url, { lazyConnect: true });
  return {
    async get<T>(key: string) {
      return parse<T>(await client.get(key));
    },
    async set(key: string, value: unknown) {
      const v = typeof value === 'string' ? value : JSON.stringify(value);
      return client.set(key, v);
    },
    async del(key: string) {
      return client.del(key);
    },
    async keys(pattern: string) {
      return client.keys(pattern);
    },
    async mget<T extends unknown[]>(...keys: string[]) {
      if (keys.length === 0) return [] as unknown as T;
      const values = await client.mget(...keys);
      return values.map((v) => parse(v)) as unknown as T;
    }
  };
}

function createUpstash(): RedisLike {
  return new UpstashRedis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
  }) as unknown as RedisLike;
}

// Use ioredis only when REDIS_URL is set (self-hosted / Docker).
// Default to Upstash so the upstream config keeps working unchanged.
function createClient(): RedisLike {
  if (process.env.REDIS_URL) {
    return createIORedis(process.env.REDIS_URL);
  }
  return createUpstash();
}

const globalForRedis = globalThis as unknown as { redisClient?: RedisLike };
export const redis = globalForRedis.redisClient ?? createClient();
if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = redis;
