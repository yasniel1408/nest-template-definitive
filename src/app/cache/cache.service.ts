import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly logger: Logger) {}

  async cacheFirst<T>(key: string, fallback: () => Promise<T>, ttl: number): Promise<T> {
    const cached = await this.cacheManager.get<T>(key);
    if (cached) {
        fallback().catch((err) => {
            this.logger.error(err);
        });
        return cached;
    }
    const data = await fallback();
    await this.cacheManager.set(key, data, ttl * 10000); // ttl in seconds
    return data;
  }

  async onlyCache<T>(key: string, data: T, ttl: number): Promise<T> {
    return await this.cacheManager.set(key, data, ttl * 1000);
  }

  async invalidate(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async invalidateAll(): Promise<void> {
    await this.cacheManager.clear();
  }

  async get<T>(key: string): Promise<T | undefined> {
    return await this.cacheManager.get<T>(key) as Promise<T | undefined>;
  }
}