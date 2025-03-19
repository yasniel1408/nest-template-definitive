import { Module } from '@nestjs/common';
import { AppService } from './health/app.service';
import { ConfigModule } from './envs/config.module';
import { AppController } from './health/app.controller';
import { LoggerModule } from './logger/logger.module';
import { CacheModule } from './cache/cache.module';
// import { RateLimitingModule } from './rate-limiting/rate-limiting.module';
import { HttpModule } from './http/http.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    CacheModule,
    // RateLimitingModule,
    HttpModule,
    CircuitBreakerModule.register({
      // Configuración global
      failureThreshold: 5,
      resetTimeout: 60000,
      halfOpenTimeout: 30000,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
