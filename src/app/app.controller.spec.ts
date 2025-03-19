import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, ConfigService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('healthCheck', () => {
    it('should return the expected HealthCheckResponseDto', () => {
      const result: HealthCheckResponseDto = {
        env: 'dev',
        version: '0.0.1',
        name: 'my-nest-project',
        status: 'ok',
      };
      jest.spyOn(appService, 'getAPIData').mockImplementation(() => result);

      expect(appController.healthCheck()).toBe(result);
    });
  });
});
