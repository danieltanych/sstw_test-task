import { Prisma } from '@prisma/client';

/**
 * Тип вакансії з включеним роботодавцем та працівниками
 */
export type JobWithRelations = Prisma.JobGetPayload<{
  include: { employer: true; workers: true };
}>;
