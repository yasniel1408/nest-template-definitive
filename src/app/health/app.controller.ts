import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheService } from '../cache/cache.service';

@ApiTags('Health Check')
@Controller('/health')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly cacheService: CacheService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({
    status: 200,
    description: 'Service status information',
    type: HealthCheckResponseDto,
  })
  public async healthCheck(): Promise<HealthCheckResponseDto> {
    const value = await this.cacheService.cacheFirst<HealthCheckResponseDto>(
      'health',
      async () => {
        // simular carga
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay.then(() => {
          console.log('Delayed for 1 second.');
        });

        return this.appService.getAPIData();
      },
      36000,
    ); // 10 hours

    return value;
  }
}
