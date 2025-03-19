import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ description: 'Service name' })
  name: string;

  @ApiProperty({ description: 'API version number' })
  version: string;

  @ApiProperty({ description: 'Current environment name' })
  env: string;

  @ApiProperty({ description: 'Service health status' })
  status: string;
}
