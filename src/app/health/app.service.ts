import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckResponseDto } from './health-check.response.dto';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  public async getAPIData(): Promise<HealthCheckResponseDto> {
    return {
      env: this.config.getOrThrow<string>('NODE_ENV'),
      version: this.config.getOrThrow<string>('API_VERSION'),
      name: this.config.getOrThrow<string>('API_NAME'),
      status: 'ok',
    } as HealthCheckResponseDto;
  }
}
