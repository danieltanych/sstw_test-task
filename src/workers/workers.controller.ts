import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { NewEmployerDto } from './dto/new-employer.dto';

/**
 * Контролер для управління працівниками
 */
@ApiTags('workers')
@ApiBearerAuth('bearer')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  /**
   * Створення нового працівника
   */
  @Post()
  @ApiOperation({ summary: 'Створення нового працівника' })
  @ApiResponse({ status: 201, description: 'Працівник успішно створений' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  create(@Body() createWorkerDto: CreateWorkerDto) {
    return this.workersService.create(createWorkerDto);
  }

  /**
   * Отримання списку всіх працівників
   */
  @Get()
  @ApiOperation({ summary: 'Отримання списку всіх працівників' })
  @ApiResponse({ status: 200, description: 'Список працівників' })
  findAll() {
    return this.workersService.findAll();
  }

  /**
   * Отримання інформації про конкретного працівника
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Отримання інформації про конкретного працівника',
  })
  @ApiParam({ name: 'id', description: 'ID працівника' })
  @ApiResponse({ status: 200, description: 'Інформація про працівника' })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.findOne(id);
  }

  /**
   * Отримання списку відповідних вакансій для працівника
   */
  @Get(':id/matched-jobs')
  @ApiOperation({
    summary: 'Вивести список активних вакансій з зарплатою не нижче очікуваної',
  })
  @ApiParam({ name: 'id', description: 'ID працівника' })
  @ApiResponse({
    status: 200,
    description: 'Список відповідних вакансій',
  })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  getMatchedJobs(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.getMatchedJobs(id);
  }

  /**
   * Оновлення інформації про працівника
   */
  @Put(':id')
  @ApiOperation({ summary: 'Оновлення інформації про працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про працівника успішно оновлена',
  })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ) {
    return this.workersService.update(id, updateWorkerDto);
  }

  /**
   * Зміна роботодавця працівника
   */
  @Put(':id/new-employer')
  @ApiOperation({ summary: 'Зміна роботодавця або звільнення працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника' })
  @ApiResponse({
    status: 200,
    description: 'Роботодавець працівника успішно змінено',
  })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  changeEmployer(
    @Param('id', ParseIntPipe) id: number,
    @Body() newEmployerDto: NewEmployerDto,
  ) {
    return this.workersService.changeEmployer(id, newEmployerDto);
  }

  /**
   * Видалення працівника
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Видалення працівника' })
  @ApiParam({ name: 'id', description: 'ID працівника' })
  @ApiResponse({ status: 200, description: 'Працівник успішно видалений' })
  @ApiResponse({ status: 404, description: 'Працівника не знайдено' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.workersService.remove(id);
  }
}
