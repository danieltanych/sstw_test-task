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
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';

/**
 * Контролер для управління роботодавцями
 */
@ApiTags('employers')
@ApiBearerAuth('bearer')
@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  /**
   * Створення нового роботодавця
   */
  @Post()
  @ApiOperation({ summary: 'Створення нового роботодавця' })
  @ApiResponse({ status: 201, description: 'Роботодавець успішно створений' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  create(@Body() createEmployerDto: CreateEmployerDto) {
    return this.employersService.create(createEmployerDto);
  }

  /**
   * Отримання списку всіх роботодавців
   */
  @Get()
  @ApiOperation({ summary: 'Отримання списку всіх роботодавців' })
  @ApiResponse({ status: 200, description: 'Список роботодавців' })
  findAll() {
    return this.employersService.findAll();
  }

  /**
   * Отримання інформації про конкретного роботодавця
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Отримання інформації про конкретного роботодавця',
  })
  @ApiParam({ name: 'id', description: 'ID роботодавця' })
  @ApiResponse({ status: 200, description: 'Інформація про роботодавця' })
  @ApiResponse({ status: 404, description: 'Роботодавця не знайдено' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employersService.findOne(id);
  }

  /**
   * Оновлення інформації про роботодавця
   */
  @Put(':id')
  @ApiOperation({ summary: 'Оновлення інформації про роботодавця' })
  @ApiParam({ name: 'id', description: 'ID роботодавця' })
  @ApiResponse({
    status: 200,
    description: 'Інформація про роботодавця успішно оновлена',
  })
  @ApiResponse({ status: 404, description: 'Роботодавця не знайдено' })
  @ApiResponse({ status: 400, description: 'Невалідні дані' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployerDto: UpdateEmployerDto,
  ) {
    return this.employersService.update(id, updateEmployerDto);
  }

  /**
   * Видалення роботодавця
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Видалення роботодавця' })
  @ApiParam({ name: 'id', description: 'ID роботодавця' })
  @ApiResponse({ status: 200, description: 'Роботодавець успішно видалений' })
  @ApiResponse({ status: 404, description: 'Роботодавця не знайдено' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employersService.remove(id);
  }

  /**
   * Отримання списку всіх працівників роботодавця
   */
  @Get(':id/workers')
  @ApiOperation({ summary: 'Отримання списку всіх працівників роботодавця' })
  @ApiParam({ name: 'id', description: 'ID роботодавця' })
  @ApiResponse({ status: 200, description: 'Список працівників роботодавця' })
  @ApiResponse({ status: 404, description: 'Роботодавця не знайдено' })
  getWorkers(@Param('id', ParseIntPipe) id: number) {
    return this.employersService.getWorkers(id);
  }
}
