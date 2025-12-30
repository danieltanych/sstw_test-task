import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

/**
 * DTO для фільтрації вакансій за періодом часу
 */
export class DatePeriodDto {
  @ApiProperty({
    description: 'Початкова дата періоду (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Кінцева дата періоду (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @IsDateString()
  endDate: string;
}
