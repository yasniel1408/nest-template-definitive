import { Module } from '@nestjs/common';
import { ConfigModule } from './envs/config.module';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
// import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { HttpModule } from './http/http.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';
import { HealthModule } from './health/health.module';
import { ErrorManagerModule } from './error-manager/error-manager.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    CacheModule,
    // RateLimitingModule,
    HttpModule,
    CircuitBreakerModule,
    HealthModule,
    ErrorManagerModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
