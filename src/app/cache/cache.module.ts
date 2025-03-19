import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import Keyv from 'keyv';
import { CacheableMemory, createKeyv } from 'cacheable';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
        useFactory: (configService: ConfigService) => {
            return {
                stores: [
                    // new Keyv({
                    //   store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
                    // }),
                    // createKeyv('redis://localhost:6379'),
                  ],
                ttl: parseInt(configService.getOrThrow<string>("CACHE_TTL", "60")),
                max: parseInt(configService.getOrThrow<string>("CACHE_MAX_ITEMS", "9999999999")),
            };
          },
          isGlobal: true,
          inject: [ConfigService]
    })
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}