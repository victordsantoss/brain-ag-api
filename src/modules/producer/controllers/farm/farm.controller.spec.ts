import { Test, TestingModule } from '@nestjs/testing';
import { FarmController } from './farm.controller';
import { IRegisterFarmService } from '../../services/farm/register/register.interface';
import { Farm } from '../../../../database/entities/farm.entity';
import { Address } from '../../../../database/entities/address.entity';
import { faker } from '@faker-js/faker';
import { BaseEntityStatus } from '../../../../common/enums/status.enum';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { IListFarmsService } from '../../services/farm/list/list.interface';
import { IListTopFarmsService } from '../../services/farm/list-top-farms/list-top-farms.interface';

describe('FarmController', () => {
  let controller: FarmController;
  let registerFarmService: jest.Mocked<IRegisterFarmService>;
  let listFarmsService: jest.Mocked<IListFarmsService>;
  let listTopFarmsService: jest.Mocked<IListTopFarmsService>;

  const mockRegisterFarmService = {
    perform: jest.fn(),
  };

  const mockListFarmsService = {
    perform: jest.fn(),
  };

  const mockListTopFarmsService = {
    perform: jest.fn(),
  };

  const createMockAddress = {
    id: faker.string.uuid(),
    street: faker.location.street(),
    number: faker.number.int({ min: 1, max: 9999 }).toString(),
    complement: faker.location.secondaryAddress(),
    neighborhood: faker.location.county(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode('#####-###'),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as Address;

  const createMockProducer = {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
  };

  const createMockFarm = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    totalArea: faker.number.float({ min: 0, max: 1000 }),
    cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
    vegetationArea: faker.number.float({ min: 0, max: 1000 }),
    status: BaseEntityStatus.ACTIVE,
    address: createMockAddress,
    producer: createMockProducer,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as Farm;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FarmController],
      providers: [
        {
          provide: 'IRegisterFarmService',
          useValue: mockRegisterFarmService,
        },
        {
          provide: 'IListFarmsService',
          useValue: mockListFarmsService,
        },
        {
          provide: 'IListTopFarmsService',
          useValue: mockListTopFarmsService,
        },
      ],
    }).compile();

    controller = module.get<FarmController>(FarmController);
    registerFarmService = module.get('IRegisterFarmService');
    listFarmsService = module.get('IListFarmsService');
    listTopFarmsService = module.get('IListTopFarmsService');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a new farm', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      registerFarmService.perform.mockResolvedValue(createMockFarm);

      const result = await controller.create(farmData);

      expect(result).toEqual(createMockFarm);
      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });

    it('should throw BadRequestException when service throws error', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      registerFarmService.perform.mockRejectedValue(
        new BadRequestException('Erro ao criar fazenda'),
      );

      await expect(controller.create(farmData)).rejects.toThrow(
        BadRequestException,
      );

      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });

    it('should throw InternalServerErrorException when service throws error', async () => {
      const farmData = {
        producerId: faker.string.uuid(),
        name: faker.company.name(),
        totalArea: faker.number.float({ min: 0, max: 1000 }),
        cultivatedArea: faker.number.float({ min: 0, max: 1000 }),
        vegetationArea: faker.number.float({ min: 0, max: 1000 }),
        address: {
          street: faker.location.street(),
          number: faker.number.int({ min: 1, max: 9999 }).toString(),
          complement: faker.location.secondaryAddress(),
          neighborhood: faker.location.county(),
          city: faker.location.city(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode('#####-###'),
        },
      };

      registerFarmService.perform.mockRejectedValue(
        new InternalServerErrorException('Erro ao salvar fazenda'),
      );

      await expect(controller.create(farmData)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(registerFarmService.perform).toHaveBeenCalledWith(farmData);
    });
  });

  describe('list', () => {
    it('should return paginated list of farms', async () => {
      const query = {
        page: 1,
        limit: 10,
        search: 'Farm',
        orderBy: 'name',
        sortBy: 'ASC' as const,
      };

      const mockFarmResponse = {
        id: createMockFarm.id,
        name: createMockFarm.name,
        totalArea: createMockFarm.totalArea,
        cultivatedArea: createMockFarm.cultivatedArea,
        vegetationArea: createMockFarm.vegetationArea,
        status: createMockFarm.status,
        cultures: ['Soja'],
        producer: {
          name: createMockFarm.producer.name,
        },
        address: {
          street: createMockFarm.address.street,
          number: createMockFarm.address.number,
          complement: createMockFarm.address.complement,
          neighborhood: createMockFarm.address.neighborhood,
          city: createMockFarm.address.city,
          state: createMockFarm.address.state,
          zipCode: createMockFarm.address.zipCode,
        },
        createdAt: createMockFarm.createdAt,
      };

      const mockResponse = {
        data: [mockFarmResponse],
        meta: {
          limit: 10,
          page: 1,
          total: 1,
          totalPages: 1,
        },
      };

      listFarmsService.perform.mockResolvedValue(mockResponse);

      const result = await controller.list(query);

      expect(result).toEqual(mockResponse);
      expect(listFarmsService.perform).toHaveBeenCalledWith(query);
    });

    it('should handle empty results', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const mockResponse = {
        data: [],
        meta: {
          limit: 10,
          page: 1,
          total: 0,
          totalPages: 0,
        },
      };

      listFarmsService.perform.mockResolvedValue(mockResponse);

      const result = await controller.list(query);

      expect(result).toEqual(mockResponse);
      expect(listFarmsService.perform).toHaveBeenCalledWith(query);
    });

    it('should handle service error', async () => {
      const query = {
        page: 1,
        limit: 10,
      };

      const error = new InternalServerErrorException();
      listFarmsService.perform.mockRejectedValue(error);

      await expect(controller.list(query)).rejects.toThrow(error);
      expect(listFarmsService.perform).toHaveBeenCalledWith(query);
    });
  });

  describe('listTopFarms', () => {
    it('should return top farms with filters', async () => {
      const filters = {
        year: 2024,
        cultureName: 'Soja',
        state: 'SP',
      };

      const mockResponse = [
        {
          id: createMockFarm.id,
          name: createMockFarm.name,
          totalProduction: 1000,
          cultures: ['Soja'],
          state: createMockFarm.address.state,
          producerName: createMockFarm.producer.name,
        },
      ];

      listTopFarmsService.perform.mockResolvedValue(mockResponse);

      const result = await controller.listTopFarms(filters);

      expect(result).toEqual(mockResponse);
      expect(listTopFarmsService.perform).toHaveBeenCalledWith(filters);
    });

    it('should return top farms without filters', async () => {
      const mockResponse = [
        {
          id: createMockFarm.id,
          name: createMockFarm.name,
          totalProduction: 1000,
          cultures: ['Soja'],
          state: createMockFarm.address.state,
          producerName: createMockFarm.producer.name,
        },
      ];

      listTopFarmsService.perform.mockResolvedValue(mockResponse);

      const result = await controller.listTopFarms();

      expect(result).toEqual(mockResponse);
      expect(listTopFarmsService.perform).toHaveBeenCalledWith(undefined);
    });

    it('should handle empty results', async () => {
      listTopFarmsService.perform.mockResolvedValue([]);

      const result = await controller.listTopFarms();

      expect(result).toEqual([]);
      expect(listTopFarmsService.perform).toHaveBeenCalledWith(undefined);
    });

    it('should handle service error', async () => {
      const error = new InternalServerErrorException();
      listTopFarmsService.perform.mockRejectedValue(error);

      await expect(controller.listTopFarms()).rejects.toThrow(error);
      expect(listTopFarmsService.perform).toHaveBeenCalledWith(undefined);
    });
  });
});
