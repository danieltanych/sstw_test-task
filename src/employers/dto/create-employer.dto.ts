import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmployerStatus } from '../enums/employer-status';

/**
 * DTO для створення нового роботодавця
 */
export class CreateEmployerDto {
  @ApiProperty({
    description: "Ім'я роботодавця",
    example: 'Tech Solutions Ltd',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    description: 'Статус роботодавця',
    enum: EmployerStatus,
    example: EmployerStatus.active,
    default: EmployerStatus.active,
  })
  @IsEnum(EmployerStatus)
  @IsOptional()
  status?: EmployerStatus;
}
