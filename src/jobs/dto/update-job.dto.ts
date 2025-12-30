import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsDateString,
} from 'class-validator';
import { JobStatus } from '../enums/job-status';

/**
 * DTO для оновлення інформації про вакансію
 */
export class UpdateJobDto {
  @ApiPropertyOptional({
    description: 'Назва вакансії',
    example: 'Senior Frontend Developer',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Статус вакансії',
    enum: JobStatus,
    example: JobStatus.active,
  })
  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;

  @ApiPropertyOptional({
    description: 'Дата створення вакансії (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  creationDate?: string;

  @ApiPropertyOptional({
    description: 'Зарплата вакансії',
    example: 5000.0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  salary?: number;

  @ApiPropertyOptional({
    description: 'ID роботодавця (власника вакансії)',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  employerId?: number;
}
