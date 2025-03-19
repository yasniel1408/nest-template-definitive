import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import {
  CacheInterceptor,
  CacheModule as NestCacheModule,
} from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-store';
import { CacheableMemory } from 'cacheable';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async (configService: ConfigService, logger: Logger) => {
        const ttl = parseInt(configService.getOrThrow<string>('CACHE_TTL', '60'));
        const max = parseInt(configService.getOrThrow<string>('CACHE_MAX_ITEMS', '9999999999'));
        
        try {
          const store = await redisStore({
            url: `redis://${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<string>('REDIS_PORT')}`,
            ttl: ttl * 1000
          });
          logger.log('Successfully connected to Redis cache');
          return { store, ttl, max };
        } catch (error) {
          logger.warn('Failed to connect to Redis, falling back to memory cache: ' + error.message);
          return {
            store: new CacheableMemory({ ttl: ttl * 1000, lruSize: max }),
            ttl,
            max
          };
        }
      },
      isGlobal: true,
      inject: [ConfigService, Logger],
    }),
  ],
  providers: [
    CacheService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [CacheService],
})
export class CacheModule {}
