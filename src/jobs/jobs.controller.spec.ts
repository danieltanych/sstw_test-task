/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JobStatus } from './enums/job-status';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  const mockJob = {
    id: 1,
    name: 'Test Job',
    status: JobStatus.active,
    creationDate: new Date(),
    salary: 5000,
    employerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockJobWithRelations = {
    ...mockJob,
    employer: {
      id: 1,
      name: 'Test Company',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    workers: [],
  };

  const mockJobsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByDatePeriod: jest.fn(),
    archive: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: mockJobsService,
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new job', async () => {
      const createDto: CreateJobDto = {
        name: 'Test Job',
        status: JobStatus.draft,
        salary: 5000,
        employerId: 1,
      };

      mockJobsService.create.mockResolvedValue(mockJob);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockJob);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of jobs', async () => {
      const jobs = [mockJobWithRelations];
      mockJobsService.findAll.mockResolvedValue(jobs);

      const result = await controller.findAll();

      expect(result).toEqual(jobs);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single job', async () => {
      mockJobsService.findOne.mockResolvedValue(mockJobWithRelations);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockJobWithRelations);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a job', async () => {
      const updateDto: UpdateJobDto = {
        name: 'Updated Job',
      };

      const updatedJob = { ...mockJob, name: 'Updated Job' };
      mockJobsService.update.mockResolvedValue(updatedJob);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedJob);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a job', async () => {
      mockJobsService.remove.mockResolvedValue(mockJob);

      const result = await controller.remove(1);

      expect(result).toEqual(mockJob);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('findByDatePeriod', () => {
    it('should return jobs within date period', async () => {
      const startDate = '2024-01-01T00:00:00.000Z';
      const endDate = '2024-12-31T23:59:59.999Z';
      const jobs = [mockJobWithRelations];

      mockJobsService.findByDatePeriod.mockResolvedValue(jobs);

      const result = await controller.findByDatePeriod(startDate, endDate);

      expect(result).toEqual(jobs);
      expect(service.findByDatePeriod).toHaveBeenCalledWith(startDate, endDate);
      expect(service.findByDatePeriod).toHaveBeenCalledTimes(1);
    });
  });

  describe('archive', () => {
    it('should archive a job', async () => {
      const archivedJob = { ...mockJob, status: JobStatus.archive };
      mockJobsService.archive.mockResolvedValue(archivedJob);

      const result = await controller.archive(1);

      expect(result).toEqual(archivedJob);
      expect(service.archive).toHaveBeenCalledWith(1);
      expect(service.archive).toHaveBeenCalledTimes(1);
    });
  });
});
