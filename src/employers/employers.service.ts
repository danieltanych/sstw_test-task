import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { Employer } from '@prisma/client';
import { EmployerWithRelations, WorkerWithJob } from './types/employer.types';

/**
 * Сервіс для роботи з роботодавцями
 */
@Injectable()
export class EmployersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Створення нового роботодавця
   */
  async create(createEmployerDto: CreateEmployerDto): Promise<Employer> {
    return await this.prisma.client.employer.create({
      data: createEmployerDto,
    });
  }

  /**
   * Отримання списку всіх роботодавців
   */
  async findAll(): Promise<EmployerWithRelations[]> {
    return await this.prisma.client.employer.findMany({
      include: {
        jobs: true,
        workers: true,
      },
    });
  }

  /**
   * Отримання інформації про конкретного роботодавця
   */
  async findOne(id: number): Promise<EmployerWithRelations> {
    const employer = await this.prisma.client.employer.findUnique({
      where: { id },
      include: {
        jobs: true,
        workers: true,
      },
    });

    if (!employer) {
      throw new NotFoundException(`Роботодавця з ID ${id} не знайдено`);
    }

    return employer;
  }

  /**
   * Оновлення інформації про роботодавця
   */
  async update(
    id: number,
    updateEmployerDto: UpdateEmployerDto,
  ): Promise<Employer> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.employer.update({
      where: { id },
      data: updateEmployerDto,
    });
  }

  /**
   * Видалення роботодавця
   * При видаленні роботодавця каскадно видаляються його вакансії,
   * а працівники звільняються (employerId та jobId стають null)
   */
  async remove(id: number): Promise<Employer> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.employer.delete({
      where: { id },
    });
  }

  /**
   * Отримання списку всіх працівників роботодавця
   */
  async getWorkers(id: number): Promise<WorkerWithJob[]> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.worker.findMany({
      where: { employerId: id },
      include: {
        job: true,
      },
    });
  }
}
