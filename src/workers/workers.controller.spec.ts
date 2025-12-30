/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { WorkersController } from './workers.controller';
import { WorkersService } from './workers.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { NewEmployerDto } from './dto/new-employer.dto';

describe('WorkersController', () => {
  let controller: WorkersController;
  let service: WorkersService;

  const mockWorker = {
    id: 1,
    name: 'Test Worker',
    salary: 4500,
    employerId: 1,
    jobId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWorkerWithRelations = {
    ...mockWorker,
    employer: {
      id: 1,
      name: 'Test Company',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    job: {
      id: 1,
      name: 'Test Job',
      status: 'active' as const,
      creationDate: new Date(),
      salary: 5000,
      employerId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    history: [],
  };

  const mockJob = {
    id: 1,
    name: 'Test Job',
    status: 'active' as const,
    creationDate: new Date(),
    salary: 5000,
    employerId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    employer: {
      id: 1,
      name: 'Test Company',
      status: 'active' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  const mockWorkersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getMatchedJobs: jest.fn(),
    changeEmployer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkersController],
      providers: [
        {
          provide: WorkersService,
          useValue: mockWorkersService,
        },
      ],
    }).compile();

    controller = module.get<WorkersController>(WorkersController);
    service = module.get<WorkersService>(WorkersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new worker', async () => {
      const createDto: CreateWorkerDto = {
        name: 'Test Worker',
        salary: 4500,
        employerId: 1,
        jobId: 1,
      };

      mockWorkersService.create.mockResolvedValue(mockWorker);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockWorker);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of workers', async () => {
      const workers = [mockWorkerWithRelations];
      mockWorkersService.findAll.mockResolvedValue(workers);

      const result = await controller.findAll();

      expect(result).toEqual(workers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single worker', async () => {
      mockWorkersService.findOne.mockResolvedValue(mockWorkerWithRelations);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockWorkerWithRelations);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update a worker', async () => {
      const updateDto: UpdateWorkerDto = {
        name: 'Updated Worker',
      };

      const updatedWorker = { ...mockWorker, name: 'Updated Worker' };
      mockWorkersService.update.mockResolvedValue(updatedWorker);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedWorker);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a worker', async () => {
      mockWorkersService.remove.mockResolvedValue(mockWorker);

      const result = await controller.remove(1);

      expect(result).toEqual(mockWorker);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('getMatchedJobs', () => {
    it('should return matched jobs for a worker', async () => {
      const jobs = [mockJob];
      mockWorkersService.getMatchedJobs.mockResolvedValue(jobs);

      const result = await controller.getMatchedJobs(1);

      expect(result).toEqual(jobs);
      expect(service.getMatchedJobs).toHaveBeenCalledWith(1);
      expect(service.getMatchedJobs).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeEmployer', () => {
    it('should change worker employer', async () => {
      const newEmployerDto: NewEmployerDto = {
        employerId: 2,
        jobId: 3,
      };

      const updatedWorker = { ...mockWorker, employerId: 2, jobId: 3 };
      mockWorkersService.changeEmployer.mockResolvedValue(updatedWorker);

      const result = await controller.changeEmployer(1, newEmployerDto);

      expect(result).toEqual(updatedWorker);
      expect(service.changeEmployer).toHaveBeenCalledWith(1, newEmployerDto);
      expect(service.changeEmployer).toHaveBeenCalledTimes(1);
    });
  });
});
