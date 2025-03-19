import { Module } from '@nestjs/common';
import { AppService } from './health/app.service';
import { ConfigModule } from './envs/config.module';
import { AppController } from './health/app.controller';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [ConfigModule, LoggerModule, CacheModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
