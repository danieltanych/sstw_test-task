import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

/**
 * Контролер для управління вакансіями
 */
@ApiTags('jobs')
@ApiBearerAuth('bearer')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  /**
   * Створення нової вакансії
   */
  @Post()
  @ApiOperation({ summary: 'Створення нової вакансії' })
  @ApiResponse({ status: 201, description: 'Вакансія успішно створена' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  /**
   * Отримання всіх вакансій за певний період часу
   */
  @Get('date-period')
  @ApiOperation({
    summary: 'Отримання всіх вакансій за певний період часу',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Початкова дата періоду (ISO 8601)',
    example: '2024-01-01T00:00:00.000Z',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'Кінцева дата періоду (ISO 8601)',
    example: '2024-12-31T23:59:59.999Z',
  })
  @ApiResponse({ status: 200, description: 'Список вакансій за період' })
  findByDatePeriod(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.jobsService.findByDatePeriod(startDate, endDate);
  }

  /**
   * Отримання списку всіх вакансій
   */
  @Get()
  @ApiOperation({ summary: 'Отримання списку всіх вакансій' })
  @ApiResponse({ status: 200, description: 'Список вакансій' })
  findAll() {
    return this.jobsService.findAll();
  }

  /**
   * Отримання інформації про конкретну вакансію
   */
  @Get(':id')
  @ApiOperation({ summary: 'Отримання інформації про конкретну вакансію' })
  @ApiParam({ name: 'id', description: 'ID вакансії' })
  @ApiResponse({ status: 200, description: 'Інформація про вакансію' })
  @ApiResponse({ status: 404, description: 'Вакансію не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.findOne(id);
  }

  /**
   * Оновлення інформації про вакансію
   */
  @Put(':id')
  @ApiOperation({ summary: 'Оновлення інформації про вакансію' })
  @ApiParam({ name: 'id', description: 'ID вакансії' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про вакансію успішно оновлена',
  })
  @ApiResponse({ status: 404, description: 'Вакансію не знайдено' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateJobDto: UpdateJobDto,
  ) {
    return this.jobsService.update(id, updateJobDto);
  }

  /**
   * Архівування вакансії
   */
  @Put(':id/archive')
  @ApiOperation({ summary: 'Архівування вакансії' })
  @ApiParam({ name: 'id', description: 'ID вакансії' })
  @ApiResponse({ status: 200, description: 'Вакансія успішно архівована' })
  @ApiResponse({ status: 404, description: 'Вакансію не знайдено' })
  archive(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.archive(id);
  }

  /**
   * Видалення вакансії
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Видалення вакансії' })
  @ApiParam({ name: 'id', description: 'ID вакансії' })
  @ApiResponse({ status: 200, description: 'Вакансія успішно видалена' })
  @ApiResponse({ status: 404, description: 'Вакансію не знайдено' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobsService.remove(id);
  }
}
