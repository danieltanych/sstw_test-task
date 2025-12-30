import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EmployerStatus } from '../enums/employer-status';

/**
 * DTO для оновлення інформації про роботодавця
 */
export class UpdateEmployerDto {
  @ApiPropertyOptional({
    description: "Ім'я роботодавця",
    example: 'Tech Solutions Ltd',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    description: 'Статус роботодавця',
    enum: EmployerStatus,
    example: EmployerStatus.active,
  })
  @IsEnum(EmployerStatus)
  @IsOptional()
  status?: EmployerStatus;
}
