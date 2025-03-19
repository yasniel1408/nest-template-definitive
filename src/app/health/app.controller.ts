import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckResponseDto } from './health-check.response.dto';

@ApiTags('Health Check')
@Controller('/health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get service health status' })
  @ApiResponse({ status: 200, description: 'Service status information', type: HealthCheckResponseDto })
  public healthCheck(): HealthCheckResponseDto {
    return this.appService.getAPIData();
  }
}
