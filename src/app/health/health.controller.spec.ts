import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../cache/cache.service';
import { HealthCheckResponseDto } from './health-check.response.dto';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('AppController', () => {
  let controller: HealthController;
  let service: HealthService;
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
    testCircuitBreaker: jest.fn() // Añadir mock para el nuevo método
  };

  // Añadir objeto de caché simulado
  const mockCache = {};

  const mockCacheService = {
    cacheFirst: jest.fn().mockImplementation(async (key, fn) => {
      if (!mockCache[key]) {
        try {
          mockCache[key] = await fn();
        } catch (error) {
          mockCache[key] = error;
          throw error;
        }
      }
      return mockCache[key];
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthService,
          useValue: mockAppService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
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
      expect(service.getAPIData).toHaveBeenCalled();
    });

  });
});
