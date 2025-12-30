import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

/**
 * DTO для створення нового працівника
 */
export class CreateWorkerDto {
  @ApiProperty({
    description: "Ім'я працівника",
    example: 'Іван Петренко',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Очікувана зарплата працівника',
    example: 4500.0,
  })
  @IsNumber()
  @IsPositive()
  salary: number;

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
