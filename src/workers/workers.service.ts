import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { NewEmployerDto } from './dto/new-employer.dto';
import { Worker, Job } from '@prisma/client';
import { WorkerWithRelations } from './types/worker.types';
import { JobStatus } from '../jobs/enums/job-status';

/**
 * Сервіс для роботи з працівниками
 */
@Injectable()
export class WorkersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Створення нового працівника
   */
  async create(createWorkerDto: CreateWorkerDto): Promise<Worker> {
    // Перевірка існування роботодавця та вакансії
    if (createWorkerDto.employerId) {
      await this.verifyEmployer(createWorkerDto.employerId);
    }

    if (createWorkerDto.jobId) {
      const job = await this.verifyJob(createWorkerDto.jobId);

      // Перевірка що вакансія належить роботодавцю
      if (
        createWorkerDto.employerId &&
        job.employerId !== createWorkerDto.employerId
      ) {
        throw new BadRequestException(
          'Вакансія не належить вказаному роботодавцю',
        );
      }
    }

    return await this.prisma.client.worker.create({
      data: createWorkerDto,
    });
  }

  /**
   * Отримання списку всіх працівників
   */
  async findAll(): Promise<WorkerWithRelations[]> {
    return await this.prisma.client.worker.findMany({
      include: {
        employer: true,
        job: true,
        history: true,
      },
    });
  }

  /**
   * Отримання інформації про конкретного працівника
   */
  async findOne(id: number): Promise<WorkerWithRelations> {
    const worker = await this.prisma.client.worker.findUnique({
      where: { id },
      include: {
        employer: true,
        job: true,
        history: true,
      },
    });

    if (!worker) {
      throw new NotFoundException(`Працівника з ID ${id} не знайдено`);
    }

    return worker;
  }

  /**
   * Оновлення інформації про працівника
   */
  async update(id: number, updateWorkerDto: UpdateWorkerDto): Promise<Worker> {
    await this.findOne(id); // Перевірка існування

    // Перевірка існування роботодавця та вакансії
    if (updateWorkerDto.employerId) {
      await this.verifyEmployer(updateWorkerDto.employerId);
    }

    if (updateWorkerDto.jobId) {
      const job = await this.verifyJob(updateWorkerDto.jobId);

      // Перевірка що вакансія належить роботодавцю
      if (
        updateWorkerDto.employerId &&
        job.employerId !== updateWorkerDto.employerId
      ) {
        throw new BadRequestException(
          'Вакансія не належить вказаному роботодавцю',
        );
      }
    }

    return await this.prisma.client.worker.update({
      where: { id },
      data: updateWorkerDto,
    });
  }

  /**
   * Видалення працівника
   */
  async remove(id: number): Promise<Worker> {
    await this.findOne(id); // Перевірка існування

    return await this.prisma.client.worker.delete({
      where: { id },
    });
  }

  /**
   * Отримання списку активних вакансій з зарплатою не нижче очікуваної працівника
   */
  async getMatchedJobs(id: number): Promise<Job[]> {
    const worker = await this.findOne(id);

    return await this.prisma.client.job.findMany({
      where: {
        status: JobStatus.active,
        salary: {
          gte: worker.salary,
        },
      },
      include: {
        employer: true,
      },
    });
  }

  /**
   * Зміна роботодавця або звільнення працівника
   */
  async changeEmployer(
    id: number,
    newEmployerDto: NewEmployerDto,
  ): Promise<Worker> {
    const worker = await this.findOne(id);

    // Перевірка існування нового роботодавця та вакансії
    await this.verifyEmployer(newEmployerDto.employerId);
    const job = await this.verifyJob(newEmployerDto.jobId);

    // Перевірка що вакансія належить новому роботодавцю
    if (job.employerId !== newEmployerDto.employerId) {
      throw new BadRequestException(
        'Вакансія не належить вказаному роботодавцю',
      );
    }

    // Створення запису "fired" у історії якщо працівник був працевлаштований
    if (worker.jobId && worker.employerId) {
      await this.prisma.client.workerHistory.create({
        data: {
          workerId: id,
          action: 'fired',
          jobId: worker.jobId,
          employerId: worker.employerId,
          jobName: worker.job?.name,
          employerName: worker.employer?.name,
          jobSalary: worker.job?.salary,
        },
      });
    }

    // Оновлення працівника на нову вакансію
    const updatedWorker = await this.prisma.client.worker.update({
      where: { id },
      data: {
        employerId: newEmployerDto.employerId,
        jobId: newEmployerDto.jobId,
      },
    });

    // Створення запису "hired" у історії
    await this.prisma.client.workerHistory.create({
      data: {
        workerId: id,
        action: 'hired',
        jobId: newEmployerDto.jobId,
        employerId: newEmployerDto.employerId,
        jobName: job.name,
        employerName: (await this.verifyEmployer(newEmployerDto.employerId))
          .name,
        jobSalary: job.salary,
      },
    });

    return updatedWorker;
  }

  /**
   * Допоміжний метод для перевірки існування роботодавця
   */
  private async verifyEmployer(id: number) {
    const employer = await this.prisma.client.employer.findUnique({
      where: { id },
    });

    if (!employer) {
      throw new NotFoundException(`Роботодавця з ID ${id} не знайдено`);
    }

    return employer;
  }

  /**
   * Допоміжний метод для перевірки існування вакансії
   */
  private async verifyJob(id: number) {
    const job = await this.prisma.client.job.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Вакансію з ID ${id} не знайдено`);
    }

    return job;
  }
}
