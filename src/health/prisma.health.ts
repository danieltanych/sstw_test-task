import { Injectable } from '@nestjs/common';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Health indicator для перевірки з'єднання з базою даних через Prisma
 */
@Injectable()
export class PrismaHealthIndicator {
  constructor(private readonly prismaService: PrismaService) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Спроба виконати простий запит до БД
      await this.prismaService.client.$queryRaw`SELECT 1`;
      return {
        [key]: {
          status: 'up',
        },
      };
    } catch (error) {
      return {
        [key]: {
          status: 'down',
          message:
            error instanceof Error
              ? error.message
              : 'Database connection failed',
        },
      };
    }
  }
}
