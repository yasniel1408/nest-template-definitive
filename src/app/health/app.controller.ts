import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HealthCheckResponseDto } from './health-check.response.dto';

@Controller('/health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  public healthCheck(): HealthCheckResponseDto {
    return this.appService.getAPIData();
  }
}
