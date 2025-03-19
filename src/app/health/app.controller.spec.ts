import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheService } from '../cache/cache.service';
import { HealthCheckResponseDto } from './health-check.response.dto';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;
  let cacheService: CacheService;

  // Mock response data
  const mockHealthResponse: HealthCheckResponseDto = {
    status: 'ok',
    env: 'test',
    name: 'test',
    version: '1.0.0',
  };

  // Create mock services
  const mockAppService = {
    getAPIData: jest.fn().mockResolvedValue(mockHealthResponse),
  };

  const mockCacheService = {
    cacheFirst: jest.fn().mockImplementation(async (key, fn) => {
      return await fn();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('healthCheck', () => {
    it('should return health check data from cache or service', async () => {
      // Act
      const result = await controller.healthCheck();

      // Assert
      expect(result).toEqual(mockHealthResponse);
      expect(cacheService.cacheFirst).toHaveBeenCalledWith(
        'health',
        expect.any(Function),
        36000,
      );
    });

    it('should call appService.getAPIData when cache miss', async () => {
      // Act
      await controller.healthCheck();

      // Assert
      expect(appService.getAPIData).toHaveBeenCalled();
    });

    it('should handle errors properly', async () => {
      // Arrange
      const error = new Error('Service error');
      mockAppService.getAPIData.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(controller.healthCheck()).rejects.toThrow('Service error');
    });
  });
});
