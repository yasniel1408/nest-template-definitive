import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResponseDto } from './health-check.response.dto';

@Injectable()
export class HealthService {
  constructor(private readonly config: ConfigService) {}

  public getAPIData(): HealthCheckResponseDto {
    return {
      env: this.config.getOrThrow<string>('NODE_ENV'),
      version: this.config.getOrThrow<string>('API_VERSION'),
      name: this.config.getOrThrow<string>('API_NAME'),
      status: 'ok',
    } as HealthCheckResponseDto;
  }
}
