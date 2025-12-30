/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';

describe('HealthController', () => {
  let controller: HealthController;
  let healthCheckService: HealthCheckService;

  const mockHealthCheckService = {
    check: jest.fn(),
  };

  const mockPrismaHealthIndicator = {
    isHealthy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: mockHealthCheckService,
        },
        {
          provide: PrismaHealthIndicator,
          useValue: mockPrismaHealthIndicator,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    healthCheckService = module.get<HealthCheckService>(HealthCheckService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return healthy status when database is up', async () => {
      const healthyResult = {
        status: 'ok',
        info: {
          database: {
            status: 'up',
          },
        },
        error: {},
        details: {
          database: {
            status: 'up',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(healthyResult);

      const result = await controller.check();

      expect(result).toEqual(healthyResult);
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
      expect(healthCheckService.check).toHaveBeenCalledWith([
        expect.any(Function),
      ]);
    });

    it('should return error status when database is down', async () => {
      const unhealthyResult = {
        status: 'error',
        info: {},
        error: {
          database: {
            status: 'down',
            message: 'Database connection failed',
          },
        },
        details: {
          database: {
            status: 'down',
            message: 'Database connection failed',
          },
        },
      };

      mockHealthCheckService.check.mockResolvedValue(unhealthyResult);

      const result = await controller.check();

      expect(result).toEqual(unhealthyResult);
      expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    });
  });
});
