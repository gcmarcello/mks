import { Logger, Module } from '@nestjs/common';

import { Redis } from 'ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [ConfigModule],
  providers: [
    RedisService,
    {
      provide: 'RedisClient',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisInstance = new Redis({
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        });

        redisInstance.on('error', (error) => {
          if ((error as any).code === 'ECONNRESET') {
            console.log('Connection to Redis Session Store timed out.');
          } else if ((error as any).code === 'ECONNREFUSED') {
            console.log('Connection to Redis Session Store refused!');
          } else console.log(error);
        });

        redisInstance.on('reconnecting', (err) => {
          if (redisInstance.status === 'reconnecting')
            console.log('Reconnecting to Redis Session Store...');
          else console.log('Error reconnecting to Redis Session Store.');
        });

        redisInstance.on('connect', () => new Logger().log('Redis connected'));

        return redisInstance;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
