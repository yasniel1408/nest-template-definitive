import { Injectable } from '@nestjs/common';
import { CircuitState } from '../types/CircuitState';
import { CircuitBreakerOptions } from '../types/CircuitBreakerOptions';
import { CircuitBreakerOpenError } from '../errors/CircuitBreakerOpenError';
import { CircuitBreakerState } from '../types/CircuitBreakerState';

@Injectable()
export class CircuitBreakerService {
  private circuits: Map<string, CircuitBreakerState> = new Map();
  private defaultOptions: CircuitBreakerOptions = {
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
    halfOpenTimeout: 30000, // 30 seconds
  };

  async executeWithCircuitBreaker<T>(
    key: string,
    operation: () => Promise<T>,
    options: Partial<CircuitBreakerOptions> = {},
  ): Promise<T> {
    const circuitOptions = { ...this.defaultOptions, ...options };
    const circuit = this.getOrCreateCircuit(key);

    if (this.isOpen(circuit)) {
      if (this.shouldAttemptReset(circuit)) {
        this.transitionToHalfOpen(circuit);
      } else {
        throw new CircuitBreakerOpenError('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess(circuit);
      return result;
    } catch (error) {
      this.onFailure(circuit, circuitOptions);
      throw error;
    }
  }

  private getOrCreateCircuit(key: string): CircuitBreakerState {
    if (!this.circuits.has(key)) {
      this.circuits.set(key, {
        state: CircuitState.CLOSED,
        failureCount: 0,
        lastFailureTime: 0,
        nextAttempt: 0,
      });
    }
    return this.circuits.get(key)!;
  }

  private isOpen(circuit: CircuitBreakerState): boolean {
    return circuit.state === CircuitState.OPEN;
  }

  private shouldAttemptReset(circuit: CircuitBreakerState): boolean {
    return Date.now() >= circuit.nextAttempt;
  }

  private transitionToHalfOpen(circuit: CircuitBreakerState): void {
    circuit.state = CircuitState.HALF_OPEN;
    circuit.failureCount = 0;
  }

  private onSuccess(circuit: CircuitBreakerState): void {
    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.state = CircuitState.CLOSED;
      circuit.failureCount = 0;
      circuit.lastFailureTime = 0;
      circuit.nextAttempt = 0;
    }
  }

  private onFailure(
    circuit: CircuitBreakerState,
    options: CircuitBreakerOptions,
  ): void {
    circuit.failureCount++;
    circuit.lastFailureTime = Date.now();

    if (
      circuit.failureCount >= options.failureThreshold ||
      circuit.state === CircuitState.HALF_OPEN
    ) {
      circuit.state = CircuitState.OPEN;
      circuit.nextAttempt = Date.now() + options.resetTimeout;
    }
  }
}
