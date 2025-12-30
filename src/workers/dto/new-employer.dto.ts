import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

/**
 * DTO для зміни роботодавця працівника
 */
export class NewEmployerDto {
  @ApiProperty({
    description: 'ID нового роботодавця',
    example: 2,
  })
  @IsNumber()
  @IsPositive()
  employerId: number;

  @ApiProperty({
    description: 'ID вакансії на яку влаштовується працівник',
    example: 3,
  })
  @IsNumber()
  @IsPositive()
  jobId: number;
}
