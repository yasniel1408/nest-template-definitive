import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from '@nestjs/common';
import { HttpService } from './http.service';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

jest.mock('axios');
jest.mock('axios-retry');

describe('HttpService', () => {
  let service: HttpService;
  let mockLogger: jest.Mocked<Logger>;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  const mockResponse: AxiosResponse = {
    data: { test: 'data' },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any,
  };

  beforeEach(async () => {
    mockLogger = {
      error: jest.fn(),
    } as any;

    mockAxiosInstance = {
      request: jest.fn().mockResolvedValue(mockResponse),
      get: jest.fn().mockResolvedValue(mockResponse),
      post: jest.fn().mockResolvedValue(mockResponse),
      put: jest.fn().mockResolvedValue(mockResponse),
      delete: jest.fn().mockResolvedValue(mockResponse),
      patch: jest.fn().mockResolvedValue(mockResponse),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    } as any;

    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HttpService,
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    service = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should configure axios with retry', () => {
    expect(axiosRetry).toHaveBeenCalledWith(axios, expect.any(Object));
  });

  describe('HTTP Methods', () => {
    const url = 'https://api.test.com';
    const data = { key: 'value' };
    const config = { headers: { 'Custom-Header': 'value' } };

    it('should make GET request', async () => {
      await service.get(url, config);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(url, config);
    });

    it('should make POST request', async () => {
      await service.post(url, data, config);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(url, data, config);
    });

    it('should make PUT request', async () => {
      await service.put(url, data, config);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(url, data, config);
    });

    it('should make DELETE request', async () => {
      await service.delete(url, config);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(url, config);
    });

    it('should make PATCH request', async () => {
      await service.patch(url, data, config);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(url, data, config);
    });

    it('should handle request errors', async () => {
      const error = new Error('Network error');
      mockAxiosInstance.get.mockRejectedValueOnce(error);
      await expect(service.get(url)).rejects.toThrow('Network error');
    });
  });

  it('should return axios instance', () => {
    expect(service.getInstance()).toBe(mockAxiosInstance);
  });
});