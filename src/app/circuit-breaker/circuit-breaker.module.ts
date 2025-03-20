import { DynamicModule, Global, Module } from '@nestjs/common';
import { CircuitBreakerService } from './services/circuit-breaker.service';
import { CircuitBreakerController } from './controllers/circuit-breaker.controller';

export interface CircuitBreakerModuleOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenTimeout: number;
}

@Global()
@Module({
  controllers: [CircuitBreakerController],
  providers: [CircuitBreakerService],
})
export class CircuitBreakerModule {
  static register(options: CircuitBreakerModuleOptions): DynamicModule {
    return {
      module: CircuitBreakerModule,
      providers: [
        {
          provide: 'CIRCUIT_BREAKER_OPTIONS',
          useValue: options,
        },
        CircuitBreakerService,
      ],
      exports: [CircuitBreakerService],
    };
  }
}
