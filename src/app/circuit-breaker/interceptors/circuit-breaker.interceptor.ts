import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CIRCUIT_BREAKER_OPTIONS } from '../decorators/circuit-breaker.decorator';
import { CircuitBreakerService } from '../services/circuit-breaker.service';
import { CircuitBreakerOpenError } from '../errors/CircuitBreakerOpenError';

@Injectable()
export class CircuitBreakerInterceptor implements NestInterceptor {
  constructor(
    private readonly circuitBreakerService: CircuitBreakerService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options =
      this.reflector.get(CIRCUIT_BREAKER_OPTIONS, context.getHandler()) || {};

    const key =
      options.key || `${context.getClass().name}_${context.getHandler().name}`;

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
        .catch(err => {
          if (err instanceof CircuitBreakerOpenError) {
            const error = {
              message: err.message,
              statusCode: err.statusCode,
              errorType: err.errorType,
            }
            subscriber.error(error);
          } else if (err.response) {
            subscriber.error(err.response);
          } else {
            subscriber.error(err);
          }
        });
    });
  }
}
