import { Module } from '@nestjs/common';
import { AppService } from './health/app.service';
import { ConfigModule } from './envs/config.module';
import { AppController } from './health/app.controller';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
import { RateLimitingModule } from './rate-limiting/rate-limiting.module';

@Module({
  imports: [ConfigModule, LoggerModule, CacheModule, RateLimitingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
