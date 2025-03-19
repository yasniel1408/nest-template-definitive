import { DynamicModule, Global, Module } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service';

export interface CircuitBreakerModuleOptions {
  failureThreshold: number;
  resetTimeout: number;
  halfOpenTimeout: number;
}

@Global()
@Module({})
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