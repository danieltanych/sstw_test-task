import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaHealthIndicator } from './prisma.health';

/**
 * Контролер для health checks
 */
@ApiTags('health')
@ApiBearerAuth('bearer')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealthIndicator: PrismaHealthIndicator,
  ) {}

  /**
   * Перевірка стану додатку та з'єднання з базою даних
   */
  @Get()
  @HealthCheck()
  @ApiOperation({ summary: "Перевірка стану додатку та з'єднання з базою" })
  @ApiResponse({
    status: 200,
    description: 'Додаток та база даних працюють нормально',
  })
  @ApiResponse({
    status: 503,
    description: "Проблеми зі здоров'ям додатку або бази даних",
  })
  check() {
    return this.health.check([
      () => this.prismaHealthIndicator.isHealthy('database'),
    ]);
  }
}
