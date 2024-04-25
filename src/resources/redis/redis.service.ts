import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('RedisClient') private readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  async get(prefix: string, key: string) {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async getAllKeysFromPrefix(prefix: string) {
    return this.redisClient.keys(`${prefix}:*`);
  }

  async getMany(prefix: string, keys: string[]) {
    return this.redisClient.mget(keys.map((key) => `${prefix}:${key}`));
  }

  async set(prefix: string, key: string, value: string) {
    await this.redisClient.set(`${prefix}:${key}`, value);
  }

  async delete(prefix: string, key: string) {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }
}
