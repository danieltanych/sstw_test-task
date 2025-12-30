import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

/**
 * DTO для оновлення інформації про працівника
 */
export class UpdateWorkerDto {
  @ApiPropertyOptional({
    description: "Ім'я працівника",
    example: 'Іван Петренко',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Очікувана зарплата працівника',
    example: 4500.0,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  salary?: number;

  @ApiPropertyOptional({
    description: 'ID поточного роботодавця',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  employerId?: number;

  @ApiPropertyOptional({
    description: 'ID активної вакансії',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  jobId?: number;
}
