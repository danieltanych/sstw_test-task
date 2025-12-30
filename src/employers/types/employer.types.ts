import { Prisma } from '@prisma/client';

/**
 * Тип роботодавця з включеними вакансіями та працівниками
 */
export type EmployerWithRelations = Prisma.EmployerGetPayload<{
  include: { jobs: true; workers: true };
}>;

/**
 * Тип працівника з включеною вакансією
 */
export type WorkerWithJob = Prisma.WorkerGetPayload<{
  include: { job: true };
}>;
