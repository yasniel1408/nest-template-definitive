import { applyDecorators, SetMetadata } from '@nestjs/common';

export interface CircuitBreakerOptions {
  key?: string;
  failureThreshold?: number;
  resetTimeout?: number;
  halfOpenTimeout?: number;
}

export const CIRCUIT_BREAKER_OPTIONS = 'CIRCUIT_BREAKER_OPTIONS';

export function UseCircuitBreaker(options: CircuitBreakerOptions = {}) {
  return applyDecorators(
    SetMetadata(CIRCUIT_BREAKER_OPTIONS, options),
  );
}