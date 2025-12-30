import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsDateString,
} from 'class-validator';
import { JobStatus } from '../enums/job-status';

/**
 * DTO для створення нової вакансії
 */
export class CreateJobDto {
  @ApiProperty({
    description: 'Назва вакансії',
    example: 'Senior Frontend Developer',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Статус вакансії',
    enum: JobStatus,
    example: JobStatus.draft,
    default: JobStatus.draft,
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

  @ApiProperty({
    description: 'Зарплата вакансії',
    example: 5000.0,
  })
  @IsNumber()
  @IsPositive()
  salary: number;

  @ApiProperty({
    description: 'ID роботодавця (власника вакансії)',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  employerId: number;
}
