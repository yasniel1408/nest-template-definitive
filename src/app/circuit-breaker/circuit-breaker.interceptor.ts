import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CircuitBreakerService } from './circuit-breaker.service';
import { Reflector } from '@nestjs/core';
import { CIRCUIT_BREAKER_OPTIONS } from './circuit-breaker.decorator';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  constructor(
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.get(
      CIRCUIT_BREAKER_OPTIONS,
      context.getHandler(),
    ) || {};

    const key = options.key || `${context.getClass().name}_${context.getHandler().name}`;

    return new Observable(subscriber => {
      this.circuitBreakerService
        .executeWithCircuitBreaker(
          key,
          () => next.handle().toPromise(),
          options,
        )
        .then(value => {
          subscriber.next(value);
          subscriber.complete();
        })
        .catch(err => subscriber.error(err));
    });
  }
}