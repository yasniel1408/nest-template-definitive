import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseCircuitBreaker } from '../decorators/circuit-breaker.decorator';
import { CircuitBreakerResponseDto } from './circuit-breaker.response.dto';

@ApiTags('Circuit Breaker Test')
@Controller('/circuit-breaker')
export class CircuitBreakerController {
  @UseCircuitBreaker({
    halfOpenTimeout: 30000, // 30 seconds
    failureThreshold: 2,
    resetTimeout: 60000, // 1 minute
  })
  @Get('/test')
  @ApiOperation({ summary: 'Endpoint para probar Circuit Breaker' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta exitosa',
    type: CircuitBreakerResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Error simulado' })
  public async testCircuitBreaker(): Promise<CircuitBreakerResponseDto> {
    // Simular latencia
    await new Promise(resolve => setTimeout(resolve, 10));

    // Simular error aleatorio (50% de probabilidad)
    if (Math.random() < 0.5) {
      console.log('Error simulado');
      throw new Error('Service Failure');
    }

    // Respuesta exitosa
    return {
      status: 'ok',
    };
  }
}
