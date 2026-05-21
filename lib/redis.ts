import Redis from 'ioredis';

const url = process.env.REDIS_URL || 'redis://localhost:6379';

const globalForRedis = globalThis as unknown as { redisClient?: Redis };
const client = globalForRedis.redisClient ?? new Redis(url, { lazyConnect: true });
if (process.env.NODE_ENV !== 'production') globalForRedis.redisClient = client;

function parse<T>(value: string | null): T | null {
  if (value === null) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

export const redis = {
  async get<T>(key: string): Promise<T | null> {
    return parse<T>(await client.get(key));
  },
  async set(key: string, value: unknown): Promise<'OK' | null> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    return client.set(key, serialized);
  },
  async del(key: string): Promise<number> {
    return client.del(key);
  },
  async keys(pattern: string): Promise<string[]> {
    return client.keys(pattern);
  },
  async mget<T extends unknown[]>(...keys: string[]): Promise<T> {
    if (keys.length === 0) return [] as unknown as T;
    const values = await client.mget(...keys);
    return values.map((v) => parse(v)) as unknown as T;
  }
};
