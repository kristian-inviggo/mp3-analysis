import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async setCache<T>(key: string, value: T): Promise<void> {
    await this.cacheManager.set(key, value);
  }

  public async getCache<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get(key);
  }
}
