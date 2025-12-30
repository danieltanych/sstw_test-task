/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EmployersController } from './employers.controller';
import { EmployersService } from './employers.service';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { EmployerStatus } from './enums/employer-status';

describe('EmployersController', () => {
  let controller: EmployersController;
  let service: EmployersService;

  const mockEmployer = {
    id: 1,
    name: 'Test Company',
    status: EmployerStatus.active,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockEmployerWithRelations = {
    ...mockEmployer,
    jobs: [],
    workers: [],
  };

  const mockWorkerWithJob = {
    id: 1,
    name: 'Test Worker',
    salary: 5000,
    employerId: 1,
    jobId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
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
  };

  const mockEmployersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getWorkers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployersController],
      providers: [
        {
          provide: EmployersService,
          useValue: mockEmployersService,
        },
      ],
    }).compile();

    controller = module.get<EmployersController>(EmployersController);
    service = module.get<EmployersService>(EmployersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new employer', async () => {
      const createDto: CreateEmployerDto = {
        name: 'Test Company',
        status: EmployerStatus.active,
      };

      mockEmployersService.create.mockResolvedValue(mockEmployer);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockEmployer);
      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('should return an array of employers', async () => {
      const employers = [mockEmployerWithRelations];
      mockEmployersService.findAll.mockResolvedValue(employers);

      const result = await controller.findAll();

      expect(result).toEqual(employers);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single employer', async () => {
      mockEmployersService.findOne.mockResolvedValue(mockEmployerWithRelations);

      const result = await controller.findOne(1);

      expect(result).toEqual(mockEmployerWithRelations);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an employer', async () => {
      const updateDto: UpdateEmployerDto = {
        name: 'Updated Company',
      };

      const updatedEmployer = { ...mockEmployer, name: 'Updated Company' };
      mockEmployersService.update.mockResolvedValue(updatedEmployer);

      const result = await controller.update(1, updateDto);

      expect(result).toEqual(updatedEmployer);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove an employer', async () => {
      mockEmployersService.remove.mockResolvedValue(mockEmployer);

      const result = await controller.remove(1);

      expect(result).toEqual(mockEmployer);
      expect(service.remove).toHaveBeenCalledWith(1);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });

  describe('getWorkers', () => {
    it('should return workers for an employer', async () => {
      const workers = [mockWorkerWithJob];
      mockEmployersService.getWorkers.mockResolvedValue(workers);

      const result = await controller.getWorkers(1);

      expect(result).toEqual(workers);
      expect(service.getWorkers).toHaveBeenCalledWith(1);
      expect(service.getWorkers).toHaveBeenCalledTimes(1);
    });
  });
});
