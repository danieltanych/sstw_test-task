import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  public readonly client: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    this.logger.log(`Connecting to database...`);

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    this.client = new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  }

  async onModuleInit() {
    await this.client.$connect();
    this.logger.log('Successfully connected to database');
  }

  async onModuleDestroy() {
    await this.client.$disconnect();
  }
}
