import Redis, { Redis as RedisClient } from 'ioredis';

import cacheConfig from '@config/cache';

import ICacheProvider from '../models/ICacheProvider';
import IRecoverFromList from '../dtos/IRecoverFromList';

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save<T>(key: string, value: T): Promise<void> {
    this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }

  public async invalidateMany(keys: string[]): Promise<void> {
    const pipeline = this.client.pipeline();

    keys.forEach(async key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }

  public async pushToList<T>(key: string, value: T[]): Promise<void> {
    const parsedValue = value.map(v => JSON.stringify(v));

    this.client.lpush(key, ...parsedValue);
  }

  public async recoverFromList<T>({
    key,
    fromIndex = 0,
    total = 10,
  }: IRecoverFromList): Promise<T[] | null> {
    const data = await this.client.lrange(key, fromIndex, total);

    if (!data || !data.length) return null;

    const parsedData = data.map(v => JSON.parse(v)) as T[];

    return parsedData;
  }
}

export default RedisCacheProvider;
