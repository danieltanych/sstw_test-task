import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Job } from '@prisma/client';
import { JobWithRelations } from './types/job.types';
import { JobStatus } from './enums/job-status';

/**
 * Сервіс для роботи з вакансіями
 */
@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Створення нової вакансії
   */
  async create(createJobDto: CreateJobDto): Promise<Job> {
    const { creationDate, ...data } = createJobDto;

    return await this.prisma.client.job.create({
      data: {
        ...data,
        creationDate: creationDate ? new Date(creationDate) : undefined,
      },
    });
  }

  /**
   * Отримання списку всіх вакансій
   */
  async findAll(): Promise<JobWithRelations[]> {
    return await this.prisma.client.job.findMany({
      include: {
        employer: true,
        workers: true,
      },
    });
  }

  /**
   * Отримання інформації про конкретну вакансію
   */
  async findOne(id: number): Promise<JobWithRelations> {
    const job = await this.prisma.client.job.findUnique({
      where: { id },
      include: {
        employer: true,
        workers: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Вакансію з ID ${id} не знайдено`);
    }

    return job;
  }

  /**
   * Оновлення інформації про вакансію
   */
  async update(id: number, updateJobDto: UpdateJobDto): Promise<Job> {
    await this.findOne(id); // Перевірка існування

    const { creationDate, ...data } = updateJobDto;

    return await this.prisma.client.job.update({
      where: { id },
      data: {
        ...data,
        creationDate: creationDate ? new Date(creationDate) : undefined,
      },
    });
  }

  /**
   * Видалення вакансії
   */
  async remove(id: number): Promise<Job> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.job.delete({
      where: { id },
    });
  }

  /**
   * Отримання всіх вакансій за певний період часу
   */
  async findByDatePeriod(
    startDate: string,
    endDate: string,
  ): Promise<JobWithRelations[]> {
    return await this.prisma.client.job.findMany({
      where: {
        creationDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      },
      include: {
        employer: true,
        workers: true,
      },
    });
  }

  /**
   * Архівування вакансії
   */
  async archive(id: number): Promise<Job> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.job.update({
      where: { id },
      data: {
        status: JobStatus.archive,
      },
    });
  }
}
