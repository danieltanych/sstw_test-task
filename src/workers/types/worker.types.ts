import { Prisma } from '@prisma/client';

/**
 * Тип працівника з включеними відносинами
 */
export type WorkerWithRelations = Prisma.WorkerGetPayload<{
  include: { employer: true; job: true; history: true };
}>;
