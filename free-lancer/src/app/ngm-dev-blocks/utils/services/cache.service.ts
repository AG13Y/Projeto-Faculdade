/*
	Installed from https://ui.angular-material.dev/api/registry/
	Update this file using `@ngm-dev/cli update utils/services`
*/

import { Injectable } from '@angular/core';

interface CacheEntry<T = unknown> {
  data: T;
  timestamp: number;
}

const cacheDuration = 60 * 1000 * 60;

@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheEntry>();

  setCache<T = unknown>(id: string, data: T) {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    this.cache.set(id, entry);
  }

  getCache<T = unknown>(id: string) {
    const cachedResponse = this.cache.get(id);
    if (cachedResponse && this.isCacheValid(cachedResponse)) {
      return cachedResponse.data as T;
    }
    return;
  }

  private isCacheValid(cacheEntry: CacheEntry): boolean {
    return Date.now() - cacheEntry.timestamp < cacheDuration;
  }
}
